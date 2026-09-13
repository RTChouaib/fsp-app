'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const OPTIONS = [
  { id: 'mixed', label: 'Gemischt — alle Lernmodi' },
  { id: 'patient', label: 'Patientensprache' },
  { id: 'medical', label: 'Fachbegriffe' },
  { id: 'intensive', label: 'FSP intensiv (Situationen)' },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [timedOut, setTimedOut] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function poll() {
      // Webhooks can occasionally take longer than a few seconds. Keep the
      // user on this page until the database confirms paid access instead of
      // failing open and sending them to a dashboard that will reject them.
      for (let i = 0; i < 60; i++) {
        try {
          const res = await fetch('/api/account/status', { cache: 'no-store' });
          const data = await res.json();
          if (data.status === 'active') {
            if (!cancelled) setReady(true);
            return;
          }
        } catch {
          // Retry on transient network errors.
        }
        await new Promise((r) => setTimeout(r, 1000));
      }
      if (!cancelled) setTimedOut(true);
    }

    poll();
    return () => { cancelled = true; };
  }, []);

  if (!ready) {
    return (
      <div className="wrap narrow" style={{ paddingTop: 80, textAlign: 'center' }}>
        <div className="eyebrow">Zahlung wird bestätigt</div>
        <h2>{timedOut ? 'Die Bestätigung dauert länger als erwartet.' : 'Deine Zahlung wird bestätigt…'}</h2>
        <p className="small-muted">
          {timedOut
            ? 'Bitte prüfe, ob du die richtige E-Mail-Adresse verwendet hast. Wenn die Zahlung bereits abgeschlossen ist, kannst du es gleich noch einmal versuchen.'
            : 'Das dauert normalerweise nur wenige Sekunden.'}
        </p>
        {timedOut && (
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginTop: 22 }}>
            <button className="btn btn-blue" onClick={() => window.location.reload()}>Erneut prüfen</button>
            <Link href="/login" className="btn btn-outline">Zum Login</Link>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="wrap narrow" style={{ paddingTop: 52, textAlign: 'center' }}>
      <div className="eyebrow">Willkommen</div>
      <h2>Was möchtest du trainieren?</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 22, textAlign: 'left' }}>
        {OPTIONS.map((o) => (
          <button key={o.id} className="option-btn" onClick={() => router.push('/dashboard')}>
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}
