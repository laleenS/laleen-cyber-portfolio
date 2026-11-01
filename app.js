import { projects } from './content.js';
import { $, make } from './lib/dom.js';
import { initExperience, openDrawer } from './experience.js';
import { initMotion } from './motion.js';
import { initGuide } from './guide.js';
import { initSound, playSound } from './sound.js';
import { initJournal, discover } from './journal.js';

const dialog = $('#case-dialog');
let returnFocus;
function openCase(slug, trigger) {
  const project = projects.find(item => item.slug === slug);
  if (!project) return;
  returnFocus = trigger || document.activeElement;
  const content = $('#case-content');
  content.replaceChildren();
  content.append(make('p', `FIELD REPORT / CASE ${project.number}`, 'case-number'));
  const title = make('h2', project.title);
  title.id = 'case-title';
  content.append(title, make('p', project.status, 'case-status'));
  const flow = make('div', null, 'timeline');
  project.flow.forEach((step, index) => flow.append(make('span', step + (index < project.flow.length - 1 ? ' →' : ''))));
  content.append(flow);
  const sections = [
    ['The question', project.problem], ['Scope & current work', project.work],
    ['Tools & concepts', project.tools.join(' · ')], ['Findings', project.findings],
    ['What I learned', project.learning], ['Next growth', project.future],
  ];
  for (const [heading, value] of sections) content.append(make('h3', heading), make('p', value));
  content.append(make('h3', 'Evidence archive'), make('p', 'Screenshots and a project repository link will appear here when reviewed evidence is available.'));
  const demo = make('a', 'Explore the related teaching demo →', 'outline-button');
  demo.href = '#living-lab';
  demo.addEventListener('click', () => {
    returnFocus = document.querySelector(`[data-station="${slug}"]`);
    dialog.close();
    document.querySelector(`[data-station="${slug}"]`)?.click();
    $('#living-lab').scrollIntoView();
  });
  content.append(demo);
  dialog.showModal();
  playSound('paper');
}
for (const project of projects) {
  const row = make('article', null, 'project');
  row.id = project.slug;
  const icon = make('span', project.symbol, 'specimen');
  icon.setAttribute('aria-hidden', 'true');
  const title = make('div');
  title.append(make('span', `CASE ${project.number} / IN PROGRESS`, 'case-number'), make('h3', project.title), make('p', project.subtitle));
  const button = make('button', '→');
  button.setAttribute('aria-label', `Open ${project.title} case file`);
  button.addEventListener('click', () => openCase(project.slug, button));
  row.append(icon, title, make('p', project.summary), button);
  $('#project-list').append(row);
}
$('#case-dialog .close').addEventListener('click', () => dialog.close());
dialog.addEventListener('close', () => returnFocus?.focus());
dialog.addEventListener('click', event => {
  if (event.target !== dialog) return;
  const rect = dialog.getBoundingClientRect();
  if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
});

const responses = {
  help: 'Commands: help, about, projects, skills, education, contact, clear, whoami, ls, cat about.txt, open soc, open iam, open baseline, open journal, help --curious',
  about: 'Laleen Salim — UNC Charlotte senior studying Computer Science + Political Science. Expected graduation: December 2026.',
  projects: '001 SOC Investigation Lab\n002 IAM Access Review\n003 Security Baseline Checker\nAll are student labs in progress. Try open soc.',
  skills: 'The confirmed skills inventory is awaiting content. Browse case files for project topics.',
  education: 'UNC Charlotte\nB.S. Computer Science\nB.A. Political Science\nExpected December 2026',
  contact: 'GitHub: https://github.com/laleenS\nEmail and LinkedIn await confirmed details.',
  whoami: 'guest — welcome to Laleen’s cyber garden.',
  ls: 'about.txt  projects/  education/  field-notes/',
  'help --curious': 'Curious paths: follow a packet, compare a specimen hash, decode Caesar’s note. Try cat seed.txt if you found the clue under the soil.',
};
$('#terminal-form').addEventListener('submit', event => {
  event.preventDefault();
  const input = $('#command');
  const command = input.value.trim().toLowerCase();
  input.value = '';
  if (!command) return;
  const output = $('#terminal-output');
  if (command === 'clear') { output.replaceChildren(); return; }
  output.append(make('p', `guest $ ${command}`));
  if (command === 'cat seed.txt') {
    output.append(make('p', 'A seed is not a secret. You found the source note. No credential belongs in an HTML comment.'));
    discover('source');
  } else if (command === 'open journal') {
    openDrawer('journal', input);
    output.append(make('p', 'Field journal opened.'));
  } else if (command === 'cat about.txt') {
    output.append(make('p', responses.about));
  } else if (['open soc', 'open iam', 'open baseline'].includes(command)) {
    openCase(command.split(' ')[1], input);
    output.append(make('p', 'Case file opened.'));
  } else {
    output.append(make('p', Object.hasOwn(responses, command) ? responses[command] : 'Unknown command. Type help for the allowlist.'));
  }
  while (output.children.length > 40) output.firstElementChild.remove();
  output.scrollTop = output.scrollHeight;
  playSound('key');
});
$('#cipher-form').addEventListener('submit', event => {
  event.preventDefault();
  const ok = $('#cipher').value.trim().toLowerCase() === 'root';
  $('#cipher-result').textContent = ok ? 'Access to a tiny secret granted: strong roots, curious branches. ✳︎' : 'Not quite. Hint: U → R. No garden access depends on this puzzle.';
  if (ok) discover('cipher');
});

initSound();
initJournal();
initExperience();
initMotion();
void initGuide();
