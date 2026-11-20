// Downloads every file listed in migration/wix-media-manifest.tsv (the full Wix media library).
// 1. Full backup, by Wix folder:  migration/wix-backup/<folder>/<wixId>__<original name>
// 2. Site copies (images/video):  public/media/<wixId>.<ext>  — what the new site serves on Xneelo.
import fs from 'node:fs/promises';
import path from 'node:path';

const rows = (await fs.readFile('migration/wix-media-manifest.tsv', 'utf8')).trim().split('\n').slice(1).map(l => l.split('\t'));
const safe = s => s.replace(/[^\w.\- ]+/g, '_').trim();
const report = [];
async function get(url) {
  for (let i = 0; i < 3; i++) {
    try {
      const r = await fetch(url, { headers: { 'user-agent': 'Mozilla/5.0' } });
      if (r.ok) return Buffer.from(await r.arrayBuffer());
      if (r.status === 404) return null;
    } catch {}
    await new Promise(r => setTimeout(r, 1500));
  }
  return null;
}
for (const [folder, name, url] of rows) {
  const isVideo = url.includes('video.wixstatic.com');
  const id = isVideo ? url.split('/video/')[1].split('/')[0] : decodeURIComponent(url.split('/').pop()).replace(/~mv2/, '');
  let buf = null, used = url;
  if (isVideo) {
    for (const v of ['1080p', '720p', '480p', '360p']) {
      used = `https://video.wixstatic.com/video/${id}/${v}/mp4/file.mp4`;
      buf = await get(used); if (buf) break;
    }
    if (!buf) { used = url; buf = await get(url); }
  } else buf = await get(url);
  if (!buf) { report.push({ folder, name, url, ok: false }); console.log('FAILED', url); continue; }
  const ext = isVideo ? '.mp4' : path.extname(id) || path.extname(name) || '';
  const base = isVideo ? id : id.replace(/\.[^.]+$/, '');
  const dir = path.join('migration/wix-backup', safe(folder));
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(path.join(dir, `${base}__${safe(name)}${path.extname(name) ? '' : ext}`), buf);
  if (/\.(jpe?g|png|webp|gif|svg|mp4)$/i.test(ext)) {
    await fs.mkdir('public/media', { recursive: true });
    await fs.writeFile(path.join('public/media', base + ext.toLowerCase()), buf);
  }
  report.push({ folder, name, url: used, ok: true, bytes: buf.length, siteFile: `/media/${base}${ext.toLowerCase()}` });
}
await fs.writeFile('migration/wix-backup/backup-report.json', JSON.stringify(report, null, 1));
const bad = report.filter(r => !r.ok);
console.log(`Downloaded ${report.length - bad.length} of ${report.length}; failed ${bad.length}`);
