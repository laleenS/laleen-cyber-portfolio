# Root Access: an inhabited garden

This is an implementation blueprint and a design brief, not a claim of completed 3D work. The current engine is SVG, Canvas 2D, CSS and native JavaScript modules. Moonlit and golden-hour materials, an animated optional field station, and the original security teaching stations are implemented. A full navigable WebGL garden remains an optional next phase.

## 1. World, light and layout mechanics

**A single place with two lights.** Moonlit mode is observatory blue, sage, dusty rose and quiet packets. Golden hour uses parchment, terracotta, warm glass, a low amber sun and drifting light. The same buildings and paths stay in place when the light changes. Do not reorient the visitor or alter evidence with a theme switch. Save only the visitor’s explicit theme choice, with a working storage-denied fallback.

**The garden is the menu.** The observatory opens investigations; greenhouse doors explain authorization; system roots respond to configuration. Use layered depth and material response rather than hijacking scrolling. A readable map, project list and contact path remain available outside the exploration.

**A field station, not an OS clone.** A desk view is an optional alternate entrance: original orbiting botanical constellations behind an accessible, movable work window. Field files, About, a safe console and Contact are visible shortcuts. Single-click or Enter opens an app. Desktop users may drag the title bar or move it with arrow keys; Home recenters it. Mobile uses a fixed, scrollable pane. The in-scene contact shortcut never depends on solving a puzzle. No fake filesystem, arbitrary uploads, emulator or heavy virtual machine is required.

**Controls live in the world.** A floating garden HUD replaces strong header/footer dividers. The footer’s root lines and return path share the scene palette. UI remains distinguishable from decoration through contrast, hit targets and focus outlines. Do not hide useful controls for the sake of realism.

**Personal voice is supplied by Laleen.** The working first-person copy now adapts her own answers about curiosity, cyber policy, Arabic calligraphy and the childhood-book connection. Actual project completion evidence and public contact details remain pending. Use direct sentences and specific observations from her notes, not invented personal motivations. Keep atmospheric labels separate from factual résumé claims.

## 2. Puzzle scripts and security-intelligence mechanics

All puzzles are optional, synthetic and explanatory. A visitor can stop, reveal the answer, or use the portfolio without losing access. Do not call encoding encryption or imply that toy puzzles secure the application.

### Script A — The night-shift signal (implemented)

- Invitation: “A service account woke at 2 a.m. What would you check before calling it an incident?”
- Evidence 1: eight authentication failures followed by a success from documentation IP 192.0.2.42.
- Evidence 2: a credential rotation and an approved maintenance window, not yet confirmed with the owner.
- Evidence 3: encoded PowerShell under a scheduled task; source inventory and script hash remain unverified.
- Mechanic: pin evidence, connect timing with context, write a rationale, then escalate or verify maintenance. Premature benign closure receives an explanation of the remaining gaps.
- Lesson: distinguish observation, hypothesis, confidence and next verification steps. A deliberately weak scripted assistant claim invites challenge.

### Script B — The borrowed key (implemented)

- Invitation: “The role changed. The permissions didn’t. Which key no longer belongs?”
- Evidence: fictional employee, contractor, departed user and reviewer records, each with current entitlements.
- Mechanic: simulate a read-only role move, test assigned doors, review business need, and record a rationale.
- Exception: a proposed 24-hour privileged grant needs independent approval and monitoring; proposing it does not silently change current assignments. Expired and terminated identities require lifecycle validation.
- Lesson: authority to request, approve and provision should be distinguishable. This is a useful connection between access controls and institutional decision-making, without inventing Laleen’s personal thesis.

### Script C — The changed specimen (implemented)

- Invitation: “Same label. Same specimen?”
- Reference: `specimen=moonflower;permission=read`.
- Mechanic: compute the actual SHA-256 digest with Web Crypto, change the contents to `permission=admin`, and compare again.
- Explanation: a digest detects different bytes relative to a trusted reference. It neither encrypts the content nor proves the publisher’s identity.
- Optional extension: a known Base64 string decodes without a key, making the encoding distinction explicit.

### Script D — A seed under the soil (implemented)

- Source comment points to the strictly allowlisted `cat seed.txt` console command.
- The study’s `URRW` clue shifts back three letters to `ROOT`.
- Reward: an optional local discovery, with a reminder that credentials never belong in source comments.
- This is a toy cipher and a discovery mechanic, not a cryptographic access gate.

### Future script — The provenance notebook (proposal)

A clearly fictional policy memo has three claims and three sources. Ask the visitor to separate a reported fact, an inference, and an unsupported conclusion. Reveal source dates and a confidence explanation on demand. This introduces communication and provenance without fabricated intelligence work or real sensitive documents. Ship only after the exact learning goal and copy are reviewed.

## 3. Tech stack and engine architecture

### Current, working engine

```text
semantic HTML narrative + native dialogs + direct links
                 │
          theme + content state
                 │
       ┌─────────┼───────────┐
       ▼         ▼           ▼
 SVG / CSS   Canvas 2D    optional field station
 materials   packets /   lazy-loaded JS + CSS / SVG
             ripples
                 │
       shared accessible controls
```

- Native JavaScript modules keep the current bundle small and understandable. A framework migration would have costs and needs a specific payoff.
- SVG supplies original botanical geometry, two lighting treatments and a readable fallback. Canvas 2D handles small decorative particles; cap device pixel ratio at 2 and reduce particle count on coarse pointers.
- Motion uses elapsed-time `requestAnimationFrame`, a capped delta and exponential easing. Stop hero animation offscreen, when the page is hidden, when paused or under reduced motion. Pause the field-station wallpaper independently and stop its CSS animation when closed.
- CSS handles short state transitions. Add GSAP only if a coordinated, cancelable scene timeline becomes difficult to maintain natively. Do not add it just for hover effects.
- Self-hosted WOFF2 subsets of Linden Hill and Commissioner establish the current typography. Preserve licenses, use `font-display: swap`, keep system fallbacks and preload only the display regular face.
- Web Crypto performs short digest demonstrations asynchronously. WebAssembly is unnecessary for tiny hashes and must not turn a security-themed site into a client CPU benchmark.
- A local, cited guide works without an API. Optional AI stays behind the server route, with explicit visitor opt-in, an evidence corpus, length/rate limits, timeout, no tools and no client-visible key. A model response remains a claim to verify.

### If a navigable 3D scene earns its cost

1. Keep all meaningful content and direct links in the DOM. Load the scene as a separate enhancement after an explicit “Explore in 3D” action; keep a static SVG poster until it succeeds.
2. For this existing site, a lazily imported Three.js module is the least disruptive route. React Three Fiber is appropriate if a later React migration is independently justified; do not ship React solely to draw a small scene.
3. Use one WebGL canvas. Share geometries/materials, instance plants, bake lighting, and limit transparent layers. Use a small number of interactable objects, not a separate event listener for each leaf.
4. Raycast to scene targets and dispatch the same actions used by DOM buttons. An object is not the sole way to reach its content. Keyboard users operate the matching map; touch users tap generous controls.
5. Use compressed glTF assets, KTX2 textures and a low-power quality tier only when there are actual 3D assets. Cap DPR, avoid mandatory postprocessing and avoid real-time shadows across every plant. No physics engine is needed for a walking camera.
6. Render on demand for static states; animate only while visible. Reduce particles and shadows when frame-time measurements degrade. Recover from `webglcontextlost` to the SVG/HTML path without losing the selected project.
7. Tailwind is optional styling syntax, not a performance or typography requirement. Existing tokens already describe the two lights. Add a framework only if it reduces maintenance cost.

### Recruiter accessibility and measurable budgets

- Core text and direct navigation render without waiting for fonts, canvas or an API. Projects and contact take one explicit navigation choice.
- Maintain a “Read directly” path. No timed puzzle, sound, dragging, pointer tracking or animation is necessary to access factual content.
- Aim for LCP under 2.5 seconds and INP under 200 ms on a representative midrange phone; measure on throttled hardware before claiming these targets are met.
- Suggested next-phase budgets: initial first-party JS under 150 KB compressed, optional 3D entry under 1 MB compressed, and a sustained 30 fps low-power tier with a static fallback. These are targets, not current measured claims.
- Use native dialogs, visible focus, ARIA tabs, readable contrast, semantic heading order, reduced-motion media queries and an explicit pause. Test actual Safari, Android and a screen reader before publication; viewport automation alone does not establish device accessibility.

## 4. Three cognitive UX questions

1. **What must a recruiter know after 30 seconds, and can they learn it without exploring?** Test whether an unfamiliar visitor can identify Laleen’s degrees, graduation date, project status and public contact path using direct controls. Count clicks and time rather than assuming the map is obvious.
2. **What happens when curiosity runs out halfway through a puzzle?** At every state, identify the exit, hint, explanation and route back to the portfolio. Ask whether an unfinished task could imply the visitor failed or that content is still locked. It should not.
3. **What meaning survives when the spectacle is unavailable?** Try keyboard-only navigation, reduced motion, a slow phone, disabled JavaScript and a failed WebGL/AI request. Confirm that facts, evidence status and contact remain coherent, then distinguish missing decoration from a broken essential task.

## Reference evidence and limits

- [Dustin Brett / daedalOS](https://github.com/DustinBrett/daedalOS): read the public README and inspected its published screenshot. Verified desktop windows, taskbar, keyboard controls, and dynamic wallpapers including a Milky Way option. No code or assets copied.
- [Bruno Simon / Folio 2025](https://github.com/brunosimon/folio-2025): public documentation and published social image inspected in the preceding build. Verified environmental systems and world-based navigation as an interaction principle. No vehicle, code or art reused.
- [Sunlight effect](https://github.com/priyamwada15/sunlight-effect): this third-party README explicitly credits Chloe Yan’s [Sunlight](https://www.chloeyan.me/digital-spaces/sunlight) piece and describes drifting light, small-screen simplification and reduced-motion support. This is indirect evidence, not a review of Chloe’s current writing or site behavior. No implementation copied.
- [Developer portfolio directory](https://github.com/Gitstar-OC/Developer-Portfolio): confirmed Chloe’s portfolio domain and public handle, but did not establish an official source repository for her current website.

Direct requests to the three supplied websites were denied by the environment proxy. Their specific hosts were saved in the environment’s network draft, which does not itself apply access. No claim is made to have browsed those live sites. Personal copy now reflects Laleen’s interview answers; project evidence and contact details remain pending.
