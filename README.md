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

All internal links are relative, so the same files work as a user site (`username.github.io`) or a project site (`username.github.io/repo/`).

## Structure

```text
.
├── index.html
├── work/                 experiments
├── blog/                 journal
├── about.html
├── ai.html
├── competitions.html
├── open-source.html
├── assets/               css, js, fonts, images
├── manifest.webmanifest
├── 404.html
└── .github/workflows/pages.yml
```

Add new pages as plain HTML and link them from the relevant index. Keep page-specific styling in the existing CSS files rather than adding a framework.

## Content notes

- Project screenshots and third-party assets remain subject to their own project licences.
- Site code is MIT; personal text and original images are all rights reserved unless stated otherwise.
- The site intentionally contains no email address or private contact details.

## Security

- No API keys, tokens, `.env` files or private endpoints.
- No external scripts, fonts, analytics or trackers.
- CSP meta tags restrict scripts, styles, images, fonts and connections to the same origin.
- External links use `rel="noopener"`.
