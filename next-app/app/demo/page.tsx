import { TERMS, termById } from '@/data/terms';
import { buildQuestion } from '@/lib/quiz';
import { MarketingTopBar } from '@/components/MarketingTopBar';
import { MarketingFooter } from '@/components/MarketingFooter';
import { DemoQuiz } from './DemoQuiz';

const DEMO_TERM_IDS = ['t001', 't012', 't021', 't031', 't044'];

export default function DemoPage() {
  const questions = DEMO_TERM_IDS.map((id) => buildQuestion(termById(id)!, 'medToPatient', TERMS));

  return (
    <>
      <MarketingTopBar />
      <div className="wrap narrow" style={{ paddingTop: 36 }}>
        <DemoQuiz questions={questions} />
      </div>
      <MarketingFooter />
    </>
  );
}
