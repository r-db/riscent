'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ScrollReveal,
  GradientSection,
  StatRibbon,
  FloatingCTA,
  TabDemo,
} from '@/components/ui/animated';
import { Display, Label } from '@/components/ui/typography';

const EASE = [0.59, 0.06, 0.1, 1] as const;

/* ── Hero product mock: simulated AI call UI ── */
const mockMessages = [
  { from: 'caller', text: 'Hi, I need to book a plumbing repair — pipe is leaking under the sink.' },
  { from: 'ai', text: "I can get someone out tomorrow morning. Can I get your address?" },
  { from: 'caller', text: '412 Sunset Drive' },
  { from: 'ai', text: "Perfect. I have 9 AM open with Mike. Shall I confirm that?" },
  { from: 'caller', text: 'Yes please!' },
  { from: 'ai', text: "Booked! You'll get a confirmation text shortly. Anything else I can help with?" },
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
          <span>BookBot</span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            Live Call
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
          <span>Smith Plumbing</span>
          <span style={{ color: 'var(--sage-deep, #4A7C59)' }}>● Recording</span>
        </div>
      </div>

      {/* Floating badge */}
      <motion.div
        className="absolute -top-4 -right-4 rounded-full px-4 py-2 text-xs font-bold shadow-lg"
        style={{ background: 'var(--torea)', color: '#fff', boxShadow: '0 8px 24px rgba(10,42,146,0.3)' }}
        animate={{ y: [0, -6, 0] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}>
        24/7 AI Receptionist
      </motion.div>

      {/* Floating stat */}
      <motion.div
        className="absolute -bottom-4 -left-6 rounded-2xl px-5 py-3 shadow-xl"
        style={{ background: '#fff', border: '1px solid var(--border-light)', boxShadow: '0 12px 40px rgba(49,36,31,0.1)' }}
        animate={{ y: [0, 4, 0] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1 }}>
        <div className="text-xl font-black" style={{ color: 'var(--torea)' }}>1,700+</div>
        <div className="text-[11px] font-medium" style={{ color: 'var(--text-muted)' }}>calls handled</div>
      </motion.div>
    </div>
  );
}

const products = [
  { name: 'Chatterbox', tag: 'Website Chat', line: 'AI chat that answers questions, books appointments, and captures leads — on your website, 24/7.' },
  { name: 'BookBot', tag: 'Phone Agent', line: 'AI receptionist that answers every call, looks up customers, and books appointments. Never misses.' },
  { name: 'LinguaReach', tag: 'Multilingual', line: 'Write in English. Your customers read in their language. 12 languages, instant.' },
  { name: 'VoiceGuard', tag: 'Voice QA', line: 'Catches what your AI voice agent gets wrong and fixes it before customers complain.' },
  { name: 'DripForce', tag: 'Service CRM', line: 'Client management, scheduling, and AI follow-ups — built for contractors and service teams.' },
  { name: 'VoiceTrain', tag: 'AI Training', line: 'Turn real conversations into training data. Your AI agent improves every week.' },
];

const pains = [
  {
    pain: 'Customer calls at 6 PM. Nobody picks up. They call your competitor.',
    fix: 'AI answers every call — any hour, any day. No voicemail, no missed revenue.',
  },
  {
    pain: "Your team spends hours answering the same questions every day.",
    fix: 'AI handles the repetitive questions so your team can focus on real work.',
  },
  {
    pain: 'You tried a chatbot. It felt robotic and embarrassed your brand.',
    fix: 'Trained on YOUR business. Sounds like YOUR team. Not a script bot.',
  },
  {
    pain: '30% of your customers speak Spanish. Your website speaks only English.',
    fix: 'Professional outreach in 12 languages — instant, not Google Translate.',
  },
];

const demoTabs = [
  {
    label: 'Chat Widget',
    desc: 'Answers customer questions instantly on your website — trained on your business, not generic AI responses.',
    demo: '> Customer: "What are your hours?"\n\n< BookBot: "We\'re open Mon–Fri 8AM–6PM and Sat 9AM–2PM. Would you like to schedule an appointment?"\n\n> Customer: "Saturday works!"\n\n< BookBot: "I\'ve got 10AM or 1PM open. Which works better for you?"',
  },
  {
    label: 'Phone Agent',
    desc: 'Picks up calls your team misses — books appointments, looks up history, never puts anyone on hold.',
    demo: '📞 [Ring...]\n\n< "Hi, this is BookBot for Smith Plumbing. How can I help?\"\n\n> "I need a repair, pipe is leaking"\n\n< "I can get someone out tomorrow. Can I get your address?"\n\n> "123 Main St"\n\n< "Perfect, 9AM tomorrow. You\'ll get a confirmation text."',
  },
  {
    label: 'Translation',
    desc: 'Your messages auto-translate into 12 languages — professional tone, not Google Translate.',
    demo: '[ English ]\n"Thank you for your interest! Our team will follow up within 24 hours."\n\n[ Spanish ]\n"¡Gracias por su interés! Nuestro equipo le dará seguimiento en 24 horas."\n\n[ Mandarin ]\n"感谢您的关注！我们的团队将在24小时内跟进。"',
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
          <div className="flex items-center gap-8">
            <a href="#research" className="text-[13px] font-medium tracking-[0.03em] uppercase no-underline transition-opacity hover:opacity-50" style={{ color: 'var(--text-muted)' }}>Research</a>
            <a href="#build" className="text-[13px] font-medium tracking-[0.03em] uppercase no-underline transition-opacity hover:opacity-50" style={{ color: 'var(--text-muted)' }}>Build</a>
            <a href="#solutions" className="text-[13px] font-medium tracking-[0.03em] uppercase no-underline transition-opacity hover:opacity-50" style={{ color: 'var(--text-muted)' }}>Applied</a>
            <FloatingCTA href="mailto:ryan@riscent.com?subject=Build%20with%20Riscent" className="!py-2.5 !px-6 text-[13px]">
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
              <Label color="var(--danube)" className="mb-6">Agentic AI — research and build</Label>
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
              <FloatingCTA href="/research" variant="secondary" className="!py-3 !px-7 text-[13px]">
                Research notes &rarr;
              </FloatingCTA>
              <span className="text-sm" style={{ color: 'var(--text-muted)' }}>
                Public dashboard launching as the first benchmarks land.
              </span>
            </div>
          </ScrollReveal>
        </div>
      </section>

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

      {/* ── LIVE DEMO ── */}
      <section className="py-28 px-6" style={{ background: 'var(--bg-primary)' }}>
        <div className="max-w-[1100px] mx-auto">
          <ScrollReveal className="mb-12">
            <Label color="var(--torea)" className="mb-3">See it in action</Label>
            <Display size="md">Watch it work.</Display>
          </ScrollReveal>
          <TabDemo tabs={demoTabs} />
        </div>
      </section>

      {/* ── APPLIED (products) ── */}
      <section id="solutions" className="py-28 px-6" style={{ background: 'var(--bg-primary)' }}>
        <div className="max-w-[1100px] mx-auto">
          <ScrollReveal className="mb-16">
            <Label color="var(--torea)" className="mb-3">Applied</Label>
            <Display size="md" className="mb-4">What the engine makes,<br />when we point it at a problem.</Display>
            <p className="text-base leading-relaxed max-w-[620px] mt-6" style={{ color: 'var(--text-secondary)' }}>
              Six products we&apos;ve shipped on top of the same agentic stack —
              each one proof the architecture works in a specific market. The same
              engine ships into client builds.
            </p>
          </ScrollReveal>
          <div className="border-t" style={{ borderColor: 'var(--border-medium)' }}>
            {products.map((p, i) => (
              <ScrollReveal key={p.name} delay={i * 0.06}>
                <div className="grid grid-cols-[56px_1fr_1.4fr] gap-10 py-8 border-b items-baseline" style={{ borderColor: 'var(--border-light)' }}>
                  <span className="text-[13px] font-bold tracking-[0.04em]" style={{ color: 'var(--text-whisper)' }}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <div className="text-[11px] font-bold tracking-[0.12em] uppercase mb-1.5" style={{ color: 'var(--danube)' }}>{p.tag}</div>
                    <div className="text-2xl font-black tracking-[-0.03em]" style={{ color: 'var(--cocoa)' }}>{p.name}</div>
                  </div>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{p.line}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

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
            Two ways<br />to work with us.
          </Display>
          <p className="text-lg leading-relaxed mb-12" style={{ color: 'rgba(255,255,255,0.7)' }}>
            Hire us to build the agentic system your business needs, or buy one of the
            products we&apos;ve already shipped on the same stack. Either way, you&apos;re working
            with the team publishing the research.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <FloatingCTA href="mailto:ryan@riscent.com?subject=Build%20with%20Riscent" variant="light">
              Build with us &rarr;
            </FloatingCTA>
            <FloatingCTA href="#solutions" variant="secondary">
              Browse the products
            </FloatingCTA>
          </div>
          <p className="text-sm mt-8" style={{ color: 'rgba(255,255,255,0.35)' }}>
            Limited build slots each quarter &middot; Response in 24 hours
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
