import type { APIRoute } from 'astro';
import { languages, type Lang } from '../i18n/ui';

const langs: Lang[] = ['es', 'it', 'en'];
const SITE = 'https://cv.raulmguerrero.com';

function buildUrl(path: string) {
  return `${SITE}${path}`;
}

function alternatesFor(path: string) {
  return langs.map(
    (l) => `<xhtml:link rel="alternate" hreflang="${l}" href="${buildUrl(`/${l}${path}`)}" />`
  ).join('\n    ');
}

const X_DEFAULT = `<xhtml:link rel="alternate" hreflang="x-default" href="${buildUrl('/es')}" />`;

export const GET: APIRoute = ({ site }) => {
  const staticPages = [
    { path: '/', changefreq: 'daily', priority: '1.0', isLangRoot: false },
  ];

  const langPages = [
    { path: '/', changefreq: 'daily', priority: '1.0' },
    { path: '/cookie-policy', changefreq: 'monthly', priority: '0.3' },
    { path: '/privacy-policy', changefreq: 'monthly', priority: '0.3' },
  ];

  const urls: string[] = [];

  for (const page of staticPages) {
    urls.push(`  <url>
    <loc>${buildUrl(page.path)}</loc>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`);
  }

  for (const page of langPages) {
    for (const lang of langs) {
      const fullPath = `/${lang}${page.path}`;
      urls.push(`  <url>
    <loc>${buildUrl(fullPath)}</loc>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
    ${alternatesFor(page.path)}
    ${X_DEFAULT}
  </url>`);
    }
  }

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.join('\n')}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
};
