# Norwin Yu — personal site

A static, multi-page personal site for GitHub Pages, framed as AI usage research. Content is plain HTML; there is no build step and no runtime dependency.

The site has no analytics, cookies, third-party requests or client-side API keys.

## Run locally

```bash
python3 -m http.server 4180
# open http://127.0.0.1:4180/
```

Opening `index.html` directly also works, but a local server is better for checking root-relative links.

## Deploy

The site deploys from `main` through `.github/workflows/pages.yml` using GitHub Actions. In the repository, **Settings → Pages → Build and deployment** should be set to **GitHub Actions**.

Most internal links are relative. The journal is split at `/blog/` (Chinese) and `/en/blog/` (English), so journal entry links, language switches and the 404 page use root-absolute paths. `404.html` is served by GitHub Pages at whatever path was requested, which is why its asset URLs are absolute; it redirects `/zh/…` misses to `/zh/404.html`.

## Conventions

- `404.html` uses absolute paths — a relative stylesheet would resolve against a directory that does not exist.
- `og:image` is an absolute `https://norwinyu.github.io/…` URL, because scrapers ignore relative ones.
- Images below the fold use `loading="lazy" decoding="async"`; the first image on a page stays eager for LCP.
- The hardware figures on `ai.html` are measured on the workstation, not estimated. If the rig changes, the numbers and the caveats change with it.

## Structure

```text
.
├── index.html            English site (root)
├── work/                 experiments
├── ai.html               "Local" section landing
├── local/                reference pages
├── about.html  competitions.html  open-source.html
├── blog/                 Chinese journal (keeps its original URLs)
├── zh/                   Chinese site: same structure as the root
│   ├── index.html  about.html  competitions.html  open-source.html
│   ├── ai.html  work/  local/
│   └── 404.html
├── en/blog/              English journal
├── assets/               css, js, fonts, images
├── manifest.webmanifest
├── 404.html              English 404 (root-absolute paths)
└── .github/workflows/pages.yml
```

Language layout:

| URL | Language |
| --- | --- |
| `/…` | English |
| `/zh/…` | Chinese |
| `/blog/…` | Chinese journal (unchanged URLs) |
| `/en/blog/…` | English journal |

Every content page carries one `<a class="lang-switch">` pointing at its counterpart and a pair of `hreflang` alternates. The mapping is by path: strip or add the `/zh/` prefix for site pages; `/blog/x.html` ↔ `/en/blog/x.html` for the journal. Pages under `zh/` and `en/` use root-absolute asset URLs (`/assets/…`) because they live one level deeper.

When you add a page, add both languages and set the switch href and the hreflang pair; a missing counterpart is a broken switch. Add a journal post to both `blog/index.html` and `en/blog/index.html`, with the same order and numbering.

`ai.html` is the landing page for the **Local** section; the three pages under `local/` hold the full reference tables it summarises. Journal notes stay narrative — they link into `local/` rather than duplicating the tables.

Add new pages as plain HTML and link them from the relevant index. Keep page-specific styling in the existing CSS files rather than adding a framework.

## Content notes

- Project screenshots and third-party assets remain subject to their own project licences.
- Site code is MIT; personal text and original images are all rights reserved unless stated otherwise.
- Journal posts are AI-drafted from project notes and reviewed by the site owner.
- The site intentionally contains no email address or private contact details.

## Security

- No API keys, tokens, `.env` files or private endpoints.
- No external scripts, fonts, analytics or trackers.
- CSP meta tags restrict scripts, styles, images, fonts and connections to the same origin.
- External links use `rel="noopener"`.
