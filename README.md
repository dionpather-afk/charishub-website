# RCA Charisma website

The website of RCA Charisma (Reformed Church in Africa, Laudium, Pretoria),
built and maintained by TLC (Talent Learn Consult).

**GitHub is the source of truth.** The site is a plain static website hosted
on Xneelo. It no longer depends on Wix in any way.

## How it is built

| Part | Where |
|---|---|
| Pages and design | `src/components/pages/*.tsx` (React + Tailwind, built with Astro) |
| Church content (team, ministries, events, sermons, gallery, giving, reading plan) | `src/data/cms.json` |
| Photos, icons, video | `public/media/` (copied 1:1 from the old Wix media library) |
| Contact form mailer | `public/contact.php` (emails the form; nothing is stored) |
| Server settings for Xneelo | `public/.htaccess` |
| Search titles and descriptions | `src/lib/seo.ts` |

## Everyday commands

```bash
npm ci                 # install
npm run dev            # local preview at http://localhost:4321
npm run build          # makes the finished site in dist/ (upload dist/ to Xneelo public_html)
```

Build settings:
- `SITE_BASE=/charishub-website/` builds for the GitHub Pages preview sub-folder. On Xneelo it's left empty.
- `SITE_INDEXING=on` lets Google index the site. The Wix site was set to "noindex". Only switch this on after go-live approval.

## Changing content

Edit `src/data/cms.json`, commit, and redeploy. For a new photo, add the file to `public/media/` and refer to it as `/media/<file name>`.

## Checking a build before sharing a link

```bash
node tools/check-site.mjs https://<address>/ ./screenshots
```

This checks every page at phone, tablet and desktop size. It reports broken links, missing pictures, script errors and anything that still loads from Wix.

## Migration from Wix (Nov 2026)

See `migration/RUNBOOK.md`. The full Wix media library backup is in `migration/wix-backup/`.
