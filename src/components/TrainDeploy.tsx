'use client';

import { ScrollReveal } from '@/components/ui/animated';
import { Display, Label } from '@/components/ui/typography';

/* ══════════════════════════════════════════════════════════════════
   TRAIN BIG ONCE, DEPLOY SMALL FOREVER — the real-world SLM economics.
   The punchline that turns the benchmark into a business decision:
   lower OpEx, higher revenue. Metrics are our own, measured.
   ══════════════════════════════════════════════════════════════════ */

const metrics = [
  { n: '75 → 95%', l: 'accuracy — a 4B we fine-tuned, in one short run' },
  { n: '30× smaller', l: 'a tuned 4B matching models 30× its size' },
  { n: '15 / 15', l: 'tool-call reliability that actually completes the action' },
  { n: '$0 / token', l: 'no API bill once it runs on hardware you own' },
];

export default function TrainDeploy() {
  return (
    <section id="model" className="py-28 px-6" style={{ background: 'var(--bg-secondary)' }}>
      <div className="max-w-[1100px] mx-auto">
        <ScrollReveal className="mb-14">
          <Label color="var(--danube)" className="mb-3">The deployment model · real-world SLM economics</Label>
          <Display size="lg" className="mb-6">
            Train big once.<br /><span style={{ color: 'var(--danube)' }}>Deploy small forever.</span>
          </Display>
          <p className="text-lg leading-relaxed max-w-[680px]" style={{ color: 'var(--text-secondary)' }}>
            Renting intelligence by the token is a bill that grows with every customer you serve.
            Our model flips it: use a big model <strong>once</strong> — to set the bar and generate the training
            data — then run a small model you <strong>own</strong>, local and offline, at near-zero cost per call.
            Lower operating cost, higher close rate.
          </p>
        </ScrollReveal>

        {/* the model: train big -> deploy small */}
        <ScrollReveal delay={0.05}>
          <div className="grid md:grid-cols-[1fr_auto_1fr] gap-4 md:gap-6 items-stretch mb-4">
            <div className="rounded-2xl p-8" style={{ background: '#fff', border: '1px solid var(--border-light)' }}>
              <div className="flex items-center justify-between mb-4">
                <div className="text-[11px] font-bold tracking-[0.14em] uppercase" style={{ color: 'var(--text-muted)' }}>Train big</div>
                <span className="text-[11px] font-black tracking-[0.1em] uppercase px-2.5 py-1 rounded-full" style={{ background: 'var(--bg-tertiary)', color: 'var(--cocoa-soft)' }}>once</span>
              </div>
              <p className="text-base leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                A frontier model earns its keep <strong style={{ color: 'var(--cocoa)' }}>one time</strong>: it defines the task, generates and
                curates the training data, and sets the quality bar. You pay the big model to <em>teach</em> — not to run in production.
              </p>
            </div>

            <div className="flex md:flex-col items-center justify-center" aria-hidden="true">
              <span className="text-2xl font-black md:rotate-0 rotate-90" style={{ color: 'var(--danube)' }}>&rarr;</span>
            </div>

            <div className="rounded-2xl p-8" style={{ background: 'var(--torea)' }}>
              <div className="flex items-center justify-between mb-4">
                <div className="text-[11px] font-bold tracking-[0.14em] uppercase" style={{ color: 'var(--shilo)' }}>Deploy small</div>
                <span className="text-[11px] font-black tracking-[0.1em] uppercase px-2.5 py-1 rounded-full" style={{ background: 'rgba(255,255,255,0.15)', color: '#fff' }}>forever</span>
              </div>
              <p className="text-base leading-relaxed" style={{ color: 'rgba(255,255,255,0.85)' }}>
                A fine-tuned small model hits that bar on <strong style={{ color: '#fff' }}>your</strong> narrow job, then runs local, offline,
                and fast — at near-zero cost per call. You own the weights. The recurring bill stops, and it keeps working when the internet does not.
              </p>
            </div>
          </div>
        </ScrollReveal>

        {/* real metrics strip */}
        <ScrollReveal delay={0.1}>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-px mb-16" style={{ background: 'var(--border-light)' }}>
            {metrics.map(m => (
              <div key={m.n} className="p-6 md:p-7" style={{ background: 'var(--bg-warm)' }}>
                <div className="text-2xl md:text-3xl font-black tracking-[-0.03em]" style={{ color: 'var(--torea)' }}>{m.n}</div>
                <p className="text-[13px] leading-relaxed mt-2" style={{ color: 'var(--text-secondary)' }}>{m.l}</p>
              </div>
            ))}
          </div>
        </ScrollReveal>

        {/* OpEx down / Revenue up */}
        <div className="grid md:grid-cols-2 gap-6 mb-14">
          <ScrollReveal delay={0.08}>
            <div className="rounded-2xl p-8 md:p-10 h-full" style={{ background: '#fff', boxShadow: 'var(--shadow-md)' }}>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xl font-black" style={{ color: 'var(--growth, #0EA968)' }}>↓</span>
                <div className="text-[11px] font-bold tracking-[0.14em] uppercase" style={{ color: 'var(--linguareach)' }}>Lower OpEx</div>
              </div>
              <p className="text-base leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                The per-token invoice that grows with your traffic becomes a <strong style={{ color: 'var(--cocoa)' }}>one-time training cost</strong> plus
                cheap, owned inference. No frontier bill scaling with every conversation. Runs on hardware as modest as a 6&nbsp;GB laptop — even offline.
              </p>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={0.12}>
            <div className="rounded-2xl p-8 md:p-10 h-full" style={{ background: '#fff', boxShadow: 'var(--shadow-md)' }}>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xl font-black" style={{ color: 'var(--torea)' }}>↑</span>
                <div className="text-[11px] font-bold tracking-[0.14em] uppercase" style={{ color: 'var(--torea)' }}>Increase revenue</div>
              </div>
              <p className="text-base leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                A fast, reliable, always-on model completes the actions that make money — <strong style={{ color: 'var(--cocoa)' }}>answers the call,
                books the appointment, captures the lead</strong> — instead of stalling on a broken tool call at 3&nbsp;a.m. Reliability is revenue.
              </p>
            </div>
          </ScrollReveal>
        </div>

        {/* dual CTA — build or consult */}
        <ScrollReveal delay={0.1}>
          <div className="rounded-2xl p-8 md:p-12 text-center" style={{ background: 'linear-gradient(135deg, var(--cocoa), var(--torea))' }}>
            <h3 className="text-2xl md:text-3xl font-black tracking-[-0.03em] mb-3" style={{ color: '#fff' }}>
              Own your model. Lower the bill. Close more.
            </h3>
            <p className="text-base leading-relaxed max-w-[560px] mx-auto mb-8" style={{ color: 'rgba(255,255,255,0.72)' }}>
              Two ways to move: have us build and ship it, or bring us in to advise. Either way, it&apos;s measured — we show you the numbers before you commit.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="mailto:ryan@riscent.com?subject=Custom%20build%20%E2%80%94%20train%20big%2C%20deploy%20small"
                className="inline-block text-base font-bold px-9 py-4 rounded-sm no-underline" style={{ background: 'var(--shilo)', color: 'var(--cocoa)' }}>
                Start a build &rarr;
              </a>
              <a href="mailto:ryan@riscent.com?subject=Consultation%20%E2%80%94%20SLM%20deployment"
                className="inline-block text-base font-bold px-9 py-4 rounded-sm no-underline" style={{ background: 'transparent', color: '#fff', border: '2px solid rgba(255,255,255,0.55)' }}>
                Book a consult
              </a>
            </div>
            <a href="/slm" className="inline-block text-sm font-semibold no-underline mt-6" style={{ color: 'var(--shilo)' }}>
              See the full case for SLM &rarr;
            </a>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
