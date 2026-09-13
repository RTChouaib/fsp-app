import Link from 'next/link';

export function MarketingTopBar() {
  return (
    <div className="topbar">
      <div className="topbar-inner">
        <Link href="/" className="logo">
          <span className="dot"></span>FSP Terminology
        </Link>
        <div className="nav-links">
          <Link href="/#how" className="nav-link">SO FUNKTIONIERT&apos;S</Link>
          <Link href="/pricing" className="nav-link">PREISE</Link>
          <Link href="/demo" className="btn btn-sm btn-blue">Kostenlos ausprobieren</Link>
        </div>
      </div>
    </div>
  );
}
