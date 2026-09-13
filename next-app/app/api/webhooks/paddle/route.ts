import { paddle, planForPriceId } from '@/lib/paddle';
import {
  upsertSubscriptionFromPaddle,
  markSubscriptionExpired,
} from '@/lib/progress';

// Next.js App Router route handlers give you the raw body via req.text() —
// no special bodyParser config needed, unlike the old Pages Router.
export async function POST(req: Request) {
  const rawBody = await req.text();
  const signature = req.headers.get('paddle-signature') ?? '';

  let event;
  try {
    event = paddle.webhooks.unmarshal(
      rawBody,
      process.env.PAYMENT_WEBHOOK_SECRET!,
      signature
    );
  } catch (err) {
    // Invalid signature — reject outright. Never trust an unverified payload.
    console.error('Paddle webhook signature verification failed', err);
    return new Response('Invalid signature', { status: 400 });
  }

  try {
    switch (event.eventType) {
      case 'subscription.created':
      case 'subscription.updated': {
        const sub = event.data;
        const userId = sub.customData?.userId as string | undefined;
        if (!userId) {
          console.error('Paddle subscription event missing customData.userId', sub.id);
          break;
        }

        const priceId = sub.items?.[0]?.price?.id;
        const plan = priceId ? planForPriceId(priceId) : null;

        // Paddle subscription statuses: trialing | active | past_due | paused | canceled
        const status =
          sub.status === 'active' || sub.status === 'trialing' ? 'active' : 'expired';

        await upsertSubscriptionFromPaddle({
          userId,
          status,
          plan: plan ?? 'monthly',
          paddleCustomerId: sub.customerId,
          paddleSubscriptionId: sub.id,
          currentPeriodEnd: new Date(sub.currentBillingPeriod?.endsAt ?? Date.now()),
        });
        break;
      }

      case 'subscription.canceled': {
        const sub = event.data;
        const userId = sub.customData?.userId as string | undefined;
        if (userId) await markSubscriptionExpired(userId);
        break;
      }

      case 'transaction.completed': {
        // Fires for the first payment on checkout, ahead of subscription.created
        // in some cases. subscription.created/updated is the authoritative source
        // for access — this event is safe to log only, to avoid double-writes.
        console.log('Paddle transaction completed', event.data.id);
        break;
      }

      case 'transaction.payment_failed': {
        // Paddle's own dunning emails/retries handle follow-up automatically.
        // If the subscription ultimately fails, a subscription.updated event
        // with status "past_due" or "canceled" will arrive separately — that's
        // what actually changes access. Log here for your own visibility.
        console.warn('Paddle payment failed', event.data.id);
        break;
      }

      default:
        // Unhandled event types are fine to ignore — just don't 4xx/5xx them,
        // or Paddle will keep retrying.
        break;
    }
  } catch (err) {
    console.error('Error processing Paddle webhook', err);
    return new Response('Webhook handler error', { status: 500 });
  }

  return new Response('OK', { status: 200 });
}
