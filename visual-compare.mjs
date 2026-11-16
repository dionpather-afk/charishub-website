// Screenshots the NEW site and compares it pixel by pixel with the Wix baseline.
// Env: NEW_URL (required), BASELINE (default migration/harvest/baseline), MAX_DIFF_PCT (default 0.1)
import { chromium } from 'playwright';
import fs from 'node:fs/promises';
import path from 'node:path';
import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch';

const NEW = (process.env.NEW_URL || '').replace(/\/$/, '');
if (!NEW) { console.error('Set NEW_URL'); process.exit(2); }
const BASE = process.env.BASELINE || 'migration/harvest/baseline';
const OUT = process.env.OUT || 'migration/compare';
const LIMIT = Number(process.env.MAX_DIFF_PCT || 0.1);
const index = JSON.parse(await fs.readFile(path.join(BASE, '..', 'baseline-index.json'), 'utf8'));
await fs.mkdir(path.join(OUT, 'diff'), { recursive: true });
const browser = await chromium.launch();
const rows = []; let failed = 0;
for (const it of index) {
  const ctx = await browser.newContext({ viewport: { width: it.width, height: it.height }, deviceScaleFactor: 1, reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  let status = 'PASS', pct = 0, note = '';
  try {
    await page.goto(NEW + it.path, { waitUntil: 'networkidle', timeout: 90000 });
    await page.evaluate(async () => { for (let y = 0; y < document.documentElement.scrollHeight; y += 400) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 120)); } window.scrollTo(0, 0); });
    await page.waitForTimeout(1500);
    const buf = await page.screenshot({ fullPage: true });
    const a = PNG.sync.read(await fs.readFile(path.join(BASE, it.file))); const b = PNG.sync.read(buf);
    if (a.width !== b.width || a.height !== b.height) { status = 'FAIL'; note = `size differs: old ${a.width}x${a.height}, new ${b.width}x${b.height}`; }
    else {
      const d = new PNG({ width: a.width, height: a.height });
      const n = pixelmatch(a.data, b.data, d.data, a.width, a.height, { threshold: 0.1 });
      pct = (n / (a.width * a.height)) * 100;
      if (pct > LIMIT) { status = 'FAIL'; await fs.writeFile(path.join(OUT, 'diff', it.file), PNG.sync.write(d)); }
    }
  } catch (e) { status = 'FAIL'; note = e.message; }
  if (status === 'FAIL') failed++;
  rows.push(`| ${it.path} | ${it.width} | ${status} | ${pct.toFixed(3)}% | ${note} |`);
  await ctx.close();
}
await browser.close();
const md = ['# Visual comparison', '', `Limit: ${LIMIT}% of pixels. Failed: ${failed} of ${index.length}`, '', '| Page | Width | Result | Diff | Note |', '|---|---|---|---|---|', ...rows].join('\n');
await fs.writeFile(path.join(OUT, 'report.md'), md); console.log(md);
process.exit(failed ? 1 : 0);
