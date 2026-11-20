// Runs before every build. Makes the small copies Wix used to make on the fly:
//  - public/media/w600/<file>      ~600px-wide thumbnails (Gallery + History grids)
//  - public/media/share/rca-charisma-church.jpg  1200x630 share picture (WhatsApp/Facebook)
// Originals in public/media/ are never changed.
import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const SRC = 'public/media';
const THUMBS = path.join(SRC, 'w600');
await fs.mkdir(THUMBS, { recursive: true });
let made = 0;
for (const f of await fs.readdir(SRC)) {
  if (!/\.(jpe?g|png|webp)$/i.test(f)) continue;
  const out = path.join(THUMBS, f);
  try { await fs.access(out); continue; } catch {}
  const img = sharp(path.join(SRC, f), { failOn: 'none' }).rotate().resize({ width: 600, withoutEnlargement: true });
  await (/\.png$/i.test(f) ? img.png({ compressionLevel: 9 }) : img.jpeg({ quality: 80, mozjpeg: true })).toFile(out);
  made++;
}
await fs.mkdir(path.join(SRC, 'share'), { recursive: true });
await sharp(path.join(SRC, 'dd740b_290880b8bfe34a809220f31ffecee390.jpeg'), { failOn: 'none' })
  .resize(1200, 630, { fit: 'cover', position: 'centre' })
  .jpeg({ quality: 85 })
  .toFile(path.join(SRC, 'share', 'rca-charisma-church.jpg'));
console.log(`make-images: ${made} new thumbnails, share picture ready`);
