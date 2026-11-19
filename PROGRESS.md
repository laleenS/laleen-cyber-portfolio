# Progress

The master plan is `prd.md`. The rules for AI are in `CLAUDE.md`.
This file tracks where we are. Update it at the end of every session.

## Where we are
- **Phase 1: Professional Foundation**
- Sessions 1, 2 and 3 are done
- **Next: Session 4, Experience**

## Sessions
| Session | Task | Status |
| --- | --- | --- |
| Setup | Master PRD, new AI rules, wishlist | Done, live (PR #2) |
| 1 | Audit site and resume | Done (no file changes) |
| 2 | Homepage and About | Done, live (PR #3) |
| 3 | Education and Skills | Done, live (PR #4) |
| Bonus | Living Light (homepage garden) | Done, in PR #6 (merge to go live) |
| 4 | Experience | Next |
| 5 to 12 | See `prd.md`, section 15 | Not started |

## What's live (Nov 19, 2026)
- New homepage: "Hi, I'm Laleen Salim." Root Access removed.
- About: PIMOSH phishing story, PIMOSH / Truist / class work, calligraphy
- Education and Skills: certs moved into Education, regrouped skills, short "Why both degrees"
- Earlier: the day/night garden design (PR #1)

## Pull requests
Merged and live: #1, #2, #3, #4, #5
Open: **#6 Living Light**. Merge it to go live.

## Site status (Nov 19, 2026)
- GitHub Pages now publishes from `main` (it was stuck on the old `root-access-review` branch until Nov 19)
- Night mode works: the switch is visible on desktop and phone, it changes the painting and colors, and the choice is remembered. Checked on the live site.
- Living Light: built and tested, live once PR #6 is merged
  - Files: `index.html`, `styles.css`, new `garden-light.js`
  - 4 lanterns flicker; desktop light follows the mouse; phone light drifts; reduced motion turns it off

## Outstanding tasks (for Laleen)
- [ ] Update the resume PDF: certs say Dec 2026, should say in progress, aiming for Feb 2027
- [ ] Optional: add TypeScript, React, Node.js, Linux and Wireshark to the resume
- [ ] Merge PR #6 (Living Light), then check it on the live site, desktop and phone
- [ ] Delete old merged branches on GitHub (Claude can't delete branches): `garden-redesign`, `setup-master-prd`, `session-2-intro`, `session-3-education`, `progress-notes`

## Verified facts
- Security+ and SC-300: in progress, aiming for Feb 2027. Not scheduled, not earned.
- Phishing story: at PIMOSH, a text impersonating her boss asking for gift cards
  (authority, urgency, a request for help). How she responded is NOT on the site yet.
- Computer Forensics class: still in progress (Fall 2026), FTK Imager and Autopsy
- SQL injection in the web app pentest: confirmed
- Log analysis: has done it (context and tools not confirmed yet)
- CrowdStrike: reviewed alerts or reports only. Never say she ran the platform.
- Linux and Wireshark: used, not advanced
- Node.js, React, TypeScript: has worked with them
- Hack The Box: started exploring, no labs finished
- Prefers "Hi, I'm Laleen Salim." Root Access is not a brand.

## Still needs confirming (don't add until confirmed)
- **XSS.** It's in her resume and Tunestore report, but she wants to verify.
  It still appears in the Security Work section and the homepage label 01 preview.
  Decide in Session 6.
- Exact pentest tools (Burp Suite, sqlmap, OWASP ZAP?)
- Log analysis examples and tools
- Coursera certificates: finished or not
- Next.js, Prisma, Docker, Kali Linux, Nmap
- Personal photo: optional, undecided (in `WISHLIST.md`)

## Decisions and preferences
- The garden should feel alive and techy but refined: no neon, no game look
- The painting is one flat image per mode, so flowers can't sway until there's cut-out art
- Nothing merges without Laleen's OK. Ask before doc edits too.

## How we work
- One small task per session. Ask before editing. Show exact wording first.
- Every change goes on a branch and a pull request. Laleen merges it to go live.
- Run `node tools/check.mjs` before every commit.

## Next task
Phase 1, Session 4: Experience.
Review the Experience section against the resume. Check every role is specific
and truthful, and doesn't repeat the About section. Ask before changing anything.

## Paste this into a new Claude chat
Let's continue my cybersecurity portfolio. The repo is laleenS/laleen-cyber-portfolio.
Read prd.md, CLAUDE.md and PROGRESS.md first.
Then start Phase 1, Session 4: Experience. Review it against my resume and
tell me what needs checking before we change anything.
