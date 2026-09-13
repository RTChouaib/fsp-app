import Link from 'next/link';
import { TERMS, CATEGORIES, termById } from '@/data/terms';
import { MarketingTopBar } from '@/components/MarketingTopBar';
import { MarketingFooter } from '@/components/MarketingFooter';
import { PricingCards } from '@/components/PricingCards';

function Faq() {
  const items: [string, string][] = [
    ['Was ist die FSP?', 'Die Fachsprachprüfung (FSP) ist eine Prüfung für internationale Ärztinnen und Ärzte, in der die medizinische Fachsprache und die Kommunikation mit Patient:innen auf Deutsch nachgewiesen werden muss.'],
    ['Für wen ist die App?', 'Für internationale Mediziner:innen, die sich gezielt auf die FSP vorbereiten — nicht für allgemeines Deutschlernen.'],
    ['Brauche ich Deutsch auf B2-Niveau?', 'Ja, ein Sprachniveau von etwa B2 wird empfohlen, da die Inhalte medizinisches Fachvokabular voraussetzen.'],
    ['Kann ich jederzeit kündigen?', 'Ja. Die Kündigung ist jederzeit im Konto-Bereich mit einem Klick möglich, ohne Rückfragen oder Fristen.'],
    ['Was bekomme ich mit dem Abo?', 'Zugriff auf alle Begriffe, unbegrenztes Training, alle Lernmodi, Tests, Fehlertraining und deinen vollständigen Fortschritt.'],
    ['Gibt es eine kostenlose Probe?', 'Ja, du kannst 5 Fragen kostenlos und ohne Registrierung ausprobieren.'],
  ];
  return (
    <>
      {items.map(([q, a]) => (
        <details className="faq-item" key={q}>
          <summary>{q}</summary>
          <p>{a}</p>
        </details>
      ))}
    </>
  );
}

export default function LandingPage() {
  const t = termById('t001')!;

  return (
    <>
      <MarketingTopBar />

      <div className="wrap hero">
        <div className="hero-grid">
          <div>
            <div className="eyebrow">Für internationale Ärztinnen und Ärzte</div>
            <h1>
              Medizinisches Deutsch für die <em>Fachsprachprüfung.</em>
            </h1>
            <p className="lead">
              Trainiere Fachbegriffe, Patientensprache und klinische Formulierungen mit
              realistischen FSP-Aufgaben.
            </p>
            <div className="hero-cta">
              <Link href="/demo" className="btn btn-blue">Kostenlos ausprobieren</Link>
              <Link href="/pricing" className="arrow-link">
                Preise ansehen <span className="arr">↗</span>
              </Link>
            </div>
            <div className="coords">
              B2–C1 · {TERMS.length} BEGRIFFE · {CATEGORIES.length} FACHGEBIETE
            </div>
          </div>
          <div className="transform-card">
            <div className="transform-row">
              <div className="t-label">Fachbegriff</div>
              <div className="t-value term">{t.medicalTerm}</div>
            </div>
            <div className="transform-row">
              <div className="t-label">Patientensprache</div>
              <div className="t-value">{t.patientTerms.join(' / ')}</div>
            </div>
            <div className="transform-row">
              <div className="t-label">Patientenfrage</div>
              <div className="t-value quote">„{t.exampleDoctorQuestion}&quot;</div>
            </div>
            <div className="transform-row">
              <div className="t-label">Arztbrief</div>
              <div className="t-value quote">{t.exampleArztbriefSentence}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="section" id="how">
        <div className="wrap">
          <div className="section-head">
            <div className="section-num">01 / DAS PROBLEM</div>
            <h2>
              Du kennst die Medizin — aber findest im Gespräch nicht immer die{' '}
              <em>richtigen</em> deutschen Worte?
            </h2>
            <p>
              Die FSP prüft nicht dein Fachwissen, sondern deine Kommunikation. Genau dafür
              ist dieses Training gemacht.
            </p>
          </div>
          <div className="grid-3">
            <div className="feature-card">
              <h3>Fachbegriff → Patientensprache</h3>
              <p>
                Übersetze medizinische Termini spontan in verständliche Alltagssprache —
                genau wie im Patientengespräch gefordert.
              </p>
            </div>
            <div className="feature-card">
              <h3>Patientensprache → Fachbegriff</h3>
              <p>Erkenne, welcher Fachbegriff hinter dem beschreibt, was Patient:innen dir erzählen.</p>
            </div>
            <div className="feature-card">
              <h3>FSP-Situationen & Arztbrief</h3>
              <p>
                Übe realistische Prüfungsszenarien: von der Anamnese bis zur schriftlichen
                Arztbrief-Formulierung.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="section">
        <div className="wrap">
          <div className="section-head">
            <div className="section-num">02 / DIE LÖSUNG</div>
            <h2>
              Nicht noch eine <em>Vokabel-App.</em>
            </h2>
            <p>
              Generisches Deutschlernen bringt dich nicht durch die FSP. Diese Plattform
              trainiert ausschließlich das, was in der Prüfung zählt: die Brücke zwischen
              Fachsprache und Patientenkommunikation, mit spaced repetition und gezieltem
              Fehlertraining.
            </p>
          </div>
          <div className="grid-2">
            <div className="feature-card">
              <h3>Gezielte Wiederholung</h3>
              <p>
                Ein einfacher Spaced-Repetition-Algorithmus zeigt dir Begriffe genau dann,
                wenn du sie sonst vergessen würdest.
              </p>
            </div>
            <div className="feature-card">
              <h3>Fehlertraining</h3>
              <p>
                Jeder falsch beantwortete Begriff landet automatisch in „Meine Fehler&quot; —
                bis du ihn sicher beherrschst.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="section">
        <div className="wrap">
          <div className="section-head">
            <div className="section-num">03 / KATEGORIEN</div>
            <h2>
              Nach Fachgebiet <em>geordnet.</em>
            </h2>
            <p>Über {TERMS.length} FSP-relevante Begriffe, strukturiert nach klinischen Fachgebieten.</p>
          </div>
          <div className="cat-grid">
            {CATEGORIES.map((c) => (
              <div className="cat-pill" key={c}>{c}</div>
            ))}
          </div>
        </div>
      </div>

      <div className="section">
        <div className="wrap">
          <div className="section-head">
            <div className="section-num">04 / FORTSCHRITT</div>
            <h2>
              Dein Fortschritt <em>im Blick.</em>
            </h2>
            <p>
              Gelernte Begriffe, Trefferquote, Streak und Schwachstellen je Kategorie — alles
              an einem Ort.
            </p>
          </div>
        </div>
      </div>

      <div className="section" id="pricing-preview">
        <div className="wrap">
          <div className="section-head">
            <div className="section-num">05 / PREISE</div>
            <h2>
              Wähle deinen <em>Zeitrahmen.</em>
            </h2>
            <p>Flexibel für kurze, intensive Vorbereitung oder über mehrere Wochen.</p>
          </div>
          <PricingCards />
        </div>
      </div>

      <div className="section">
        <div className="wrap narrow">
          <div className="section-head">
            <div className="section-num">06 / FAQ</div>
            <h2>Häufige Fragen</h2>
          </div>
          <Faq />
        </div>
      </div>

      <div className="section">
        <div className="wrap narrow" style={{ textAlign: 'center' }}>
          <div className="section-num">07 / LOS GEHT&apos;S</div>
          <h2>
            FSP-Training <em>starten.</em>
          </h2>
          <Link href="/demo" className="btn btn-blue">Kostenlos ausprobieren</Link>
        </div>
      </div>

      <MarketingFooter />
    </>
  );
}
