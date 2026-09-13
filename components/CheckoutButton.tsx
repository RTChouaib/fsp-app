'use client';

import { useEffect, useState } from 'react';

declare global {
  interface Window {
    Paddle?: any;
  }
}

type Plan = 'weekly' | 'monthly' | 'quarterly';

export function CheckoutButton({
  plan,
  priceId,
  userEmail,
  userId,
  label,
}: {
  plan: Plan;
  priceId: string;
  userEmail: string;
  userId: string;
  label: string;
}) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (window.Paddle) {
      setReady(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://cdn.paddle.com/paddle/v2/paddle.js';
    script.async = true;
    script.onload = () => {
      window.Paddle.Environment.set(
        process.env.NEXT_PUBLIC_PADDLE_ENV === 'production' ? 'production' : 'sandbox'
      );
      window.Paddle.Setup({ token: process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN! });
      setReady(true);
    };
    document.body.appendChild(script);
  }, []);

  function openCheckout() {
    if (!window.Paddle) return;
    window.Paddle.Checkout.open({
      items: [{ priceId, quantity: 1 }],
      customer: { email: userEmail },
      customData: { userId }, // this is what comes back on the webhook to identify the user
      settings: {
        successUrl: `${window.location.origin}/onboarding`,
      },
    });
  }

  return (
    <button className="btn btn-blue btn-block" disabled={!ready} onClick={openCheckout}>
      {ready ? label : 'Lädt…'}
    </button>
  );
}
