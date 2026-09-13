import Link from 'next/link';
import { getCurrentUserId } from '@/lib/session';
import { getProgressMap, getMistakeTermIds, getDueTermIds } from '@/lib/progress';
import { TERMS, CATEGORIES } from '@/data/terms';

export default async function DashboardPage() {
  const userId = (await getCurrentUserId())!; // layout guarantees this is set

  const [progress, mistakeIds, dueIds] = await Promise.all([
    getProgressMap(userId),
    getMistakeTermIds(userId),
    getDueTermIds(userId, TERMS.map((t) => t.id)),
  ]);

  const total = TERMS.length;
  const learned = Object.values(progress).filter((p) => p.confidence >= 3).length;
  const seen = Object.keys(progress).length;
  const correctSum = Object.values(progress).reduce((s, p) => s + p.correctCount, 0);
  const incorrectSum = Object.values(progress).reduce((s, p) => s + p.incorrectCount, 0);
  const accuracy =
    correctSum + incorrectSum > 0 ? Math.round((correctSum / (correctSum + incorrectSum)) * 100) : 0;

  return (
    <>
      <div className="app-header">
        <h2 style={{ margin: 0 }}>Deine heutige Einheit</h2>
      </div>
      <div className="stat-row">
        <div className="stat-card">
          <div className="stat-num">
            {learned}/{total}
          </div>
          <div className="stat-label">Gelernte Begriffe</div>
        </div>
        <div className="stat-card">
          <div className="stat-num">{accuracy}%</div>
          <div className="stat-label">Trefferquote</div>
        </div>
        <div className="stat-card">
          <div className="stat-num">{seen}</div>
          <div className="stat-label">Gesehene Begriffe</div>
        </div>
        <div className="stat-card">
          <div className="stat-num">{mistakeIds.length}</div>
          <div className="stat-label">Offene Fehler</div>
        </div>
      </div>
      <div
        className="card"
        style={{ margin: '18px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 14 }}
      >
        <div>
          <h3 style={{ margin: '0 0 4px', fontSize: 17 }}>Heute trainieren</h3>
          <p style={{ margin: 0, fontSize: 13.5 }}>
            10 Fragen · ca. 5–10 Minuten · {dueIds.length} Begriffe sind heute fällig.
          </p>
        </div>
        <Link href="/practice" className="btn btn-blue">
          Jetzt starten
        </Link>
      </div>
      <div className="grid-2">
        <div className="card-flat" style={{ padding: 18 }}>
          <h3 style={{ fontSize: 15, marginBottom: 6 }}>FSP Kurztest</h3>
          <p style={{ fontSize: 13.5, marginBottom: 12 }}>
            15 Fragen, gemischte Typen, mit Auswertung am Ende.
          </p>
          <Link href="/test" className="btn btn-outline btn-sm">
            Test starten
          </Link>
        </div>
        <div className="card-flat" style={{ padding: 18 }}>
          <h3 style={{ fontSize: 15, marginBottom: 6 }}>Meine Fehler</h3>
          <p style={{ fontSize: 13.5, marginBottom: 12 }}>
            {mistakeIds.length > 0
              ? `${mistakeIds.length} Begriffe, die du noch üben solltest.`
              : 'Aktuell keine offenen Fehler.'}
          </p>
          <Link href="/mistakes" className="btn btn-outline btn-sm">
            Fehler wiederholen
          </Link>
        </div>
      </div>
      <div style={{ marginTop: 26 }}>
        <h3 style={{ fontSize: 16 }}>Kategorien</h3>
        <div className="cat-grid">
          {CATEGORIES.map((c) => (
            <Link key={c} href={`/categories/${encodeURIComponent(c)}`} className="cat-pill">
              {c}
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
