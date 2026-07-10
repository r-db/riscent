'use client';

import SiteNav from '@/components/SiteNav';
import BookCTA from '@/components/BookCTA';
import { ScrollReveal } from '@/components/ui/animated';
import { Display, Label } from '@/components/ui/typography';

/* Impact + shift numbers are outcome/why signals (sourced). The "how" is deliberately not here. */
const shift = [
  { n: '−25%', l: 'of traditional search volume gone by 2026 as buyers move to AI', src: 'Gartner, 2024' },
  { n: '58.5%', l: 'of U.S. searches now end with zero clicks — the answer never leaves the page', src: 'Similarweb, 2025' },
  { n: '1.6B', l: 'AI-assistant queries a day and climbing — a new front door to every business', src: 'Industry reporting, 2025' },
  { n: '47%', l: 'of Gen Z discovered a brand through an AI assistant this year', src: 'PR News, 2025' },
];

export default function GeoPitch() {
  return (
    <main className="min-h-screen overflow-x-hidden" style={{ background: 'var(--bg-primary)' }}>
      <SiteNav />

      {/* ── hero ─────────────────────────────────────────────── */}
      <section className="relative pt-[110px] pb-16 px-6" style={{ background: 'var(--cocoa)' }}>
        <div className="max-w-[1100px] mx-auto">
          <ScrollReveal>
            <Label color="var(--shilo)" className="mb-4">GEO · Generative Engine Optimization</Label>
            <Display size="xl" as="h1" color="#fff" className="mb-6 leading-[0.95]">
              When the AI answers,<br /><span style={{ color: 'var(--shilo)' }}>its citations are the traffic.</span>
            </Display>
            <p className="text-lg md:text-xl leading-relaxed max-w-[680px] mb-9" style={{ color: 'rgba(255,255,255,0.78)' }}>
              For twenty years the game was ranking on Google. Now a growing share of your buyers don&apos;t
              search — they <em>ask</em>. ChatGPT, Gemini, Claude, Perplexity and Grok return one synthesized
              answer naming two or three companies. If you&apos;re not in it, you don&apos;t exist for that customer.
              <strong style={{ color: '#fff' }}> Getting named in that answer is GEO.</strong>
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <BookCTA variant="light">See where you stand &rarr;</BookCTA>
              <BookCTA variant="outline-light">Talk to Ryan</BookCTA>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── the shift is measurable ──────────────────────────── */}
      <section className="py-20 px-6" style={{ background: 'var(--bg-primary)' }}>
        <div className="max-w-[1100px] mx-auto">
          <ScrollReveal className="mb-8">
            <Label color="var(--danube)" className="mb-3">The shift is already here</Label>
            <Display size="md">Search is becoming answers.</Display>
          </ScrollReveal>
          <ScrollReveal delay={0.05}>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-px" style={{ background: 'var(--border-light)' }}>
              {shift.map(s => (
                <div key={s.n} className="p-6 md:p-7 flex flex-col" style={{ background: 'var(--bg-warm)' }}>
                  <div className="text-3xl md:text-4xl font-black tracking-[-0.03em] mb-2" style={{ color: 'var(--cocoa)' }}>{s.n}</div>
                  <p className="text-[13px] leading-relaxed mb-3 flex-1" style={{ color: 'var(--text-secondary)' }}>{s.l}</p>
                  <span className="text-[11px] font-medium" style={{ color: 'var(--text-whisper)' }}>{s.src}</span>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── there is no page two (graphic) ───────────────────── */}
      <section className="py-20 px-6" style={{ background: 'var(--bg-secondary)' }}>
        <div className="max-w-[1000px] mx-auto">
          <ScrollReveal className="mb-10 text-center">
            <Label color="var(--torea)" className="mb-3 justify-center">How the new front page works</Label>
            <Display size="md" className="mb-5">There is no page two.</Display>
            <p className="text-lg leading-relaxed max-w-[680px] mx-auto" style={{ color: 'var(--text-secondary)' }}>
              A buyer asks &ldquo;who&apos;s the best <em>[your category]</em>?&rdquo; The assistant names a handful of
              businesses and stops. Everyone it didn&apos;t mention isn&apos;t ranked lower — they&apos;re simply not in the answer.
            </p>
          </ScrollReveal>

          {/* The answer card + the invisible pile */}
          <ScrollReveal delay={0.05}>
            <div className="grid md:grid-cols-2 gap-6 items-center">
              {/* synthesized answer */}
              <div className="rounded-lg overflow-hidden" style={{ background: '#fff', border: '1px solid var(--border-light)', boxShadow: '0 20px 50px rgba(49,36,31,0.10)' }}>
                <div className="flex items-center gap-2 px-5 py-3" style={{ borderBottom: '1px solid var(--border-light)' }}>
                  <span className="w-6 h-6 rounded-full grid place-items-center text-[13px]" style={{ background: 'var(--torea)', color: '#fff' }}>✦</span>
                  <span className="text-[13px] font-bold" style={{ color: 'var(--cocoa)' }}>AI Assistant</span>
                </div>
                <div className="px-5 py-5">
                  <p className="text-[14px] leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>
                    For that, the three I&apos;d recommend are:
                  </p>
                  {['Northstar Co. — the category leader', 'Bright & Able — best reviewed', 'Meridian Group — great value'].map((t, i) => (
                    <div key={i} className="flex items-center gap-3 mb-2.5 px-3 py-2.5 rounded-md" style={{ background: 'var(--danube-pale)' }}>
                      <span className="text-[12px] font-black w-5 h-5 grid place-items-center rounded-full" style={{ background: 'var(--torea)', color: '#fff' }}>{i + 1}</span>
                      <span className="text-[13.5px] font-semibold" style={{ color: 'var(--cocoa)' }}>{t}</span>
                    </div>
                  ))}
                  <p className="text-[12px] mt-3" style={{ color: 'var(--text-muted)' }}>Sources: 3 sites cited ↗</p>
                </div>
              </div>
              {/* the invisible */}
              <div className="text-center md:text-left">
                <div className="relative h-[180px] mb-5">
                  {[0, 1, 2, 3, 4].map(i => (
                    <div key={i} className="absolute left-0 right-0 mx-auto rounded-md" style={{
                      top: `${i * 30}px`, height: '38px', maxWidth: `${92 - i * 6}%`,
                      background: 'var(--bg-tertiary)', opacity: 0.9 - i * 0.16,
                      border: '1px dashed var(--border-medium)',
                    }} />
                  ))}
                  <div className="absolute inset-0 grid place-items-center">
                    <span className="text-[13px] font-bold px-3 py-1.5 rounded-full" style={{ background: 'var(--cocoa)', color: '#fff' }}>everyone else</span>
                  </div>
                </div>
                <p className="text-[15px] leading-relaxed font-semibold" style={{ color: 'var(--cocoa)' }}>
                  No page two. No scroll. No second chance.
                </p>
                <p className="text-[14px] leading-relaxed mt-1" style={{ color: 'var(--text-secondary)' }}>
                  Being absent from the answer isn&apos;t neutral — it&apos;s being left out of the only result the buyer sees.
                </p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── what GEO is (two doors — the WHAT, not the HOW) ──── */}
      <section className="py-20 px-6" style={{ background: 'var(--bg-primary)' }}>
        <div className="max-w-[1000px] mx-auto">
          <ScrollReveal className="mb-10">
            <Label color="var(--danube)" className="mb-3">What GEO actually is</Label>
            <Display size="md" className="mb-5">Two ways into the answer.</Display>
            <p className="text-lg leading-relaxed max-w-[700px]" style={{ color: 'var(--text-secondary)' }}>
              An AI can name your business two ways — and understanding the difference is the whole point. One
              you can&apos;t change on demand. The other is winnable, measurable, and where all the practical leverage lives.
            </p>
          </ScrollReveal>
          <ScrollReveal delay={0.05}>
            <div className="grid md:grid-cols-2 gap-5">
              <div className="p-7 rounded-lg" style={{ background: 'var(--bg-warm)', border: '1px solid var(--border-light)' }}>
                <div className="text-[12px] font-black tracking-[0.1em] uppercase mb-3" style={{ color: 'var(--text-muted)' }}>Door 1 · what it already learned</div>
                <h3 className="text-xl font-black mb-3" style={{ color: 'var(--cocoa)' }}>Frozen until the next model ships.</h3>
                <p className="text-[15px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  Some of what an AI &ldquo;knows&rdquo; was baked in months or years ago. You can&apos;t flip it on this quarter —
                  and anyone promising to &ldquo;get you into the training data&rdquo; on demand is selling something they can&apos;t deliver.
                </p>
              </div>
              <div className="p-7 rounded-lg" style={{ background: 'var(--cocoa)', border: '1px solid var(--cocoa)' }}>
                <div className="text-[12px] font-black tracking-[0.1em] uppercase mb-3" style={{ color: 'var(--shilo)' }}>Door 2 · what it finds when asked</div>
                <h3 className="text-xl font-black mb-3" style={{ color: '#fff' }}>Live, measurable, winnable.</h3>
                <p className="text-[15px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.8)' }}>
                  When someone asks, the assistant searches the web right then, reads what it finds, and cites it in the
                  answer. That happens in real time — it can be measured, and it can be won. This is the door GEO opens.
                  <strong style={{ color: '#fff' }}> How we open it is our craft; that it&apos;s open is the opportunity.</strong>
                </p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── the impact of being cited (graphic) ──────────────── */}
      <section className="py-20 px-6" style={{ background: 'var(--bg-secondary)' }}>
        <div className="max-w-[1000px] mx-auto">
          <ScrollReveal className="mb-10 text-center">
            <Label color="var(--growth, #0EA968)" className="mb-3 justify-center">The measured payoff</Label>
            <Display size="md" className="mb-5">Being cited isn&apos;t vanity. It&apos;s traffic.</Display>
            <p className="text-lg leading-relaxed max-w-[640px] mx-auto" style={{ color: 'var(--text-secondary)' }}>
              Brands named in AI answers don&apos;t just look credible — they get the click. Versus uncited competitors:
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.05}>
            <div className="grid sm:grid-cols-2 gap-5 max-w-[720px] mx-auto">
              {[
                { n: '+35%', l: 'organic click-through', c: 'var(--torea)' },
                { n: '+91%', l: 'paid click-through', c: 'var(--growth, #0EA968)' },
              ].map(b => (
                <div key={b.n} className="p-8 rounded-lg text-center" style={{ background: '#fff', border: '1px solid var(--border-light)', boxShadow: '0 12px 34px rgba(49,36,31,0.06)' }}>
                  <div className="text-5xl md:text-6xl font-black tracking-[-0.04em] mb-2" style={{ color: b.c }}>{b.n}</div>
                  {/* bar */}
                  <div className="h-2.5 rounded-full my-4 overflow-hidden" style={{ background: 'var(--bg-tertiary)' }}>
                    <div className="h-full rounded-full" style={{ width: b.n === '+35%' ? '55%' : '92%', background: b.c }} />
                  </div>
                  <p className="text-[14px] font-semibold" style={{ color: 'var(--cocoa)' }}>{b.l} vs. uncited</p>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── the cost of waiting (widening-gap graphic) ───────── */}
      <section className="py-20 px-6" style={{ background: 'var(--cocoa)' }}>
        <div className="max-w-[1000px] mx-auto">
          <ScrollReveal className="mb-10">
            <Label color="var(--shilo)" className="mb-3">The cost of sitting it out</Label>
            <Display size="md" color="#fff" className="mb-5">The gap compounds — and it&apos;s widening now.</Display>
            <p className="text-lg leading-relaxed max-w-[700px]" style={{ color: 'rgba(255,255,255,0.72)' }}>
              The sites the assistants learn to trust <em>today</em> become their default citations tomorrow. Early movers
              get named, earn the clicks, get talked about, and get named more. Everyone who waits watches the answer
              harden around their competitors.
            </p>
          </ScrollReveal>

          {/* diverging lines */}
          <ScrollReveal delay={0.05}>
            <div className="rounded-lg p-6 md:p-8" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <svg viewBox="0 0 760 300" className="w-full h-auto" role="img" aria-label="Diverging lines: businesses that invest in GEO pull ahead in AI citations while those who wait fall behind over time.">
                {/* axes */}
                <line x1="60" y1="20" x2="60" y2="250" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
                <line x1="60" y1="250" x2="730" y2="250" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
                <text x="60" y="278" fill="rgba(255,255,255,0.5)" fontSize="13" fontWeight="600">now</text>
                <text x="392" y="278" fill="rgba(255,255,255,0.5)" fontSize="13" fontWeight="600" textAnchor="middle">next few quarters</text>
                <text x="730" y="278" fill="rgba(255,255,255,0.5)" fontSize="13" fontWeight="600" textAnchor="end">this time next year</text>
                <text x="30" y="140" fill="rgba(255,255,255,0.5)" fontSize="13" fontWeight="600" transform="rotate(-90 30 140)" textAnchor="middle">AI citation share</text>
                {/* early-mover curve (up) */}
                <path d="M60 210 C 250 200, 420 120, 730 40" fill="none" stroke="var(--shilo)" strokeWidth="4" strokeLinecap="round" />
                {/* wait-and-see curve (flat/down) */}
                <path d="M60 210 C 250 220, 420 235, 730 244" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="4" strokeLinecap="round" strokeDasharray="2 9" />
                {/* gap shade */}
                <path d="M60 210 C 250 200, 420 120, 730 40 L730 244 C 420 235, 250 220, 60 210 Z" fill="var(--shilo)" opacity="0.07" />
                {/* labels */}
                <circle cx="730" cy="40" r="6" fill="var(--shilo)" />
                <text x="718" y="30" fill="var(--shilo)" fontSize="14" fontWeight="800" textAnchor="end">Invest now</text>
                <circle cx="730" cy="244" r="6" fill="rgba(255,255,255,0.5)" />
                <text x="718" y="238" fill="rgba(255,255,255,0.6)" fontSize="14" fontWeight="700" textAnchor="end">Wait and see</text>
              </svg>
              <p className="text-[13px] mt-4" style={{ color: 'rgba(255,255,255,0.5)' }}>
                Off-site authority — being talked about on sites you don&apos;t own — is the strongest driver, and it takes
                months to build. Starting when AI search is already most of your traffic means starting the slow part too late.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── why it's a discipline, not a one-off ─────────────── */}
      <section className="py-20 px-6" style={{ background: 'var(--bg-primary)' }}>
        <div className="max-w-[900px] mx-auto text-center">
          <ScrollReveal>
            <Label color="var(--danube)" className="mb-3 justify-center">Kept honest by one number</Label>
            <Display size="md" className="mb-6">Citation share is the KPI.</Display>
            <p className="text-lg leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              GEO isn&apos;t a vibe or a promise. It&apos;s a number you can watch move: how often the assistants name
              <strong style={{ color: 'var(--cocoa)' }}> you</strong> versus your competitors when a real buyer asks a real
              question. We track it, we report it, and we hold the work to it. Everything else is guessing.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* ── close ────────────────────────────────────────────── */}
      <section className="py-24 px-6 text-center" style={{ background: 'var(--bg-secondary)' }}>
        <div className="max-w-[720px] mx-auto">
          <ScrollReveal>
            <Display size="lg" className="mb-5">Find out what the AIs say about you.</Display>
            <p className="text-lg leading-relaxed mb-9" style={{ color: 'var(--text-secondary)' }}>
              We&apos;ll run your real buyer questions against ChatGPT, Gemini, Claude, Perplexity and Grok and show you,
              in plain numbers, how often you&apos;re named — and who&apos;s named instead. That scan is where every GEO
              engagement starts.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <BookCTA variant="primary">Scan my business &rarr;</BookCTA>
              <BookCTA variant="outline">See a time</BookCTA>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </main>
  );
}
