"""
Page text snapshot (AEO fix) - run after `npm run build`.

Why: the site's pages are drawn by JavaScript in the visitor's browser.
Google runs JavaScript, but most AI tools (ChatGPT, Perplexity, Claude, Bing
previews) and WhatsApp/Facebook previews only read the raw HTML, so they see
an empty page. This script opens every built page in a headless browser,
copies the text people actually see (headings, paragraphs, lists, links,
image descriptions) and writes it into that page's HTML inside <noscript>.

- Visitors see no change at all (browsers with JavaScript ignore <noscript>).
- Crawlers that don't run JavaScript now read the real page text.
- The text is copied from the real rendered page, so it always matches.

Usage:  python3 tools/snapshot-pages.py dist [/base/]
Rollback: rebuild without running this script (or revert the commit).
"""
import functools
import html
import http.server
import sys
import threading
from pathlib import Path

from playwright.sync_api import sync_playwright

DIST = Path(sys.argv[1] if len(sys.argv) > 1 else "dist").resolve()
BASE = sys.argv[2] if len(sys.argv) > 2 else "/"
MARK_START = "<!-- page-snapshot:start -->"
MARK_END = "<!-- page-snapshot:end -->"

# Runs inside the page: walks the rendered #root and returns blocks in order.
EXTRACT_JS = r"""
() => {
  const root = document.getElementById('root');
  const out = [];
  const seen = new Set();
  const clean = s => {
    let t = (s || '').replace(/\s+/g, ' ').trim();
    const w = t.split(' ');  // "EXPLORE EXPLORE" (hover animation text) -> "EXPLORE"
    if (w.length % 2 === 0 && w.length > 0 && w.slice(0, w.length/2).join(' ') === w.slice(w.length/2).join(' ')) t = w.slice(0, w.length/2).join(' ');
    return t;
  };
  const push = (b) => {
    const key = b.t + '|' + b.text + '|' + (b.href || '');
    if (!b.text || seen.has(key)) return;
    seen.add(key); out.push(b);
  };
  const walk = (el) => {
    if (!(el instanceof Element)) return;
    const tag = el.tagName.toLowerCase();
    if (['script','style','svg','noscript','iframe','button','input','textarea','select','form'].includes(tag)) {
      if (tag === 'form') push({t: 'p', text: '[Contact form on this page]'});
      return;
    }
    if (/^h[1-6]$/.test(tag)) { push({t: tag, text: clean(el.innerText)}); return; }
    if (tag === 'p' || tag === 'blockquote' || tag === 'address') { push({t: 'p', text: clean(el.innerText)}); return; }
    if (tag === 'li') { push({t: 'li', text: clean(el.innerText)}); return; }
    if (tag === 'img') { const a = clean(el.getAttribute('alt')); if (a) push({t: 'img', text: a}); return; }
    if (tag === 'a') {
      const href = el.getAttribute('href') || '';
      const text = clean(el.innerText) || clean(el.getAttribute('aria-label'));
      if (text && href && !href.startsWith('javascript')) { push({t: 'a', text, href}); return; }
    }
    // Leaf text inside divs/spans (e.g. service times shown in a div)
    const kids = Array.from(el.children);
    if (kids.length === 0) { const t = clean(el.innerText); if (t && t.length > 2) push({t: 'p', text: t}); return; }
    kids.forEach(walk);
  };
  walk(root);
  return out;
}
"""


def pages():
    for f in sorted(DIST.rglob("index.html")):
        rel = f.parent.relative_to(DIST).as_posix()
        if rel == ".":
            yield f, BASE
        else:
            yield f, BASE + rel


def to_html(blocks):
    parts = []
    in_list = False
    for b in blocks:
        t, text = b["t"], html.escape(b["text"])
        if t in ("li", "a") and not in_list:
            parts.append("<ul>"); in_list = True
        if t not in ("li", "a") and in_list:
            parts.append("</ul>"); in_list = False
        if t == "li":
            parts.append(f"<li>{text}</li>")
        elif t == "a":
            parts.append(f'<li><a href="{html.escape(b["href"], quote=True)}">{text}</a></li>')
        elif t == "img":
            parts.append(f"<p>[Image: {text}]</p>")
        elif t.startswith("h"):
            parts.append(f"<{t}>{text}</{t}>")
        else:
            parts.append(f"<p>{text}</p>")
    if in_list:
        parts.append("</ul>")
    return "\n".join(parts)


def main():
    # Serve dist so the site's base path works like the real site.
    import os, tempfile
    if BASE.strip("/"):
        tmp = Path(tempfile.mkdtemp())
        (tmp / BASE.strip("/")).parent.mkdir(parents=True, exist_ok=True)
        os.symlink(DIST, tmp / BASE.strip("/"))
        serve_dir = tmp
    else:
        serve_dir = DIST
    url_base = BASE
    handler = functools.partial(http.server.SimpleHTTPRequestHandler, directory=str(serve_dir))
    http.server.SimpleHTTPRequestHandler.log_message = lambda *a: None
    httpd = http.server.ThreadingHTTPServer(("127.0.0.1", 0), handler)
    httpd.handle_error = lambda *a: None
    port = httpd.server_address[1]
    threading.Thread(target=httpd.serve_forever, daemon=True).start()

    failed = 0
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page(viewport={"width": 1280, "height": 900})
        for f, path in pages():
            url_path = path.replace(BASE, url_base, 1)
            url = f"http://127.0.0.1:{port}{url_path}"
            page.goto(url, wait_until="networkidle")
            # Scroll through so scroll-triggered sections render.
            page.evaluate("async () => { for (let y = 0; y < document.body.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 60)); } window.scrollTo(0, 0); }")
            page.wait_for_timeout(800)
            blocks = page.evaluate(EXTRACT_JS)
            if len(blocks) < 5:
                print(f"FAIL {path}: only {len(blocks)} blocks found"); failed += 1; continue
            snippet = f'{MARK_START}<noscript><div class="page-snapshot">\n{to_html(blocks)}\n</div></noscript>{MARK_END}'
            src = f.read_text(encoding="utf-8")
            if MARK_START in src:
                src = src[: src.index(MARK_START)] + src[src.index(MARK_END) + len(MARK_END):]
            anchor = '<div id="root"'
            if anchor not in src:
                print(f"FAIL {path}: #root not found"); failed += 1; continue
            src = src.replace(anchor, snippet + anchor, 1)
            f.write_text(src, encoding="utf-8")
            words = sum(len(b["text"].split()) for b in blocks)
            print(f"OK   {path}: {len(blocks)} blocks, {words} words")
        browser.close()
    httpd.shutdown()
    if failed:
        sys.exit(f"{failed} page(s) failed")


if __name__ == "__main__":
    main()
