// Full technical check of a built or deployed site, run before any link is shared.
//   node tools/check-site.mjs <base-url> [screenshot-folder]
// For every page, at phone / tablet / desktop width, it reports:
//   - files that failed to load (404s etc.), broken internal links,
//   - pictures that did not load, JavaScript errors,
//   - any request to an outside host (to prove nothing still loads from Wix).
// Needs playwright-core and a Chrome/Chromium (CHROME_PATH, default /usr/bin/google-chrome).
import { chromium } from 'playwright-core';
import fs from 'node:fs/promises';

const BASE = (process.argv[2] || 'http://localhost:4321/').replace(/\/?$/, '/');
const SHOTS = process.argv[3];
const ROUTES = ['', 'about', 'leadership', 'history', 'events', 'sermons', 'ministries', 'devotionals', 'gallery', 'giving', 'contact'];
// Same screen sizes the Wix site was captured at (migration/harvest/baseline).
const SIZES = [[375, 812], [768, 1024], [1440, 900]];
// Outside services the site is meant to use (not Wix).
const ALLOWED_HOSTS = ['www.google.com', 'maps.google.com', 'maps.gstatic.com', 'www.youtube.com', 'www.youtube-nocookie.com', 'i.ytimg.com', 'fonts.gstatic.com'];

const base = new URL(BASE);
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || '/usr/bin/google-chrome', args: ['--no-sandbox'] });
const problems = [];
const outside = new Map();
const links = new Set();
if (SHOTS) await fs.mkdir(SHOTS, { recursive: true });

for (const [width, height] of SIZES) {
  const ctx = await browser.newContext({ viewport: { width, height } });
  for (const route of ROUTES) {
    const page = await ctx.newPage();
    const url = new URL(route, BASE).href;
    page.on('pageerror', (e) => problems.push(`[${width}] ${route || 'home'}: JS error: ${e.message}`));
    page.on('requestfailed', (r) => { if (!/youtube|google/.test(r.url()) && !(/\.mp4$/.test(r.url()) && r.failure()?.errorText === 'net::ERR_ABORTED')) problems.push(`[${width}] ${route || 'home'}: failed ${r.url()} (${r.failure()?.errorText})`); });
    page.on('response', (r) => {
      const u = new URL(r.url());
      if (u.host === base.host) { if (r.status() >= 400) problems.push(`[${width}] ${route || 'home'}: HTTP ${r.status()} ${r.url()}`); }
      else outside.set(u.host, (outside.get(u.host) || 0) + 1);
    });
    await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
    // Scroll to the bottom so lazy pictures load, then check every picture.
    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 120)); }
      window.scrollTo(0, 0);
    });
    await page.waitForLoadState('networkidle');
    const broken = await page.evaluate(() => [...document.images].filter((i) => i.complete && i.naturalWidth === 0 && i.getAttribute('src')).map((i) => i.src));
    broken.forEach((b) => problems.push(`[${width}] ${route || 'home'}: picture did not load ${b}`));
    const imgCount = await page.evaluate(() => document.images.length);
    const title = await page.title();
    (await page.evaluate(() => [...document.querySelectorAll('a[href]')].map((a) => a.href))).forEach((h) => links.add(h));
    if (SHOTS) await page.screenshot({ path: `${SHOTS}/${route || 'home'}-${width}.png`, fullPage: true });
    console.log(`ok ${width}px ${route || 'home'} — "${title}", ${imgCount} pictures`);
    await page.close();
  }
  await ctx.close();
}

// Internal links must open a real page.
for (const href of links) {
  const u = new URL(href);
  if (u.host !== base.host || !u.pathname.startsWith(base.pathname)) continue;
  const r = await fetch(u.origin + u.pathname);
  if (r.status >= 400) problems.push(`broken link ${href} (HTTP ${r.status})`);
}
await browser.close();

const wixHosts = [...outside.keys()].filter((h) => /wix|parastorage/.test(h));
const unexpected = [...outside.keys()].filter((h) => !ALLOWED_HOSTS.includes(h));
console.log('\nOutside hosts used:', Object.fromEntries(outside));
console.log('Wix hosts used:', wixHosts.length ? wixHosts : 'none');
if (unexpected.length) console.log('Unexpected outside hosts:', unexpected);
console.log(problems.length ? `\nPROBLEMS (${problems.length}):\n` + problems.join('\n') : '\nNo problems found.');
process.exit(problems.length || wixHosts.length ? 1 : 0);
