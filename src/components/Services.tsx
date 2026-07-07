'use client';

import Link from 'next/link';
import { ScrollReveal } from '@/components/ui/animated';
import { Display, Label } from '@/components/ui/typography';

const services = [
  {
    href: '/slm',
    tag: 'Custom AI you own',
    title: 'Own your model.\nStop renting by the token.',
    body: 'We build and ship a small model that does your job — local, private, and cheap. Train big once, deploy small forever. Lower your bill, keep your data.',
    cta: 'Explore SLM builds',
    accent: 'var(--torea)',
  },
  {
    href: '/ai-visibility',
    tag: 'Get found by the AI',
    title: 'Get named and recommended\nby ChatGPT, Gemini & Claude.',
    body: 'Your buyers ask the models and act on the answer. We rebuild your business information the special way the models read it — so you show up in the answer.',
    cta: 'Explore AI visibility',
    accent: 'var(--danube)',
  },
];

export default function Services() {
  return (
    <section id="services" className="py-24 px-6" style={{ background: 'var(--bg-primary)' }}>
      <div className="max-w-[1100px] mx-auto">
        <ScrollReveal className="mb-12">
          <Label color="var(--danube)" className="mb-3">Where we help</Label>
          <Display size="md">Two ways we move the needle.</Display>
        </ScrollReveal>
        <div className="grid md:grid-cols-2 gap-6">
          {services.map((s, i) => (
            <ScrollReveal key={s.href} delay={i * 0.08}>
              <Link href={s.href} className="group block h-full no-underline rounded-2xl p-8 md:p-10 transition-all duration-300 hover:-translate-y-1"
                style={{ background: '#fff', border: '1px solid var(--border-light)', borderTop: `3px solid ${s.accent}`, boxShadow: 'var(--shadow-sm)' }}>
                <div className="text-[11px] font-bold tracking-[0.14em] uppercase mb-4" style={{ color: s.accent }}>{s.tag}</div>
                <div className="text-2xl md:text-[28px] font-black tracking-[-0.03em] leading-[1.1] mb-4 whitespace-pre-line" style={{ color: 'var(--cocoa)' }}>{s.title}</div>
                <p className="text-base leading-relaxed mb-6" style={{ color: 'var(--text-secondary)' }}>{s.body}</p>
                <span className="inline-flex items-center gap-1.5 text-sm font-bold transition-all group-hover:gap-3" style={{ color: s.accent }}>
                  {s.cta} &rarr;
                </span>
              </Link>
            </ScrollReveal>
          ))}
        </div>
        <ScrollReveal delay={0.15}>
          <p className="text-sm mt-8" style={{ color: 'var(--text-muted)' }}>
            Or <Link href="/docs" className="font-semibold no-underline" style={{ color: 'var(--torea)' }}>read the research →</Link> behind it.
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
