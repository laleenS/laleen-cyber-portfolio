# Typography provenance

- **Display:** Linden Hill regular and italic, an oldstyle book face by Barry Schwartz. Its irregular, calligraphic texture connects the garden’s book-like setting with Laleen’s interest in Arabic calligraphy without pretending it is an Arabic typeface.
- **Body:** Commissioner regular and semibold by the Commissioner Project Authors. Its clear humanist construction keeps narrative and controls readable alongside the expressive display lettering.
- **Technical annotations:** the operating system’s Courier New / monospace fallback. No third-party runtime request.

The Latin WOFF2 subsets are named **Garden Oldstyle** and **Garden Humanist** to distinguish the modified builds. The original copyright and license metadata are retained. OFL licenses are distributed beside the fonts in `assets/fonts/`.

Original sources were retrieved over verified HTTPS from the public Google Fonts repository:

- https://github.com/google/fonts/tree/main/ofl/lindenhill
- https://github.com/google/fonts/tree/main/ofl/commissioner

`tools/subset-fonts.py` accepts a local directory containing `LindenHill-Regular.ttf`, `LindenHill-Italic.ttf` and `Commissioner.ttf`. With fonttools and brotli installed in a temporary tooling environment, it pins Commissioner to regular/semibold weights, subsets the Latin/punctuation character coverage, renames the modified font families, and writes WOFF2 files. It does not fetch network assets or modify application dependencies. The shipped font outputs require no build tools to run.

Four font files total approximately 78 KB. Font display uses swap; the regular display face is the only preloaded font. The design was selected using Laleen’s request for distinctive, readable typography, not as a claim that any font can prove who authored a website.
