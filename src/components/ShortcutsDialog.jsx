import Modal from './Modal.jsx';

const KEYS = [
  ['Bold', 'Ctrl + B'],
  ['Italic', 'Ctrl + I'],
  ['Underline', 'Ctrl + U'],
  ['Insert link', 'Ctrl + K'],
  ['Undo', 'Ctrl + Z'],
  ['Redo', 'Ctrl + Y or Ctrl + Shift + Z'],
  ['Force save', 'Ctrl + S'],
  ['Close a dialog', 'Esc'],
];

export default function ShortcutsDialog({ onClose }) {
  return (
    <Modal title="Keyboard shortcuts" onClose={onClose}>
      <table className="keys">
        <tbody>
          {KEYS.map(([a, k]) => (
            <tr key={a}>
              <th scope="row">{a}</th>
              <td>
                <kbd>{k}</kbd>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="share-note">On Mac, use Command instead of Ctrl.</p>
    </Modal>
  );
}
