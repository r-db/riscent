'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ScrollReveal,
  GradientSection,
  StatRibbon,
  FloatingCTA,
} from '@/components/ui/animated';
import { Display, Label } from '@/components/ui/typography';
import SlmStudy from '@/components/SlmStudy';
import ProofSection from '@/components/ProofSection';
import AiVisibility from '@/components/AiVisibility';
import TrainDeploy from '@/components/TrainDeploy';

const EASE = [0.59, 0.06, 0.1, 1] as const;

/* ── Hero product mock: agentic chat with persistent memory ── */
const mockMessages = [
  { from: 'caller', text: 'Hey — picking up where we left off on the integration?' },
  { from: 'ai', text: 'Yes. Last session you flagged the Postgres write-path. I queued the fix and ran your test suite — green.' },
  { from: 'caller', text: 'Did you log the schema change?' },
  { from: 'ai', text: 'Migration 042 committed, indexed on user_id. I also wrote the rollback in case staging trips it.' },
  { from: 'caller', text: 'Good catch on the rollback.' },
  { from: 'ai', text: 'Noted as a preference. I will scaffold rollbacks by default going forward.' },
];

function HeroMock() {
  const [visible, setVisible] = useState(1);

  useEffect(() => {
    if (visible >= mockMessages.length) return;
    const t = setTimeout(() => setVisible(v => v + 1), 900 + visible * 300);
    return () => clearTimeout(t);
  }, [visible]);

  return (
    <div className="relative">
      {/* Phone frame */}
      <div className="rounded-[32px] overflow-hidden shadow-2xl border-4"
        style={{ background: '#fff', borderColor: 'var(--border-light)', boxShadow: '0 40px 80px rgba(49,36,31,0.18), 0 0 0 1px rgba(49,36,31,0.06)' }}>

        {/* Status bar */}
        <div className="flex justify-between items-center px-6 py-3 text-[11px] font-semibold"
          style={{ background: 'var(--torea)', color: '#fff' }}>
          <span>SEQ · Memory layer active</span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            Live
          </span>
        </div>

        {/* Chat area */}
        <div className="px-4 py-5 space-y-3 min-h-[340px]" style={{ background: 'var(--bg-secondary)' }}>
          {mockMessages.slice(0, visible).map((msg, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: EASE }}
              className={`flex ${msg.from === 'ai' ? 'justify-start' : 'justify-end'}`}>
              <div className="max-w-[78%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed"
                style={{
                  background: msg.from === 'ai' ? '#fff' : 'var(--torea)',
                  color: msg.from === 'ai' ? 'var(--cocoa)' : '#fff',
                  borderBottomLeftRadius: msg.from === 'ai' ? 4 : 16,
                  borderBottomRightRadius: msg.from === 'ai' ? 16 : 4,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                }}>
                {msg.text}
              </div>
            </motion.div>
          ))}
          {visible < mockMessages.length && (
            <div className="flex justify-start">
              <div className="px-4 py-3 rounded-2xl" style={{ background: '#fff', borderBottomLeftRadius: 4 }}>
                <div className="flex gap-1">
                  {[0, 0.2, 0.4].map(d => (
                    <motion.div key={d} className="w-2 h-2 rounded-full"
                      style={{ background: 'var(--danube)' }}
                      animate={{ y: [0, -4, 0] }}
                      transition={{ duration: 0.8, delay: d, repeat: Infinity }} />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bottom bar */}
        <div className="flex items-center justify-between px-5 py-3 border-t text-[12px] font-medium"
          style={{ borderColor: 'var(--border-light)', color: 'var(--text-muted)', background: '#fff' }}>
          <span>Session resumed · 12 memories injected</span>
          <span style={{ color: 'var(--sage-deep, #4A7C59)' }}>● Persistent</span>
        </div>
      </div>

      {/* Floating badge */}
      <motion.div
        className="absolute -top-4 -right-4 rounded-full px-4 py-2 text-xs font-bold shadow-lg"
        style={{ background: 'var(--torea)', color: '#fff', boxShadow: '0 8px 24px rgba(10,42,146,0.3)' }}
        animate={{ y: [0, -6, 0] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}>
        Apple Silicon native
      </motion.div>

      {/* Floating stat */}
      <motion.div
        className="absolute -bottom-4 -left-6 rounded-2xl px-5 py-3 shadow-xl"
        style={{ background: '#fff', border: '1px solid var(--border-light)', boxShadow: '0 12px 40px rgba(49,36,31,0.1)' }}
        animate={{ y: [0, 4, 0] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1 }}>
        <div className="text-xl font-black" style={{ color: 'var(--torea)' }}>0 ms</div>
        <div className="text-[11px] font-medium" style={{ color: 'var(--text-muted)' }}>cold-start memory</div>
      </motion.div>
    </div>
  );
}

const pains = [
  {
    pain: 'Your AI feature is a wrapper around someone else\'s API. So is your competitor\'s.',
    fix: 'We architect the persistence layer underneath the wrapper. Memory is the moat — and it compounds.',
  },
  {
    pain: 'Every session your agent forgets the user. Every conversation starts cold.',
    fix: 'We build the memory pipeline: extraction, embedding, recall, decay. Your agent gets better every week.',
  },
  {
    pain: 'You\'re burning frontier-model tokens on tasks a small model could do.',
    fix: 'We fine-tune Apple Silicon-native models on your data, swap them in behind the same interface. Same quality, 1/200th the cost.',
  },
  {
    pain: 'Your team can ship a feature. You need someone who can ship an agentic system.',
    fix: 'Architecture, training, infra, evals, production. One team. We publish the methodology so you can audit the work.',
  },
];

export default function LandingPage() {
  return (
    <main className="min-h-screen overflow-x-hidden" style={{ background: 'var(--bg-primary)' }}>

      {/* ── NAV ── */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b"
        style={{ background: '#fff', borderColor: 'var(--border-light)' }}>
        <div className="max-w-[1200px] mx-auto px-8 h-[60px] flex justify-between items-center">
          <Link href="/" className="no-underline">
            <span className="text-xl font-black tracking-[-0.04em]" style={{ color: 'var(--cocoa)' }}>RISCENT</span>
          </Link>
          <div className="flex items-center gap-5 md:gap-8">
            <div className="hidden md:flex items-center gap-8">
              <a href="#visibility" className="text-[13px] font-medium tracking-[0.03em] uppercase no-underline transition-opacity hover:opacity-50" style={{ color: 'var(--text-muted)' }}>AI Search</a>
              <a href="#research" className="text-[13px] font-medium tracking-[0.03em] uppercase no-underline transition-opacity hover:opacity-50" style={{ color: 'var(--text-muted)' }}>Research</a>
              <a href="#build" className="text-[13px] font-medium tracking-[0.03em] uppercase no-underline transition-opacity hover:opacity-50" style={{ color: 'var(--text-muted)' }}>Build</a>
            </div>
            <FloatingCTA href="mailto:ryan@riscent.com?subject=Talk%20to%20Riscent" className="!py-2.5 !px-5 md:!px-6 text-[13px]">
              Talk to us
            </FloatingCTA>
          </div>
        </div>
      </header>

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex items-center pt-[60px] overflow-hidden"
        style={{ background: 'linear-gradient(160deg, var(--danube-pale) 0%, var(--shilo-pale) 45%, var(--bg-primary) 100%)' }}>

        {/* Decorative blobs */}
        <div className="absolute top-10 right-0 w-[700px] h-[700px] rounded-full opacity-25 pointer-events-none"
          style={{ background: 'radial-gradient(circle, var(--danube) 0%, transparent 65%)', filter: 'blur(100px)' }} />
        <div className="absolute bottom-20 left-0 w-[500px] h-[500px] rounded-full opacity-20 pointer-events-none"
          style={{ background: 'radial-gradient(circle, var(--shilo) 0%, transparent 70%)', filter: 'blur(80px)' }} />

        <div className="relative max-w-[1200px] mx-auto px-8 w-full grid lg:grid-cols-2 gap-16 items-center py-20">

          {/* Left: copy */}
          <div>
            <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: EASE }}>
              <Label color="var(--danube)" className="mb-6">AI consulting · agentic deployment · SLM tuning · AI memory</Label>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.1, ease: EASE }}>
              <Display size="xl" as="h1" className="mb-8 text-left leading-[0.92]">
                AI systems<br />that learn<br />
                <span style={{ color: 'var(--danube)' }}>your business</span>
              </Display>
            </motion.div>

            <motion.p className="text-lg md:text-xl leading-relaxed mb-10 max-w-[520px]"
              style={{ color: 'var(--text-secondary)' }}
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: EASE }}>
              We build agentic apps, PWAs, and custom software for businesses that need
              software with memory. We publish the research behind it — autonomous memory
              compression, self-directed fine-tuning, real benchmarks against frontier models.
            </motion.p>

            <motion.div className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5, ease: EASE }}>
              <FloatingCTA href="mailto:ryan@riscent.com?subject=Build%20with%20Riscent">
                Build with us &rarr;
              </FloatingCTA>
              <FloatingCTA href="#research" variant="secondary">
                See the research
              </FloatingCTA>
            </motion.div>
          </div>

          {/* Right: live product mock */}
          <motion.div
            initial={{ opacity: 0, x: 60, rotateY: -8 }} animate={{ opacity: 1, x: 0, rotateY: 0 }}
            transition={{ duration: 1.1, delay: 0.4, ease: EASE }}
            style={{ perspective: 800 }}>
            <HeroMock />
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}>
          <div className="w-6 h-10 rounded-full border-2 flex justify-center pt-2" style={{ borderColor: 'var(--border-medium)' }}>
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--danube)' }} />
          </div>
        </motion.div>
      </section>

      {/* ── STATS ── */}
      <StatRibbon stats={[
        { value: 'Agentic', label: 'by default' },
        { value: 'Open', label: 'methodology' },
        { value: '1M+', label: 'lines shipped' },
        { value: 'Apple Silicon', label: 'native' },
      ]} />

      {/* ── RESEARCH ── */}
      <section id="research" className="py-28 px-6" style={{ background: 'var(--bg-primary)' }}>
        <div className="max-w-[1100px] mx-auto">
          <ScrollReveal className="mb-16">
            <Label color="var(--danube)" className="mb-3">The research lane</Label>
            <Display size="md" className="mb-6">
              We&apos;re training AI<br />to manage its own memory.
            </Display>
            <p className="text-lg leading-relaxed max-w-[640px]" style={{ color: 'var(--text-secondary)' }}>
              Most agents forget. Ours don&apos;t. We publish what we learn building
              persistent intelligence — the methodology, the datasets, the benchmarks
              against frontier models. The same architecture goes into every system we ship.
            </p>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 gap-px mb-16" style={{ background: 'var(--border-light)' }}>
            <ScrollReveal>
              <div className="p-10 h-full" style={{ background: '#fff' }}>
                <div className="text-[11px] font-bold tracking-[0.12em] uppercase mb-3" style={{ color: 'var(--danube)' }}>In progress</div>
                <div className="text-2xl font-black tracking-[-0.03em] mb-4" style={{ color: 'var(--cocoa)' }}>
                  Autonomous memory compression
                </div>
                <p className="text-sm leading-relaxed mb-6" style={{ color: 'var(--text-secondary)' }}>
                  Training a small Apple Silicon-native model to classify, compress, and
                  store conversational memory in real time — replacing frontier API calls
                  in the persistence layer of every agent we build.
                </p>
                <div className="text-[11px] font-medium tracking-[0.06em] uppercase" style={{ color: 'var(--text-whisper)' }}>
                  Target: match Opus 4.7 accuracy at 1/200th the cost. Open eval coming.
                </div>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={0.1}>
              <div className="p-10 h-full" style={{ background: '#fff' }}>
                <div className="text-[11px] font-bold tracking-[0.12em] uppercase mb-3" style={{ color: 'var(--shilo)' }}>In progress</div>
                <div className="text-2xl font-black tracking-[-0.03em] mb-4" style={{ color: 'var(--cocoa)' }}>
                  Self-directed fine-tuning
                </div>
                <p className="text-sm leading-relaxed mb-6" style={{ color: 'var(--text-secondary)' }}>
                  An agent that uses its own accumulated decisions as training data,
                  scaffolds eval pairs from its own corrections, and trains its next
                  body without a human in the labeling loop.
                </p>
                <div className="text-[11px] font-medium tracking-[0.06em] uppercase" style={{ color: 'var(--text-whisper)' }}>
                  Live training log + eval dashboard publishing here as benchmarks land.
                </div>
              </div>
            </ScrollReveal>
          </div>

          <ScrollReveal delay={0.2}>
            <div className="flex flex-wrap gap-4 items-center">
              <FloatingCTA href="/docs" variant="secondary" className="!py-3 !px-7 text-[13px]">
                Read the research &rarr;
              </FloatingCTA>
              <span className="text-sm" style={{ color: 'var(--text-muted)' }}>
                Public dashboard launching as the first benchmarks land.
              </span>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── SLM STUDY + FINE-TUNING (real, measured results) ── */}
      <SlmStudy />

      {/* ── TRAIN BIG ONCE, DEPLOY SMALL FOREVER — economics + build/consult CTA ── */}
      <TrainDeploy />

      {/* ── BUILD ── */}
      <section id="build" className="py-28 px-6" style={{ background: 'var(--bg-secondary)' }}>
        <div className="max-w-[1100px] mx-auto">
          <ScrollReveal className="mb-14">
            <Label color="var(--torea)" className="mb-3">The build lane</Label>
            <Display size="md" className="mb-6">
              Want this engine<br />working on your problem?
            </Display>
            <p className="text-lg leading-relaxed max-w-[640px]" style={{ color: 'var(--text-secondary)' }}>
              We take on a small number of build engagements every quarter. Same team
              that&apos;s publishing the research. Same architecture, applied to whatever
              you&apos;re shipping.
            </p>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-px" style={{ background: 'var(--border-light)' }}>
            {[
              {
                tag: 'Custom software',
                title: 'Full product builds',
                body: 'Agentic backends, structured-data flows, internal tools, vertical SaaS. We architect, we ship, we hand over what works.',
              },
              {
                tag: 'Web apps',
                title: 'Modern web platforms',
                body: 'Next.js, Postgres, auth, payments, dashboards. Production-grade from day one — the stack we use for our own products.',
              },
              {
                tag: 'PWA integration',
                title: 'Install-anywhere apps',
                body: 'Progressive Web Apps that ship to iOS, Android, and desktop from one codebase. Offline-first when it matters.',
              },
            ].map((item, i) => (
              <ScrollReveal key={item.tag} delay={i * 0.08}>
                <div className="p-10 h-full" style={{ background: '#fff' }}>
                  <div className="text-[11px] font-bold tracking-[0.12em] uppercase mb-3" style={{ color: 'var(--torea)' }}>{item.tag}</div>
                  <div className="text-xl font-black tracking-[-0.03em] mb-4" style={{ color: 'var(--cocoa)' }}>{item.title}</div>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{item.body}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal delay={0.3}>
            <div className="mt-12 flex flex-wrap gap-4 items-center">
              <FloatingCTA href="mailto:ryan@riscent.com?subject=Build%20engagement%20—%20Riscent" className="!py-3 !px-7 text-[13px]">
                Start a project &rarr;
              </FloatingCTA>
              <span className="text-sm" style={{ color: 'var(--text-muted)' }}>
                We&apos;ll show you something working before you sign anything.
              </span>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── PAIN POINTS ── */}
      <section className="py-28 px-6" style={{ background: 'var(--cocoa)' }}>
        <div className="max-w-[1100px] mx-auto">
          <ScrollReveal className="mb-16">
            <Label color="var(--shilo)" className="mb-3">The problem</Label>
            <Display size="md" color="#fff">Sound familiar?</Display>
          </ScrollReveal>
          <div className="border-t" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
            {pains.map((item, i) => (
              <ScrollReveal key={i} delay={i * 0.08}>
                <div className="grid md:grid-cols-2 gap-10 py-10 border-b" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
                  <p className="text-xl font-semibold leading-snug" style={{ color: 'rgba(255,255,255,0.88)' }}>
                    {item.pain}
                  </p>
                  <p className="text-base leading-relaxed" style={{ color: 'var(--shilo)' }}>
                    <span className="font-bold">→ </span>{item.fix}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── APPLIED / PROOF — results over idealism (Phantom Vault, synthetic memory, cited ROI reality) ── */}
      <ProofSection />

      {/* ── AI VISIBILITY — the scan / GEO-AEO specialty (cited stats + POC) ── */}
      <AiVisibility />

      {/* ── WHY US ── */}
      <section id="proof" className="py-28 px-6">
        <div className="max-w-[900px] mx-auto text-center">
          <ScrollReveal>
            <Label color="var(--danube)" className="mb-4">Why us</Label>
            <Display size="md" className="mb-6">
              We build the kind of AI<br />most teams don&apos;t know how to build.
            </Display>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <p className="text-lg leading-relaxed max-w-[640px] mx-auto mb-16" style={{ color: 'var(--text-secondary)' }}>
              Most AI work today is wrapper code around someone else&apos;s API. Ours
              isn&apos;t. We architect persistence, train our own models, publish the
              methodology, and run it in production. Healthcare was our first vertical —
              HIPAA-grade voice agents, midnight calls, two languages — and the same
              architecture now ships across eight industries.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-px mb-14" style={{ background: 'var(--border-light)' }}>
              {[
                { val: '1M+', lbl: 'lines shipped' },
                { val: 'Agentic', lbl: 'by default' },
                { val: 'Open', lbl: 'methodology' },
                { val: 'HIPAA', lbl: 'production-grade' },
              ].map(s => (
                <div key={s.lbl} className="p-8" style={{ background: '#fff' }}>
                  <div className="text-3xl font-black tracking-[-0.03em]" style={{ color: 'var(--torea)' }}>{s.val}</div>
                  <div className="text-xs font-medium tracking-[0.08em] uppercase mt-2" style={{ color: 'var(--text-whisper)' }}>{s.lbl}</div>
                </div>
              ))}
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.3}>
            <p className="text-sm tracking-[0.04em]" style={{ color: 'var(--text-whisper)' }}>
              Healthcare &nbsp;·&nbsp; Home Services &nbsp;·&nbsp; Legal &nbsp;·&nbsp; Real Estate &nbsp;·&nbsp; Restaurants &nbsp;·&nbsp; Auto &nbsp;·&nbsp; Fitness &nbsp;·&nbsp; E-commerce
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <GradientSection id="cta" dark from="var(--cocoa)" to="var(--torea)" direction="135deg" className="text-center">
        <ScrollReveal className="max-w-[760px] mx-auto">
          <Display color="#fff" className="mb-6">
            Two ways<br />to build with us.
          </Display>
          <p className="text-lg leading-relaxed mb-12" style={{ color: 'rgba(255,255,255,0.7)' }}>
            We&apos;re a consulting agency — no products to buy. <strong style={{ color: '#fff' }}>Custom builds:</strong> we
            architect and ship your agentic systems, fine-tuned models, and AI software.
            <strong style={{ color: '#fff' }}> Consultations:</strong> we advise on model selection, memory, and getting your
            business visible inside the models buyers now ask. Either way, you work with the team publishing the research.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <FloatingCTA href="mailto:ryan@riscent.com?subject=Custom%20build%20%E2%80%94%20Riscent" variant="light">
              Start a custom build &rarr;
            </FloatingCTA>
            <FloatingCTA href="mailto:ryan@riscent.com?subject=Consultation%20%E2%80%94%20Riscent" variant="secondary-light">
              Book a consultation
            </FloatingCTA>
          </div>
          <p className="text-sm mt-8" style={{ color: 'rgba(255,255,255,0.35)' }}>
            Limited engagements each quarter &middot; Response in 24 hours
          </p>
        </ScrollReveal>
      </GradientSection>

      {/* ── FOOTER ── */}
      <footer className="py-10 px-6 border-t" style={{ background: '#fff', borderColor: 'var(--border-light)' }}>
        <div className="max-w-[1100px] mx-auto flex flex-col md:flex-row justify-between items-start gap-8 text-sm">
          <div>
            <div className="text-base font-black tracking-[-0.03em] mb-2" style={{ color: 'var(--cocoa)' }}>RISCENT</div>
            <div style={{ color: 'var(--text-muted)' }}>Agentic AI — research and build.</div>
          </div>
          <div className="flex flex-wrap gap-6">
            <a href="#research" className="no-underline hover:opacity-60 transition-opacity text-[13px]" style={{ color: 'var(--text-secondary)' }}>Research</a>
            <a href="#build" className="no-underline hover:opacity-60 transition-opacity text-[13px]" style={{ color: 'var(--text-secondary)' }}>Build</a>
            <a href="#solutions" className="no-underline hover:opacity-60 transition-opacity text-[13px]" style={{ color: 'var(--text-secondary)' }}>Applied</a>
            <a href="mailto:ryan@riscent.com" className="no-underline hover:opacity-60 transition-opacity text-[13px]"
              style={{ color: 'var(--text-secondary)' }}>
              Contact
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
