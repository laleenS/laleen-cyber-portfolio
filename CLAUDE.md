# Rules for any AI working in this repo

Read `prd.md` first. It is the source of truth.

- Build only what is in `prd.md`. If you have an idea, suggest it. Do not build it.
- Work in small steps. One station or one feature at a time. Explain each change in plain words.
- Laleen must be able to read and explain every file. Keep code simple and commented.
- No new packages, CDNs or outside scripts without asking first.
- No inline scripts, inline styles, `eval`, or inserting changing text as HTML.
- Words go in `index.html`. Looks go in `styles.css`. Behavior goes in a `.js` file.
- Never add: phone number, home address, GPA, API keys, analytics, trackers, cookies.
- Never invent facts, results or filler text that looks real.
- The page must work with JavaScript turned off.
- Run `node tools/check.mjs` before every commit. It must pass.
- Writing style: casual, short lines, no em dashes.
