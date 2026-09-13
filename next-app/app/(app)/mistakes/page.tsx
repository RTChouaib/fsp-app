import Link from 'next/link';
import { getCurrentUserId } from '@/lib/session';
import { getMistakeTermIds } from '@/lib/progress';
import { termById, type Term } from '@/data/terms';

export default async function MistakesPage() {
  const userId = (await getCurrentUserId())!;
  const ids = await getMistakeTermIds(userId);

  if (ids.length === 0) {
    return (
      <div className="empty-state">
        <div className="es-emoji">🎉</div>
        <h3>Noch keine Fehler.</h3>
        <p>Starte eine Trainingseinheit und deine schwierigen Begriffe erscheinen hier automatisch.</p>
        <Link href="/practice" className="btn btn-outline">
          Training starten
        </Link>
      </div>
    );
  }

  const terms = ids.map((id) => termById(id)).filter((t): t is Term => !!t);

  return (
    <div style={{ maxWidth: 640, margin: '0 auto' }}>
      <h2>Meine Fehler</h2>
      <p className="small-muted">{terms.length} Begriffe, die du noch üben solltest.</p>
      <Link href="/practice?mode=mistakes" className="btn btn-blue btn-block" style={{ marginBottom: 20 }}>
        Fehler wiederholen
      </Link>
      {terms.map((t) => (
        <Link key={t.id} href={`/term/${t.id}`} className="term-row" style={{ display: 'block' }}>
          <div className="tr-main">{t.medicalTerm}</div>
          <div className="tr-sub">{t.patientTerms.join(' / ')}</div>
        </Link>
      ))}
    </div>
  );
}
