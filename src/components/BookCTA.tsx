'use client';

import Link from 'next/link';
import type { ReactNode } from 'react';

type Variant = 'primary' | 'light' | 'light-solid' | 'outline' | 'outline-light';

const V: Record<Variant, React.CSSProperties> = {
  primary: { background: 'var(--torea)', color: '#fff', boxShadow: '0 8px 30px rgba(10,42,146,0.3)' },
  light: { background: 'var(--shilo)', color: 'var(--cocoa)' },
  'light-solid': { background: '#fff', color: 'var(--torea)' },
  outline: { background: 'transparent', color: 'var(--cocoa)', border: '2px solid var(--border-medium)' },
  'outline-light': { background: 'transparent', color: '#fff', border: '2px solid rgba(255,255,255,0.55)' },
};

/* Every "take the next step" CTA routes to the calendar. */
export default function BookCTA({ children, variant = 'primary', className = '' }: { children: ReactNode; variant?: Variant; className?: string }) {
  return (
    <Link href="/book" className={`inline-block text-base font-bold px-9 py-4 rounded-sm no-underline text-center transition-transform hover:-translate-y-0.5 ${className}`} style={V[variant]}>
      {children}
    </Link>
  );
}
