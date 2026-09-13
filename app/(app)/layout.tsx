import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getCurrentUserId } from '@/lib/session';
import { getSubscription, canAccess } from '@/lib/progress';

const TABS = [
  { href: '/dashboard', icon: '⌂', label: 'Start' },
  { href: '/practice', icon: '◐', label: 'Üben' },
  { href: '/test', icon: '▤', label: 'Test' },
  { href: '/mistakes', icon: '✕', label: 'Fehler' },
  { href: '/search', icon: '⌕', label: 'Suche' },
];

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const userId = await getCurrentUserId();
  if (!userId) redirect('/login');

  const subscription = await getSubscription(userId);
  if (!canAccess(subscription, 'full')) redirect('/pricing?reason=paid');

  return (
    <>
      <div className="topbar">
        <div className="topbar-inner">
          <Link href="/dashboard" className="logo">
            <span className="dot"></span>FSP Terminology
          </Link>
          <div className="nav-links">
            <Link href="/dashboard" className="nav-link">START</Link>
            <Link href="/practice" className="nav-link">ÜBEN</Link>
            <Link href="/test" className="nav-link">TEST</Link>
            <Link href="/account" className="nav-link">KONTO</Link>
          </div>
        </div>
      </div>
      <div className="app-shell">
        <div className="wrap">{children}</div>
      </div>
      <div className="tabbar">
        {TABS.map((t) => (
          <Link key={t.href} href={t.href} className="tab-item">
            <span className="tab-icon">{t.icon}</span>
            {t.label}
          </Link>
        ))}
      </div>
    </>
  );
}
