# Laleen Salim: cybersecurity portfolio

My portfolio site. It is a plain HTML and CSS site with no backend, no trackers and no outside scripts.

It is being built one station at a time. All eight stations are in. The visual phase has started: a garden gate that opens as you scroll, golden hour and night modes, and sections that ease in.

The first version of this site (the "Root Access" garden) is kept on the `root-access-review` branch as a reference.

## Where things are

| File | What it is |
| --- | --- |
| `index.html` | All the words on the site. Each station is marked with a big comment. |
| `styles.css` | All the looks: colors, fonts, spacing. Colors are at the top. |
| `gate.js` | Opens the garden gate as you scroll. All the motion itself is in `styles.css`. |
| `theme-init.js` | Turns on night mode before the page draws, if you picked it last time. |
| `theme.js` | Makes the golden hour / night switch in the menu work. |
| `reveal.js` | Makes each section ease in the first time you scroll to it. Skips the first screen, and turns off for people who ask for less motion. |
| `contact.js` | Turns the email into a clickable link, so spam bots don't see it in the page. |
| `assets/garden-day.webp`, `assets/garden-night.webp` | The two gate paintings (golden hour and night), made by Laleen with an AI image tool. Compressed, with no hidden file details. |
| `assets/fonts/` | The fonts, stored here so nothing loads from another site. Licenses are beside them. |
| `tools/check.mjs` | A safety check that looks for broken links, inline code, and private info. |
| `.github/workflows/check.yml` | Makes GitHub run the safety check on every push. |
| `prd.md` | The plan and the rules for this site. |
| `CLAUDE.md` | Short rules for any AI helping with this repo. |

## How to change something on the GitHub website

1. Open the file, for example `index.html`.
2. Click the pencil icon.
3. Change the words between the tags. Leave the tags themselves alone.
4. Click "Commit changes" and write one line about what you changed.

## How to view it on a computer

Open a terminal in this folder and run:

```sh
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

## How to run the safety check

```sh
node tools/check.mjs
```

## Fonts

Linden Hill and Commissioner, both under the SIL Open Font License. The files here are smaller Latin-only versions, renamed Garden Oldstyle and Garden Humanist.
