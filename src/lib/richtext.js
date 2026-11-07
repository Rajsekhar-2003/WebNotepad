/* Rich-text helpers: sanitizing, export formats, download and print. Browser-only (uses DOMParser). */

const ALLOWED = new Set([
  'B', 'STRONG', 'I', 'EM', 'U', 'S', 'STRIKE', 'DEL', 'SPAN', 'DIV', 'P', 'BR', 'UL', 'OL', 'LI', 'A', 'IMG',
  'FONT', 'H1', 'H2', 'H3', 'H4', 'BLOCKQUOTE', 'PRE', 'CODE', 'SUB', 'SUP', 'HR',
]);
const DROP = new Set([
  'SCRIPT', 'STYLE', 'IFRAME', 'OBJECT', 'EMBED', 'NOSCRIPT', 'TEMPLATE', 'SVG', 'MATH', 'FORM', 'INPUT',
  'BUTTON', 'TEXTAREA', 'SELECT', 'LINK', 'META', 'TITLE', 'HEAD',
]);

const COLOR = /^(#[0-9a-f]{3,8}|rgba?\([\d\s.,%]+\)|[a-z]+)$/i;
const CSS_RULES = {
  color: COLOR,
  'background-color': COLOR,
  'font-size': /^(\d+(\.\d+)?(px|pt|em|rem|%)|xx-small|x-small|small|medium|large|x-large|xx-large|xxx-large)$/i,
  'font-family': /^[\w\s,'"\-]+$/,
  'text-align': /^(left|right|center|justify)$/i,
  'font-weight': /^(normal|bold|\d{3})$/i,
  'font-style': /^(normal|italic)$/i,
  'text-decoration': /^[a-z\s-]+$/i,
  'text-decoration-line': /^[a-z\s-]+$/i,
};

function cleanStyle(str) {
  const out = [];
  for (const decl of str.split(';')) {
    const i = decl.indexOf(':');
    if (i < 0) continue;
    const k = decl.slice(0, i).trim().toLowerCase();
    const v = decl.slice(i + 1).trim();
    const re = CSS_RULES[k];
    if (re && v.length < 120 && re.test(v)) out.push(`${k}: ${v}`);
  }
  return out.join('; ');
}

const safeHref = (h) => /^(https?:|mailto:)/i.test((h || '').trim());
const safeSrc = (s) => /^data:image\/(png|jpe?g|gif|webp);base64,[a-z0-9+/=\s]+$/i.test((s || '').trim()) || /^https:\/\//i.test((s || '').trim());

export function escapeHtml(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export function textToHtml(text) {
  return text
    .replace(/\r\n?/g, '\n')
    .split('\n')
    .map((l) => `<div>${l ? escapeHtml(l) : '<br>'}</div>`)
    .join('');
}

export function sanitizeHtml(html) {
  if (typeof DOMParser === 'undefined') return escapeHtml(String(html || ''));
  const src = new DOMParser().parseFromString(String(html || ''), 'text/html');
  const out = src.createElement('div');

  const clean = (from, to) => {
    for (const node of Array.from(from.childNodes)) {
      if (node.nodeType === 3) {
        to.appendChild(src.createTextNode(node.nodeValue));
      } else if (node.nodeType === 1) {
        const tag = node.tagName.toUpperCase();
        if (DROP.has(tag)) continue;
        if (!ALLOWED.has(tag)) {
          clean(node, to);
          continue;
        }
        const el = src.createElement(tag.toLowerCase());
        const style = cleanStyle(node.getAttribute('style') || '');
        if (style) el.setAttribute('style', style);
        if (tag === 'A') {
          const href = node.getAttribute('href');
          if (safeHref(href)) {
            el.setAttribute('href', href.trim());
            el.setAttribute('target', '_blank');
            el.setAttribute('rel', 'noopener noreferrer');
          }
        }
        if (tag === 'IMG') {
          const s = node.getAttribute('src');
          if (!safeSrc(s)) continue;
          el.setAttribute('src', s.trim());
          el.setAttribute('alt', (node.getAttribute('alt') || '').slice(0, 200));
        }
        if (tag === 'FONT') {
          const size = node.getAttribute('size');
          const color = node.getAttribute('color');
          const face = node.getAttribute('face');
          if (size && /^[1-7]$/.test(size)) el.setAttribute('size', size);
          if (color && COLOR.test(color)) el.setAttribute('color', color);
          if (face && CSS_RULES['font-family'].test(face)) el.setAttribute('face', face);
        }
        clean(node, el);
        to.appendChild(el);
      }
    }
  };
  clean(src.body, out);
  return out.innerHTML;
}

export function docTitle(text) {
  const line = (text || '').split('\n').find((l) => l.trim());
  return line ? line.trim().slice(0, 60) : 'Untitled note';
}

export function fileBase(title) {
  const b = title.replace(/[^\p{L}\p{N}\-_ ]/gu, '').trim().replace(/\s+/g, '-').slice(0, 40);
  return b || 'note';
}

export function buildHtmlDocument(title, html) {
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(title)}</title>
<style>body{font-family:Inter,Arial,sans-serif;font-size:16px;line-height:1.6;max-width:760px;margin:2rem auto;padding:0 1rem;color:#18212d}img{max-width:100%;height:auto}a{color:#4f5bd5}</style>
</head><body>
${html}
</body></html>`;
}

export function buildWordDocument(title, html) {
  return `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
<head><meta charset="utf-8"><title>${escapeHtml(title)}</title>
<style>body{font-family:Calibri,Arial,sans-serif;font-size:12pt;line-height:1.5}</style></head>
<body>${html}</body></html>`;
}

export function htmlToMarkdown(html) {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  const walk = (node) => {
    if (node.nodeType === 3) return node.nodeValue.replace(/\u00a0/g, ' ').replace(/\s+/g, ' ');
    if (node.nodeType !== 1) return '';
    const tag = node.tagName.toLowerCase();
    const inner = () => Array.from(node.childNodes).map(walk).join('');
    const wrap = (m) => {
      const t = inner();
      const core = t.trim();
      if (!core) return t;
      return `${t.match(/^\s*/)[0]}${m}${core}${m}${t.match(/\s*$/)[0]}`;
    };
    switch (tag) {
      case 'b':
      case 'strong':
        return wrap('**');
      case 'i':
      case 'em':
        return wrap('*');
      case 's':
      case 'strike':
      case 'del':
        return wrap('~~');
      case 'u': {
        const t = inner();
        return t.trim() ? `<u>${t}</u>` : t;
      }
      case 'code':
        return '`' + inner() + '`';
      case 'pre':
        return '\n\n```\n' + node.textContent + '\n```\n\n';
      case 'a': {
        const href = node.getAttribute('href');
        const t = inner();
        return href && t.trim() ? `[${t.trim()}](${href})` : t;
      }
      case 'img':
        return `![${node.getAttribute('alt') || 'image'}](${node.getAttribute('src') || ''})`;
      case 'br':
        return '  \n';
      case 'hr':
        return '\n\n---\n\n';
      case 'ul':
      case 'ol': {
        let i = 0;
        const items = Array.from(node.children)
          .filter((c) => c.tagName === 'LI')
          .map((li) => {
            i += 1;
            return (tag === 'ol' ? `${i}. ` : '- ') + walk(li).trim().replace(/\s*\n+\s*/g, ' ');
          });
        return '\n\n' + items.join('\n') + '\n\n';
      }
      case 'li':
        return inner();
      case 'h1':
      case 'h2':
      case 'h3':
      case 'h4':
        return '\n\n' + '#'.repeat(Number(tag[1])) + ' ' + inner().trim() + '\n\n';
      case 'blockquote':
        return '\n\n' + inner().trim().split('\n').map((l) => '> ' + l).join('\n') + '\n\n';
      case 'p':
      case 'div':
        return '\n\n' + inner().trim() + '\n\n';
      default:
        return inner();
    }
  };
  return walk(doc.body).replace(/\n +/g, '\n').replace(/\n{3,}/g, '\n\n').trim() + '\n';
}

export function downloadFile(name, type, content) {
  const url = URL.createObjectURL(new Blob([content], { type: `${type};charset=utf-8` }));
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1500);
}

/** Opens the browser print dialog for a clean copy of the note (choose "Save as PDF"). */
export function printHtml(title, html) {
  const iframe = document.createElement('iframe');
  iframe.setAttribute('aria-hidden', 'true');
  iframe.style.cssText = 'position:fixed;right:0;bottom:0;width:0;height:0;border:0';
  document.body.appendChild(iframe);
  const win = iframe.contentWindow;
  const d = win.document;
  d.open();
  d.write(buildHtmlDocument(title, html));
  d.close();
  const cleanup = () => iframe.remove();
  win.onafterprint = cleanup;
  setTimeout(cleanup, 120000);
  const go = () => {
    win.focus();
    win.print();
  };
  if (d.readyState === 'complete') setTimeout(go, 150);
  else iframe.onload = () => setTimeout(go, 150);
}

/** Resize large images before embedding so autosave stays within browser storage limits. */
export function imageFileToDataUrl(file, maxWidth = 1200) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('read'));
    reader.onload = () => {
      const dataUrl = String(reader.result);
      if (/image\/(gif|svg)/.test(file.type)) {
        return file.size < 700 * 1024 ? resolve(dataUrl) : reject(new Error('large'));
      }
      const img = new Image();
      img.onerror = () => reject(new Error('decode'));
      img.onload = () => {
        const scale = Math.min(1, maxWidth / img.width);
        const c = document.createElement('canvas');
        c.width = Math.round(img.width * scale);
        c.height = Math.round(img.height * scale);
        c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
        resolve(c.toDataURL(file.type === 'image/png' ? 'image/png' : 'image/jpeg', 0.85));
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  });
}
