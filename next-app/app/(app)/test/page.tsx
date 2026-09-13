import { TERMS } from '@/data/terms';
import { buildQuestion, randomTerms, type QuestionMode } from '@/lib/quiz';
import { TestSession } from './TestSession';

export default function TestPage() {
  const terms = randomTerms(TERMS, 15);
  const modes: QuestionMode[] = ['medToPatient', 'patToMed', 'context'];
  const questions = terms.map((t, i) => buildQuestion(t, modes[i % 3], TERMS));

  return <TestSession questions={questions} />;
}
