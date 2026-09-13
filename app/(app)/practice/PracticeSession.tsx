'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { recordAnswerAction } from '@/lib/actions';
import type { Term } from '@/data/terms';

export function PracticeSession({ initialQueue }: { initialQueue: Term[] }) {
  const [queue] = useState(initialQueue);
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);

  const term = queue[index];

  const judge = useCallback(
    async (correct: boolean) => {
      if (!term) return;
      await recordAnswerAction(term.id, correct);
      setIndex((i) => i + 1);
      setRevealed(false);
    },
    [term]
  );

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (!term) return;
      if (e.code === 'Space') {
        e.preventDefault();
        if (!revealed) setRevealed(true);
      }
      if (revealed) {
        if (e.key === '1') judge(false);
        if (e.key === '2') judge(true);
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [term, revealed, judge]);

  if (queue.length === 0) {
    return (
      <div className="empty-state">
        <div className="es-emoji">🎉</div>
        <h3>Alles erledigt!</h3>
        <p>Heute gibt es keine fälligen Wiederholungen.</p>
        <Link href="/dashboard" className="btn btn-outline">
          Zurück zum Start
        </Link>
      </div>
    );
  }

  if (!term) {
    return (
      <div style={{ textAlign: 'center', paddingTop: 40 }}>
        <div className="eyebrow">Einheit abgeschlossen</div>
        <h2>Gut gemacht.</h2>
        <Link href="/dashboard" className="btn btn-blue">
          Zurück zum Start
        </Link>
      </div>
    );
  }

  const pct = Math.round((index / queue.length) * 100);

  return (
    <div style={{ maxWidth: 640, margin: '0 auto' }}>
      <div className="progress-bar-track">
        <div className="progress-bar-fill" style={{ width: `${pct}%` }} />
      </div>
      <div className="flash-card">
        <div className="question-kicker">
          Begriff {index + 1}/{queue.length}
        </div>
        <div className="flash-term">{term.medicalTerm}</div>
        {!revealed ? (
          <>
            <div className="flash-hint">Leertaste zum Aufdecken · Klick auf „Antwort anzeigen&quot;</div>
            <button className="btn btn-outline" style={{ marginTop: 20 }} onClick={() => setRevealed(true)}>
              Antwort anzeigen
            </button>
          </>
        ) : (
          <>
            <div className="flash-answer">
              <div className="a-label">Patientensprache</div>
              <div className="a-val">{term.patientTerms.join(' / ')}</div>
              <div className="a-label">Beispiel — Patientenfrage</div>
              <div className="a-val">„{term.exampleDoctorQuestion}&quot;</div>
              <div className="a-label">Arztbrief</div>
              <div className="a-val">{term.exampleArztbriefSentence}</div>
              <div className="a-label">Erklärung</div>
              <div className="a-val">{term.explanation}</div>
            </div>
            <div className="judge-row">
              <button className="judge-btn judge-wrong" onClick={() => judge(false)}>
                ✗ Nicht gewusst <span className="small-muted">(1)</span>
              </button>
              <button className="judge-btn judge-right" onClick={() => judge(true)}>
                ✓ Gewusst <span className="small-muted">(2)</span>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
