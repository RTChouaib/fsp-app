import { getCurrentUserId } from '@/lib/session';
import { getSubscription } from '@/lib/progress';
import { db } from '@/lib/db';
import { AccountActions } from './AccountActions';

const PLAN_LABEL: Record<string, string> = {
  weekly: 'Wöchentlich',
  monthly: 'Monatlich',
  quarterly: '3 Monate',
};

export default async function AccountPage() {
  const userId = (await getCurrentUserId())!;
  const [user, subscription] = await Promise.all([
    db.user.findUnique({ where: { id: userId } }),
    getSubscription(userId),
  ]);

  const isActive = subscription?.status === 'active';

  return (
    <div style={{ maxWidth: 640, margin: '0 auto' }}>
      <h2>Konto</h2>
      <div className="card" style={{ marginBottom: 16 }}>
        <p style={{ margin: '0 0 4px' }}>
          <strong>E-Mail</strong>
        </p>
        <p style={{ margin: '0 0 14px' }}>{user?.email}</p>
        <p style={{ margin: '0 0 4px' }}>
          <strong>Abo</strong>
        </p>
        <p style={{ margin: 0 }}>
          {isActive
            ? `${PLAN_LABEL[subscription?.plan ?? ''] ?? subscription?.plan} — aktiv${
                subscription?.cancelAtPeriodEnd ? ' (Kündigung zum Periodenende)' : ''
              }`
            : 'Kein aktives Abo'}
        </p>
      </div>
      <AccountActions isActive={isActive} />
    </div>
  );
}
