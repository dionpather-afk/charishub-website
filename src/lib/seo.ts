/**
 * Search and share-preview metadata for every page.
 *
 * Titles and descriptions are rendered on the server (see
 * src/pages/[...slug].astro) so WhatsApp, Facebook and search engines see
 * them without running JavaScript, and kept in sync in the browser when a
 * visitor moves between pages (see Router.tsx).
 *
 * Indexing (robots / noindex) is NOT set here: it stays under the Wix SEO
 * settings until launch.
 */
import { SITE_CONFIG } from '@/lib/site-config';

export const SITE_NAME = SITE_CONFIG.churchName;

// Home page church photo, cropped by Wix to the 1200x630 share-preview size.
export const DEFAULT_OG_IMAGE =
  'https://static.wixstatic.com/media/dd740b_dae12d6e461c41f99e4e5548f0777039~mv2.jpg/v1/fill/w_1200,h_630,al_c,q_85,enc_auto/rca-charisma-church.jpg';
export const DEFAULT_OG_IMAGE_ALT = 'RCA Charisma church building in Laudium, Pretoria';

export interface PageSeo {
  title: string;
  description: string;
}

const SUFFIX = 'RCA Charisma – Reformed Church in Laudium, Pretoria';
const SHORT_SUFFIX = 'RCA Charisma – Laudium, Pretoria';

export const PAGE_SEO: Record<string, PageSeo> = {
  '/': {
    title: 'RCA Charisma | Reformed Church in Laudium, Pretoria',
    description:
      'RCA Charisma is a congregation of the Reformed Church in Africa in Laudium, Pretoria. Join us for Sunday Service at 9:00 and Sunday School at 10:30.',
  },
  '/about': {
    title: `About | ${SUFFIX}`,
    description:
      'Learn about RCA Charisma in Laudium, Pretoria, a Reformed Church in Africa congregation called to serve church and community with the Gospel of Jesus Christ.',
  },
  '/leadership': {
    title: `Leadership | ${SHORT_SUFFIX}`,
    description:
      'Meet the elders, pastor and leaders of RCA Charisma in Laudium, Pretoria, called to serve, teach and care for the flock of God in the Reformed Church in Africa.',
  },
  '/history': {
    title: `History | ${SUFFIX}`,
    description:
      'Discover the history of RCA Charisma in Laudium, Pretoria: the Declaration of Laudium and the ministers who have shepherded our congregation over the decades.',
  },
  '/events': {
    title: `Events | ${SUFFIX}`,
    description:
      'See upcoming events at RCA Charisma in Laudium, Pretoria, including the RCA National Synod 2026, and join us for fellowship, worship and community gatherings.',
  },
  '/sermons': {
    title: `Sermons | ${SUFFIX}`,
    description:
      "Watch sermons from RCA Charisma in Laudium, Pretoria: faithful exposition of God's Word, preached with clarity and conviction at our Sunday Service.",
  },
  '/ministries': {
    title: `Ministries | ${SHORT_SUFFIX}`,
    description:
      'Every believer has a place to serve. Explore the ministries of RCA Charisma in Laudium, Pretoria and find where you belong in the life of our church.',
  },
  '/devotionals': {
    title: `Devotionals | ${SHORT_SUFFIX}`,
    description:
      'Weekly devotionals from RCA Charisma in Laudium, Pretoria: reflections and spiritual insights from our pastoral team to nourish your faith journey.',
  },
  '/gallery': {
    title: `Gallery | ${SUFFIX}`,
    description:
      'Browse photos of RCA Charisma in Laudium, Pretoria: moments of worship, fellowship and community life, our church history, and missions and outreach.',
  },
  '/giving': {
    title: `Giving | ${SUFFIX}`,
    description:
      "Support the ministry of RCA Charisma in Laudium, Pretoria. Your generous giving helps us proclaim the Gospel, serve our community and advance God's kingdom.",
  },
  '/contact': {
    title: `Contact | ${SUFFIX}`,
    description:
      'Contact RCA Charisma at 261 Jewel Street, Laudium, Pretoria. Find our phone number, email and service times, or send us your questions and prayer requests.',
  },
};

/** SEO for a path; unknown paths redirect home, so they share the home tags. */
export const getPageSeo = (pathname: string): PageSeo => {
  const path = pathname.replace(/\/+$/, '') || '/';
  return PAGE_SEO[path] ?? PAGE_SEO['/'];
};
