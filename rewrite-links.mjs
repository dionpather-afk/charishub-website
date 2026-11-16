// Replaces every Wix photo link in the site code with the local file from photo-map.json.
// Usage: node tools/rewrite-links.mjs <siteDir> <photo-map.json>
import fs from 'node:fs/promises';
import path from 'node:path';

const siteDir = process.argv[2] || 'xneelo-site';
const map = JSON.parse(await fs.readFile(process.argv[3] || 'migration/harvest/photo-map.json', 'utf8'));
const entries = Object.entries(map).sort((a, b) => b[0].length - a[0].length);
const byId = {}; for (const [, v] of entries) byId[v.id] ??= v.file;
const exts = new Set(['.html', '.htm', '.css', '.js', '.json', '.xml', '.php']);
const report = { filesChanged: 0, exact: 0, approximate: [], unresolved: [] };

async function* walk(d) {
  for (const e of await fs.readdir(d, { withFileTypes: true })) {
    if (e.name === 'node_modules' || e.name === '.git') continue;
    const p = path.join(d, e.name);
    if (e.isDirectory()) yield* walk(p); else yield p;
  }
}
for await (const f of walk(siteDir)) {
  if (!exts.has(path.extname(f).toLowerCase()) || path.basename(f) === 'photo-map.json') continue;
  let t = await fs.readFile(f, 'utf8'); const before = t;
  for (const [url, v] of entries) {
    for (const variant of [url, url.replace(/^https:/, ''), url.replace(/&/g, '&amp;')]) {
      const parts = t.split(variant);
      if (parts.length > 1) { report.exact += parts.length - 1; t = parts.join(v.file); }
    }
  }
  t = t.replace(/(?:https?:)?\/\/static\.wixstatic\.com\/media\/([^\/"'\s)?#\\]+)(?:\/v1\/[^"'\s)\\]*)?/g, (m, id) => {
    if (byId[id]) { report.approximate.push({ file: f, link: m, usedFile: byId[id] }); return byId[id]; }
    report.unresolved.push({ file: f, link: m }); return m;
  });
  if (t !== before) { await fs.writeFile(f, t); report.filesChanged++; }
}
await fs.writeFile('rewrite-report.json', JSON.stringify(report, null, 2));
console.log(`Files changed: ${report.filesChanged}\nExact replacements: ${report.exact}\nApproximate (same photo, different crop, REVIEW): ${report.approximate.length}\nUnresolved Wix links: ${report.unresolved.length}`);
if (report.unresolved.length) process.exitCode = 1;
