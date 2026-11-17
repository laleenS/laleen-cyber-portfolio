// ==============================================================
// tools/check.mjs
// A safety check for the portfolio. It reads the site files and
// stops with an error if it finds something that breaks a rule
// from the PRD.
//
// Run it with:   node tools/check.mjs
// It needs no packages. It only reads files. It changes nothing.
// GitHub also runs it automatically on every push.
// ==============================================================

import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const problems = [];                       // every broken rule gets added here
const html = readFileSync('index.html', 'utf8');

// Comments are notes for people, not part of the page, so ignore them.
const page = html.replace(/<!--[\s\S]*?-->/g, '');

// --- Rule 1: the page must have a Content Security Policy ---
if (!/http-equiv="Content-Security-Policy"/.test(page)) {
  problems.push('index.html is missing its Content Security Policy.');
}

// --- Rule 2: no inline code (it would break the policy and is harder to review) ---
if (/<script(?![^>]*\bsrc=)[^>]*>/i.test(page)) problems.push('Found an inline <script>. Put code in a .js file.');
if (/<style[\s>]/i.test(page)) problems.push('Found a <style> block. Put styles in styles.css.');
if (/\sstyle="/i.test(page)) problems.push('Found a style="..." attribute. Put styles in styles.css.');
if (/\son[a-z]+="/i.test(page)) problems.push('Found an inline event like onclick="...". Put code in a .js file.');

// --- Rule 3: every file the page points to must exist ---
const linkedFiles = [...page.matchAll(/(?:href|src)="([^"#]+)"/g)].map((match) => match[1]);
for (const file of linkedFiles) {
  const isOutsideLink = /^(https?:|mailto:)/.test(file);
  if (!isOutsideLink && !existsSync(file)) problems.push(`index.html points to a missing file: ${file}`);
}

// --- Rule 4: outside links must be https and must use rel="noopener noreferrer" ---
for (const tag of page.match(/<a\s[^>]*>/g) ?? []) {
  if (/href="http:\/\//.test(tag)) problems.push(`Link is not https: ${tag}`);
  if (/href="https:\/\//.test(tag) && !/rel="noopener noreferrer"/.test(tag)) {
    problems.push(`Outside link is missing rel="noopener noreferrer": ${tag}`);
  }
}

// --- Rule 5: every image needs alt text ---
for (const tag of page.match(/<img\s[^>]*>/g) ?? []) {
  if (!/\salt="/.test(tag)) problems.push(`Image is missing alt text: ${tag}`);
}

// --- Rule 6: nothing private or secret in the files visitors can see ---
// (Notes like README.md and prd.md are allowed to mention the rules themselves.)
const privatePatterns = [
  [/\(?\d{3}\)?[ .-]\d{3}[ .-]\d{4}/, 'something that looks like a phone number'],
  [/\bGPA\b/, 'a GPA (the PRD says to leave it off)'],
  [/\b(sk-[A-Za-z0-9]{20,}|AKIA[A-Z0-9]{16})\b/, 'something that looks like an API key'],
  [/(api[_-]?key|secret|password|token)\s*[:=]\s*['"][^'"]+['"]/i, 'something that looks like a saved secret'],
];
const textFiles = readdirSync('.').filter((name) => /\.(html|css|js)$/.test(name));
for (const name of textFiles) {
  const text = readFileSync(join('.', name), 'utf8');
  for (const [pattern, description] of privatePatterns) {
    if (pattern.test(text)) problems.push(`${name} contains ${description}.`);
  }
}

// --- Report ---
if (problems.length > 0) {
  console.error('Check failed:\n- ' + problems.join('\n- '));
  process.exit(1);
}
console.log('All checks passed.');
