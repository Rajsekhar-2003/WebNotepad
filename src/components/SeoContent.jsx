import { FAQ } from '../lib/faq.js';

const FEATURES = [
  ['Rich text formatting', 'Bold, italic, underline and strikethrough, plus fonts, sizes, text color and highlight color.'],
  ['Lists, links and images', 'Bulleted and numbered lists, clickable links, and images you insert or paste.'],
  ['Auto-Save', 'Every change is saved in your browser about once a second, and Force Save (Ctrl+S) saves instantly.'],
  ['Export to six formats', 'Download your note as PDF, Word, HTML, TXT, Markdown or JSON.'],
  ['Share with QR code', 'Send a note to your phone or a friend with a 6-digit code or QR code. Shared copies are deleted after 1 hour.'],
  ['Speech tools', 'Dictate with speech to text, or have your note read aloud with text to speech.'],
  ['Live statistics', 'Characters, words, lines and estimated reading time update as you type.'],
  ['Dark mode', 'Switch themes with one click. Your choice is remembered.'],
  ['Keyboard shortcuts', 'Standard shortcuts for formatting, undo, redo, links and saving.'],
  ['Works offline', 'After the first visit the notepad loads and saves without a connection.'],
];

export default function SeoContent() {
  return (
    <div className="seo">
      <section id="features" aria-labelledby="features-h">
        <h2 id="features-h">A free online notepad with the features that matter</h2>
        <p className="lead">
          Web Notepad is a rich text editor that lives in your browser. There is nothing to install, no account to
          create and no ads to dismiss. Open the page, type, and come back later: your notes will be there.
        </p>
        <dl className="feature-list">
          {FEATURES.map(([t, d]) => (
            <div key={t}>
              <dt>{t}</dt>
              <dd>{d}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section aria-labelledby="how-h">
        <h2 id="how-h">How the online notepad works</h2>
        <p>
          Changes are saved as you work using the HTML5 localStorage API. The editor copies your note, with its formatting, into
          your browser’s storage about one second after you stop typing, so your data stays on your device. Your notes remain in the browser until you
          clear cookies and other site data. When you share a note, only that note’s text is sent to the server, and only
          for an hour.
        </p>
      </section>

      <section aria-labelledby="devices-h">
        <h2 id="devices-h">A notepad for every device</h2>
        <p>
          Use it as a notepad for PC on Windows, macOS and Linux, and as a notepad app for Android and iPhone that runs in
          your browser. It works in current versions of Google Chrome, Microsoft Edge, Mozilla Firefox, Safari and Opera.
          JavaScript must be enabled.
        </p>
        <p>
          Bookmark the page with Ctrl+D (Command+D on Mac). On mobile, choose “Add to Home Screen” for an app-like
          experience.
        </p>
      </section>

      <section aria-labelledby="tips-h">
        <h2 id="tips-h">Tips for using Web Notepad</h2>
        <ul className="tips">
          <li>Use the Export buttons regularly to back up important notes to your computer.</li>
          <li>Press Ctrl+S (Command+S) to force a save at any time.</li>
          <li>Watch the word and reading-time counters to track a writing target.</li>
          <li>Your notes persist between sessions unless you clear your browser’s site data.</li>
        </ul>
      </section>

      <section id="privacy" aria-labelledby="privacy-h">
        <h2 id="privacy-h">Privacy and security</h2>
        <p>
          Your notes are stored locally in your browser, so they stay private to you. We do not receive what you type. The
          one exception is Share: the note you choose to share (text and formatting) is held in server memory for 1 hour so someone with the code
          can open it, then it is deleted. We do not use advertising trackers.
        </p>
      </section>

      <section id="faq" aria-labelledby="faq-h">
        <h2 id="faq-h">Frequently asked questions</h2>
        <div className="faq">
          {FAQ.map((f) => (
            <details key={f.q}>
              <summary>{f.q}</summary>
              <p>{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section id="about" aria-labelledby="about-h">
        <h2 id="about-h">About Web Notepad</h2>
        <p>
          Web Notepad is a free tool for anyone: individuals, companies, schools and offices. It started as a simple
          project to make quick notes faster than opening a heavy app, and it has stayed focused on that.
        </p>
      </section>

      <footer className="site-footer">
        <p>© 2026 Web Notepad. Free online notepad, no login required.</p>
        <nav aria-label="Footer">
          <a href="#features">Features</a>
          <a href="#faq">FAQ</a>
          <a href="#privacy">Privacy</a>
          <a href="#notepad">Back to notepad</a>
        </nav>
      </footer>
    </div>
  );
}
