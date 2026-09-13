import { db } from './db';

/* ============================================================
   USERS
   ============================================================ */

export async function getOrCreateUser(email: string) {
  return db.user.upsert({
    where: { email },
    update: {},
    create: { email },
  });
}

/* ============================================================
   ACCESS CONTROL — mirrors the prototype's guardOrRedirect()
   ============================================================ */

export type AccessLevel = 'free' | 'trial' | 'active' | 'expired';

export function canAccess(
  subscription: { status?: string | null } | null,
  feature: 'demo' | 'full'
): boolean {
  if (feature === 'demo') return true; // everyone gets the 5-question preview
  if (!subscription) return false;
  const status = subscription.status as AccessLevel | undefined;
  return status === 'active' || status === 'trial';
}

export async function getSubscription(userId: string) {
  return db.subscription.findUnique({ where: { userId } });
}

/* ============================================================
   PADDLE WEBHOOK WRITES — the ONLY place subscription status changes.
   Never call these from a client-facing route; only from the
   signature-verified webhook handler (see PRODUCTION-GUIDE.md §5).
   ============================================================ */

export async function upsertSubscriptionFromPaddle(data: {
  userId: string;
  status: AccessLevel;
  plan: 'weekly' | 'monthly' | 'quarterly';
  paddleCustomerId: string;
  paddleSubscriptionId: string;
  currentPeriodEnd: Date;
}) {
  return db.subscription.upsert({
    where: { userId: data.userId },
    update: {
      status: data.status,
      plan: data.plan,
      paddleCustomerId: data.paddleCustomerId,
      paddleSubscriptionId: data.paddleSubscriptionId,
      currentPeriodEnd: data.currentPeriodEnd,
      cancelAtPeriodEnd: false,
    },
    create: {
      userId: data.userId,
      status: data.status,
      plan: data.plan,
      paddleCustomerId: data.paddleCustomerId,
      paddleSubscriptionId: data.paddleSubscriptionId,
      currentPeriodEnd: data.currentPeriodEnd,
    },
  });
}

export async function markSubscriptionCancelPending(userId: string) {
  return db.subscription.update({
    where: { userId },
    data: { cancelAtPeriodEnd: true },
  });
}

export async function markSubscriptionExpired(userId: string) {
  return db.subscription.update({
    where: { userId },
    data: { status: 'expired', cancelAtPeriodEnd: false },
  });
}

/* ============================================================
   TERM PROGRESS + SPACED REPETITION
   Same algorithm as the prototype's recordAnswer(): confidence
   0-5, interval schedule [0,1,3,7,14,30] days, mistakes tracked
   on every wrong answer and cleared on the next correct one.
   ============================================================ */

const INTERVAL_DAYS = [0, 1, 3, 7, 14, 30];

function addDays(base: Date, days: number): Date {
  const d = new Date(base);
  d.setDate(d.getDate() + days);
  return d;
}

export async function getProgressMap(userId: string) {
  const rows = await db.termProgress.findMany({ where: { userId } });
  const map: Record<string, (typeof rows)[number]> = {};
  for (const row of rows) map[row.termId] = row;
  return map;
}

export async function recordAnswer(userId: string, termId: string, correct: boolean) {
  const existing = await db.termProgress.findUnique({
    where: { userId_termId: { userId, termId } },
  });

  const confidence = existing?.confidence ?? 2;
  const nextConfidence = correct
    ? Math.min(5, confidence + 1)
    : Math.max(0, confidence - 1);
  const nextReview = correct
    ? addDays(new Date(), INTERVAL_DAYS[nextConfidence] ?? 30)
    : addDays(new Date(), 1);

  await db.termProgress.upsert({
    where: { userId_termId: { userId, termId } },
    update: {
      timesSeen: { increment: 1 },
      correctCount: { increment: correct ? 1 : 0 },
      incorrectCount: { increment: correct ? 0 : 1 },
      streak: correct ? { increment: 1 } : 0,
      confidence: nextConfidence,
      lastReviewed: new Date(),
      nextReview,
    },
    create: {
      userId,
      termId,
      timesSeen: 1,
      correctCount: correct ? 1 : 0,
      incorrectCount: correct ? 0 : 1,
      streak: correct ? 1 : 0,
      confidence: nextConfidence,
      lastReviewed: new Date(),
      nextReview,
    },
  });

  if (correct) {
    // a correct answer clears any existing mistake entry for this term
    await db.mistake.deleteMany({ where: { userId, termId } });
  } else {
    await db.mistake.upsert({
      where: { userId_termId: { userId, termId } },
      update: {},
      create: { userId, termId },
    });
  }
}

/**
 * Returns the due term IDs from a given list of all term IDs (the static
 * terms.ts catalog), ordered by priority: worst accuracy first, then terms
 * never seen before. Mirrors the prototype's dueTerms().
 */
export async function getDueTermIds(userId: string, allTermIds: string[]): Promise<string[]> {
  const progress = await getProgressMap(userId);
  const today = new Date();

  const due = allTermIds.filter((id) => {
    const p = progress[id];
    if (!p) return true; // never seen
    return !p.nextReview || p.nextReview <= today;
  });

  return due.sort((a, b) => {
    const pa = progress[a];
    const pb = progress[b];
    const wa = pa ? pa.incorrectCount - pa.correctCount : 0;
    const wb = pb ? pb.incorrectCount - pb.correctCount : 0;
    return wb - wa;
  });
}

/* ============================================================
   MISTAKES
   ============================================================ */

export async function getMistakeTermIds(userId: string): Promise<string[]> {
  const rows = await db.mistake.findMany({ where: { userId }, select: { termId: true } });
  return rows.map((r) => r.termId);
}

/* ============================================================
   TEST RESULTS
   ============================================================ */

export async function saveTestResult(
  userId: string,
  result: { score: number; total: number; weakCategories: string[]; wrongTermIds: string[] }
) {
  return db.testResult.create({
    data: {
      userId,
      score: result.score,
      total: result.total,
      weakCategories: result.weakCategories,
      wrongTermIds: result.wrongTermIds,
    },
  });
}

export async function getTestResults(userId: string) {
  return db.testResult.findMany({ where: { userId }, orderBy: { date: 'desc' } });
}

/* ============================================================
   ACCOUNT DELETION — brief §35: users can delete their account
   ============================================================ */

export async function deleteAccount(userId: string) {
  // relations use onDelete: Cascade in schema.prisma, so this removes
  // Subscription, TermProgress, Mistake, and TestResult rows too.
  return db.user.delete({ where: { id: userId } });
}
