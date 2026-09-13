import { getCurrentUserId } from '@/lib/session';
import { getDueTermIds, getMistakeTermIds } from '@/lib/progress';
import { TERMS, termById, type Term } from '@/data/terms';
import { PracticeSession } from './PracticeSession';

export default async function PracticePage({
  searchParams,
}: {
  searchParams: Promise<{ mode?: string }>;
}) {
  const { mode } = await searchParams;
  const userId = (await getCurrentUserId())!;

  const ids =
    mode === 'mistakes'
      ? await getMistakeTermIds(userId)
      : (await getDueTermIds(userId, TERMS.map((t) => t.id))).slice(0, 10);

  const queue = ids.map((id) => termById(id)).filter((t): t is Term => !!t);

  return <PracticeSession initialQueue={queue} />;
}
