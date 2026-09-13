'use client';

import { useState } from 'react';
import { startCheckoutSession } from '@/lib/actions';
import { CheckoutButton } from '@/components/CheckoutButton';

const PRICE_ID_BY_PLAN: Record<string, string> = {
  weekly: process.env.NEXT_PUBLIC_PRICE_WEEKLY!,
  monthly: process.env.NEXT_PUBLIC_PRICE_MONTHLY!,
  quarterly: process.env.NEXT_PUBLIC_PRICE_QUARTERLY!,
};

export function CheckoutForm({ plan }: { plan: 'weekly' | 'monthly' | 'quarterly' }) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [session, setSession] = useState<{ userId: string; email: string } | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleContinue() {
    if (!email.includes('@')) {
      setError('Bitte eine gültige E-Mail-Adresse eingeben.');
      return;
    }
    setError('');
    setLoading(true);
    const result = await startCheckoutSession(email);
    setSession(result);
    setLoading(false);
  }

  if (session) {
    return (
      <CheckoutButton
        plan={plan}
        priceId={PRICE_ID_BY_PLAN[plan]}
        userEmail={session.email}
        userId={session.userId}
        label="Bezahlen"
      />
    );
  }

  return (
    <div>
      <div className="field">
        <label>E-Mail-Adresse</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="name@beispiel.de"
        />
      </div>
      {error && <p className="err-text">{error}</p>}
      <button className="btn btn-blue btn-block" onClick={handleContinue} disabled={loading}>
        {loading ? 'Einen Moment…' : 'Weiter zur Zahlung'}
      </button>
    </div>
  );
}
