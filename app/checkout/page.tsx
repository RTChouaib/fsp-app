import { MarketingTopBar } from '@/components/MarketingTopBar';
import { MarketingFooter } from '@/components/MarketingFooter';
import { CheckoutForm } from './CheckoutForm';

const PLAN_INFO: Record<string, { label: string; price: string; period: string }> = {
  weekly: { label: 'Wöchentlich', price: '4,99 €', period: 'pro Woche' },
  monthly: { label: 'Monatlich', price: '14,99 €', period: 'pro Monat' },
  quarterly: { label: '3 Monate', price: '29,99 €', period: 'für 3 Monate' },
};

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{ plan?: string }>;
}) {
  const { plan: rawPlan } = await searchParams;
  const plan = (rawPlan as 'weekly' | 'monthly' | 'quarterly') || 'monthly';
  const info = PLAN_INFO[plan] ?? PLAN_INFO.monthly;

  return (
    <>
      <MarketingTopBar />
      <div className="wrap narrow" style={{ paddingTop: 44 }}>
        <div className="eyebrow">Checkout</div>
        <h2>
          Plan: {info.label} — {info.price} {info.period}
        </h2>
        <CheckoutForm plan={plan} />
        <p className="small-muted" style={{ marginTop: 10, textAlign: 'center' }}>
          Wir speichern keine Zahlungsdaten. Kündigung jederzeit im Konto möglich.
        </p>
      </div>
      <MarketingFooter />
    </>
  );
}
