#!/usr/bin/env python3
"""Rebuild sitemap.xml from the static HTML pages.

Usage: python3 tools/build_sitemap.py
"""
from datetime import date
from pathlib import Path

BASE = "https://norwinyu.github.io"
ROOT = Path(__file__).resolve().parent.parent


def webpath(page: Path) -> str:
    path = page.relative_to(ROOT).as_posix()
    if path == "index.html":
        return "/"
    if path.endswith("/index.html"):
        return "/" + path[:-10]
    return "/" + path


def alternates(path: str):
    if path.startswith("/zh/"):
        return path[3:] or "/", path
    if path.startswith("/blog/"):
        return "/en/blog/" + path[len("/blog/"):], path
    if path.startswith("/en/blog/"):
        return path, "/blog/" + path[len("/en/blog/"):]
    return path, "/zh/" + path.lstrip("/")


def main():
    rows = []
    for page in sorted(ROOT.glob("**/*.html")):
        if page.name == "404.html":
            continue
        # Standalone demos are linked from Work but are not site pages.
        if page.relative_to(ROOT).parts[0] == "demos":
            continue
        path = webpath(page)
        en, zh = alternates(path)
        rows.append((BASE + path, BASE + en, BASE + zh))

    rows.sort(key=lambda row: row[0])
    lines = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
    ]
    today = date.today().isoformat()
    for loc, en, zh in rows:
        lines += [
            "  <url>",
            f"    <loc>{loc}</loc>",
            f"    <lastmod>{today}</lastmod>",
            f'    <xhtml:link rel="alternate" hreflang="en" href="{en}"/>',
            f'    <xhtml:link rel="alternate" hreflang="zh-CN" href="{zh}"/>',
            f'    <xhtml:link rel="alternate" hreflang="x-default" href="{en}"/>',
            "  </url>",
        ]
    lines.append("</urlset>")
    (ROOT / "sitemap.xml").write_text("\n".join(lines) + "\n")
    print(f"wrote sitemap.xml with {len(rows)} URLs")


if __name__ == "__main__":
    main()
