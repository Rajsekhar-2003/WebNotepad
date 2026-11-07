const DOC_KEY = 'webnotepad:doc:v2';
const THEME_KEY = 'webnotepad:theme';

export const WELCOME_HTML =
  '<div>Welcome to Web Notepad! Start writing your notes here...</div><div>Your content is automatically saved and will NOT be deleted on refresh.</div>';

export function loadDoc() {
  try {
    const d = JSON.parse(localStorage.getItem(DOC_KEY) || 'null');
    if (d && typeof d.html === 'string') return d.html;
  } catch {
    /* ignore */
  }
  return null;
}

export function saveDoc(html) {
  try {
    localStorage.setItem(DOC_KEY, JSON.stringify({ html, savedAt: Date.now() }));
    return true;
  } catch {
    return false;
  }
}

export function loadTheme() {
  const attr = document.documentElement.getAttribute('data-theme');
  if (attr === 'dark' || attr === 'light') return attr;
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function saveTheme(t) {
  try {
    localStorage.setItem(THEME_KEY, t);
  } catch {
    /* ignore */
  }
}

export function countStats(text) {
  const t = text.replace(/\u00a0/g, ' ');
  const trimmed = t.trim();
  const words = trimmed ? trimmed.split(/\s+/).length : 0;
  const lines = trimmed ? t.split(/\n+/).filter((l) => l.trim()).length : 0;
  return {
    characters: t.replace(/\r?\n/g, '').length,
    words,
    lines,
    minRead: words ? Math.max(1, Math.ceil(words / 200)) : 0,
  };
}
