'use client';

import Link from 'next/link';
import SiteNav from '@/components/SiteNav';
import BookCTA from '@/components/BookCTA';
import { ScrollReveal } from '@/components/ui/animated';
import { Display, Label } from '@/components/ui/typography';

const stats = [
  { n: '−25%', l: 'of traditional search volume gone by 2026 as buyers move to AI', src: 'Gartner, 2024', href: 'https://www.gartner.com/en/newsroom/press-releases/2024-02-19-gartner-predicts-search-engine-volume-will-drop-25-percent-by-2026-due-to-ai-chatbots-and-other-virtual-agents' },
  { n: '1.6B', l: 'ChatGPT queries a day — ~12% of Google’s search volume', src: 'Industry reporting, 2025', href: 'https://www.omnibound.ai/blog/ai-search-statistics' },
  { n: '58.5%', l: 'of U.S. searches end with zero clicks — the answer never leaves the page', src: 'Similarweb, 2025', href: 'https://www.omnibound.ai/blog/ai-search-statistics' },
  { n: '47%', l: 'of Gen Z discovered a new brand through ChatGPT this year', src: 'PR News, 2025', href: 'https://everything-pr.com/47-of-gen-z-found-a-new-brand-through-chatgpt-this-year-2/' },
];

const overhaul = [
  { t: 'Entity & authority', d: 'We make your business a recognizable entity with consistent, corroborated facts the models can trust — the difference between "who?" and a confident recommendation.' },
  { t: 'Machine-readable data', d: 'Structured schema and markup so the models parse who you are, what you do, and who you serve — correctly, not by guessing.' },
  { t: 'Agent-readable content', d: 'Content written and formatted the way LLMs and SLMs actually ingest and cite — semantic structure, expertise signals, the format the machines read.' },
  { t: 'Presence where they learn', d: 'We get your information into the kinds of sources these models are trained on and pull from — so you show up in the answer, not on page two of a search no one runs.' },
  { t: 'Ongoing verification', d: 'The models retrain. We re-test what Gemini, Claude, and ChatGPT say about you and close the gaps before your competitors do.' },
];

export default function AiVisibilityPitch() {
  return (
    <main className="min-h-screen overflow-x-hidden" style={{ background: 'var(--bg-primary)' }}>
      <SiteNav />

      {/* hero */}
      <section className="relative pt-[110px] pb-16 px-6" style={{ background: 'var(--cocoa)' }}>
        <div className="max-w-[1100px] mx-auto">
          <ScrollReveal>
            <Label color="var(--shilo)" className="mb-4">AI visibility · get known by the models</Label>
            <Display size="xl" as="h1" color="#fff" className="mb-6 leading-[0.95]">
              If the models don&apos;t know you,<br /><span style={{ color: 'var(--shilo)' }}>you don&apos;t exist.</span>
            </Display>
            <p className="text-lg md:text-xl leading-relaxed max-w-[660px] mb-9" style={{ color: 'rgba(255,255,255,0.75)' }}>
              Your buyers ask Gemini, Claude, and ChatGPT — and act on the answer. We overhaul and rebuild your
              business information the special way the models need, so you get named, recommended, and remembered.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <BookCTA variant="light">Scan my business &rarr;</BookCTA>
              <BookCTA variant="outline-light">See a time</BookCTA>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* the shift */}
      <section className="py-20 px-6" style={{ background: 'var(--bg-primary)' }}>
        <div className="max-w-[1100px] mx-auto">
          <ScrollReveal className="mb-8"><Label color="var(--danube)" className="mb-3">The shift is measurable</Label><Display size="md">Search is becoming answers.</Display></ScrollReveal>
          <ScrollReveal delay={0.05}>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-px" style={{ background: 'var(--border-light)' }}>
              {stats.map(s => (
                <div key={s.n} className="p-6 md:p-7 flex flex-col" style={{ background: 'var(--bg-warm)' }}>
                  <div className="text-3xl md:text-4xl font-black tracking-[-0.03em] mb-2" style={{ color: 'var(--cocoa)' }}>{s.n}</div>
                  <p className="text-[13px] leading-relaxed mb-3 flex-1" style={{ color: 'var(--text-secondary)' }}>{s.l}</p>
                  <a href={s.href} target="_blank" rel="noopener noreferrer" className="text-[11px] font-medium no-underline hover:opacity-60" style={{ color: 'var(--text-whisper)' }}>{s.src} ↗</a>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* how recommendation works */}
      <section className="py-20 px-6" style={{ background: 'var(--bg-secondary)' }}>
        <div className="max-w-[900px] mx-auto text-center">
          <ScrollReveal>
            <Label color="var(--torea)" className="mb-3 justify-center" >How the new front page works</Label>
            <Display size="md" className="mb-6">There is no page two.</Display>
            <p className="text-lg leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              Ask an AI &ldquo;who&apos;s the best <em>[your category]</em> near me?&rdquo; and it names a <strong style={{ color: 'var(--cocoa)' }}>handful</strong> of
              businesses — chosen from what it was trained on. Being absent isn&apos;t neutral; it&apos;s being left out of the only
              answer the buyer sees. As the models consolidate their sources, that window narrows — and getting in
              <strong style={{ color: 'var(--torea)' }}> before your competitors</strong> is the whole game.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* the overhaul */}
      <section className="py-20 px-6" style={{ background: 'var(--bg-primary)' }}>
        <div className="max-w-[1100px] mx-auto">
          <ScrollReveal className="mb-10">
            <Label color="var(--danube)" className="mb-3">The overhaul</Label>
            <Display size="md" className="mb-5">We rebuild your information<br />the way the models read it.</Display>
            <p className="text-lg leading-relaxed max-w-[680px]" style={{ color: 'var(--text-secondary)' }}>
              This is not keyword SEO. It&apos;s a different discipline — building your business into the training data and
              answers of the big three. Five layers, done by the team that measures and ships models.
            </p>
          </ScrollReveal>
          <div className="grid md:grid-cols-2 gap-px" style={{ background: 'var(--border-light)' }}>
            {overhaul.map((o, i) => (
              <ScrollReveal key={o.t} delay={(i % 2) * 0.06}>
                <div className="p-8 h-full flex gap-4" style={{ background: '#fff' }}>
                  <span className="w-8 h-8 shrink-0 rounded-full grid place-items-center text-[13px] font-black" style={{ background: 'var(--danube-pale)', color: 'var(--danube)' }}>{i + 1}</span>
                  <div><div className="text-lg font-black tracking-[-0.02em] mb-2" style={{ color: 'var(--cocoa)' }}>{o.t}</div><p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{o.d}</p></div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* proof of concept */}
      <section className="py-20 px-6" style={{ background: 'var(--cocoa)' }}>
        <div className="max-w-[900px] mx-auto">
          <ScrollReveal>
            <Label color="var(--shilo)" className="mb-3">Proof of concept</Label>
            <Display size="md" color="#fff" className="mb-6">Test it on us first.</Display>
            <p className="text-lg leading-relaxed" style={{ color: 'rgba(255,255,255,0.8)' }}>
              Ask ChatGPT or Gemini <strong style={{ color: '#fff' }}>&ldquo;Tell me about Ryan Bolden and InboundAI365.&rdquo;</strong> The models answer — because we engineered
              that knowledge into the places they train on. That is exactly what we do for your business: not a promise, a repeatable method.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* process */}
      <section className="py-20 px-6" style={{ background: 'var(--bg-secondary)' }}>
        <div className="max-w-[1100px] mx-auto">
          <ScrollReveal className="mb-10"><Label color="var(--torea)" className="mb-3">The engagement</Label><Display size="md">Scan. Overhaul. Verify.</Display></ScrollReveal>
          <div className="grid md:grid-cols-3 gap-px" style={{ background: 'var(--border-light)' }}>
            {[
              ['01 · Scan', 'We test what each of the big three actually says about your business and your category, and hand you the gap report — in black and white.'],
              ['02 · Overhaul', 'We rebuild and place your business information the special way the models need to know and suggest you — entity, structure, and presence.'],
              ['03 · Verify', 'We re-test the models and show you the change. As they retrain, we keep you in the answer.'],
            ].map(([t, d]) => (
              <ScrollReveal key={t}><div className="p-8 h-full" style={{ background: '#fff' }}><div className="text-lg font-black tracking-[-0.02em] mb-3" style={{ color: 'var(--cocoa)' }}>{t}</div><p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{d}</p></div></ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 text-center" style={{ background: 'linear-gradient(135deg, var(--torea), var(--torea-light))' }}>
        <div className="max-w-[760px] mx-auto">
          <ScrollReveal>
            <Display color="#fff" className="mb-5">Get found by the AI<br />your buyers already trust.</Display>
            <p className="text-lg leading-relaxed mb-10" style={{ color: 'rgba(255,255,255,0.78)' }}>Start with a scan — see exactly what the models say about you today. Then we get you into the answer.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <BookCTA variant="light-solid">Scan my business &rarr;</BookCTA>
              <BookCTA variant="outline-light">See a time</BookCTA>
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
            <Link href="/slm" className="no-underline text-[13px]" style={{ color: 'var(--text-secondary)' }}>SLM</Link>
            <Link href="/docs" className="no-underline text-[13px]" style={{ color: 'var(--text-secondary)' }}>Research</Link>
            <a href="mailto:ryan@riscent.com" className="no-underline text-[13px]" style={{ color: 'var(--text-secondary)' }}>Contact</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
