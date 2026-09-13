import type { Term } from '@/data/terms';

export function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

export function randomTerms(terms: Term[], n: number, excludeIds: string[] = []): Term[] {
  const pool = terms.filter((t) => !excludeIds.includes(t.id));
  return shuffle(pool).slice(0, n);
}

export type QuestionMode = 'medToPatient' | 'patToMed' | 'context';

export interface Question {
  termId: string;
  mode: QuestionMode;
  prompt: string;
  kicker: string;
  options: string[];
  correct: string;
}

export function buildQuestion(term: Term, mode: QuestionMode, allTerms: Term[]): Question {
  if (mode === 'medToPatient') {
    const correct = term.patientTerms[0];
    const distractors = shuffle(allTerms.filter((t) => t.id !== term.id))
      .slice(0, 3)
      .map((t) => t.patientTerms[0]);
    return {
      termId: term.id,
      mode,
      prompt: term.medicalTerm,
      kicker: 'Fachbegriff → Patientensprache',
      options: shuffle([correct, ...distractors]),
      correct,
    };
  }

  if (mode === 'patToMed') {
    const correct = term.medicalTerm;
    const distractors = shuffle(allTerms.filter((t) => t.id !== term.id))
      .slice(0, 3)
      .map((t) => t.medicalTerm);
    return {
      termId: term.id,
      mode,
      prompt: term.patientTerms[0],
      kicker: 'Patientensprache → Fachbegriff',
      options: shuffle([correct, ...distractors]),
      correct,
    };
  }

  // context
  const correct = term.medicalTerm;
  const sameCategory = shuffle(
    allTerms.filter((t) => t.id !== term.id && t.category === term.category)
  )
    .slice(0, 3)
    .map((t) => t.medicalTerm);
  const distractors =
    sameCategory.length === 3
      ? sameCategory
      : shuffle(allTerms.filter((t) => t.id !== term.id))
          .slice(0, 3)
          .map((t) => t.medicalTerm);
  return {
    termId: term.id,
    mode,
    prompt: term.exampleDoctorQuestion,
    kicker: 'FSP-Situation — welcher Fachbegriff passt?',
    options: shuffle([correct, ...distractors]),
    correct,
  };
}
