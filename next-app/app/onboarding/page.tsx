'use client';

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

  useEffect(() => {
    let cancelled = false;

    async function poll() {
      // The Paddle webhook usually lands within a second or two of checkout,
      // but the browser can get here first. Poll briefly rather than bounce
      // the user straight to a "please pay" screen right after they paid.
      for (let i = 0; i < 10; i++) {
        const res = await fetch('/api/account/status');
        const data = await res.json();
        if (data.status === 'active') {
          if (!cancelled) setReady(true);
          return;
        }
        await new Promise((r) => setTimeout(r, 1000));
      }
      // Fail open after ~10s even if the webhook is unusually slow — the
      // dashboard's own guard (app/(app)/layout.tsx) still enforces access
      // for real, this is only about not stalling the UI indefinitely.
      if (!cancelled) setReady(true);
    }

    poll();
    return () => {
      cancelled = true;
    };
  }, []);

  if (!ready) {
    return (
      <div className="wrap narrow" style={{ paddingTop: 80, textAlign: 'center' }}>
        <div className="eyebrow">Einen Moment</div>
        <h2>Deine Zahlung wird bestätigt…</h2>
        <p className="small-muted">Das dauert normalerweise nur wenige Sekunden.</p>
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
