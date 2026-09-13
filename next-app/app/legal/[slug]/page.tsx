import { notFound } from 'next/navigation';
import { MarketingTopBar } from '@/components/MarketingTopBar';
import { MarketingFooter } from '@/components/MarketingFooter';

const CONTENT: Record<string, { title: string; paragraphs: string[] }> = {
  impressum: {
    title: 'Impressum',
    paragraphs: [
      'Angaben gemäß § 5 TMG',
      '[Name / Firmenbezeichnung] · [Straße, Hausnummer] · [PLZ, Ort] · [Land]',
      'Vertreten durch: [Name der vertretungsberechtigten Person]',
      'Kontakt: [Telefonnummer] · E-Mail: [E-Mail-Adresse]',
      'Umsatzsteuer-ID: [USt-IdNr. gemäß § 27a UStG, falls vorhanden]',
      'Registereintrag: [Registergericht, Registernummer, falls zutreffend]',
      'Platzhalter — bitte durch die tatsächlichen rechtlichen Angaben des Betreibers ersetzen.',
    ],
  },
  datenschutz: {
    title: 'Datenschutzerklärung',
    paragraphs: [
      'Diese App verarbeitet personenbezogene Daten (E-Mail-Adresse, Lernfortschritt) ausschließlich zur Bereitstellung des Dienstes.',
      'Zahlungsdaten werden nicht von uns, sondern ausschließlich von unserem Zahlungsanbieter (Paddle.com Market Limited, als Merchant of Record) verarbeitet.',
      'Platzhalter — vollständige Datenschutzerklärung gemäß DSGVO durch den Betreiber ergänzen: Verantwortlicher, Rechtsgrundlagen, Speicherdauer, Empfänger, Betroffenenrechte, Kontakt des Datenschutzbeauftragten falls vorhanden.',
    ],
  },
  agb: {
    title: 'Allgemeine Geschäftsbedingungen',
    paragraphs: [
      'Platzhalter — AGB durch den Betreiber ergänzen, u. a. Vertragsgegenstand, Preise, Zahlungsbedingungen, Laufzeit und Kündigung, Widerrufsrecht für Verbraucher, Haftung.',
      'Zahlungen werden über Paddle.com Market Limited als Merchant of Record abgewickelt; Rechnungen werden von Paddle ausgestellt.',
      'Hinweis: Dieses Angebot dient der sprachlichen Vorbereitung auf die Fachsprachprüfung und ist kein amtliches Prüfungs- oder medizinisches Produkt.',
    ],
  },
};

export function generateStaticParams() {
  return Object.keys(CONTENT).map((slug) => ({ slug }));
}

export default async function LegalPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const entry = CONTENT[slug];
  if (!entry) notFound();

  return (
    <>
      <MarketingTopBar />
      <div className="wrap narrow" style={{ paddingTop: 36 }}>
        <h2>{entry.title}</h2>
        {entry.paragraphs.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>
      <MarketingFooter />
    </>
  );
}
