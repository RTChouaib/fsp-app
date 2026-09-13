import { termById } from '@/data/terms';

export default async function TermDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const t = termById(id);

  if (!t) return <div style={{ paddingTop: 60 }}>Begriff nicht gefunden.</div>;

  return (
    <div style={{ maxWidth: 640, margin: '0 auto' }}>
      <div className="badge badge-cat">
        {t.category}
        {t.subcategory ? ` · ${t.subcategory}` : ''}
      </div>
      <h2 style={{ marginTop: 10 }}>
        {t.medicalTerm} <span className="small-muted">({t.article})</span>
      </h2>
      <p>
        <strong>Patientensprache:</strong> {t.patientTerms.join(' / ')}
      </p>
      <p>
        <strong>Englisch:</strong> {t.englishMeaning}
      </p>
      <div className="card" style={{ margin: '16px 0' }}>
        <div className="a-label" style={{ fontSize: 11, textTransform: 'uppercase', color: 'var(--muted)' }}>
          Patientensatz
        </div>
        <p style={{ margin: '4px 0 12px' }}>„{t.examplePatientSentence}&quot;</p>
        <div className="a-label" style={{ fontSize: 11, textTransform: 'uppercase', color: 'var(--muted)' }}>
          Ärztliche Frage
        </div>
        <p style={{ margin: '4px 0 12px' }}>„{t.exampleDoctorQuestion}&quot;</p>
        <div className="a-label" style={{ fontSize: 11, textTransform: 'uppercase', color: 'var(--muted)' }}>
          Arztbrief
        </div>
        <p style={{ margin: '4px 0 12px' }}>{t.exampleArztbriefSentence}</p>
        <div className="a-label" style={{ fontSize: 11, textTransform: 'uppercase', color: 'var(--muted)' }}>
          Erklärung
        </div>
        <p style={{ margin: '4px 0 0' }}>{t.explanation}</p>
      </div>
      {t.commonMistakes.length > 0 && (
        <div
          className="locked-banner"
          style={{ background: 'var(--clay-tint)', borderColor: 'var(--clay)', color: 'var(--clay)' }}
        >
          <strong>Typischer Fehler:</strong> {t.commonMistakes.join(' ')}
        </div>
      )}
    </div>
  );
}
