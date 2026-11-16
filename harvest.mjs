// Crawls the live Wix site, records every photo (page, position, size) at 3 screen widths,
// downloads the exact displayed version and the original, and writes photo-map.json.
// Also saves baseline screenshots used later to prove the new site looks identical.
import { chromium } from 'playwright';
import fs from 'node:fs/promises';
import path from 'node:path';

const SITE = (process.env.SITE || 'https://www.rcacharisma.com').replace(/\/$/, '');
const OUT = process.env.OUT || 'migration/harvest';
const MAX_PAGES = Number(process.env.MAX_PAGES || 200);
const VIEWPORTS = [{ w: 375, h: 812 }, { w: 768, h: 1024 }, { w: 1440, h: 900 }];
const UA = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36';
const bare = h => h.replace(/^www\./, '');
const sameSite = u => { try { return bare(new URL(u).host) === bare(new URL(SITE).host); } catch { return false; } };
const slug = s => (s || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 40);
const pageSlug = u => { const p = new URL(u).pathname; return slug(p === '/' ? 'home' : p) || 'page'; };
const wixId = u => (u.match(/^https:\/\/static\.wixstatic\.com\/media\/([^\/?#]+)/) || [])[1] || null;
const wixBase = u => { const id = wixId(u); return id ? `https://static.wixstatic.com/media/${id}` : null; };
const normalize = u => { const x = new URL(u); x.hash = ''; return x.href.replace(/\/$/, '') || SITE; };

async function getText(u) {
  const r = await fetch(u, { headers: { 'user-agent': UA } });
  if (!r.ok) throw new Error('HTTP ' + r.status);
  return r.text();
}
async function sitemapUrls() {
  const found = new Set();
  async function walk(u, depth) {
    try {
      const xml = await getText(u);
      const locs = [...xml.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)].map(m => m[1].replace(/&amp;/g, '&'));
      for (const l of locs) {
        if (/\.xml(\?|$)/.test(l) && depth < 3) await walk(l, depth + 1); else found.add(l);
      }
    } catch (e) { console.log('sitemap skipped:', u, e.message); }
  }
  await walk(`${SITE}/sitemap.xml`, 0);
  return [...found].filter(sameSite);
}
async function autoScroll(page) {
  await page.evaluate(async () => {
    await new Promise(res => {
      let y = 0; const step = 400;
      const t = setInterval(() => {
        window.scrollBy(0, step); y += step;
        if (y >= document.documentElement.scrollHeight) { clearInterval(t); window.scrollTo(0, 0); res(); }
      }, 150);
    });
  });
}
const collect = () => {
  const abs = u => { try { return new URL(u, location.href).href; } catch { return null; } };
  const box = el => { const r = el.getBoundingClientRect(); return { x: Math.round(r.x + scrollX), y: Math.round(r.y + scrollY), w: Math.round(r.width), h: Math.round(r.height) }; };
  const images = [];
  document.querySelectorAll('img').forEach(el => {
    const u = abs(el.currentSrc || el.src);
    if (u && !u.startsWith('data:')) images.push({ kind: 'img', url: u, alt: el.alt || '', ...box(el), nw: el.naturalWidth, nh: el.naturalHeight });
  });
  document.querySelectorAll('*').forEach(el => {
    const bg = getComputedStyle(el).backgroundImage;
    if (bg && bg !== 'none') for (const m of bg.matchAll(/url\(["']?([^"')]+)["']?\)/g)) {
      const u = abs(m[1]);
      if (u && !u.startsWith('data:')) images.push({ kind: 'background', url: u, alt: el.getAttribute('aria-label') || '', ...box(el), nw: 0, nh: 0 });
    }
  });
  return { images, links: [...document.querySelectorAll('a[href]')].map(a => a.href) };
};

await fs.mkdir(path.join(OUT, 'baseline'), { recursive: true });
await fs.mkdir(path.join(OUT, 'html'), { recursive: true });
await fs.mkdir(path.join(OUT, 'assets/images'), { recursive: true });
await fs.mkdir(path.join(OUT, 'originals'), { recursive: true });

const queue = [SITE + '/', ...(await sitemapUrls())];
const seen = new Set();
const occurrences = [];
const baselineIndex = [];
const pageErrors = [];
const apiHits = [];
const browser = await chromium.launch();

while (queue.length && seen.size < MAX_PAGES) {
  const raw = queue.shift();
  let url; try { url = normalize(raw); } catch { continue; }
  if (seen.has(url) || !sameSite(url)) continue;
  seen.add(url);
  console.log(`[${seen.size}] ${url}`);
  for (const vp of VIEWPORTS) {
    const ctx = await browser.newContext({ viewport: { width: vp.w, height: vp.h }, deviceScaleFactor: 1, userAgent: UA, reducedMotion: 'reduce' });
    const page = await ctx.newPage();
    const net = new Set();
    page.on('response', async r => {
      const u = r.url();
      if (u.includes('static.wixstatic.com/media/')) net.add(u);
      const ct = r.headers()['content-type'] || '';
      if (vp.w === 1440 && ct.includes('json') && /wixapis\.com|\/_api\/|wix-data/.test(u) && !/frog\.wix|analytics|bi-|monitoring/.test(u)) {
        try { apiHits.push({ page: new URL(url).pathname, url: u, method: r.request().method(), status: r.status(), body: await r.text() }); } catch { /* ignore */ }
      }
    });
    try {
      await page.goto(url, { waitUntil: 'networkidle', timeout: 90000 });
      await autoScroll(page);
      await page.waitForTimeout(1500);
      const data = await page.evaluate(collect);
      const ps = pageSlug(url);
      const shot = `${ps}-${vp.w}.png`;
      await page.screenshot({ path: path.join(OUT, 'baseline', shot), fullPage: true });
      await fs.writeFile(path.join(OUT, 'html', `${ps}-${vp.w}.html`), await page.content());
      baselineIndex.push({ file: shot, path: new URL(url).pathname, width: vp.w, height: vp.h });
      const domUrls = new Set(data.images.map(i => i.url));
      data.images.sort((a, b) => a.y - b.y || a.x - b.x).forEach((im, i) => occurrences.push({ page: new URL(url).pathname, pageSlug: ps, viewport: vp.w, order: i + 1, ...im }));
      for (const u of net) if (!domUrls.has(u)) occurrences.push({ page: new URL(url).pathname, pageSlug: ps, viewport: vp.w, order: 999, kind: 'network-only', url: u, alt: '', x: 0, y: 0, w: 0, h: 0, nw: 0, nh: 0 });
      if (vp.w === 1440) for (const l of data.links) if (sameSite(l) && !/\.(pdf|jpg|png|zip)$/i.test(l)) queue.push(l);
    } catch (e) { pageErrors.push({ url, viewport: vp.w, error: e.message }); console.log('  failed:', vp.w, e.message); }
    await ctx.close();
  }
}
await browser.close();

// Download every Wix-hosted photo: exact displayed version + original
const extFromType = (ct, u) => {
  if (/jpeg/.test(ct)) return 'jpg'; if (/png/.test(ct)) return 'png'; if (/webp/.test(ct)) return 'webp';
  if (/gif/.test(ct)) return 'gif'; if (/svg/.test(ct)) return 'svg'; if (/avif/.test(ct)) return 'avif';
  return (u.split('?')[0].match(/\.([a-z0-9]{3,4})$/i) || [, 'jpg'])[1].toLowerCase();
};
async function fetchBin(u) {
  for (let i = 0; i < 3; i++) {
    try {
      const r = await fetch(u, { headers: { 'user-agent': UA, accept: 'image/*,*/*' } });
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return { buf: Buffer.from(await r.arrayBuffer()), type: r.headers.get('content-type') || '' };
    } catch (e) { if (i === 2) throw e; await new Promise(r => setTimeout(r, 1000 * (i + 1))); }
  }
}
const preferred = [...occurrences.filter(o => o.viewport === 1440), ...occurrences.filter(o => o.viewport !== 1440)];
const map = {}; const perPageCount = {}; const failures = []; const otherHosts = new Set();
for (const o of preferred) {
  if (!wixId(o.url)) { if (!o.url.startsWith('data:') && !sameSite(o.url)) otherHosts.add(new URL(o.url).host); continue; }
  if (map[o.url]) { if (!map[o.url].pages.includes(o.page)) map[o.url].pages.push(o.page); continue; }
  perPageCount[o.pageSlug] = (perPageCount[o.pageSlug] || 0) + 1;
  const n = String(perPageCount[o.pageSlug]).padStart(2, '0');
  const stem = `${o.pageSlug}-${n}-${slug(o.alt) || o.kind}`;
  try {
    const shown = await fetchBin(o.url);
    const ext = extFromType(shown.type, o.url);
    const file = `${stem}.${ext}`;
    await fs.writeFile(path.join(OUT, 'assets/images', file), shown.buf);
    let originalFile = null;
    try {
      const orig = await fetchBin(wixBase(o.url));
      originalFile = `${stem}.${extFromType(orig.type, wixBase(o.url))}`;
      await fs.writeFile(path.join(OUT, 'originals', originalFile), orig.buf);
    } catch (e) { failures.push({ url: wixBase(o.url), what: 'original', error: e.message }); }
    map[o.url] = { id: wixId(o.url), file: `/assets/images/${file}`, original: originalFile && `originals/${originalFile}`, displayedWidth: o.w, displayedHeight: o.h, pages: [o.page] };
  } catch (e) { failures.push({ url: o.url, what: 'displayed', error: e.message }); }
}
await fs.writeFile(path.join(OUT, 'api-capture.json'), JSON.stringify(apiHits, null, 2));
const cmsIds = new Map();
for (const h of apiHits) {
  for (const m of h.body.matchAll(/wix:image:\/\/v1\/([^\/"\\]+)\/([^"\\#]*)/g)) cmsIds.set(m[1], m[2]);
  for (const m of h.body.matchAll(/static\.wixstatic\.com\/media\/([^\/"\\?#]+)/g)) if (!cmsIds.has(m[1])) cmsIds.set(m[1], '');
}
await fs.mkdir(path.join(OUT, 'assets/images/cms'), { recursive: true });
const knownIds = new Set(Object.values(map).map(v => v.id));
const cmsPhotos = [];
for (const [id, name] of cmsIds) {
  const base = `https://static.wixstatic.com/media/${id}`;
  try {
    const r = await fetchBin(base);
    const file = `${slug(id.replace(/~mv2.*/, ''))}.${extFromType(r.type, base)}`;
    await fs.writeFile(path.join(OUT, 'assets/images/cms', file), r.buf);
    cmsPhotos.push({ id, friendlyName: name, file: `/assets/images/cms/${file}`, alsoShownOnPages: knownIds.has(id) });
  } catch (e) { failures.push({ url: base, what: 'cms-photo', error: e.message }); }
}
await fs.writeFile(path.join(OUT, 'cms-photos.json'), JSON.stringify(cmsPhotos, null, 2));
await fs.writeFile(path.join(OUT, 'photo-map.json'), JSON.stringify(map, null, 2));
await fs.writeFile(path.join(OUT, 'photo-inventory.json'), JSON.stringify(occurrences, null, 2));
await fs.writeFile(path.join(OUT, 'baseline-index.json'), JSON.stringify(baselineIndex, null, 2));
const report = [
  '# Wix harvest report', '',
  `- Site: ${SITE}`, `- Pages visited: ${seen.size}`, `- Photo occurrences recorded: ${occurrences.length}`,
  `- Unique Wix photos downloaded: ${Object.keys(map).length}`, `- Photos found inside CMS data: ${cmsPhotos.length}`, `- CMS/API data responses captured: ${apiHits.length}`, `- Download failures: ${failures.length}`,
  `- Page load errors: ${pageErrors.length}`, `- Other image hosts seen: ${[...otherHosts].join(', ') || 'none'}`, '',
  '## Pages', ...[...seen].map(u => `- ${u}`), '',
  '## Failures', ...(failures.length ? failures.map(f => `- ${f.what}: ${f.url} (${f.error})`) : ['- none']), '',
  '## Page errors', ...(pageErrors.length ? pageErrors.map(f => `- ${f.url} @${f.viewport}: ${f.error}`) : ['- none']),
].join('\n');
await fs.writeFile(path.join(OUT, 'report.md'), report);
console.log(report);
