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
| 4 | Experience | Next |
| 5 to 12 | See `prd.md`, section 15 | Not started |

## What's live (Nov 19, 2026)
- New homepage: "Hi, I'm Laleen Salim." Root Access removed.
- About: PIMOSH phishing story, PIMOSH / Truist / class work, calligraphy
- Education and Skills: certs moved into Education, regrouped skills, short "Why both degrees"
- Earlier: the day/night garden design (PR #1)

## Pull requests
All merged: #1, #2, #3, #4. Nothing open.

## Outstanding tasks (for Laleen)
- [ ] Update the resume PDF: certs say Dec 2026, should say in progress, aiming for Feb 2027
- [ ] Optional: add TypeScript, React, Node.js, Linux and Wireshark to the resume

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
