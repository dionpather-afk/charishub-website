import type { APIRoute } from 'astro';
import { SITE_CONFIG } from '@/lib/site-config';
import { WEEKLY_GATHERINGS } from '@/lib/seo';

// Plain-English summary of the church for AI assistants (https://llmstxt.org).
// Links use the address the site is served from, so they are right on any domain.
const PAGES: [string, string, string][] = [
  ['About Us', '/about', 'who we are and what we believe'],
  ['Our Leadership', '/leadership', 'our pastor, elders and ministry leaders'],
  ['Our History', '/history', 'the Declaration of Laudium and the ministers who served the congregation'],
  ['Events', '/events', 'upcoming events, including the RCA National Synod 2026'],
  ['Sermons', '/sermons', 'sermon videos'],
  ['Ministries', '/ministries', 'ways to serve in the church'],
  ['Devotionals', '/devotionals', 'weekly devotionals'],
  ['Gallery', '/gallery', 'photos of church life, history and outreach'],
  ['Giving', '/giving', 'how to support the church'],
  ['Contact Us', '/contact', 'address, phone, email and a contact form'],
];

const to12h = (time: string) => {
  const [h, m] = time.split(':').map(Number);
  return `${h % 12 || 12}:${String(m).padStart(2, '0')} ${h < 12 ? 'AM' : 'PM'}`;
};

export const GET: APIRoute = ({ url }) => {
  const base = (import.meta.env.BASE_NAME || '').replace(/\/+$/, '');
  const link = (path: string) => `${url.origin}${base}${path}`;

  const body = [
    `# ${SITE_CONFIG.churchName}`,
    '',
    `> ${SITE_CONFIG.churchName} is a congregation of the Reformed Church in Africa (RCA) in Laudium, Pretoria, South Africa. "${SITE_CONFIG.tagline}".`,
    '',
    '## Visit us',
    '',
    `- Address: ${SITE_CONFIG.addressLine1}, ${SITE_CONFIG.addressLine2}`,
    `- Phone: ${SITE_CONFIG.phoneDisplay}`,
    `- Email: ${SITE_CONFIG.email}`,
    '',
    '## Weekly gatherings',
    '',
    ...WEEKLY_GATHERINGS.map((g) => `- ${g.name}: ${g.day} ${to12h(g.startTime)}`),
    '',
    '## Special events',
    '',
    `- ${SITE_CONFIG.churchName} is hosting the RCA National Synod 2026, 29 September – 4 October 2026.`,
    '',
    '## Pages',
    '',
    `- [Home](${link('/')}): welcome, weekly gatherings and directions`,
    ...PAGES.map(([name, path, about]) => `- [${name}](${link(path)}): ${about}`),
    '',
  ].join('\n');

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
