// Single source of truth: rendered on the page AND emitted as FAQPage JSON-LD at build time.
export const FAQ = [
  {
    q: 'Is this notepad free?',
    a: 'Yes. Web Notepad is a free online notepad with no login, no signup and no ads.',
  },
  {
    q: 'Are my notes private?',
    a: 'Your notes are stored in your own browser and are not sent to a server while you type. Only if you choose Share is the note stored on the server, and it is deleted after 1 hour.',
  },
  {
    q: 'Can I format my text?',
    a: 'Yes. Web Notepad is a rich text editor: bold, italic, underline, strikethrough, fonts and sizes, text and highlight colors, alignment, bulleted and numbered lists, links and images.',
  },
  {
    q: 'Which formats can I export to?',
    a: 'You can export your note as PDF (through the print dialog, choose Save as PDF), Word (.doc), HTML, plain text (TXT), Markdown (MD) or JSON.',
  },
  {
    q: 'How do I share a note?',
    a: 'Click Share to get a 6-digit code and a QR code. On another device, scan the QR code or open Receiver and enter the digits. The shared copy, with its formatting, expires after 1 hour.',
  },
  {
    q: 'How do I install it as a notepad app?',
    a: 'On Android, open the Chrome menu and choose Add to Home screen. On iPhone, tap Share and then Add to Home Screen. On desktop Chrome or Edge, use the install icon in the address bar.',
  },
  {
    q: 'Does this notepad work offline?',
    a: 'Yes. After your first visit the app is cached by your browser, and notes autosave locally, so you can keep writing without a connection. Sharing and receiving need a connection.',
  },
  {
    q: 'Will I lose my notes if I clear my browser data?',
    a: 'Yes. Notes live in your browser until you clear cookies and other site data. Use the Export buttons to back up important notes to your computer.',
  },
];
