import Icon from './Icon.jsx';

const EXPORTS = [
  ['pdf', 'PDF', 'Print dialog: choose “Save as PDF”'],
  ['word', 'Word', 'Download as a Word document (.doc)'],
  ['html', 'HTML', 'Download as an HTML page'],
  ['txt', 'TXT', 'Download as plain text'],
  ['md', 'MD', 'Download as Markdown'],
  ['json', 'JSON', 'Download as JSON'],
];

export default function Sidebar({ stats, onExport }) {
  const tiles = [
    [stats.characters, 'Characters'],
    [stats.words, 'Words'],
    [stats.lines, 'Lines'],
    [stats.minRead, 'Min Read'],
  ];
  return (
    <aside className="side" aria-label="Export and statistics">
      <h2 className="side-title">
        <Icon name="download" size={18} /> Export Document
      </h2>
      <div className="export-grid">
        {EXPORTS.map(([id, label, hint]) => (
          <button key={id} className={'exp exp-' + id} onClick={() => onExport(id)} title={hint}>
            <Icon name="file" size={15} /> {label}
          </button>
        ))}
      </div>
      <div className="stat-grid" aria-label="Document statistics">
        {tiles.map(([n, l]) => (
          <div className="stat" key={l}>
            <strong>{n}</strong>
            <span>{l}</span>
          </div>
        ))}
      </div>
    </aside>
  );
}
