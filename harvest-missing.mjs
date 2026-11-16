// harvest-missing.mjs
// Retries ONLY the baseline screenshots that are missing.
// Does not wait for "networkidle" (Wix never goes quiet). Loads the page,
// waits a few seconds, scrolls to trigger lazy photos, then screenshots.

import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const SITE = (process.env.SITE || 'https://www.rcacharisma.com').replace(/\/$/, '');
const OUT = process.env.OUT || 'migration/harvest';
const BASE = path.join(OUT, 'baseline');
fs.mkdirSync(BASE, { recursive: true });

const PAGES = [
  ['home', '/'],
  ['about', '/about'],
  ['leadership', '/leadership'],
  ['ministries', '/ministries'],
  ['sermons', '/sermons'],
  ['events', '/events'],
  ['devotionals', '/devotionals'],
  ['history', '/history'],
  ['gallery', '/gallery'],
  ['giving', '/giving'],
  ['contact', '/contact'],
];
const WIDTHS = [375, 768, 1440];
const ATTEMPTS = 3;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const todo = [];
for (const [name, route] of PAGES) {
  for (const width of WIDTHS) {
    const file = path.join(BASE, `${name}-${width}.png`);
    if (!fs.existsSync(file)) todo.push({ name, route, width, file });
  }
}

console.log(`Missing screenshots to retry: ${todo.length}`);
todo.forEach((t) => console.log(` - ${t.name}-${t.width}`));

const browser = await chromium.launch();
const results = [];

for (const t of todo) {
  const url = SITE + t.route;
  let ok = false;
  let lastError = '';
  let images = [];

  for (let attempt = 1; attempt <= ATTEMPTS && !ok; attempt++) {
    const context = await browser.newContext({
      viewport: { width: t.width, height: 900 },
    });
    const page = await context.newPage();
    const seen = new Set();

    page.on('response', (res) => {
      try {
        const u = res.url();
        const type = res.headers()['content-type'] || '';
        if (u.includes('static.wixstatic.com') && type.startsWith('image/')) {
          seen.add(u);
        }
      } catch {
        // ignore
      }
    });

    try {
      console.log(`${t.name}-${t.width}: attempt ${attempt}`);
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
      await sleep(8000);

      // Scroll down in steps so lazy-loaded photos load
      const height = await page.evaluate(() => document.body.scrollHeight);
      for (let y = 0; y < height + 900; y += 600) {
        await page.evaluate((pos) => window.scrollTo(0, pos), y);
        await sleep(400);
      }
      await page.evaluate(() => window.scrollTo(0, 0));
      await sleep(2500);

      const textLength = await page.evaluate(
        () => (document.body.innerText || '').trim().length
      );
      if (textLength < 20) {
        throw new Error('Page looks blank');
      }

      await page.screenshot({ path: t.file, fullPage: true });
      images = [...seen];
      ok = true;
      console.log(`${t.name}-${t.width}: saved`);
    } catch (err) {
      lastError = String(err.message || err).split('\n')[0];
      console.log(`${t.name}-${t.width}: attempt ${attempt} failed: ${lastError}`);
    } finally {
      await context.close();
    }
  }

  results.push({
    page: t.name,
    width: t.width,
    ok,
    error: ok ? '' : lastError,
    wixPhotosSeen: images,
  });
}

await browser.close();

fs.writeFileSync(
  path.join(OUT, 'baseline-missing-report.json'),
  JSON.stringify(results, null, 2)
);

const saved = results.filter((r) => r.ok).length;
console.log(`Done. Saved ${saved} of ${results.length} missing screenshots.`);
