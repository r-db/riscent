'use client';

import Link from 'next/link';
import SiteNav from '@/components/SiteNav';
import { ScrollReveal } from '@/components/ui/animated';
import { Display, Label } from '@/components/ui/typography';

const metrics = [
  { n: '75 → 95%', l: 'accuracy — a 4B we fine-tuned, one short run' },
  { n: '30× smaller', l: 'a tuned 4B matching models 30× its size' },
  { n: '15 / 15', l: 'tool-call reliability that completes the action' },
  { n: '$0 / token', l: 'no API bill once it runs on hardware you own' },
];

const benefits = [
  { t: 'Lower OpEx', d: 'The per-token invoice that grows with your traffic becomes a one-time training cost plus cheap, owned inference.' },
  { t: 'You own the weights', d: 'The model and the data are yours. No vendor can raise your price, deprecate your model, or read your prompts.' },
  { t: 'Private by default', d: 'Runs on your hardware — even fully offline. Your proprietary and customer data never leaves the building.' },
  { t: 'Low latency', d: 'No network round-trip to a frontier API. Answers come back fast enough for real-time voice and chat.' },
  { t: 'Reliable tool calls', d: 'We select the base by measurement, so the model actually emits the clean JSON that completes an action.' },
  { t: 'No lock-in', d: 'Swap it in behind your existing interface. If you ever leave us, you keep a working, documented model.' },
];

const useCases = ['Classification & routing', 'Structured extraction', 'On-device agents', 'High-volume, narrow tasks', 'Private / regulated data', 'Offline & edge deployment'];

export default function SlmPitch() {
  return (
    <main className="min-h-screen overflow-x-hidden" style={{ background: 'var(--bg-primary)' }}>
      <SiteNav />

      {/* hero */}
      <section className="relative pt-[110px] pb-16 px-6 overflow-hidden" style={{ background: 'linear-gradient(165deg, var(--danube-pale), var(--bg-primary) 70%)' }}>
        <div className="max-w-[1100px] mx-auto">
          <ScrollReveal>
            <Label color="var(--danube)" className="mb-4">Small language models · custom-built &amp; shipped</Label>
            <Display size="xl" as="h1" className="mb-6 leading-[0.95]">
              Stop renting intelligence<br />by the token.
            </Display>
            <p className="text-lg md:text-xl leading-relaxed max-w-[640px] mb-9" style={{ color: 'var(--text-secondary)' }}>
              Own a small model that does <em>your</em> job — cheaper, faster, private, and forever.
              Train big once to teach it; deploy small to run it. Lower operating cost, higher close rate.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="mailto:ryan@riscent.com?subject=Custom%20SLM%20build%20%E2%80%94%20Riscent" className="inline-block text-base font-bold px-9 py-4 rounded-sm no-underline text-center" style={{ background: 'var(--torea)', color: '#fff', boxShadow: '0 8px 30px rgba(10,42,146,0.3)' }}>Start a build &rarr;</a>
              <a href="mailto:ryan@riscent.com?subject=SLM%20consultation%20%E2%80%94%20Riscent" className="inline-block text-base font-bold px-9 py-4 rounded-sm no-underline text-center" style={{ background: 'transparent', color: 'var(--cocoa)', border: '2px solid var(--border-medium)' }}>Book a consult</a>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* the problem */}
      <section className="py-20 px-6" style={{ background: 'var(--cocoa)' }}>
        <div className="max-w-[1100px] mx-auto">
          <ScrollReveal>
            <Label color="var(--shilo)" className="mb-3">The problem</Label>
            <Display size="md" color="#fff" className="mb-6">The frontier bill never stops growing.</Display>
            <div className="grid md:grid-cols-3 gap-x-10 gap-y-6 mt-8">
              {[
                ['You rent, you don’t own', 'Every answer is a metered API call. Scale your traffic and the invoice scales with it — forever.'],
                ['You’re exposed', 'Your prompts and customer data leave your building. The vendor can change the model, the price, or the terms.'],
                ['It’s often overkill', 'You’re paying frontier prices for a narrow, repetitive task a small model could own outright.'],
              ].map(([t, d]) => (
                <div key={t}>
                  <div className="text-lg font-bold mb-2" style={{ color: '#fff' }}>{t}</div>
                  <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.65)' }}>{d}</p>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* the model */}
      <section className="py-20 px-6" style={{ background: 'var(--bg-secondary)' }}>
        <div className="max-w-[1100px] mx-auto">
          <ScrollReveal className="mb-10">
            <Label color="var(--danube)" className="mb-3">The model</Label>
            <Display size="md" className="mb-5">Train big once. Deploy small forever.</Display>
          </ScrollReveal>
          <div className="grid md:grid-cols-[1fr_auto_1fr] gap-4 md:gap-6 items-stretch">
            <ScrollReveal>
              <div className="rounded-2xl p-8 h-full" style={{ background: '#fff', border: '1px solid var(--border-light)' }}>
                <div className="text-[11px] font-bold tracking-[0.14em] uppercase mb-3" style={{ color: 'var(--text-muted)' }}>Train big — once</div>
                <p className="text-base leading-relaxed" style={{ color: 'var(--text-secondary)' }}>A frontier model earns its keep one time: it defines the task, generates and curates the training data, and sets the quality bar. You pay the big model to <em>teach</em> — not to run.</p>
              </div>
            </ScrollReveal>
            <div className="flex md:flex-col items-center justify-center" aria-hidden="true"><span className="text-2xl font-black rotate-90 md:rotate-0" style={{ color: 'var(--danube)' }}>&rarr;</span></div>
            <ScrollReveal delay={0.08}>
              <div className="rounded-2xl p-8 h-full" style={{ background: 'var(--torea)' }}>
                <div className="text-[11px] font-bold tracking-[0.14em] uppercase mb-3" style={{ color: 'var(--shilo)' }}>Deploy small — forever</div>
                <p className="text-base leading-relaxed" style={{ color: 'rgba(255,255,255,0.85)' }}>A fine-tuned small model hits that bar on your narrow job, then runs local, offline, and fast — at near-zero cost per call. You own the weights. The recurring bill stops.</p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* proof */}
      <section className="py-20 px-6" style={{ background: 'var(--bg-primary)' }}>
        <div className="max-w-[1100px] mx-auto">
          <ScrollReveal className="mb-8">
            <Label color="var(--torea)" className="mb-3">The proof — measured, not promised</Label>
            <Display size="md" className="mb-4">Numbers from our own work.</Display>
          </ScrollReveal>
          <ScrollReveal delay={0.05}>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-px mb-6" style={{ background: 'var(--border-light)' }}>
              {metrics.map(m => (
                <div key={m.n} className="p-6 md:p-7" style={{ background: 'var(--bg-warm)' }}>
                  <div className="text-2xl md:text-3xl font-black tracking-[-0.03em]" style={{ color: 'var(--torea)' }}>{m.n}</div>
                  <p className="text-[13px] leading-relaxed mt-2" style={{ color: 'var(--text-secondary)' }}>{m.l}</p>
                </div>
              ))}
            </div>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>See the full head-to-head and method in <Link href="/docs/slm-fine-tuning" className="font-semibold no-underline" style={{ color: 'var(--torea)' }}>the research →</Link></p>
          </ScrollReveal>
        </div>
      </section>

      {/* benefits */}
      <section className="py-20 px-6" style={{ background: 'var(--bg-secondary)' }}>
        <div className="max-w-[1100px] mx-auto">
          <ScrollReveal className="mb-10"><Label color="var(--danube)" className="mb-3">Why it wins</Label><Display size="md">Six reasons owners choose it.</Display></ScrollReveal>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px" style={{ background: 'var(--border-light)' }}>
            {benefits.map((b, i) => (
              <ScrollReveal key={b.t} delay={(i % 3) * 0.06}>
                <div className="p-8 h-full" style={{ background: '#fff' }}>
                  <div className="text-lg font-black tracking-[-0.02em] mb-3" style={{ color: 'var(--cocoa)' }}>{b.t}</div>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{b.d}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* use cases + how we work */}
      <section className="py-20 px-6" style={{ background: 'var(--bg-primary)' }}>
        <div className="max-w-[1100px] mx-auto grid lg:grid-cols-2 gap-14">
          <ScrollReveal>
            <Label color="var(--torea)" className="mb-3">Good for</Label>
            <Display size="sm" className="mb-6">Narrow, high-volume, or private.</Display>
            <div className="flex flex-wrap gap-2">
              {useCases.map(u => (<span key={u} className="text-[13px] font-semibold px-3.5 py-2 rounded-full" style={{ background: 'var(--bg-secondary)', color: 'var(--cocoa-soft)' }}>{u}</span>))}
            </div>
          </ScrollReveal>
          <ScrollReveal delay={0.08}>
            <Label color="var(--danube)" className="mb-3">How we work</Label>
            <Display size="sm" className="mb-6">Measured end to end.</Display>
            <ol className="flex flex-col gap-4">
              {[
                ['Select the base by measurement', 'We score candidate models on your production criteria — not brand or leaderboard.'],
                ['Fine-tune against a held-out gate', 'The tuned model must pass objective checks it never trained on, red-first, before we ship.'],
                ['Ship it — and tell you the edges', 'You get a model you own, documented, and an honest map of where its competence ends.'],
              ].map(([t, d], i) => (
                <li key={t} className="flex gap-4">
                  <span className="w-7 h-7 shrink-0 rounded-full grid place-items-center text-[13px] font-black" style={{ background: 'var(--danube-pale)', color: 'var(--danube)' }}>{i + 1}</span>
                  <div><div className="font-bold" style={{ color: 'var(--cocoa)' }}>{t}</div><p className="text-sm leading-relaxed mt-1" style={{ color: 'var(--text-secondary)' }}>{d}</p></div>
                </li>
              ))}
            </ol>
          </ScrollReveal>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 text-center" style={{ background: 'linear-gradient(135deg, var(--cocoa), var(--torea))' }}>
        <div className="max-w-[760px] mx-auto">
          <ScrollReveal>
            <Display color="#fff" className="mb-5">Own your model.<br />Lower the bill. Close more.</Display>
            <p className="text-lg leading-relaxed mb-10" style={{ color: 'rgba(255,255,255,0.72)' }}>Two ways to move: have us build and ship it, or bring us in to advise. Either way, it&apos;s measured — we show you the numbers before you commit.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="mailto:ryan@riscent.com?subject=Custom%20SLM%20build%20%E2%80%94%20Riscent" className="inline-block text-base font-bold px-9 py-4 rounded-sm no-underline" style={{ background: 'var(--shilo)', color: 'var(--cocoa)' }}>Start a build &rarr;</a>
              <a href="mailto:ryan@riscent.com?subject=SLM%20consultation%20%E2%80%94%20Riscent" className="inline-block text-base font-bold px-9 py-4 rounded-sm no-underline" style={{ background: 'transparent', color: '#fff', border: '2px solid rgba(255,255,255,0.55)' }}>Book a consult</a>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* footer */}
      <footer className="py-10 px-6 border-t" style={{ background: '#fff', borderColor: 'var(--border-light)' }}>
        <div className="max-w-[1100px] mx-auto flex flex-col md:flex-row justify-between items-start gap-6 text-sm">
          <div><div className="text-base font-black tracking-[-0.03em] mb-1" style={{ color: 'var(--cocoa)' }}>RISCENT</div><div style={{ color: 'var(--text-muted)' }}>AI consulting — agentic deployment, SLM fine-tuning, AI memory.</div></div>
          <div className="flex flex-wrap gap-6">
            <Link href="/" className="no-underline text-[13px]" style={{ color: 'var(--text-secondary)' }}>Home</Link>
            <Link href="/ai-visibility" className="no-underline text-[13px]" style={{ color: 'var(--text-secondary)' }}>AI Visibility</Link>
            <Link href="/docs" className="no-underline text-[13px]" style={{ color: 'var(--text-secondary)' }}>Research</Link>
            <a href="mailto:ryan@riscent.com" className="no-underline text-[13px]" style={{ color: 'var(--text-secondary)' }}>Contact</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
