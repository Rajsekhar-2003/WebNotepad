import { useState } from 'react';
import Modal from './Modal.jsx';

export default function OpenCodeDialog({ onClose, onOpened }) {
  const [code, setCode] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function submit(e) {
    e.preventDefault();
    if (!/^\d{6}$/.test(code)) return setError('Enter all 6 digits.');
    setBusy(true);
    setError('');
    try {
      const res = await fetch(`/api/share/${code}`);
      if (res.status === 404) return setError('No note found for that code. It may have expired.');
      if (res.status === 429) return setError('Too many attempts. Please wait a few minutes.');
      if (!res.ok) return setError('Something went wrong. Please try again.');
      const data = await res.json();
      onOpened(data);
    } catch {
      setError('Could not reach the server. Check your connection.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <Modal title="Receive a shared note" onClose={onClose}>
      <form className="open-form" onSubmit={submit}>
        <label htmlFor="share-code">6-digit code</label>
        <input
          id="share-code"
          inputMode="numeric"
          pattern="\d{6}"
          maxLength={6}
          autoComplete="off"
          autoFocus
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
          placeholder="123456"
          className="code-input"
        />
        {error && (
          <p className="modal-msg error" role="alert">
            {error}
          </p>
        )}
        <p className="share-note">The shared note, with its formatting, opens in the editor.</p>
        <button className="btn primary" type="submit" disabled={busy}>
          {busy ? 'Receiving…' : 'Receive note'}
        </button>
      </form>
    </Modal>
  );
}
