import Link from 'next/link';

const PLANS = [
  {
    name: 'Wöchentlich',
    price: '4,99 €',
    period: 'pro Woche',
    note: 'Für kurze, intensive Vorbereitung',
    featured: false,
    features: ['Alle Begriffe & Kategorien', 'Unbegrenztes Training', 'Spaced Repetition & Fehlertraining', 'Jederzeit kündbar'],
    plan: 'weekly',
  },
  {
    name: 'Monatlich',
    price: '14,99 €',
    period: 'pro Monat',
    note: '≈ 3,46 € / Woche',
    featured: true,
    features: ['Alle Begriffe & Kategorien', 'Unbegrenztes Training', 'Spaced Repetition & Fehlertraining', 'Vollständige Fortschrittsverfolgung', 'Jederzeit kündbar'],
    plan: 'monthly',
  },
  {
    name: '3 Monate',
    price: '29,99 €',
    period: 'für 3 Monate',
    note: '≈ 2,31 € / Woche — bester Wert',
    featured: false,
    features: ['Alle Begriffe & Kategorien', 'Unbegrenztes Training', 'Spaced Repetition & Fehlertraining', 'Vollständige Fortschrittsverfolgung', 'Jederzeit kündbar'],
    plan: 'quarterly',
  },
] as const;

export function PricingCards() {
  return (
    <div className="pricing-grid">
      {PLANS.map((p) => (
        <div key={p.plan} className={`plan ${p.featured ? 'featured' : ''}`}>
          {p.featured && <div className="plan-badge">Empfohlen</div>}
          <div className="plan-name">{p.name}</div>
          <div className="plan-price">{p.price}</div>
          <div className="plan-period">{p.period}</div>
          <div className="plan-weekly-equiv">{p.note}</div>
          <ul className="plan-features">
            {p.features.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
          <Link
            href={`/checkout?plan=${p.plan}`}
            className={`btn btn-block ${p.featured ? 'btn-blue' : 'btn-outline'}`}
          >
            Wählen
          </Link>
        </div>
      ))}
    </div>
  );
}
