import Link from 'next/link';
import { getCurrentUserId } from '@/lib/session';
import { getProgressMap } from '@/lib/progress';
import { TERMS } from '@/data/terms';

export default async function CategoryDetailPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category: rawCategory } = await params;
  const category = decodeURIComponent(rawCategory);
  const userId = (await getCurrentUserId())!;
  const progress = await getProgressMap(userId);
  const terms = TERMS.filter((t) => t.category === category);

  return (
    <div style={{ maxWidth: 640, margin: '0 auto' }}>
      <Link href="/categories" className="nav-link" style={{ marginBottom: 10, display: 'inline-block' }}>
        ← Alle Kategorien
      </Link>
      <h2>{category}</h2>
      {terms.map((t) => {
        const p = progress[t.id];
        const status = p ? (p.confidence >= 3 ? 'Gelernt' : 'In Arbeit') : 'Neu';
        return (
          <Link key={t.id} href={`/term/${t.id}`} className="term-row" style={{ display: 'block' }}>
            <div className="tr-main">{t.medicalTerm}</div>
            <div className="tr-sub">
              {t.patientTerms.join(' / ')} · <span className="badge">{status}</span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
