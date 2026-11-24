# RCA Charisma: Wix → Xneelo migration runbook

Owner: Dion Pather (Product Owner) · Engineering: TLC
Branch: `migration/xneelo`

## Goal
Move rcacharisma.com from Wix to Xneelo hosting, like for like, with no Wix dependencies. Cancel the Wix plan only after Xneelo is live, tested and approved. The domain stays registered at Wix; only its DNS records change.

## What was moved out of Wix
| Item | Where it is now |
|---|---|
| All 10 CMS collections (team bios 7, ministries 7, events 5, sermons 1, reading plan 7, gallery 56, giving 2, devotionals 0, contact submissions 0, feedback 0) | `src/data/cms.json` (checked against Wix on 20 Nov 2026; nothing changed after 29 Sep) |
| Full media library: 155 files, 37.6 MB (photos, icons, documents, zip, video) | `migration/wix-backup/<Wix folder>/` + `backup-report.json` |
| Photos, icons and video used by the site | `public/media/` |
| Contact form (Wix form + Wix automation emailing developer5@talentlearnconsult.com) | `public/contact.php`, same recipient |
| Search titles, descriptions, share pictures | `src/lib/seo.ts`, `src/pages/[...slug].astro` |
| "noindex" search setting | Kept. Change with `SITE_INDEXING=on` at go-live (needs Dion's decision) |

Removed: the Wix runtime, Wix CMS SDK, Wix image service, Wix members/login, unused Wix shop code, Wix monitoring, Wix cookie banner scripts. The site still uses Google Maps (contact page) and YouTube (sermons).

Note: Wix only served the church video at 480p, so that's the copy we have.

## Proof of like for like
`tools/check-site.mjs` checks all 11 pages at 375, 768 and 1440 px. Result on 20 Nov 2026: no broken links, no missing pictures, no script errors, **zero requests to Wix**. Pages were compared pixel by pixel with the Wix screenshots in `harvest/wix-assets`. Most differ by 0.1–2%, and the gallery by 4–14% because its photo grid fills in load order.

## Cutover plan (nothing here happens without Dion's written go-ahead)
1. Dion buys an Xneelo Basic package for rcacharisma.com under TLC's account.
2. Create the mailbox `website@rcacharisma.com` on Xneelo. The form sends from this address. (Check first whether any @rcacharisma.com email exists today; see Risks.)
3. Upload `dist/` (built without `SITE_BASE`) to `public_html` and test on Xneelo's temporary address with `tools/check-site.mjs`. Send a real test message through the contact form.
4. Client review (Naglin). Gate 2 sign-off.
5. Dion's written go-ahead (Gate 3).
6. In Wix → Domains → rcacharisma.com → DNS records: point the A record (`@`) and `www` at the Xneelo server IP, and add Xneelo's SPF/mail records. Keep a screenshot of the old records first.
7. Turn on SSL (Let's Encrypt) in Xneelo and confirm https://www.rcacharisma.com loads from Xneelo.
8. Run `tools/check-site.mjs https://www.rcacharisma.com/` again, and send a contact form test.
9. Leave the Wix site unpublished but don't delete it for at least 14 days. Then downgrade or cancel the Wix premium plan, keeping the domain registration.

## Rollback
- **Before step 6:** nothing public has changed. Wix stays live.
- **After step 6:** restore the old DNS records in Wix (from the screenshot in step 6). The Wix site is still there and comes back within the DNS refresh time, usually under an hour. Don't cancel Wix until the 14-day watch period is over.
- **Code:** every change is a commit on `migration/xneelo`. `main` still holds the Wix version, untouched.

## Risks and open questions
- **Email on the domain:** if any @rcacharisma.com mailboxes exist (via Wix/Google Workspace), their MX records must be kept unchanged when the A records move.
- **Google Analytics:** the Wix site loaded tag G-K1BGZ5TM24 through Wix. It wasn't carried over, because we don't know who owns it and it needs a cookie notice. Needs Dion's decision.
- **Indexing:** Wix had the site hidden from Google ("noindex"). It stays hidden until Dion decides.

## Attempt 1: 23 Nov 2026, 18:3x–19:13 (rolled back)
- DNS switched to Xneelo (197.221.14.61) at about 18:35 through the Wix DNS API. Google and Cloudflare resolvers picked it up within minutes.
- Xneelo's Let's Encrypt certificate had **not** been issued after about 40 minutes, and the control panel has no button to request it. Browsers forced https (the old Wix site had served https), so visitors got a certificate warning.
- Rolled back at 19:13, restoring the exact Wix records from `dns-backup-wix-2026-11-23_1719.json` (TTL kept at 600 for the next attempt). Public DNS was back on Wix by 19:16.
- The `.htaccess` https redirect on Xneelo is still commented out ("TEMPORARILY OFF"). Turn it back on once the certificate is active.

**Lesson / next attempt:** sort out the certificate with Xneelo support *before* switching. Ask whether they can issue Let's Encrypt for a domain whose DNS stays at Wix, and whether they can validate it in advance (a DNS TXT record we add at Wix). Otherwise, agree a window where they issue it right after the switch.

## Attempt 2: 24 Nov 2026 — LIVE ON XNEELO ✅
- What Xneelo support told us (live chat, Jonathan B): Let's Encrypt certificates install automatically four times a day (06:00, 12:00, 16:00, 23:00), and only once DNS has fully propagated. Outside those run hours, support can request a manual install.
- 08:07: switched the @ and www A records to 197.221.14.61 (TTL 600) through the Wix DNS API. Google and Cloudflare DNS showed the change by 08:07.
- About 08:13: Xneelo installed the certificate manually. Both https://rcacharisma.com and https://www.rcacharisma.com load securely from Xneelo.
- 08:15: turned the https/www redirect in `.htaccess` back on.
- Live check: all 11 pages return 200 with the right titles; 334 of 334 files are present (`.htaccess` 403 and `contact.php` 405 are correct); `rcacharisma.com` redirects to `https://www.rcacharisma.com`.
- Warning gap: about 6 minutes (08:07 to about 08:13).
- Next: send a contact-form test (needs Dion's OK), clean up the upload zip on the server, keep Wix for 14 days (to 8 Dec 2026), then cancel only the Wix site plan.
- **Lesson for future clients:** before switching DNS for a hosting-only Xneelo package, agree a manual certificate install with Xneelo live chat, and switch outside their run hours.

## 24 Nov 2026 — SEO and hardening (live)
- Google indexing approved by Dion. "noindex" removed from all 11 pages, and the default build now allows indexing (`SITE_INDEXING=off` hides the site again).
- Added `robots.txt` (blocks only /contact.php) and `sitemap.xml` (11 pages).
- `.htaccess` hardening: Permissions-Policy, Cross-Origin-Opener-Policy, HSTS (max-age 1 day to start; raise to 1 year after a stable month), X-Powered-By removed, hidden and leftover files blocked (403).
- Deployed by editing files in the Xneelo File Manager. All 13 changed files were checked against the GitHub build by SHA-256: they match exactly.
- Incident (fixed within minutes): one automated File Editor save wrote the About page into the home `index.html`. Page content was unaffected, because the app builds each page itself; only the page title and description were wrong. It was caught by the hash check and restored from the build. **Lesson:** open each file from the file list (full reload) before editing, and always hash-check after deploying.

## AEO fix: page text snapshot (24 Nov 2026) — LIVE since ~12:30 SAST, approved by Dion ("Go live")
- Problem: pages are drawn by JavaScript, so AI tools and simple crawlers saw an empty page.
- Fix: `tools/snapshot-pages.py` (run after build: `npm run build && npm run snapshot`) opens each built page in a headless browser and copies the visible text into `<noscript>` in that page's HTML. Visitors see no change.
- Tested locally: all 11 pages snapshotted (130–488 words each); pages still render at phone and desktop sizes with no JavaScript errors; the snapshot isn't added to the visible page.
- Preview build now also sets `SITE_INDEXING=off`, so the github.io copy stays out of Google.
- Rollback: deploy the previous build (xneelo-build branch history) or rebuild without `npm run snapshot`. Only the 11 `index.html` files change.
- Deployed 24 Nov ~12:25–12:30 SAST:
  - Uploaded the 11-file zip and extracted it. Xneelo extracts into a subfolder and Copy won't overwrite.
  - So each live index.html was replaced in the File Editor. Each file was opened by full page load and its old hash checked before saving.
  - The temporary folder and zip were then deleted from the server.
- Verified live (SHA-256, first 12 characters): home 83df6f63d8b9, about ec269d300365, contact 7d8c4d78a195, devotionals c94b7514a43e, events 8d3028ff972c, gallery 53c28cc02991, giving f0a28bb52bb2, history fe542ac9950a, leadership a818f1a0de12, ministries 22c0c8ca58fd, sermons f345e4ec9672. All 11 match the build.
- Production build reproduces the previous live hashes exactly (home 2cd260c1a61e, about 5b4eb24c45a7, sitemap 4bf5cac37c31), which proves only the 11 index.html files changed.
- Rollback: `releases/rollback-pre-aeo-2026-11-24_1220.zip` on the xneelo-build branch (the previous 11 files).
- Lessons:
  - A JS click on the editor's top Save button does nothing; a real click on the bottom Save works.
  - Xneelo's Extract never overwrites; it creates a folder named after the zip.
  - WebFetch caches pages for 15 minutes, so re-check with a query string.
- Note: GitHub Actions is blocked by an account billing lock (24 Nov), so the preview was built locally and pushed to gh-pages.

## 24 Nov 2026 (afternoon): contact form, SPF, Google Analytics
- Contact form: contact.php now sends to vicpillay@mweb.co.za (the church), not developer5@talentlearnconsult.com. Live file hash ef5f284635dc matches the repo. Test sent 12:37 (addressed to the Rev, from Dion).
- SPF: Dion approved. A root TXT value `v=spf1 a include:spf.host-h.net ~all` was added at Wix. It sits in the same TXT record as the Google verification value, which is kept. Rollback: remove that value.
- Google Analytics: reuses the Wix-era property "RCA Charisma Website" (G-K1BGZ5TM24, in Dion's Google account).
  - It loads only on rcacharisma.com.
  - A first-visit notice offers OK / No thanks (opt-out is remembered in localStorage).
  - Live at ~12:55; all 11 pages are hash-verified. Realtime confirmed a visit from Durban.
  - Rollback: remove the GA script block from the 11 index.html files (rebuild without `<Analytics />`).
- Monthly report: scheduled task trig_0137p49GnsehznmwbLNEjMBx runs on the 1st of each month at 08:23 SAST in Dion's Chrome. It is a PDF for Dion only and is never sent to the client.
