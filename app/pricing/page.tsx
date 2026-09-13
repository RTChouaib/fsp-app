import { MarketingTopBar } from '@/components/MarketingTopBar';
import { MarketingFooter } from '@/components/MarketingFooter';
import { PricingCards } from '@/components/PricingCards';

export default async function PricingPage({
  searchParams,
}: {
  searchParams: Promise<{ reason?: string }>;
}) {
  const { reason } = await searchParams;

  return (
    <>
      <MarketingTopBar />
      <div className="wrap narrow" style={{ paddingTop: 44 }}>
        {reason && (
          <div className="locked-banner">
            {reason === 'paid'
              ? 'Dieser Bereich ist für zahlende Mitglieder. Wähle einen Plan, um weiterzumachen.'
              : 'Bitte wähle zunächst einen Plan, um dein Konto einzurichten.'}
          </div>
        )}
        <div className="eyebrow">Bereit, gezielt für die FSP zu trainieren?</div>
        <h2>Vorbereitung starten</h2>
        <p>
          Wähle den Plan, der zu deiner Prüfungsvorbereitung passt. Keine versteckten Kosten,
          jederzeit kündbar.
        </p>
        <PricingCards />
        <p className="small-muted" style={{ marginTop: 18 }}>
          Alle Preise inkl. gesetzlicher MwSt. Zahlungsabwicklung erfolgt sicher über unseren
          Zahlungsanbieter — wir speichern keine Kartendaten.
        </p>
      </div>
      <MarketingFooter />
    </>
  );
}
