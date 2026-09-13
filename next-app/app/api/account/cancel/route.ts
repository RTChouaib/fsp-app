import { paddle } from '@/lib/paddle';
import { getCurrentUserId } from '@/lib/session';
import { getSubscription, markSubscriptionCancelPending } from '@/lib/progress';

export async function POST() {
  const userId = await getCurrentUserId();
  if (!userId) return new Response('Unauthorized', { status: 401 });

  const subscription = await getSubscription(userId);
  if (!subscription?.paddleSubscriptionId) {
    return new Response('No active subscription', { status: 400 });
  }

  // effectiveFrom: 'next_billing_period' — access continues until the period
  // the user already paid for ends. No retention offers, no forced survey,
  // matching the brief's "no dark patterns" cancellation requirement.
  await paddle.subscriptions.cancel(subscription.paddleSubscriptionId, {
    effectiveFrom: 'next_billing_period',
  });

  // Reflect it immediately in the UI ("Dein Zugriff endet am ...") — the
  // webhook will later confirm the actual status change when the period ends.
  await markSubscriptionCancelPending(userId);

  return Response.json({ ok: true, currentPeriodEnd: subscription.currentPeriodEnd });
}
