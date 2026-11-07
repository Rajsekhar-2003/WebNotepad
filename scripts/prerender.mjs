// Pre-renders the React app into dist/index.html so crawlers get full HTML,
// and injects FAQPage JSON-LD generated from the same data the page shows.
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { FAQ } from '../src/lib/faq.js';

const root = path.resolve(import.meta.dirname, '..');
const dist = path.join(root, 'dist');
const { render } = await import(pathToFileURL(path.join(root, 'dist-ssr/entry-server.js')).href);

let html = fs.readFileSync(path.join(dist, 'index.html'), 'utf8');

const faqLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQ.map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
};

html = html
  .replace('<!--app-html-->', render())
  .replace('<!--faq-jsonld-->', `<script type="application/ld+json">${JSON.stringify(faqLd)}</script>`);

fs.writeFileSync(path.join(dist, 'index.html'), html);
fs.rmSync(path.join(root, 'dist-ssr'), { recursive: true, force: true });
console.log('[prerender] dist/index.html pre-rendered');
