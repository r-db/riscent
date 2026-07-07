'use client';

import { ScrollReveal } from '@/components/ui/animated';
import { Display, Label } from '@/components/ui/typography';

/* ══════════════════════════════════════════════════════════════════
   PROOF / "APPLIED" — results over idealism.
   The national numbers are real and cited (MIT NANDA 2025, McKinsey 2025);
   our proof is our own, measured. We are on the results side of the gap.
   ══════════════════════════════════════════════════════════════════ */

/* national reality — cited, not ours */
const nationalStats = [
  {
    stat: '95%',
    body: 'of enterprise generative-AI pilots deliver no measurable P&L impact — only ~5% break through.',
    src: 'MIT NANDA · “The GenAI Divide,” 2025',
    href: 'https://fortune.com/2025/08/18/mit-report-95-percent-generative-ai-pilots-at-companies-failing-cfo/',
  },
  {
    stat: '39%',
    body: 'of organizations see any enterprise-level earnings impact from AI — and typically under 5%.',
    src: 'McKinsey · “The State of AI,” 2025 (≈2,000 firms, 105 nations)',
    href: 'https://www.mckinsey.com/capabilities/quantumblack/our-insights/the-state-of-ai',
  },
  {
    stat: 'Back-office',
    body: 'is where the real ROI sits — automation and engineering, not the demo the budget chased.',
    src: 'MIT NANDA, 2025',
    href: 'https://fortune.com/2025/08/18/mit-report-95-percent-generative-ai-pilots-at-companies-failing-cfo/',
  },
];

/* our flagships — real, shipped */
const flagships = [
  {
    name: 'Phantom Vault',
    tag: 'Shipped · open source',
    line: 'An open-source secret vault for the age of AI agents: the model uses your API keys by name and never sees the value — encrypted at rest, jailed at runtime, sanitized on the way out. Free, Apache 2.0.',
    href: 'https://phantomvault.riscent.com/',
    cta: 'phantomvault.riscent.com',
    accent: 'var(--torea)',
  },
  {
    name: 'Synthetic memory',
    tag: 'In every system we build',
    line: 'The persistence layer that makes an agent remember: extraction, embedding, recall, decay. Agents stop starting cold and get better every week. Memory is the moat — and it compounds.',
    href: '#research',
    cta: 'See the research',
    accent: 'var(--danube)',
  },
];

const products = ['Chatterbox', 'BookBot', 'LinguaReach', 'VoiceGuard', 'DripForce', 'VoiceTrain'];

export default function ProofSection() {
  return (
    <section id="solutions" className="py-28 px-6" style={{ background: 'var(--bg-primary)' }}>
      <div className="max-w-[1100px] mx-auto">
        <ScrollReveal className="mb-14">
          <Label color="var(--torea)" className="mb-3">Results over idealism</Label>
          <Display size="md" className="mb-6">Most AI dies in the pilot.<br />We build what ships.</Display>
          <p className="text-lg leading-relaxed max-w-[660px]" style={{ color: 'var(--text-secondary)' }}>
            The national numbers are sobering — and public. Most AI spend never reaches the P&amp;L.
            That&apos;s the idealism gap: pilots, demos, and AI theater that never touch the bottom line.
          </p>
        </ScrollReveal>

        {/* national reality — cited */}
        <ScrollReveal delay={0.05}>
          <div className="grid md:grid-cols-3 gap-px mb-4" style={{ background: 'var(--border-light)' }}>
            {nationalStats.map(s => (
              <div key={s.stat} className="p-8 flex flex-col" style={{ background: 'var(--bg-warm)' }}>
                <div className="text-4xl md:text-5xl font-black tracking-[-0.03em] mb-3" style={{ color: 'var(--cocoa)' }}>{s.stat}</div>
                <p className="text-sm leading-relaxed mb-4 flex-1" style={{ color: 'var(--text-secondary)' }}>{s.body}</p>
                <a href={s.href} target="_blank" rel="noopener noreferrer" className="text-[11px] font-medium tracking-[0.02em] no-underline hover:opacity-60 transition-opacity" style={{ color: 'var(--text-whisper)' }}>
                  {s.src} ↗
                </a>
              </div>
            ))}
          </div>
        </ScrollReveal>

        {/* the turn: wisdom over idealism */}
        <ScrollReveal delay={0.1}>
          <p className="text-lg md:text-xl leading-relaxed max-w-[760px] mb-16 mt-8" style={{ color: 'var(--cocoa)' }}>
            We build for the <strong>5%</strong>. Our judgment is done by <strong>experience, not fresh-graduate idealism</strong> —
            wisdom that has grown past &ldquo;AI will fix it&rdquo; and is built on the foundation of shipped results.
            Here&apos;s the proof, not the pitch.
          </p>
        </ScrollReveal>

        {/* flagships — real, shipped */}
        <div className="grid md:grid-cols-2 gap-px mb-4" style={{ background: 'var(--border-light)' }}>
          {flagships.map((f, i) => (
            <ScrollReveal key={f.name} delay={i * 0.08}>
              <div className="p-10 h-full flex flex-col" style={{ background: '#fff', borderTop: `3px solid ${f.accent}` }}>
                <div className="text-[11px] font-bold tracking-[0.12em] uppercase mb-3" style={{ color: f.accent }}>{f.tag}</div>
                <div className="text-2xl font-black tracking-[-0.03em] mb-4" style={{ color: 'var(--cocoa)' }}>{f.name}</div>
                <p className="text-sm leading-relaxed mb-6 flex-1" style={{ color: 'var(--text-secondary)' }}>{f.line}</p>
                <a href={f.href} target={f.href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer"
                  className="text-sm font-bold no-underline inline-flex items-center gap-1.5 hover:gap-2.5 transition-all" style={{ color: f.accent }}>
                  {f.cta} &rarr;
                </a>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* measured proof strip → benchmark */}
        <ScrollReveal delay={0.1}>
          <div className="rounded-2xl p-8 md:p-10 mb-14" style={{ background: 'var(--cocoa)' }}>
            <div className="text-[11px] font-bold tracking-[0.14em] uppercase mb-4" style={{ color: 'var(--shilo)' }}>And the models are chosen the same way — by measurement</div>
            <div className="grid sm:grid-cols-3 gap-8 mb-6">
              {[
                { v: '15 / 15', l: 'Gemma-4 E4B on our tool-call harness — Qwen3-4B managed 6/15' },
                { v: '75 → 95%', l: 'a 4B classifier we fine-tuned, in a single short run' },
                { v: '30× smaller', l: 'a tuned 4B matching models 30× its size — local and offline' },
              ].map(x => (
                <div key={x.v}>
                  <div className="text-2xl md:text-3xl font-black tracking-[-0.02em]" style={{ color: '#fff' }}>{x.v}</div>
                  <p className="text-[13px] leading-relaxed mt-1.5" style={{ color: 'rgba(255,255,255,0.6)' }}>{x.l}</p>
                </div>
              ))}
            </div>
            <a href="#benchmark" className="text-sm font-bold no-underline inline-flex items-center gap-1.5" style={{ color: 'var(--shilo)' }}>
              See the full benchmark &rarr;
            </a>
          </div>
        </ScrollReveal>

        {/* shipped products — the same stack in market */}
        <ScrollReveal delay={0.15}>
          <div className="flex flex-col md:flex-row md:items-center gap-x-6 gap-y-3 border-t pt-8" style={{ borderColor: 'var(--border-light)' }}>
            <span className="text-[13px] font-semibold shrink-0" style={{ color: 'var(--text-muted)' }}>
              Six products shipped on the same stack:
            </span>
            <div className="flex flex-wrap gap-2">
              {products.map(p => (
                <span key={p} className="text-[13px] font-semibold px-3 py-1 rounded-full" style={{ background: 'var(--bg-secondary)', color: 'var(--cocoa-soft)' }}>{p}</span>
              ))}
            </div>
          </div>
          <p className="text-sm tracking-[0.04em] mt-6" style={{ color: 'var(--text-whisper)' }}>
            Healthcare &nbsp;·&nbsp; Home Services &nbsp;·&nbsp; Legal &nbsp;·&nbsp; Real Estate &nbsp;·&nbsp; Restaurants &nbsp;·&nbsp; Auto &nbsp;·&nbsp; Fitness &nbsp;·&nbsp; E-commerce
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
