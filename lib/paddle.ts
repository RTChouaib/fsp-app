import { Paddle, Environment } from '@paddle/paddle-node-sdk';

// Sandbox vs live is determined by which API key you set — no separate flag needed.
// Use PADDLE_ENV=sandbox in .env.local while testing, PADDLE_ENV=production once live.
export const paddle = new Paddle(process.env.PAYMENT_PROVIDER_KEY!, {
  environment:
    process.env.PADDLE_ENV === 'production' ? Environment.production : Environment.sandbox,
});

export type Plan = 'weekly' | 'monthly' | 'quarterly';

const PLAN_TO_PRICE_ID: Record<Plan, string> = {
  weekly: process.env.PRICE_WEEKLY!,
  monthly: process.env.PRICE_MONTHLY!,
  quarterly: process.env.PRICE_QUARTERLY!,
};

const PRICE_ID_TO_PLAN: Record<string, Plan> = Object.fromEntries(
  Object.entries(PLAN_TO_PRICE_ID).map(([plan, priceId]) => [priceId, plan as Plan])
);

export function priceIdForPlan(plan: Plan): string {
  const id = PLAN_TO_PRICE_ID[plan];
  if (!id) throw new Error(`No Paddle price configured for plan "${plan}"`);
  return id;
}

export function planForPriceId(priceId: string): Plan | null {
  return PRICE_ID_TO_PLAN[priceId] ?? null;
}
