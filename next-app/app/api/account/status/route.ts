import { getCurrentUserId } from '@/lib/session';
import { getSubscription } from '@/lib/progress';

export async function GET() {
  const userId = await getCurrentUserId();
  if (!userId) return Response.json({ status: 'free' });
  const sub = await getSubscription(userId);
  return Response.json({ status: sub?.status ?? 'free' });
}
