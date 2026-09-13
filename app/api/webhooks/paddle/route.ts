import { paddle, planForPriceId } from '@/lib/paddle';
import {
  upsertSubscriptionFromPaddle,
  markSubscriptionExpired,
} from '@/lib/progress';

export async function POST(req: Request) {
  const rawBody = await req.text();
  const signature = req.headers.get('paddle-signature') ?? '';

  let event;
  try {
    event = await paddle.webhooks.unmarshal(
      rawBody,
      process.env.PAYMENT_WEBHOOK_SECRET!,
      signature
    );
  } catch (err) {
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
        console.log('Subscription upserted successfully for user', userId);
        break;
      }

      case 'subscription.canceled': {
        const sub = event.data;
        const userId = sub.customData?.userId as string | undefined;
        if (userId) await markSubscriptionExpired(userId);
        break;
      }

      case 'transaction.completed': {
        console.log('Paddle transaction completed', event.data.id);
        break;
      }

      case 'transaction.payment_failed': {
        console.warn('Paddle payment failed', event.data.id);
        break;
      }

      default:
        break;
    }
  } catch (err) {
    console.error('Error processing Paddle webhook', err);
    return new Response('Webhook handler error', { status: 500 });
  }

  return new Response('OK', { status: 200 });
}