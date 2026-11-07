# Web Notepad (webnotepad)

Free online **rich text** notepad built with **React + Vite**, with a small **Express** server for the share feature.

- Rich text: bold, italic, underline, strikethrough, font family and size, text and highlight colors, alignment,
  bulleted/numbered lists, links, images (inserted or pasted)
- Auto-Save to the browser (1 s after typing stops) plus Force Save (Ctrl+S)
- Export: PDF (print dialog > Save as PDF), Word (.doc), HTML, TXT, Markdown, JSON
- Live stats: characters, words, lines, minutes to read
- Share by QR code + 6-digit code, Receiver to open a shared note (formatting kept, expires after 1 hour)
- Speech to text, text to speech, dark mode, fullscreen, keyboard shortcuts dialog, offline support (PWA)
- Open a .txt, .md, .html or .json file into the editor
- All HTML from files, pastes and shared notes is sanitized (scripts, event handlers and unsafe URLs removed)

## Quick start

```bash
npm install
npm run dev        # app on http://localhost:5173, API on :3001
```

## Production

```bash
npm run build      # builds, pre-renders HTML for SEO, writes sitemap + robots
npm start          # serves dist/ + API on http://localhost:3001  (PORT env to change)
```

Docker: `docker build -t webnotepad . && docker run -p 3001:3001 webnotepad`

## Set your domain (important for SEO)

Edit `.env`:

```
VITE_SITE_URL=https://webnotepad.com
```

Change it to your real domain, then run `npm run build`. It updates the canonical URL, Open Graph/Twitter tags,
JSON-LD, `sitemap.xml` and `robots.txt` automatically.

## SEO included

- Unique title, meta description, canonical, hreflang, robots directives
- Open Graph + Twitter cards (`public/og-image.png`, 1200x630)
- JSON-LD: WebSite, WebApplication, Organization, FAQPage (FAQ text comes from `src/lib/faq.js`)
- Build-time pre-rendering: crawlers receive full HTML (H1, features, FAQ, privacy) before JavaScript runs
- Semantic headings, one H1, accessible FAQ (`<details>`), sitemap.xml, robots.txt
- PWA manifest + service worker (installable, works offline), theme-color for light/dark
- Long-lived caching for hashed assets, gzip compression

After deploying: add the site to Google Search Console and Bing Webmaster Tools, submit
`https://YOUR-DOMAIN/sitemap.xml`, and replace `public/og-image.png` and the icons with your final branding.

## How sharing works

`POST /api/share` stores the note (text + HTML) **in server memory only** and returns a 6-digit code (valid 1 hour, 200,000 characters max).
`GET /api/share/:code` returns it. Basic per-IP rate limiting is built in. Restarting the server clears all shares.
If you run several server instances, move the `shares` Map in `server/index.js` to Redis.

## Hosting notes

- Static hosts (Netlify/Vercel/GitHub Pages) can serve `dist/`, but Share needs the Node server (or port the two
  endpoints to serverless functions).
- Put the Node app behind HTTPS (Nginx, Caddy, Cloudflare). Microphone dictation and clipboard need HTTPS.
- Redirect `www.yourdomain` to the apex domain (or the reverse) so there is one canonical host.

## Project layout

```
src/App.jsx              editor logic, autosave, export, share, speech
src/components/          Toolbar, Sidebar (export + stats), ShareDialog, OpenCodeDialog (Receiver), ShortcutsDialog, SeoContent, Modal, Icon
src/lib/richtext.js      sanitizer, Markdown/Word/HTML builders, download + print helpers
src/lib/doc.js           storage, theme, statistics
src/lib/faq.js           FAQ data (page + FAQPage JSON-LD)
server/index.js          Express: static files + share API
scripts/seo.mjs          sitemap.xml + robots.txt
scripts/prerender.mjs    build-time HTML pre-render + FAQ JSON-LD
public/                  icons, manifest, service worker, OG image
```
