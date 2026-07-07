'use client';

import { useState } from 'react';
import Link from 'next/link';

const LINKS = [
  { label: 'Custom AI', href: '/slm' },
  { label: 'AI Visibility', href: '/ai-visibility' },
  { label: 'Research', href: '/docs' },
];

export default function SiteNav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b" style={{ background: '#fff', borderColor: 'var(--border-light)' }}>
      <div className="max-w-[1200px] mx-auto px-6 md:px-8 h-[60px] flex justify-between items-center">
        <Link href="/" className="no-underline" onClick={() => setOpen(false)}>
          <span className="text-xl font-black tracking-[-0.04em]" style={{ color: 'var(--cocoa)' }}>RISCENT</span>
        </Link>

        {/* desktop */}
        <div className="hidden md:flex items-center gap-8">
          {LINKS.map(l => (
            <Link key={l.href} href={l.href} className="text-[13px] font-medium tracking-[0.03em] uppercase no-underline transition-opacity hover:opacity-50" style={{ color: 'var(--text-muted)' }}>{l.label}</Link>
          ))}
          <Link href="/book" className="inline-block text-[13px] font-bold px-6 py-2.5 rounded-sm no-underline transition-transform hover:-translate-y-0.5" style={{ background: 'var(--torea)', color: '#fff', boxShadow: '0 8px 24px rgba(10,42,146,0.25)' }}>Talk to Ryan</Link>
        </div>

        {/* mobile hamburger */}
        <button
          className="md:hidden inline-flex items-center justify-center w-10 h-10 -mr-2 rounded-lg"
          aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open}
          onClick={() => setOpen(o => !o)}
          style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--cocoa)" strokeWidth="2.2" strokeLinecap="round">
            {open
              ? (<><line x1="5" y1="5" x2="19" y2="19" /><line x1="19" y1="5" x2="5" y2="19" /></>)
              : (<><line x1="3" y1="7" x2="21" y2="7" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="17" x2="21" y2="17" /></>)}
          </svg>
        </button>
      </div>

      {/* mobile dropdown panel */}
      {open && (
        <div className="md:hidden border-t" style={{ background: '#fff', borderColor: 'var(--border-light)', boxShadow: '0 16px 40px rgba(49,36,31,0.10)' }}>
          <div className="px-6 py-4 flex flex-col gap-1">
            {LINKS.map(l => (
              <Link key={l.href} href={l.href} onClick={() => setOpen(false)}
                className="text-[15px] font-semibold no-underline py-3 border-b" style={{ color: 'var(--cocoa)', borderColor: 'var(--hair, rgba(49,36,31,0.05))' }}>
                {l.label}
              </Link>
            ))}
            <Link href="/book" onClick={() => setOpen(false)}
              className="mt-4 text-center text-[15px] font-bold no-underline py-3.5 rounded-sm" style={{ background: 'var(--torea)', color: '#fff' }}>
              Talk to Ryan &rarr;
            </Link>
            <a href="mailto:ryan@riscent.com?subject=Custom%20build%20%E2%80%94%20Riscent" onClick={() => setOpen(false)}
              className="mt-2 text-center text-[15px] font-bold no-underline py-3.5 rounded-sm" style={{ background: 'transparent', color: 'var(--cocoa)', border: '1.5px solid var(--border-medium)' }}>
              Start a custom build
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
