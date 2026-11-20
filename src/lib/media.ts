/**
 * Media addresses for the site.
 *
 * Every photo, icon and the video live in public/media/ (copied 1:1 from the
 * old Wix media library; full backup in migration/wix-backup/). Content and
 * code refer to them as "/media/<file>". Photos from the content file can
 * carry their original size after a "#", e.g.
 *   /media/dd740b_abc.png#originWidth=602&originHeight=432
 * This helper adds the site's base folder (needed for the GitHub preview,
 * which runs in a sub-folder) and strips the size part.
 */
const BASE = import.meta.env.BASE_URL.replace(/\/$/, '');

export function mediaUrl(src?: string | null): string | undefined {
  if (!src) return undefined;
  if (src.startsWith('/media/')) return BASE + src.split('#')[0];
  return src;
}

/** Original width/height stored after "#" (originWidth / originHeight). */
export function mediaSize(src?: string | null): { width: number; height: number } | undefined {
  if (!src || !src.includes('#')) return undefined;
  const params = new URLSearchParams(src.split('#')[1] || '');
  const width = parseInt(params.get('originWidth') || '0', 10);
  const height = parseInt(params.get('originHeight') || '0', 10);
  return width && height ? { width, height } : undefined;
}
