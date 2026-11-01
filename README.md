# Root Access — a cyber garden

Laleen Salim’s interactive cybersecurity portfolio: a moonlit network garden with an observatory, an access greenhouse, and living system roots. The experience connects botanical exploration to security reasoning rather than treating the site as a list of résumé cards.

## Preview on a Mac

Use Node.js 20 or newer. From this project folder:

```sh
npm ci
npm run check
npm test
npm run dev
```

Open localhost on port 5173 in your browser. Stop the server with Control-C. There is no build step, package dependency, external font, or required API key. The included server is for local development; production hosting is a separate decision.

## Explore the experience

- **Move through the world:** the hero has pointer-responsive depth, gently swaying foreground leaves, drifting fireflies that move away from the pointer, packets traveling along the garden path, and pond ripples. Tap the scene for a ripple. Motion pauses offscreen and in hidden tabs. A visible pause button and reduced-motion support provide static alternatives.
- **Reveal the system:** the lens overlays endpoints, a policy engine, configuration nodes and a trust boundary on the botanical world.
- **Investigate the night shift:** inspect three fictional evidence slips, pin or drag them into a notebook, connect a credential rotation to authentication retries, write a rationale, and choose an analyst decision. Premature closure is explained rather than rewarded as correct.
- **Question the assistant:** challenge a deliberately flawed, scripted claim about encoded PowerShell. This teaches uncertainty and verification; it is not presented as live AI.
- **Review the greenhouse keys:** select fictional employee, contractor, departed-user and reviewer identities. Test doors, simulate a role move or an expired session, apply least privilege, or propose an exception requiring independent approval. Review decisions have an auditable rationale. Proposed exceptions do not silently grant new permissions.
- **Care for the roots:** change four fictional configuration values and compare them against an explicit teaching baseline. Root indicators update with results. No machine is scanned.
- **Open the curiosity cabinet:** follow a packet through request/authentication/authorization/response, compare a sample’s actual SHA-256 hash, tamper with it, decode a known Base64 sample, and touch a clearly labeled local honeytoken.
- **Collect discoveries:** eleven optional discoveries live in a browser-local journal. Reset requires an explicit second action. Storage denial does not break the site, and discoveries never gate content.
- **Ask the guide:** local, cited answers explain the portfolio’s actual claims and missing information. Optional server-side AI is described below. Neither mode impersonates Laleen.
- **Open the build notebook:** inspect the motion equation, audio architecture, safety decisions and research references.
- **Jump anywhere:** the persistent map links directly to the introduction, About, teaching stations, projects, education/archive, résumé placeholder and contact.

Sound starts **off every visit**. Opting in enables brief synthesized tap, glass, latch, release, paper-like, terminal and discovery tones. Volume is adjustable. There is no background music, microphone use, downloaded audio or copyrighted recording.

## Project honesty and growth

The SOC Investigation Lab, IAM Access Review, and Security Baseline Checker are separate student projects **in progress**. Their case files state the scope, tools, missing findings, evidence placeholders and future work. Windows Event Logs, Sysmon and Splunk integration remain planned.

The website’s working teaching demos are original fictional examples. They are not claimed results from those lab projects. The growth timeline records implemented portfolio features; new lab milestones should be added only when reviewed evidence is available. No proficiency, work experience, certifications, contact details, grades or outcomes are invented.

## Content and code map

| File | Purpose |
| --- | --- |
| `index.html` | Semantic narrative, personal/education copy, controls, dialogs and metadata |
| `style.css`, `experience.css` | Base visual system, responsive scenes, material effects and accessibility fallbacks |
| `assets/garden.svg`, `assets/favicon.svg` | Original replaceable art |
| `content.js` | Centralized project descriptions and reserved profile fields |
| `garden-data.js` | Synthetic evidence, identity/grant fixtures, baseline, discoveries and growth milestones |
| `knowledge.js` | Public evidence corpus and explicit local guide intent matching |
| `app.js` | Case files and strict allowlisted terminal |
| `experience.js` | Teaching stations, map, packet/hash drawers and build notebook |
| `motion.js` | One time-based, visibility-aware hero animation loop |
| `sound.js` | Opt-in Web Audio material tones |
| `journal.js` | Validated local discovery storage and reset |
| `guide.js` | Local/optional AI guide UI, consent, citations and fallback |
| `lib/guide-server.mjs` | Optional server-side provider integration and input/rate/source validation |
| `server.mjs` | Development HTTP server and security headers |
| `tests/` | Node API tests and Chromium browser checks |

Confirmed personal copy is in `index.html`; update contact and résumé placeholders there after reviewing real details. Profile fields in `content.js` reserve future data but are not automatically rendered. Keep the guide corpus aligned with public case-file claims. Do not add hypothetical completed milestones.

## Terminal commands and secrets

The simulated console supports:

```text
help        about        projects        skills
education   contact      clear           whoami
ls          cat about.txt
open soc    open iam     open baseline   open journal
help --curious
```

A harmless page-source clue reveals `cat seed.txt`. The study’s Caesar note decodes `URRW` to `ROOT`. Neither is a credential. Input is length-limited and rendered as text; no shell, eval, arbitrary functions, network commands or HTML insertion are involved.

## Optional real AI mode

Local mode works without any service. It uses explicit matching against `knowledge.js`; it is **not a generative model** and openly declines unsupported questions.

To enable the optional provider route, supply `GARDEN_AI_API_KEY` securely to the **server process** and allow HTTPS egress to `api.openai.com`, then restart `npm run dev`. Do not place a key in frontend code or commit it. The server uses OpenAI’s Responses API with `gpt-4.1-mini`, `store: false`, no tools, a constrained answer/source schema, and only the public portfolio corpus plus the current question. Provider use can incur charges; it is not enabled by default.

Even when configured, visitors must choose **Enable AI mode** before a question is sent. The UI explains what leaves the browser. No conversation history is saved by this app. Provider retention and policies remain separate from the app’s `store: false` setting. Closing the dialog cancels a pending browser request; unavailable or invalid answers fall back to a clearly labeled local lookup.

The route validates length, JSON, same-origin browser requests and known citation IDs; it has a 12-second upstream timeout and an in-memory limit of eight requests per IP per minute. These are development safeguards, not a complete production abuse-prevention system. Citations constrain references but cannot guarantee model truth. A public deployment needs appropriate provider credentials, durable rate limits, hosting and privacy review.

No live provider call was made during this build: a real key was not configured. The integration and UI were tested with mocked provider responses, including rejection and fallback paths.

## Validation

```sh
npm run check
npm test
```

The Node suite verifies disabled AI, input/origin/size validation, known-source output validation, provider failures, rate limits, and honest local answers.

For browser checks, start the server first. On a Mac with Python 3 and Google Chrome:

```sh
python3 -m venv /tmp/garden-browser-venv
source /tmp/garden-browser-venv/bin/activate
python3 -m pip install playwright
export CHROMIUM_PATH='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
python3 tests/browser_smoke.py
python3 tests/experience_smoke.py
```

Screenshots are written under `/tmp`. The scripts use the cloud Chromium path by default; `CHROMIUM_PATH` selects the Mac browser. The extended suite also accepts `GARDEN_TEST_URL`.

Chromium checks cover case files, all teaching stations, 11 discoveries, reset/persistence, source/hash/packet puzzles, allowlisted terminal and safe input rendering, local guide, opt-in AI UI with mocked responses, unavailable-provider fallback, map links, keyboard tab behavior, focus return, motion pause and reduced motion. Layout checks run at 375, 390, 430, 768, 1024, 1366 and 1920px. JavaScript-disabled narrative and storage-denied initialization are checked. Desktop, phone and investigation screenshots are visually inspected.

These are not physical-device Safari/Android tests or a complete screen-reader/contrast audit. Sound controls and synthesis run in Chromium; subjective audio quality still needs listening review.

## Accessibility, performance and security

Native headings, links, details and dialogs; keyboard-operable tabs and visible focus; direct navigation; non-drag alternatives; text equivalents for security outcomes; motion pause and OS reduced-motion support. Mobile gives the garden a prominent vertical scene and uses tap-friendly controls. Core introduction, education, project summaries and contact placeholders remain accessible without JavaScript; interactive demos require JavaScript.

Zero package dependencies. The hero caps particles and pixel density, uses elapsed-time animation, and stops when hidden or offscreen. There is no WebGL, giant animation framework, third-party tracking, account, contact backend or required network asset. Optional discoveries alone use local storage; analyst notes, access reviews and guide conversations are not persisted.

The server keeps provider keys out of the browser, denies hidden paths, limits served file types and sends CSP, referrer, MIME and permission headers. User-facing text uses safe DOM creation. No claim of perfect security is made.

Research and original-design decisions are recorded in `docs/DESIGN.md`. Nothing has been deployed, published, pushed or connected to a paid service. The latest user instruction authorizes a local commit after validation.
