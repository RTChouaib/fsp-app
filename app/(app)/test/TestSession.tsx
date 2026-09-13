'use client';

import { useState } from 'react';
import Link from 'next/link';
import { recordAnswerAction, saveTestResultAction } from '@/lib/actions';
import { termById } from '@/data/terms';
import type { Question } from '@/lib/quiz';

export function TestSession({ questions }: { questions: Question[] }) {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<{ termId: string; correct: boolean }[]>([]);
  const [chosen, setChosen] = useState<string | null>(null);
  const [result, setResult] = useState<{ score: number; total: number; weakCategories: string[] } | null>(
    null
  );

  const q = questions[index];

  async function choose(opt: string) {
    if (chosen) return;
    setChosen(opt);
    const isCorrect = opt === q.correct;
    const nextAnswers = [...answers, { termId: q.termId, correct: isCorrect }];
    setAnswers(nextAnswers);
    await recordAnswerAction(q.termId, isCorrect);

    setTimeout(async () => {
      if (index + 1 >= questions.length) {
        const catCounts: Record<string, number> = {};
        nextAnswers.forEach((a) => {
          if (!a.correct) {
            const term = termById(a.termId);
            if (term) catCounts[term.category] = (catCounts[term.category] || 0) + 1;
          }
        });
        const weak = Object.entries(catCounts)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 3)
          .map((e) => e[0]);
        const finalScore = nextAnswers.filter((a) => a.correct).length;

        await saveTestResultAction({
          score: finalScore,
          total: questions.length,
          weakCategories: weak,
          wrongTermIds: nextAnswers.filter((a) => !a.correct).map((a) => a.termId),
        });

        setResult({ score: finalScore, total: questions.length, weakCategories: weak });
      } else {
        setIndex((i) => i + 1);
        setChosen(null);
      }
    }, 700);
  }

  if (result) {
    return (
      <div style={{ maxWidth: 640, margin: '0 auto', textAlign: 'center', paddingTop: 20 }}>
        <div className="eyebrow">FSP Kurztest — Ergebnis</div>
        <h2>
          {result.score}/{result.total} richtig
        </h2>
        <div className="card" style={{ textAlign: 'left', margin: '20px 0' }}>
          <h3 style={{ fontSize: 15 }}>Schwachstellen</h3>
          {result.weakCategories.length ? (
            <p style={{ fontSize: 13.5 }}>{result.weakCategories.join(', ')}</p>
          ) : (
            <p style={{ fontSize: 13.5 }}>Keine besonderen Schwachstellen in diesem Test.</p>
          )}
        </div>
        <Link href="/mistakes" className="btn btn-blue btn-block">
          Fehler wiederholen
        </Link>
        <Link href="/dashboard" className="btn btn-outline btn-block" style={{ marginTop: 10 }}>
          Zurück zum Start
        </Link>
      </div>
    );
  }

  const pct = Math.round((index / questions.length) * 100);

  return (
    <div style={{ maxWidth: 640, margin: '0 auto' }}>
      <div className="progress-bar-track">
        <div className="progress-bar-fill" style={{ width: `${pct}%` }} />
      </div>
      <div className="question-card">
        <div className="question-kicker">
          {q.kicker} · Frage {index + 1}/{questions.length}
        </div>
        <div className="question-term">{q.prompt}</div>
        <div className="question-sub">Wähle die passende Übersetzung</div>
        <div className="options">
          {q.options.map((o) => {
            let cls = 'option-btn';
            if (chosen) {
              if (o === q.correct) cls += ' correct';
              else if (o === chosen) cls += ' wrong';
            }
            return (
              <button key={o} className={cls} disabled={!!chosen} onClick={() => choose(o)}>
                {o}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
