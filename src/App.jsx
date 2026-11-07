import { useCallback, useEffect, useRef, useState } from 'react';
import Icon from './components/Icon.jsx';
import Toolbar from './components/Toolbar.jsx';
import Sidebar from './components/Sidebar.jsx';
import ShareDialog from './components/ShareDialog.jsx';
import OpenCodeDialog from './components/OpenCodeDialog.jsx';
import ShortcutsDialog from './components/ShortcutsDialog.jsx';
import SeoContent from './components/SeoContent.jsx';
import { WELCOME_HTML, loadDoc, saveDoc, loadTheme, saveTheme, countStats } from './lib/doc.js';
import {
  sanitizeHtml,
  textToHtml,
  docTitle,
  fileBase,
  buildHtmlDocument,
  buildWordDocument,
  htmlToMarkdown,
  downloadFile,
  printHtml,
  imageFileToDataUrl,
} from './lib/richtext.js';

const EMPTY_STATS = { characters: 0, words: 0, lines: 0, minRead: 0 };
const FONT_NAMES = ['Inter', 'Arial', 'Verdana', 'Georgia', 'Times New Roman', 'Courier New', 'Trebuchet MS', 'Comic Sans MS'];
const SIZE_LIST = [12, 14, 16, 18, 20, 24, 28, 32, 36, 48];

export default function App() {
  const [ready, setReady] = useState(false);
  const [theme, setTheme] = useState('light');
  const [status, setStatus] = useState('saved');
  const [stats, setStats] = useState(EMPTY_STATS);
  const [empty, setEmpty] = useState(true);
  const [fmt, setFmt] = useState({});
  const [font, setFont] = useState('Inter');
  const [size, setSize] = useState(16);
  const [dialog, setDialog] = useState(null); // 'share' | 'receive' | 'keys'
  const [shareData, setShareData] = useState({ text: '', html: '' });
  const [toast, setToast] = useState('');
  const [listening, setListening] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);

  const edRef = useRef(null);
  const cardRef = useRef(null);
  const fileRef = useRef(null);
  const imgRef = useRef(null);
  const lastRange = useRef(null);
  const saveTimer = useRef(null);
  const toastTimer = useRef(null);
  const dirty = useRef(false);
  const recRef = useRef(null);

  const notify = useCallback((msg) => {
    setToast(msg);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(''), 3200);
  }, []);

  /* ---------- state helpers ---------- */
  const readText = () => edRef.current?.innerText || '';

  const updateStats = useCallback(() => {
    const ed = edRef.current;
    if (!ed) return;
    const text = ed.innerText || '';
    setStats(countStats(text));
    setEmpty(!text.trim() && !ed.querySelector('img'));
  }, []);

  const persist = useCallback(() => {
    clearTimeout(saveTimer.current);
    const ok = saveDoc(edRef.current ? edRef.current.innerHTML : '');
    dirty.current = !ok;
    setStatus(ok ? 'saved' : 'error');
    return ok;
  }, []);

  const markDirty = useCallback(() => {
    dirty.current = true;
    setStatus('saving');
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(persist, 1000);
  }, [persist]);

  /* <font size=7> (from the size command) -> span with exact px size */
  const normalizeFonts = useCallback(() => {
    const ed = edRef.current;
    if (!ed) return;
    ed.querySelectorAll('font[size="7"]').forEach((f) => {
      const span = document.createElement('span');
      span.style.fontSize = (f.dataset.px || window.__nextPx || 16) + 'px';
      while (f.firstChild) span.appendChild(f.firstChild);
      f.replaceWith(span);
    });
  }, []);

  const afterEdit = useCallback(() => {
    normalizeFonts();
    updateStats();
    markDirty();
  }, [normalizeFonts, updateStats, markDirty]);

  const setContent = useCallback(
    (html) => {
      const ed = edRef.current;
      ed.innerHTML = html || '<div><br></div>';
      lastRange.current = null;
      afterEdit();
    },
    [afterEdit]
  );

  /* ---------- selection ---------- */
  const restoreSel = () => {
    const ed = edRef.current;
    ed.focus();
    const s = window.getSelection();
    if (lastRange.current && ed.contains(lastRange.current.commonAncestorContainer)) {
      s.removeAllRanges();
      s.addRange(lastRange.current);
    } else if (!s.rangeCount || !ed.contains(s.anchorNode)) {
      const r = document.createRange();
      r.selectNodeContents(ed);
      r.collapse(false);
      s.removeAllRanges();
      s.addRange(r);
    }
  };

  useEffect(() => {
    const onSel = () => {
      const s = window.getSelection();
      const ed = edRef.current;
      if (!s || !s.rangeCount || !ed || !ed.contains(s.anchorNode)) return;
      lastRange.current = s.getRangeAt(0).cloneRange();
      const q = (c) => {
        try {
          return document.queryCommandState(c);
        } catch {
          return false;
        }
      };
      setFmt({
        bold: q('bold'),
        italic: q('italic'),
        underline: q('underline'),
        strike: q('strikeThrough'),
        left: q('justifyLeft'),
        center: q('justifyCenter'),
        right: q('justifyRight'),
        ul: q('insertUnorderedList'),
        ol: q('insertOrderedList'),
      });
      const el = s.anchorNode.nodeType === 1 ? s.anchorNode : s.anchorNode.parentElement;
      if (el) {
        const cs = getComputedStyle(el);
        const px = Math.round(parseFloat(cs.fontSize));
        if (SIZE_LIST.includes(px)) setSize(px);
        const fam = cs.fontFamily.split(',')[0].replace(/["']/g, '').trim();
        if (FONT_NAMES.includes(fam)) setFont(fam);
      }
    };
    document.addEventListener('selectionchange', onSel);
    return () => document.removeEventListener('selectionchange', onSel);
  }, []);

  /* ---------- commands ---------- */
  const exec = useCallback(
    (cmd, val) => {
      restoreSel();
      document.execCommand('styleWithCSS', false, true);
      document.execCommand(cmd, false, val);
      afterEdit();
    },
    [afterEdit]
  );

  function applyFont(name) {
    setFont(name);
    exec('fontName', name);
  }

  function applySize(px) {
    setSize(px);
    window.__nextPx = px;
    restoreSel();
    document.execCommand('styleWithCSS', false, false);
    document.execCommand('fontSize', false, '7');
    // tag the freshly created <font> elements with the exact pixel size
    edRef.current.querySelectorAll('font[size="7"]').forEach((f) => (f.dataset.px = String(px)));
    document.execCommand('styleWithCSS', false, true);
    afterEdit();
  }

  function insertLink() {
    restoreSel();
    const sel = window.getSelection();
    const url = window.prompt('Enter the link URL', 'https://');
    if (!url || url === 'https://') return;
    let href = url.trim();
    if (!/^[a-z][a-z0-9+.-]*:/i.test(href)) href = 'https://' + href;
    if (!/^(https?:|mailto:)/i.test(href)) return notify('Only http, https and mailto links are allowed');
    if (sel && sel.isCollapsed) {
      const a = document.createElement('a');
      a.textContent = href;
      a.setAttribute('href', href);
      document.execCommand('insertHTML', false, a.outerHTML);
    } else {
      document.execCommand('createLink', false, href);
    }
    afterEdit();
  }

  async function insertImageFile(file) {
    if (!file || !file.type.startsWith('image/')) return notify('Please choose an image file');
    try {
      const url = await imageFileToDataUrl(file);
      restoreSel();
      document.execCommand('insertImage', false, url);
      edRef.current.querySelectorAll('img').forEach((img) => {
        img.style.maxWidth = '100%';
        img.style.height = 'auto';
      });
      afterEdit();
    } catch (e) {
      notify(e.message === 'large' ? 'That image is too large (limit 700 KB for GIF/SVG)' : 'Could not add that image');
    }
  }

  /* ---------- load / theme / lifecycle ---------- */
  useEffect(() => {
    const saved = loadDoc();
    edRef.current.innerHTML = saved !== null ? sanitizeHtml(saved) || '<div><br></div>' : WELCOME_HTML;
    updateStats();
    setTheme(loadTheme());
    setReady(true);
    document.execCommand('styleWithCSS', false, true);
  }, [updateStats]);

  useEffect(() => {
    if (!ready) return;
    document.documentElement.setAttribute('data-theme', theme);
    saveTheme(theme);
  }, [theme, ready]);

  useEffect(() => {
    const flush = () => dirty.current && edRef.current && saveDoc(edRef.current.innerHTML);
    const onVis = () => document.visibilityState === 'hidden' && flush();
    window.addEventListener('pagehide', flush);
    document.addEventListener('visibilitychange', onVis);
    const onFs = () => setFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', onFs);
    return () => {
      window.removeEventListener('pagehide', flush);
      document.removeEventListener('visibilitychange', onVis);
      document.removeEventListener('fullscreenchange', onFs);
      recRef.current?.stop?.();
      window.speechSynthesis?.cancel?.();
    };
  }, []);

  const receive = useCallback(
    (data) => {
      const ed = edRef.current;
      const isWelcome = ed.innerHTML === WELCOME_HTML;
      if (!isWelcome && (ed.innerText || '').trim() && !window.confirm('Replace the current note with the received note?')) return false;
      setContent(data.html ? sanitizeHtml(data.html) : textToHtml(data.text || ''));
      notify('Shared note received');
      return true;
    },
    [setContent, notify]
  );

  /* ?code=123456 (from a QR code) opens the shared note */
  useEffect(() => {
    if (!ready) return;
    const code = new URLSearchParams(window.location.search).get('code');
    if (!code) return;
    window.history.replaceState(null, '', window.location.pathname);
    if (!/^\d{6}$/.test(code)) return;
    fetch(`/api/share/${code}`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then(receive)
      .catch(() => notify('That shared note was not found. It may have expired.'));
  }, [ready, receive, notify]);

  /* global shortcuts */
  useEffect(() => {
    const onKey = (e) => {
      if (!(e.ctrlKey || e.metaKey)) return;
      const k = e.key.toLowerCase();
      if (k === 's') {
        e.preventDefault();
        forceSave();
      } else if (k === 'k' && edRef.current?.contains(document.activeElement)) {
        e.preventDefault();
        insertLink();
      } else if (k === 'y' && edRef.current?.contains(document.activeElement)) {
        e.preventDefault();
        exec('redo');
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  });

  /* ---------- actions ---------- */
  function forceSave() {
    if (persist()) notify('Note saved in this browser');
    else notify('Could not save: browser storage is full or blocked');
  }

  function clearNote() {
    if (empty) return;
    if (window.confirm('Clear this note? This cannot be undone.')) setContent('');
  }

  function openFile(e) {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) return notify('That file is larger than 2 MB');
    if (!empty && !window.confirm('Replace the current note with this file?')) return;
    const reader = new FileReader();
    reader.onload = () => {
      const raw = String(reader.result);
      const name = file.name.toLowerCase();
      let html;
      if (/\.html?$/.test(name)) html = sanitizeHtml(raw);
      else if (name.endsWith('.json')) {
        try {
          const j = JSON.parse(raw);
          html = typeof j.html === 'string' ? sanitizeHtml(j.html) : typeof j.text === 'string' ? textToHtml(j.text) : textToHtml(raw);
        } catch {
          html = textToHtml(raw);
        }
      } else html = textToHtml(raw);
      setContent(html);
      notify(`Opened ${file.name}`);
    };
    reader.onerror = () => notify('Could not read that file');
    reader.readAsText(file);
  }

  function doExport(kind) {
    const ed = edRef.current;
    const text = ed.innerText || '';
    const html = sanitizeHtml(ed.innerHTML);
    if (empty) return notify('Nothing to export yet');
    const title = docTitle(text);
    const base = fileBase(title);
    if (kind === 'pdf') {
      notify('In the print dialog, choose “Save as PDF”');
      return printHtml(title, html);
    }
    if (kind === 'word') return downloadFile(`${base}.doc`, 'application/msword', buildWordDocument(title, html));
    if (kind === 'html') return downloadFile(`${base}.html`, 'text/html', buildHtmlDocument(title, html));
    if (kind === 'txt') return downloadFile(`${base}.txt`, 'text/plain', text);
    if (kind === 'md') return downloadFile(`${base}.md`, 'text/markdown', htmlToMarkdown(html));
    if (kind === 'json') {
      return downloadFile(
        `${base}.json`,
        'application/json',
        JSON.stringify({ title, text, html, stats: countStats(text), exportedAt: new Date().toISOString() }, null, 2)
      );
    }
  }

  function openShare() {
    if (empty || !readText().trim()) return notify('Write some text first, then share it');
    setShareData({ text: readText(), html: sanitizeHtml(edRef.current.innerHTML) });
    setDialog('share');
  }

  function toggleDictation() {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return notify('Speech to text is not supported in this browser. Try Chrome, Edge or Safari.');
    if (listening) return recRef.current?.stop();
    const rec = new SR();
    rec.continuous = true;
    rec.interimResults = false;
    rec.lang = navigator.language || 'en-US';
    rec.onresult = (ev) => {
      let add = '';
      for (let i = ev.resultIndex; i < ev.results.length; i++) if (ev.results[i].isFinal) add += ev.results[i][0].transcript;
      if (add.trim()) {
        restoreSel();
        document.execCommand('insertText', false, add.trim() + ' ');
        afterEdit();
      }
    };
    rec.onerror = (ev) => {
      if (ev.error === 'not-allowed' || ev.error === 'service-not-allowed') notify('Microphone access was blocked.');
    };
    rec.onend = () => setListening(false);
    try {
      rec.start();
      recRef.current = rec;
      setListening(true);
    } catch {
      notify('Could not start the microphone.');
    }
  }

  function toggleSpeak() {
    if (!('speechSynthesis' in window)) return notify('Text to speech is not supported in this browser.');
    if (speaking) {
      window.speechSynthesis.cancel();
      return setSpeaking(false);
    }
    const sel = window.getSelection()?.toString() || '';
    const chunk = sel.trim() ? sel : readText();
    if (!chunk.trim()) return notify('Nothing to read yet');
    const u = new SpeechSynthesisUtterance(chunk);
    u.onend = u.onerror = () => setSpeaking(false);
    setSpeaking(true);
    window.speechSynthesis.speak(u);
  }

  function toggleFullscreen() {
    if (document.fullscreenElement) document.exitFullscreen();
    else cardRef.current?.requestFullscreen?.().catch(() => notify('Fullscreen is not available here'));
  }

  function onPaste(e) {
    e.preventDefault();
    const files = Array.from(e.clipboardData.files || []).filter((f) => f.type.startsWith('image/'));
    if (files.length) return insertImageFile(files[0]);
    const html = e.clipboardData.getData('text/html');
    if (html) document.execCommand('insertHTML', false, sanitizeHtml(html));
    else document.execCommand('insertText', false, e.clipboardData.getData('text/plain'));
    afterEdit();
  }

  const statusLabel = status === 'saving' ? 'Saving…' : status === 'error' ? 'Not saved' : 'Auto-Save';

  return (
    <>
      <div className="page">
        <header className="topbar">
          <a className="brand" href="/" aria-label="Web Notepad home">
            <svg width="30" height="30" viewBox="0 0 32 32" fill="none" stroke="#ef5b5b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M7 4h16a2 2 0 0 1 2 2v20a2 2 0 0 1-2 2H7z" />
              <path d="M12 10h8M12 15h8M12 20h5" />
              <path d="M7 9H4M7 14H4M7 19H4M7 24H4" />
            </svg>
            <span>Web Notepad</span>
          </a>
          <nav className="topnav" aria-label="Main">
            <a className="active" href="#notepad">
              <Icon name="home" size={17} /> Home
            </a>
            <button type="button" onClick={() => setDialog('receive')}>
              <Icon name="inbox" size={17} /> Receiver
            </button>
            <a href="#about">
              <Icon name="info" size={17} /> About
            </a>
          </nav>
          <div className="top-actions">
            <button className="sq" onClick={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))} aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'} title="Dark mode">
              <Icon name={theme === 'dark' ? 'sun' : 'moon'} />
            </button>
            <button className="sq" onClick={() => setDialog('keys')} aria-label="Keyboard shortcuts" title="Keyboard shortcuts">
              <Icon name="keyboard" />
            </button>
            <button className="sq" onClick={toggleFullscreen} aria-label={fullscreen ? 'Exit fullscreen' : 'Fullscreen'} title="Fullscreen">
              <Icon name={fullscreen ? 'shrink' : 'expand'} />
            </button>
          </div>
        </header>

        <main className="card" id="notepad" ref={cardRef}>
          <div className="card-head">
            <div className="titles">
              <h1>
                <Icon name="file" size={30} /> Online Notepad – Free Web Notepad No Login Required
              </h1>
              <p>Rich Text Editor • Auto-Save • Share with QR Code • Speech Tools • Dark Mode</p>
            </div>
            <div className="head-actions">
              <span className={'pill ' + status} role="status">
                <Icon name="cloud" size={14} /> {statusLabel}
              </span>
              <button className="btn-share" onClick={openShare}>
                <Icon name="share" size={17} /> Share
              </button>
              <button className="btn-save" onClick={forceSave}>
                <Icon name="save" size={17} /> Force Save
              </button>
            </div>
          </div>

          <Toolbar
            fmt={fmt}
            font={font}
            size={size}
            onCmd={exec}
            onFont={applyFont}
            onSize={applySize}
            onTextColor={(c) => exec('foreColor', c)}
            onHighlight={(c) => exec('hiliteColor', c)}
            onLink={insertLink}
            onImage={() => imgRef.current?.click()}
            onMic={toggleDictation}
            listening={listening}
            onSpeak={toggleSpeak}
            speaking={speaking}
            onClear={clearNote}
            onOpenFile={() => fileRef.current?.click()}
          />
          <input ref={fileRef} type="file" accept=".txt,.md,.html,.htm,.json,text/*" onChange={openFile} hidden />
          <input
            ref={imgRef}
            type="file"
            accept="image/*"
            hidden
            onChange={(e) => {
              const f = e.target.files?.[0];
              e.target.value = '';
              insertImageFile(f);
            }}
          />

          <div className="work">
            <div
              ref={edRef}
              className={'editor' + (empty ? ' is-empty' : '')}
              contentEditable
              suppressContentEditableWarning
              role="textbox"
              aria-multiline="true"
              aria-label="Note editor"
              data-placeholder="Start typing your note here…"
              spellCheck
              onInput={afterEdit}
              onPaste={onPaste}
            />
            <Sidebar stats={stats} onExport={doExport} />
          </div>
        </main>
      </div>

      <SeoContent />

      {dialog === 'share' && <ShareDialog text={shareData.text} html={shareData.html} onClose={() => setDialog(null)} notify={notify} />}
      {dialog === 'receive' && (
        <OpenCodeDialog
          onClose={() => setDialog(null)}
          onOpened={(data) => {
            if (receive(data)) setDialog(null);
          }}
        />
      )}
      {dialog === 'keys' && <ShortcutsDialog onClose={() => setDialog(null)} />}

      <div className={'toast' + (toast ? ' show' : '')} role="status" aria-live="polite">
        {toast}
      </div>
    </>
  );
}
