import { useEffect, useState } from 'react';
import Modal from './Modal.jsx';
import Icon from './Icon.jsx';

export default function ShareDialog({ text, html, onClose, notify }) {
  const [state, setState] = useState({ status: 'loading' });
  const [qr, setQr] = useState('');
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const ctrl = new AbortController();
    (async () => {
      try {
        const res = await fetch('/api/share', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text, html }),
          signal: ctrl.signal,
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          const msg =
            data.error === 'empty'
              ? 'Write something first, then share it.'
              : data.error === 'too_large'
              ? 'This note is too large to share (limit: 200,000 characters).'
              : data.error === 'too_many_requests'
              ? 'Too many shares. Please wait a few minutes and try again.'
              : 'Sharing is unavailable right now. Please try again.';
          return setState({ status: 'error', msg });
        }
        const link = `${location.origin}/?code=${data.code}`;
        setState({ status: 'ready', code: data.code, expiresAt: data.expiresAt, link });
        const QRCode = (await import('qrcode')).default;
        const url = await QRCode.toDataURL(link, {
          margin: 1,
          width: 240,
          color: { dark: '#18212D', light: '#FFFFFF' },
        });
        setQr(url);
      } catch (e) {
        if (e.name !== 'AbortError') {
          setState({ status: 'error', msg: 'Could not reach the server. Check your connection and try again.' });
        }
      }
    })();
    return () => ctrl.abort();
  }, [text, html]);

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 30_000);
    return () => clearInterval(t);
  }, []);

  async function copy(value, label) {
    try {
      await navigator.clipboard.writeText(value);
      notify(`${label} copied`);
    } catch {
      notify('Copy failed. Select and copy it manually.');
    }
  }

  const minutes = state.expiresAt ? Math.max(0, Math.ceil((state.expiresAt - now) / 60000)) : 0;

  return (
    <Modal title="Share this note" onClose={onClose}>
      {state.status === 'loading' && <p className="modal-msg">Creating your share code…</p>}
      {state.status === 'error' && <p className="modal-msg error">{state.msg}</p>}
      {state.status === 'ready' && (
        <div className="share-body">
          <div className="share-qr">
            {qr ? <img src={qr} width="240" height="240" alt={`QR code that opens shared note ${state.code}`} /> : <div className="qr-ph" />}
          </div>
          <div className="share-info">
            <p className="share-label">6-digit code</p>
            <p className="share-code" aria-label={`Code ${state.code.split('').join(' ')}`}>
              {state.code.slice(0, 3)} {state.code.slice(3)}
            </p>
            <div className="share-actions">
              <button className="btn" onClick={() => copy(state.code, 'Code')}>
                <Icon name="copy" size={16} /> Copy code
              </button>
              <button className="btn" onClick={() => copy(state.link, 'Link')}>
                <Icon name="copy" size={16} /> Copy link
              </button>
            </div>
            <p className="share-note">
              On another device, scan the QR code, or choose <strong>Receiver</strong> and enter the digits. This copy
              is deleted in {minutes} {minutes === 1 ? 'minute' : 'minutes'}.
            </p>
          </div>
        </div>
      )}
    </Modal>
  );
}
