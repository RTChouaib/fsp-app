'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { Question } from '@/lib/quiz';

export function DemoQuiz({ questions }: { questions: Question[] }) {
  const [index, setIndex] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [chosen, setChosen] = useState<string | null>(null);
  const [done, setDone] = useState<{ correct: number; total: number } | null>(null);

  const q = questions[index];

  function choose(opt: string) {
    if (chosen) return;
    setChosen(opt);
    const isCorrect = opt === q.correct;
    const nextCorrect = correct + (isCorrect ? 1 : 0);
    if (isCorrect) setCorrect(nextCorrect);

    setTimeout(() => {
      if (index + 1 >= questions.length) {
        setDone({ correct: nextCorrect, total: questions.length });
      } else {
        setIndex((i) => i + 1);
        setChosen(null);
      }
    }, 700);
  }

  if (done) {
    return (
      <div style={{ textAlign: 'center', paddingTop: 20 }}>
        <div className="eyebrow">Probelektion abgeschlossen</div>
        <h2>
          {done.correct}/{done.total} richtig
        </h2>
        <p>
          {done.correct >= Math.ceil(done.total * 0.6)
            ? 'Du kennst bereits viele Begriffe — jetzt kannst du gezielt deine Schwachstellen trainieren.'
            : 'Ein guter Start — mit gezieltem Training verbesserst du dich schnell.'}
        </p>
        <div className="card" style={{ margin: '26px 0', textAlign: 'left' }}>
          <h3 style={{ fontSize: 16 }}>Über 60 FSP-relevante Begriffe warten auf dich</h3>
          <p style={{ margin: 0, fontSize: 14 }}>
            Alle Kategorien, unbegrenztes Training, Spaced Repetition, Fehlertraining, Tests und
            dein vollständiger Fortschritt.
          </p>
        </div>
        <Link href="/pricing" className="btn btn-blue btn-block">
          Vorbereitung starten
        </Link>
      </div>
    );
  }

  const pct = Math.round((index / questions.length) * 100);

  return (
    <div>
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
