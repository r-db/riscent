'use client';

import type { ReactNode } from 'react';

/* ═══════════════════════════════════════════
   RISCENT TYPOGRAPHY SYSTEM
   Reference: shelby.ashfall.studio
   - Ultra-tight letter-spacing (-0.04em)
   - vw-based responsive sizing
   - Heavy weights (800-900)
   ═══════════════════════════════════════════ */

interface DisplayProps {
  children: ReactNode;
  size?: 'xl' | 'lg' | 'md' | 'sm';
  color?: string;
  className?: string;
  as?: 'h1' | 'h2' | 'h3';
}

const sizeMap = {
  xl: 'text-[clamp(48px,8vw,96px)]',
  lg: 'text-[clamp(40px,6vw,72px)]',
  md: 'text-[clamp(32px,4.5vw,56px)]',
  sm: 'text-[clamp(28px,3.5vw,44px)]',
};

export function Display({ children, size = 'lg', color, className = '', as: Tag = 'h2' }: DisplayProps) {
  return (
    <Tag
      className={`font-black leading-[0.95] tracking-[-0.04em] ${sizeMap[size]} ${className}`}
      style={{ color: color || 'var(--cocoa)' }}
    >
      {children}
    </Tag>
  );
}

interface LabelProps {
  children: ReactNode;
  color?: string;
  className?: string;
}

export function Label({ children, color, className = '' }: LabelProps) {
  return (
    <p
      className={`text-[13px] font-semibold tracking-[0.15em] uppercase mb-4 ${className}`}
      style={{ color: color || 'var(--danube)' }}
    >
      {children}
    </p>
  );
}
