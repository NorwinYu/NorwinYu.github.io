# Norwin Yu — personal site

A static, multi-page personal site for GitHub Pages, framed as AI usage research. It collects game, comparison and coding experiments, the local environment, open-source contributions, competitions and technical notes.

The site is deliberately dependency-free at runtime: plain HTML, one CSS file per page type, a small vanilla JS file, self-hosted fonts and local images. No analytics, no cookies, no API keys, no third-party requests.

## Pages

| Path | What it is |
| --- | --- |
| `index.html` | Home: research framing, selected projects, research areas, stack summary, competitions, latest writing |
| `work/index.html` | Game probes, comparisons and coding tools, plus the pipeline behind them |
| `ai.html` | Local environment and configuration: machines, OS and local runtime |
| `competitions.html` | Selected competition results, with only verifiable numbers |
| `about.html` | AI usage research framing, research areas and method |
| `open-source.html` | Contributions to Strata and Project Maya |
| `blog/index.html` | Journal index |
| `blog/*.html` | Five technical / design notes |
| `404.html` | Static not-found page |

## Run locally

No build step is required.

```bash
cd GitRepo/norwin-site
python3 -m http.server 4180
# open http://127.0.0.1:4180/
```

Or open `index.html` directly. A local server is recommended for correct root-relative behaviour when testing links.

## Deploy to GitHub Pages

1. Create a repository and push this folder to `main`.
2. In **Settings → Pages → Build and deployment**, choose **GitHub Actions**.
3. The included workflow (`.github/workflows/pages.yml`) publishes the repository root.

All internal links are relative, so the site works both as a user site (`username.github.io`) and a project site (`username.github.io/repo/`).

## Structure

```text
.
├── index.html
├── work/index.html
├── ai.html
├── competitions.html
├── about.html
├── open-source.html
├── blog/
│   ├── index.html
│   ├── name-that-llm.html
│   ├── two-gpu-local-lab.html
│   ├── last-mile-taste.html
│   ├── agent-loops-need-taste.html
│   └── what-1-4mb-buys.html
├── manifest.webmanifest
├── assets/
│   ├── css/site.css
│   ├── css/article.css
│   ├── fonts/inter-normal.woff2
│   ├── fonts/ibm-plex-mono-*.woff2
│   ├── img/
│   └── js/site.js
├── .github/workflows/pages.yml
└── favicon.svg
```

`site.css` contains the shared shell and home/work/stack pages. `article.css` contains the journal and article reading layout.

## Content sources

- **ECHO ZERO / 零号信标** — the "蓝光游戏" project; live at https://norwinyu.github.io/echo-zero/; screenshot from `echo-zero/screenshots/title.webp`.
- **烽火三国 / Beacon of the Three Kingdoms** — live at https://norwinyu.github.io/three-kingdoms-slg/; screenshot from `three-kingdoms-slg/screenshots/menu.png`.
- **仙宗 / Immortal Sect** — "修仙宗门" project; live at https://norwinyu.github.io/ImmortalSect/; screenshot from `ImmortalSect/docs/media/hero.jpg`.
- **雾谷农庄 / Mistvale Farm** — live at https://norwinyu.github.io/mistvale-farm/.
- **机场大亨 3D / Airport Tycoon** — Godot desktop build; no public web export.
- **NEON BREACH** — no-skill control run; live at https://norwinyu.github.io/neon-breach/.
- **明宫三维 / Ming Palace 3D** — local-model comparison; live at https://norwinyu.github.io/deepseek-flash-1017-ming-palace/.
- **RoomTessera 3D** — live at https://norwinyu.github.io/roomtessera-3d/.
- **Name That LLM** — chart and figures from the open-pool study in `name-that-llm/`.
- **Competitions** — 2020 insurance NLP (Rank 14 / 0.29306), 2020 Tianchi Ele.me (45 / 102 / 0.751), plus the 2026 Kaggle works in progress.

The game screenshots and assets remain subject to their own project licences (mostly non-commercial demos). Only reuse them with the same restrictions.

## Before publishing

Verify these fields, which are deliberately kept in plain HTML so they are easy to edit:

- Mac memory/storage (`48 GB`, `1 TB`) and workstation RAM/storage (`94 GB DDR4`, `4 TB NVMe`) in `ai.html` and the home summary.
- AI plan names and model versions in `ai.html` — this is a November 2026 snapshot.
- Competition results and dates in `competitions.html`.
- Any project links in `work/index.html`.

The site intentionally has **no email address** in the source. Add a contact link in `about.html` and the footer if you want one.

## Mobile web

The layout is tested at 320, 390, 430 and 1440 px wide. It uses a single-column flow below 940 px, converts data tables into labelled cards below 760 px, and enables a full-height mobile menu with safe-area handling. `manifest.webmanifest` plus 192/512 px icons make the site installable from a mobile browser; there is no service worker or offline cache.

## Security

- No API keys, tokens, `.env` files or private endpoints.
- No external scripts, fonts, analytics or trackers.
- CSP meta tags restrict scripts, styles, images, fonts and connections to the same origin.
- External links use `rel="noopener"`.

## Licence

Site code: MIT. Personal text and project screenshots: all rights reserved unless the source project states otherwise.
