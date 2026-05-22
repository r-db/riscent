'use client';

import { useRef, useEffect, useState, type ReactNode } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

/* ═══════════════════════════════════════════════════════════════
   RISCENT VISUAL SYSTEM
   Reference: shelby.ashfall.studio
   Easing: cubic-bezier(.59, .06, .1, 1) — Shelby's snappy elastic
   ═══════════════════════════════════════════════════════════════ */

const SHELBY_EASE = [0.59, 0.06, 0.1, 1] as const;

/* ── 1. ScrollReveal ──
   3D scroll-triggered entry with perspective.
   Elements appear to "roll" into view from below with rotateX tilt.
*/
interface ScrollRevealProps {
  children: ReactNode;
  delay?: number;
  className?: string;
  rotate?: boolean;    // adds rotateX tilt (default true)
  direction?: 'up' | 'down' | 'left' | 'right';
  scale?: boolean;     // adds scale effect
}

export function ScrollReveal({ children, delay = 0, className = '', rotate = true, direction = 'up', scale = false }: ScrollRevealProps) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  const directionMap = {
    up: { y: 60, x: 0 },
    down: { y: -60, x: 0 },
    left: { x: 60, y: 0 },
    right: { x: -60, y: 0 },
  };

  const initial = {
    opacity: 0,
    ...directionMap[direction],
    rotateX: rotate && direction === 'up' ? 14 : 0,
    rotateY: rotate && direction === 'left' ? 10 : 0,
    scale: scale ? 0.92 : 1,
  };

  return (
    <div style={{ perspective: rotate ? 800 : undefined }}>
      <motion.div
        ref={ref}
        className={className}
        initial={initial}
        animate={inView ? { opacity: 1, y: 0, x: 0, rotateX: 0, rotateY: 0, scale: 1 } : initial}
        transition={{ duration: 0.8, delay, ease: SHELBY_EASE }}
        style={{ willChange: 'transform, opacity', transformStyle: 'preserve-3d' }}
      >
        {children}
      </motion.div>
    </div>
  );
}

/* ── 2. GradientSection ──
   Section wrapper with gradient background and centered content.
*/
interface GradientSectionProps {
  children: ReactNode;
  from?: string;
  to?: string;
  direction?: string;
  className?: string;
  dark?: boolean;
  id?: string;
}

export function GradientSection({ children, from, to, direction = '180deg', className = '', dark = false, id }: GradientSectionProps) {
  const bg = from && to
    ? `linear-gradient(${direction}, ${from}, ${to})`
    : dark ? 'var(--cocoa)' : 'var(--bg-primary)';

  return (
    <section id={id} className={`py-28 px-6 ${className}`} style={{ background: bg, color: dark ? '#fff' : 'var(--cocoa)' }}>
      <div className="max-w-[1100px] mx-auto">
        {children}
      </div>
    </section>
  );
}

/* ── 3. Card3D ──
   Hover-reactive card with depth, tilt, and shadow.
   Optionally wraps in a Link.
*/
interface Card3DProps {
  children: ReactNode;
  href?: string;
  className?: string;
  accent?: string;
  delay?: number;
}

export function Card3D({ children, href, className = '', accent, delay = 0 }: Card3DProps) {
  const [hovered, setHovered] = useState(false);

  const card = (
    <ScrollReveal delay={delay}>
      <motion.div
        className={`rounded-2xl p-7 h-full border ${className}`}
        style={{
          background: '#fff',
          borderColor: hovered ? (accent || 'var(--danube)') : 'var(--border-light)',
          borderTopWidth: accent ? 3 : 1,
          borderTopColor: accent || 'var(--border-light)',
          cursor: href ? 'pointer' : 'default',
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        animate={{
          y: hovered ? -8 : 0,
          boxShadow: hovered
            ? '0 20px 60px rgba(49,36,31,0.12)'
            : '0 2px 12px rgba(49,36,31,0.04)',
        }}
        transition={{ duration: 0.3, ease: SHELBY_EASE }}
      >
        {children}
      </motion.div>
    </ScrollReveal>
  );

  if (href) {
    return <Link href={href} className="block no-underline" style={{ color: 'inherit' }}>{card}</Link>;
  }
  return card;
}

/* ── 4. StatRibbon ──
   Dark stats bar with animated count-up values.
*/
interface StatItem {
  value: string;
  label: string;
}

function CountUp({ target, active }: { target: string; active: boolean }) {
  // If target is a number string, animate it. Otherwise just show it.
  const num = parseInt(target.replace(/[^0-9]/g, ''));
  const suffix = target.replace(/[0-9,]/g, '');
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!active || isNaN(num)) return;
    const duration = 1200;
    const start = performance.now();
    const tick = () => {
      const p = Math.min((performance.now() - start) / duration, 1);
      setVal(Math.round(num * (1 - Math.pow(1 - p, 3))));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [active, num]);

  if (isNaN(num)) return <>{target}</>;
  return <>{val.toLocaleString()}{suffix}</>;
}

export function StatRibbon({ stats }: { stats: StatItem[] }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  return (
    <section ref={ref} className="py-8 border-y" style={{ background: 'var(--cocoa)', borderColor: 'var(--cocoa)' }}>
      <div className="max-w-[1000px] mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
        {stats.map(s => (
          <motion.div key={s.label}
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: SHELBY_EASE }}>
            <div className="text-2xl font-black tracking-[-0.02em]" style={{ color: 'var(--shilo)' }}>
              <CountUp target={s.value} active={inView} />
            </div>
            <div className="text-[11px] font-medium tracking-[0.08em] uppercase mt-1.5" style={{ color: 'rgba(255,255,255,0.45)' }}>{s.label}</div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ── 5. FloatingCTA ──
   Pill-shaped CTA button with hover depth.
*/
interface FloatingCTAProps {
  children: ReactNode;
  href?: string;
  variant?: 'primary' | 'secondary' | 'light';
  className?: string;
}

export function FloatingCTA({ children, href = '#', variant = 'primary', className = '' }: FloatingCTAProps) {
  const styles = {
    primary: { bg: 'var(--torea)', color: '#fff', shadow: '0 8px 30px rgba(10,42,146,0.3)' },
    secondary: { bg: 'transparent', color: 'var(--cocoa)', shadow: 'none' },
    light: { bg: 'var(--shilo)', color: 'var(--cocoa)', shadow: '0 8px 30px rgba(0,0,0,0.15)' },
  };
  const s = styles[variant];

  return (
    <motion.a
      href={href}
      className={`inline-block text-base font-bold px-10 py-4 rounded-sm no-underline ${className}`}
      style={{ background: s.bg, color: s.color, boxShadow: s.shadow, border: variant === 'secondary' ? '2px solid var(--border-medium)' : 'none' }}
      whileHover={{ y: -3, boxShadow: variant === 'primary' ? '0 14px 40px rgba(10,42,146,0.4)' : s.shadow }}
      transition={{ duration: 0.25, ease: SHELBY_EASE }}
    >
      {children}
    </motion.a>
  );
}

/* ── 6. TabDemo ──
   Interactive product demonstration with tab switching.
*/
interface TabItem {
  label: string;
  desc: string;
  demo: string;
}

export function TabDemo({ tabs }: { tabs: TabItem[] }) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setActive(t => (t + 1) % tabs.length), 4500);
    return () => clearInterval(interval);
  }, [tabs.length]);

  return (
    <ScrollReveal>
      <div className="rounded-2xl overflow-hidden" style={{ background: '#fff', boxShadow: '0 16px 60px rgba(49,36,31,0.08)' }}>
        {/* Tab buttons */}
        <div className="flex border-b" style={{ borderColor: 'var(--border-light)' }}>
          {tabs.map((tab, i) => (
            <button key={tab.label} onClick={() => setActive(i)}
              className="flex-1 py-4 text-sm font-semibold transition-all relative"
              style={{ color: active === i ? 'var(--torea)' : 'var(--text-muted)', background: 'transparent', border: 'none', cursor: 'pointer' }}>
              {tab.label}
              {active === i && (
                <motion.div layoutId="tab-indicator" className="absolute bottom-0 left-0 right-0 h-0.5"
                  style={{ background: 'var(--torea)' }} transition={{ duration: 0.3, ease: SHELBY_EASE }} />
              )}
            </button>
          ))}
        </div>
        {/* Tab content */}
        <div className="p-8 md:p-10 grid md:grid-cols-2 gap-8 items-center min-h-[200px]">
          <AnimatePresence mode="wait">
            <motion.div key={active}
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.35, ease: SHELBY_EASE }}>
              <h3 className="text-2xl font-bold mb-3 tracking-[-0.02em]" style={{ color: 'var(--cocoa)' }}>{tabs[active].label}</h3>
              <p className="text-base leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{tabs[active].desc}</p>
            </motion.div>
          </AnimatePresence>
          <AnimatePresence mode="wait">
            <motion.div key={`demo-${active}`}
              className="rounded-xl p-6 font-mono text-sm leading-relaxed"
              style={{ background: 'var(--bg-secondary)', color: 'var(--cocoa-soft)' }}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.35, delay: 0.1, ease: SHELBY_EASE }}>
              {tabs[active].demo}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </ScrollReveal>
  );
}
