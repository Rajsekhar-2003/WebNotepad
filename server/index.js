import express from 'express';
import compression from 'compression';
import crypto from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dist = path.join(__dirname, '..', 'dist');
const PORT = process.env.PORT || 3001;

const TTL_MS = 60 * 60 * 1000; // shared notes live for 1 hour
const MAX_CHARS = 200_000;
const MAX_HTML = 1_000_000;

/** code -> { text, expiresAt } (memory only, never written to disk) */
const shares = new Map();
setInterval(() => {
  const now = Date.now();
  for (const [code, s] of shares) if (s.expiresAt <= now) shares.delete(code);
}, 60_000).unref();

// Tiny per-IP rate limiter (protects the 6-digit code space from brute force).
const hits = new Map();
setInterval(() => hits.clear(), 10 * 60_000).unref();
const limit = (max) => (req, res, next) => {
  const key = `${req.ip}:${req.method}`;
  const n = (hits.get(key) || 0) + 1;
  hits.set(key, n);
  if (n > max) return res.status(429).json({ error: 'too_many_requests' });
  next();
};

const app = express();
app.disable('x-powered-by');
app.set('trust proxy', 1);
app.use(compression());
app.use((req, res, next) => {
  res.set({
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'SAMEORIGIN',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'microphone=(self), camera=(), geolocation=()',
  });
  next();
});

function newCode() {
  for (let i = 0; i < 20; i++) {
    const code = String(crypto.randomInt(0, 1_000_000)).padStart(6, '0');
    if (!shares.has(code)) return code;
  }
  return null;
}

app.use('/api', (req, res, next) => {
  res.set('Cache-Control', 'no-store');
  next();
});

app.post('/api/share', limit(20), express.json({ limit: '1.3mb' }), (req, res) => {
  const text = req.body?.text;
  const html = typeof req.body?.html === 'string' ? req.body.html : '';
  if (typeof text !== 'string' || !text.trim()) return res.status(400).json({ error: 'empty' });
  if (text.length > MAX_CHARS || html.length > MAX_HTML) return res.status(413).json({ error: 'too_large' });
  const code = newCode();
  if (!code) return res.status(503).json({ error: 'busy' });
  const expiresAt = Date.now() + TTL_MS;
  shares.set(code, { text, html, expiresAt });
  res.status(201).json({ code, expiresAt });
});

app.get('/api/share/:code', limit(60), (req, res) => {
  const { code } = req.params;
  const s = /^\d{6}$/.test(code) ? shares.get(code) : null;
  if (!s || s.expiresAt <= Date.now()) return res.status(404).json({ error: 'not_found' });
  res.json({ text: s.text, html: s.html, expiresAt: s.expiresAt });
});

app.use('/api', (req, res) => res.status(404).json({ error: 'not_found' }));

app.use(
  express.static(dist, {
    index: false,
    setHeaders(res, file) {
      if (file.includes(`${path.sep}assets${path.sep}`)) {
        res.set('Cache-Control', 'public, max-age=31536000, immutable');
      } else if (/(sw\.js|index\.html)$/.test(file)) {
        res.set('Cache-Control', 'no-cache');
      } else {
        res.set('Cache-Control', 'public, max-age=86400');
      }
    },
  })
);

app.get('/', (req, res) => {
  res.set('Cache-Control', 'no-cache');
  res.sendFile(path.join(dist, 'index.html'));
});

app.use((req, res) => {
  res.status(404).type('text/plain').send('Not found. Go to / for Web Notepad.');
});

app.listen(PORT, () => console.log(`Web Notepad running on http://localhost:${PORT}`));
