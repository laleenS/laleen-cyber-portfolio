# Portfolio PRD (short version)

The full PRD lives in Laleen's Claude doc "Portfolio PRD: Laleen's Secret Garden". This file is the short copy that travels with the code. When a decision changes, update both.

## North star

A recruiter opens the link on a phone and, within 30 seconds, knows what Laleen studies, what she has built, and how to reach her.

## What this is

A static, single-page personal site with no backend. Words are written straight into `index.html` so they show even if scripts fail. The plain version ships first. Visual layers are added later without changing the words.

## Audience

Anyone who could open a door in cybersecurity: recruiters, internship programs, employers and grad schools. Any cyber team (SOC, IAM, GRC, policy). Long-term goal: the policy side, especially AI.

## The eight stations, in order

1. The gate: who she is, in a few lines
2. Education
3. Experience
4. Leadership
5. Security work and things I've built
6. Currently building, plus certifications in progress
7. How I secured this site, including how AI-written code was kept safe
8. Resume and contact

## Decisions

- One scrolling page
- No photo
- Two modes: day (default) and night, with a small sun/moon switch. The choice is remembered on the visitor's device only.
- Resume: open PDF download at assets/laleen-salim-resume.pdf, with phone number and GPA removed
- Email: shown to people, hidden from spam bots
- Contact is job email, LinkedIn and GitHub only
- Hosting: GitHub Pages to start
- Laleen edits on the GitHub website, so files stay simple

## Visual principle

Updated Nov 17, 2026. The look is "Root Access": modern botanical tech, luxury editorial, whimsical but professional. Laleen's day and night mockups are the reference. Her two blank paintings (same stone archway with circuit engravings, a fingerprint panel, a geometric panel and a glass greenhouse) are the actual artwork. No text is ever baked into an image.

The first screen is a split layout:
- Left: a small eyebrow, the headline "Root Access." with an italic accent, "Building a more secure digital world.", one true line about her, and two buttons (Explore my work, View resume)
- Right: the painting, with three numbered glass labels and thin connector lines pointing at parts of the arch
- Top right: a small vertical "Explore / Learn / Build / Secure" element with a star icon. Each word is a real link.
- A quiet "scroll to explore" marker

The numbered labels are real links to real content. The mockup labels (Cryptography, Network Security, System Design) didn't match her actual work, so they are:
1. Security Testing: the pentest and forensics work
2. Identity and Access: MFA, least privilege and role-based access at PIMOSH and Truist
3. Things I've Built: her sites and apps

Hovering or focusing a label lights its line and node and shows a one-line preview. On phones the labels become a simple list of cards under the painting.

Day: soft ivory, muted greens, dusty lavender and blush, champagne gold, deep plum text. Night: deep midnight blue, muted indigo, warm gold, ivory text. Both modes keep the same layout and label positions.

Fonts: the serif and sans already in the repo, plus the device's own monospace font for small technical notes (no new download).

Avoid: neon, code rain, big padlocks, anything that looks like a fantasy game site. Motion is slow, small and never everywhere at once. Reduced motion turns it off.

The old iron gate that opened on scroll was removed. The new archway is open, so it no longer fit.

The first screen is the calmest. Effects build up the further a visitor scrolls. Three.js 3D is still planned for later.

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

## Parked for later

- Code-art centerpiece: a photo redrawn as thousands of colored text characters. Liked it, parked so it doesn't slow down the gate.
- Lenis smooth scrolling. Tried it Nov 17. Skipped for now because the floaty scroll can feel like extra work. Revisit at the end of the beauty phase, desktop only if added.

## Out of scope

Backend, payments, fake password gate, AI chatbot, analytics, contact form, unbuilt projects shown as finished, a live link to Hisaab, a free-roam game world, sound that plays by itself.

## Where we left off (Nov 17, 2026)

- Base is done: all eight stations, resume PDF, contact, security station, courses.
- New "Root Access" look built on the `garden-redesign` branch: split first screen, Laleen's new day and night paintings, three numbered labels, the Explore / Learn / Build / Secure links, sun/moon switch, sections below restyled to match.
- Next steps:
  1. Laleen reviews the branch and merges it into main
  2. Fine-tune label positions and colors after seeing it on her own screens
  3. Update the security station and run a real header scan on the live site
  4. Later: when the SOC Investigation Lab and IAM Access Review are built, they could take over labels 1 and 2 (her old "SOC Observatory" and "Access Greenhouse" ideas)
