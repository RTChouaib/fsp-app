'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { logout } from '@/lib/actions';

export function AccountActions({ isActive }: { isActive: boolean }) {
  const router = useRouter();
  const [cancelling, setCancelling] = useState(false);

  async function handleCancel() {
    if (!confirm('Abo wirklich kündigen? Der Zugriff bleibt bis zum Ende der aktuellen Periode bestehen.')) {
      return;
    }
    setCancelling(true);
    await fetch('/api/account/cancel', { method: 'POST' });
    setCancelling(false);
    router.refresh();
  }

  async function handleLogout() {
    await logout();
    router.push('/');
  }

  return (
    <>
      {isActive ? (
        <button className="btn btn-danger-outline btn-block" onClick={handleCancel} disabled={cancelling}>
          {cancelling ? 'Wird gekündigt…' : 'Abo kündigen'}
        </button>
      ) : (
        <Link href="/pricing" className="btn btn-blue btn-block">
          Abo abschließen
        </Link>
      )}
      <button className="btn btn-outline btn-block" style={{ marginTop: 10 }} onClick={handleLogout}>
        Abmelden
      </button>
    </>
  );
}
