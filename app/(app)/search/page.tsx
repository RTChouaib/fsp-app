'use client';

import { useState } from 'react';
import Link from 'next/link';
import { TERMS } from '@/data/terms';

export default function SearchPage() {
  const [q, setQ] = useState('');
  const query = q.toLowerCase();
  const results =
    query.length > 0
      ? TERMS.filter(
          (t) =>
            t.medicalTerm.toLowerCase().includes(query) ||
            t.patientTerms.some((p) => p.toLowerCase().includes(query)) ||
            t.synonyms.some((s) => s.toLowerCase().includes(query)) ||
            t.englishMeaning.toLowerCase().includes(query)
        )
      : [];

  return (
    <div style={{ maxWidth: 640, margin: '0 auto' }}>
      <h2>Suche</h2>
      <input
        className="search-input"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Fachbegriff, Patientenbegriff oder Englisch…"
        autoFocus
      />
      <div style={{ marginTop: 18 }}>
        {query.length === 0 && <p className="small-muted">Tippe, um in {TERMS.length} Begriffen zu suchen.</p>}
        {query.length > 0 && results.length === 0 && (
          <div className="empty-state">
            <p>Kein Treffer für „{q}&quot;.</p>
          </div>
        )}
        {results.map((t) => (
          <Link key={t.id} href={`/term/${t.id}`} className="term-row" style={{ display: 'block' }}>
            <div className="tr-main">{t.medicalTerm}</div>
            <div className="tr-sub">
              {t.patientTerms.join(' / ')} · <span className="badge badge-cat">{t.category}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
