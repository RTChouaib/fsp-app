import Link from 'next/link';
import { TERMS, CATEGORIES } from '@/data/terms';

export default function CategoriesPage() {
  return (
    <div style={{ maxWidth: 640, margin: '0 auto' }}>
      <h2>Kategorien</h2>
      <div className="cat-grid">
        {CATEGORIES.map((c) => {
          const count = TERMS.filter((t) => t.category === c).length;
          return (
            <Link key={c} href={`/categories/${encodeURIComponent(c)}`} className="cat-pill">
              {c}
              <div className="small-muted">{count} Begriffe</div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
