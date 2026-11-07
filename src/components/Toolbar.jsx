import Icon from './Icon.jsx';

const FONTS = ['Inter', 'Arial', 'Verdana', 'Georgia', 'Times New Roman', 'Courier New', 'Trebuchet MS', 'Comic Sans MS'];
export const SIZES = [12, 14, 16, 18, 20, 24, 28, 32, 36, 48];

// Keep the editor selection when a toolbar button is pressed.
const keepFocus = (e) => e.preventDefault();

function Btn({ icon, label, title, onClick, active, danger }) {
  return (
    <button
      type="button"
      className={'tb' + (active ? ' on' : '') + (danger ? ' danger' : '') + (label ? ' has-label' : '')}
      onMouseDown={keepFocus}
      onClick={onClick}
      aria-pressed={active === undefined ? undefined : !!active}
      aria-label={title || label}
      title={title || label}
    >
      <Icon name={icon} size={16} />
      {label && <span>{label}</span>}
    </button>
  );
}

export default function Toolbar({ fmt, font, size, onCmd, onFont, onSize, onTextColor, onHighlight, onLink, onImage, onMic, listening, onSpeak, speaking, onClear, onOpenFile }) {
  return (
    <div className="toolbar" role="toolbar" aria-label="Formatting tools">
      <div className="tb-group">
        <Btn icon="bold" label="Bold" title="Bold (Ctrl+B)" active={fmt.bold} onClick={() => onCmd('bold')} />
        <Btn icon="italic" label="Italic" title="Italic (Ctrl+I)" active={fmt.italic} onClick={() => onCmd('italic')} />
        <Btn icon="underline" label="Underline" title="Underline (Ctrl+U)" active={fmt.underline} onClick={() => onCmd('underline')} />
        <Btn icon="strike" title="Strikethrough" active={fmt.strike} onClick={() => onCmd('strikeThrough')} />
      </div>

      <div className="tb-group">
        <select className="tb-select font" value={font} onChange={(e) => onFont(e.target.value)} aria-label="Font family">
          {FONTS.map((f) => (
            <option key={f} value={f}>
              {f}
            </option>
          ))}
        </select>
        <select className="tb-select size" value={size} onChange={(e) => onSize(Number(e.target.value))} aria-label="Font size">
          {SIZES.map((s) => (
            <option key={s} value={s}>
              {s}px
            </option>
          ))}
        </select>
      </div>

      <div className="tb-group">
        <Btn icon="alignLeft" title="Align left" active={fmt.left} onClick={() => onCmd('justifyLeft')} />
        <Btn icon="alignCenter" title="Align center" active={fmt.center} onClick={() => onCmd('justifyCenter')} />
        <Btn icon="alignRight" title="Align right" active={fmt.right} onClick={() => onCmd('justifyRight')} />
      </div>

      <div className="tb-group">
        <label className="swatch" title="Text color">
          <input type="color" defaultValue="#000000" onChange={(e) => onTextColor(e.target.value)} aria-label="Text color" />
        </label>
        <label className="swatch" title="Highlight color">
          <input type="color" defaultValue="#fff6bf" onChange={(e) => onHighlight(e.target.value)} aria-label="Highlight color" />
        </label>
      </div>

      <div className="tb-group">
        <Btn icon="listUl" title="Bulleted list" active={fmt.ul} onClick={() => onCmd('insertUnorderedList')} />
        <Btn icon="listOl" title="Numbered list" active={fmt.ol} onClick={() => onCmd('insertOrderedList')} />
        <Btn icon="link" title="Insert link (Ctrl+K)" onClick={onLink} />
        <Btn icon="image" title="Insert image" onClick={onImage} />
      </div>

      <div className="tb-group">
        <Btn icon="undo" title="Undo (Ctrl+Z)" onClick={() => onCmd('undo')} />
        <Btn icon="redo" title="Redo (Ctrl+Y)" onClick={() => onCmd('redo')} />
      </div>

      <div className="tb-group">
        <Btn icon="mic" title={listening ? 'Stop dictation' : 'Speech to text'} active={listening} onClick={onMic} />
        <Btn icon="speaker" title={speaking ? 'Stop reading' : 'Text to speech'} active={speaking} onClick={onSpeak} />
      </div>

      <div className="tb-group">
        <Btn icon="trash" title="Clear note" danger onClick={onClear} />
        <Btn icon="upload" title="Open a file (.txt, .md, .html, .json)" onClick={onOpenFile} />
      </div>
    </div>
  );
}
