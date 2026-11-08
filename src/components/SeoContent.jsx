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

const USE_CASES = [
  'Write blog posts and website articles.',
  'Create movie reviews and entertainment articles.',
  'Prepare research papers, assignments and study notes.',
  'Write essays, reports and professional documents.',
  'Draft emails, stories and personal notes.',
  'Write, edit and store programming code or text snippets.',
  'Copy and paste text for quick editing and sharing.',
];

const AUDIENCES = [
  ['Students', 'Prepare assignments, class notes, research papers and study materials.'],
  ['Bloggers and content writers', 'Draft blog posts, website articles, movie reviews and other online content.'],
  ['Researchers', 'Organise research information, write reports and prepare academic documents.'],
  ['Developers', 'Write, edit, copy and share programming code and technical notes.'],
  ['Teachers', 'Prepare educational materials, instructions and classroom notes.'],
  ['Professionals', 'Draft reports, organise information and prepare everyday documents.'],
];

const REASONS = [
  'Free and easy to use — no account to create and nothing to install.',
  'Automatic saving of your notes while you type.',
  'Simple, distraction-free interface with no ads.',
  'Download as PDF, Word, HTML, TXT, Markdown or JSON.',
  'Share notes with a 6-digit code or QR code.',
  'Useful for articles, research papers and assignments.',
  'Handles programming code as well as prose.',
  'Accessible from desktop and mobile browsers.',
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

      <section id="use-cases" aria-labelledby="use-cases-h">
        <h2 id="use-cases-h">Write anything, anytime, anywhere</h2>
        <p>
          The notepad is designed for everyone — students, bloggers, researchers, developers, teachers and
          professionals. It gives you a single, distraction-free place to write, edit, save and share text online.
          You can use it to:
        </p>
        <ul className="tips">
          {USE_CASES.map((useCase) => (
            <li key={useCase}>{useCase}</li>
          ))}
        </ul>
        <p>
          Whether you are working on a college assignment or writing your next blog post, the editor stays out of the
          way and lets you focus on the words.
        </p>
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

      <section id="save" aria-labelledby="save-h">
        <h2 id="save-h">Automatic saving — never lose your important notes</h2>
        <p>
          There is no Save button to remember. Start typing and your latest changes are stored automatically, which
          makes the notepad practical for long articles, research documents, personal notes and everyday writing
          tasks. If you want a save to happen immediately, press Ctrl+S (Command+S on Mac) to force one.
        </p>
        <p>
          <em>
            Auto-save availability and data retention depend on your browser and its storage settings. Always export a
            backup of important documents.
          </em>
        </p>
      </section>

      <section id="download" aria-labelledby="download-h">
        <h2 id="download-h">Download your notes as PDF or Word</h2>
        <p>
          Want to keep a copy of your notes or use them outside the browser? Export your content whenever you need it.
          Alongside PDF and Word, notes can also be downloaded as HTML, TXT, Markdown and JSON, so the same text can go
          to a printer, into another editor or into a backup folder.
        </p>
      </section>

      <section id="share" aria-labelledby="share-h">
        <h2 id="share-h">Easily share text with friends and groups</h2>
        <p>
          Sharing should be simple. Instead of sending long messages over and over, write the text once in the notepad
          and share it with a 6-digit code or a QR code. That makes it easy to pass along:
        </p>
        <ul className="tips">
          <li>College notes and study materials.</li>
          <li>Blog drafts and article content.</li>
          <li>Research information and project details.</li>
          <li>Programming code and technical snippets.</li>
          <li>Important information with friends and groups.</li>
        </ul>
        <p>
          A shared copy is held only in server memory and is deleted after 1 hour. Your own note stays in your browser.
        </p>
      </section>

      <section id="developers" aria-labelledby="developers-h">
        <h2 id="developers-h">A convenient online notepad for programmers</h2>
        <p>
          Developers often need a quick place to write, edit, copy and share code. The notepad works as a lightweight
          scratch space for HTML, CSS, JavaScript, Python, PHP, SQL and other snippets — useful for debugging a small
          block, preparing programming notes or passing code to a teammate.
        </p>
      </section>

      <section aria-labelledby="devices-h">
        <h2 id="devices-h">A notepad for every device</h2>
        <p>
          Use it as a notepad for PC on Windows, macOS and Linux, and as a notepad app for Android and iPhone that runs in
          your browser. It works in current versions of Google Chrome, Microsoft Edge, Mozilla Firefox, Safari and Opera.
          JavaScript must be enabled.
        </p>
        <p>Because everything runs in the browser, there is no software to install:</p>
        <ul className="tips">
          <li>Use it on Windows, Linux and macOS.</li>
          <li>Access it from Android and iPhone.</li>
          <li>Write from a laptop, desktop, tablet or smartphone.</li>
          <li>Start typing without installing a desktop application.</li>
        </ul>
        <p>
          Bookmark the page with Ctrl+D (Command+D on Mac). On mobile, choose “Add to Home Screen” for an app-like
          experience.
        </p>
      </section>

      <section id="who" aria-labelledby="who-h">
        <h2 id="who-h">Who can use the free online notepad?</h2>
        <p>The notepad is useful for almost everyone:</p>
        <dl className="feature-list">
          {AUDIENCES.map(([t, d]) => (
            <div key={t}>
              <dt>{t}</dt>
              <dd>{d}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section id="why" aria-labelledby="why-h">
        <h2 id="why-h">Why choose Web Notepad?</h2>
        <ul className="tips">
          {REASONS.map((reason) => (
            <li key={reason}>{reason}</li>
          ))}
        </ul>
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
        <p>
          Write smarter, save automatically, download easily and share anywhere — open the page and start typing.
        </p>
      </section>

      <footer className="site-footer">
        <p>© 2026 Web Notepad. Free online notepad, no login required.</p>
        <nav aria-label="Footer">
          <a href="#features">Features</a>
          <a href="#download">Download</a>
          <a href="#share">Share</a>
          <a href="#faq">FAQ</a>
          <a href="#privacy">Privacy</a>
          <a href="#notepad">Back to notepad</a>
        </nav>
      </footer>
    </div>
  );
}
