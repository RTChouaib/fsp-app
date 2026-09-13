'use client';

import Link from 'next/link';
import { FormEvent, useState } from 'react';
import { MarketingTopBar } from '@/components/MarketingTopBar';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  async function requestCode(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const res = await fetch('/api/auth/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || 'Fehler beim Senden.');
      setSent(true);
      setMessage('Wenn ein aktives Konto zu dieser E-Mail gehört, wurde ein 6-stelliger Code gesendet.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Fehler beim Senden.');
    } finally {
      setLoading(false);
    }
  }

  async function verifyCode(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || 'Ungültiger Code.');
      window.location.assign('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login fehlgeschlagen.');
      setLoading(false);
    }
  }

  return (
    <>
      <MarketingTopBar />
      <div className="wrap narrow" style={{ paddingTop: 70, paddingBottom: 80 }}>
        <div className="eyebrow">Bereits Mitglied?</div>
        <h2>Einloggen</h2>
        <p>Nutze die E-Mail-Adresse, mit der du dein FSP-Terminology-Abo gekauft hast.</p>

        {!sent ? (
          <form onSubmit={requestCode} style={{ marginTop: 28 }}>
            <div className="field">
              <label htmlFor="email">E-Mail-Adresse</label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@beispiel.de"
                required
              />
            </div>
            {error && <p className="err-text">{error}</p>}
            <button className="btn btn-blue btn-block" disabled={loading}>
              {loading ? 'Wird gesendet…' : 'Login-Code senden'}
            </button>
          </form>
        ) : (
          <form onSubmit={verifyCode} style={{ marginTop: 28 }}>
            <div className="field">
              <label htmlFor="code">6-stelliger Code</label>
              <input
                id="code"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={6}
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                placeholder="123456"
                required
              />
            </div>
            {message && <p className="small-muted">{message}</p>}
            {error && <p className="err-text">{error}</p>}
            <button className="btn btn-blue btn-block" disabled={loading || code.length !== 6}>
              {loading ? 'Wird geprüft…' : 'Einloggen'}
            </button>
            <button
              type="button"
              className="arrow-link"
              style={{ marginTop: 16 }}
              onClick={() => { setSent(false); setCode(''); setError(''); setMessage(''); }}
            >
              Andere E-Mail verwenden
            </button>
          </form>
        )}

        <p className="small-muted" style={{ marginTop: 28 }}>
          Noch kein Abo? <Link href="/pricing">Preise ansehen</Link>
        </p>
      </div>
    </>
  );
}
