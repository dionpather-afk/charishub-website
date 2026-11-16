// Proves no Wix photo link remains and every local photo reference exists.
// Usage: node tools/check-photos.mjs <siteDir>
import fs from 'node:fs/promises';
import path from 'node:path';

const siteDir = process.argv[2] || 'xneelo-site';
const exts = new Set(['.html', '.htm', '.css', '.js', '.json', '.xml', '.php']);
const problems = []; let files = 0, refs = 0;
async function* walk(d) {
  for (const e of await fs.readdir(d, { withFileTypes: true })) {
    if (e.name === 'node_modules' || e.name === '.git') continue;
    const p = path.join(d, e.name);
    if (e.isDirectory()) yield* walk(p); else yield p;
  }
}
for await (const f of walk(siteDir)) {
  if (!exts.has(path.extname(f).toLowerCase())) continue;
  files++;
  const t = await fs.readFile(f, 'utf8');
  if (/wixstatic\.com|wixmp\.com|parastorage\.com/.test(t)) problems.push(`Wix link still present: ${f}`);
  for (const m of t.matchAll(/\/assets\/images\/[^"'\s)?#\\]+/g)) {
    refs++;
    try { const s = await fs.stat(path.join(siteDir, m[0])); if (!s.size) problems.push(`Empty photo: ${m[0]} (in ${f})`); }
    catch { problems.push(`Missing photo: ${m[0]} (in ${f})`); }
  }
}
console.log(`Checked ${files} files, ${refs} photo references.`);
if (problems.length) { console.log('PROBLEMS:\n' + [...new Set(problems)].join('\n')); process.exit(1); }
console.log('PASS: no Wix links left and every photo exists.');
