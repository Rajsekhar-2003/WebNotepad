// Generates public/robots.txt and public/sitemap.xml from VITE_SITE_URL.
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');

function readEnvFile() {
  try {
    const raw = fs.readFileSync(path.join(root, '.env'), 'utf8');
    const m = raw.match(/^VITE_SITE_URL=(.+)$/m);
    return m ? m[1].trim() : '';
  } catch {
    return '';
  }
}

const siteUrl = (process.env.VITE_SITE_URL || readEnvFile() || 'https://webnotepad.online').replace(/\/+$/, '');
const today = new Date().toISOString().slice(0, 10);

fs.writeFileSync(
  path.join(root, 'public/robots.txt'),
  `User-agent: *\nAllow: /\nDisallow: /api/\n\nSitemap: ${siteUrl}/sitemap.xml\n`
);

fs.writeFileSync(
  path.join(root, 'public/sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url>\n    <loc>${siteUrl}/</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>1.0</priority>\n  </url>\n</urlset>\n`
);

console.log(`[seo] robots.txt + sitemap.xml generated for ${siteUrl}`);
