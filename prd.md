# Portfolio PRD (short version)

The full PRD lives in Laleen's Claude doc "Portfolio PRD: Laleen's Secret Garden". This file is the short copy that travels with the code. When a decision changes, update both.

## North star

A recruiter opens the link on a phone and, within 30 seconds, knows what Laleen studies, what she has built, and how to reach her.

## What this is

A static, single-page personal site with no backend. Words are written straight into `index.html` so they show even if scripts fail. The plain version ships first. Visual layers are added later without changing the words.

## Audience

Recruiters, and people who study or work in cybersecurity.

## The eight stations, in order

1. The gate: who she is, in a few lines
2. Education
3. Experience
4. Leadership
5. Security work and things I've built
6. Currently building, plus certifications in progress
7. How I secured this site
8. Resume and contact

## Decisions

- One scrolling page
- No photo
- Day and night with a switch. Day first.
- Resume: open PDF download, with phone number removed
- Email: shown to people, hidden from spam bots
- Contact is job email, LinkedIn and GitHub only
- Hosting: GitHub Pages to start
- Laleen edits on the GitHub website, so files stay simple

## Security and privacy rules

- No keys, tokens or passwords anywhere
- No backend, database or logins
- HTTPS only
- Content Security Policy in the page. No inline scripts or styles.
- Nothing a visitor types is ever inserted as HTML
- Fonts and any libraries are stored in this repo
- Outside links use `rel="noopener noreferrer"`
- No analytics, trackers or cookies
- No phone number, home address or GPA
- No fake password gates. Puzzles must be labeled as games.
- Known limit: GitHub Pages cannot send custom security headers

## Phases

0. PRD
1. Base: the eight stations, plain, real content, phone ready, live
2. Projects: build the cyber projects one at a time
3. Beauty: smooth scrolling, the text flower bouquet, the garden walk, a pond with fish, 3D tests
4. Extras: an honest puzzle, optional sound

## Out of scope

Backend, payments, fake password gate, AI chatbot, analytics, contact form, unbuilt projects shown as finished, a live link to Hisaab, a free-roam game world, sound that plays by itself.
