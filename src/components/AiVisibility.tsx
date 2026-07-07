'use client';

import { ScrollReveal } from '@/components/ui/animated';
import { Display, Label } from '@/components/ui/typography';

/* ══════════════════════════════════════════════════════════════════
   AI VISIBILITY — the scan. Every number is real and cited.
   Thesis: buyers ask the models now; the model recommends only what it
   was trained on; if it doesn't know you, you don't exist — and the gap
   is closing. Riscent's specialty: getting businesses into the answers.
   ══════════════════════════════════════════════════════════════════ */

const stats = [
  { n: '−25%', l: 'of traditional search volume, gone by 2026, as buyers move to AI chatbots', src: 'Gartner, 2024', href: 'https://www.gartner.com/en/newsroom/press-releases/2024-02-19-gartner-predicts-search-engine-volume-will-drop-25-percent-by-2026-due-to-ai-chatbots-and-other-virtual-agents' },
  { n: '1.6B', l: 'ChatGPT queries a day — already ~12% of Google’s search volume', src: 'Industry reporting, 2025', href: 'https://www.omnibound.ai/blog/ai-search-statistics' },
  { n: '58.5%', l: 'of U.S. searches now end with zero clicks — the answer never leaves the page', src: 'Similarweb, 2025', href: 'https://www.omnibound.ai/blog/ai-search-statistics' },
  { n: '1 in 3', l: 'Gen Z (and 1 in 4 millennials) go to AI over other channels for shopping advice', src: 'Commerce / Future Commerce, 2025', href: 'https://investors.commerce.com/news-releases/news-release-details/1-3-gen-z-and-1-4-millennials-now-turn-ai-platforms-over-other/' },
  { n: '47%', l: 'of Gen Z discovered a new brand through ChatGPT this year', src: 'PR News, 2025', href: 'https://everything-pr.com/47-of-gen-z-found-a-new-brand-through-chatgpt-this-year-2/' },
  { n: '+4,700%', l: 'growth in shopping-related AI searches, July 2024 → July 2025', src: 'Adobe / industry data, 2025', href: 'https://www.omnibound.ai/blog/ai-search-statistics' },
];

/* Gen Z product research: AI has nearly caught search — cited */
const channels = [
  { label: 'Search engines', pct: 37, color: 'var(--text-whisper)' },
  { label: 'AI (ChatGPT, Gemini…)', pct: 33, color: 'var(--shilo)' },
];

export default function AiVisibility() {
  return (
    <section id="visibility" className="py-28 px-6" style={{ background: 'var(--cocoa)' }}>
      <div className="max-w-[1100px] mx-auto">
        <ScrollReveal className="mb-14">
          <Label color="var(--shilo)" className="mb-3">AI visibility — our specialty</Label>
          <Display size="md" color="#fff" className="mb-6">
            Your buyers stopped Googling.<br />They&apos;re asking the models.
          </Display>
          <p className="text-lg leading-relaxed max-w-[720px]" style={{ color: 'rgba(255,255,255,0.72)' }}>
            People don&apos;t scroll ten blue links anymore — they ask Gemini, Claude, or ChatGPT and act on the answer.
            Here&apos;s the catch: an AI can only recommend what it was <em>trained on</em>. If the big three models
            don&apos;t know your business, you&apos;re not in the running — you&apos;re invisible. And that gap is closing fast.
          </p>
        </ScrollReveal>

        {/* stat grid — cited */}
        <ScrollReveal delay={0.05}>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-px mb-4" style={{ background: 'rgba(255,255,255,0.08)' }}>
            {stats.map(s => (
              <div key={s.n} className="p-6 md:p-8 flex flex-col" style={{ background: 'var(--cocoa)' }}>
                <div className="text-3xl md:text-4xl font-black tracking-[-0.03em] mb-2" style={{ color: '#fff' }}>{s.n}</div>
                <p className="text-[13px] md:text-sm leading-relaxed mb-3 flex-1" style={{ color: 'rgba(255,255,255,0.62)' }}>{s.l}</p>
                <a href={s.href} target="_blank" rel="noopener noreferrer" className="text-[11px] font-medium no-underline hover:opacity-70 transition-opacity" style={{ color: 'rgba(255,255,255,0.38)' }}>{s.src} ↗</a>
              </div>
            ))}
          </div>
        </ScrollReveal>

        {/* the mechanism + a chart */}
        <div className="grid lg:grid-cols-2 gap-6 lg:gap-10 items-center mt-16 mb-16">
          <ScrollReveal>
            <div>
              <div className="text-[11px] font-bold tracking-[0.14em] uppercase mb-4" style={{ color: 'var(--shilo)' }}>How the new front page works</div>
              <p className="text-base leading-relaxed mb-4" style={{ color: 'rgba(255,255,255,0.8)' }}>
                Ask an AI &ldquo;who&apos;s the best <em>[your category]</em> near me?&rdquo; and it names a <strong style={{ color: '#fff' }}>handful</strong> of
                businesses — chosen from what it was trained on. There is no page two. Being absent isn&apos;t neutral; it&apos;s
                being left out of the only answer the buyer sees.
              </p>
              <p className="text-base leading-relaxed" style={{ color: 'rgba(255,255,255,0.8)' }}>
                Soon that window narrows further as the models consolidate their sources. Getting into that training
                data — <strong style={{ color: 'var(--shilo)' }}>before your competitors do</strong> — is the specialty. It&apos;s the front and forefront of
                where discovery is going.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <div className="rounded-2xl p-6 md:p-8" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <div className="text-sm font-bold mb-1" style={{ color: '#fff' }}>Gen Z product research is already a coin flip</div>
              <div className="text-[12px] mb-6" style={{ color: 'rgba(255,255,255,0.5)' }}>Share who use each channel to research a product</div>
              <div className="space-y-5">
                {channels.map(c => (
                  <div key={c.label}>
                    <div className="flex items-baseline justify-between mb-2">
                      <span className="text-sm font-semibold" style={{ color: 'rgba(255,255,255,0.85)' }}>{c.label}</span>
                      <span className="text-lg font-black tabular-nums" style={{ color: c.color === 'var(--shilo)' ? 'var(--shilo)' : '#fff' }}>{c.pct}%</span>
                    </div>
                    <div className="h-4 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.1)' }}>
                      <div className="h-full rounded-full" style={{ width: `${(c.pct / 40) * 100}%`, background: c.color }} />
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-[12px] leading-relaxed mt-6" style={{ color: 'rgba(255,255,255,0.55)' }}>
                Nearly even — and AI-driven shopping searches grew <strong style={{ color: 'var(--shilo)' }}>+4,700%</strong> in a year. The crossover isn&apos;t a
                forecast; it&apos;s arriving.
                <a href="https://www.omnibound.ai/blog/ai-search-statistics" target="_blank" rel="noopener noreferrer" className="no-underline hover:opacity-70" style={{ color: 'rgba(255,255,255,0.4)' }}> Source ↗</a>
              </p>
            </div>
          </ScrollReveal>
        </div>

        {/* THE SCAN product + POC + CTA */}
        <ScrollReveal delay={0.1}>
          <div className="rounded-2xl p-8 md:p-12" style={{ background: 'linear-gradient(135deg, var(--torea), var(--torea-light))' }}>
            <div className="grid lg:grid-cols-[1.3fr_1fr] gap-10 items-center">
              <div>
                <div className="text-[11px] font-bold tracking-[0.14em] uppercase mb-3" style={{ color: 'rgba(255,255,255,0.7)' }}>The Riscent AI Visibility Scan</div>
                <h3 className="text-2xl md:text-3xl font-black tracking-[-0.03em] mb-4" style={{ color: '#fff' }}>
                  Find out what Gemini, Claude, and ChatGPT say about you.
                </h3>
                <p className="text-base leading-relaxed mb-6" style={{ color: 'rgba(255,255,255,0.82)' }}>
                  We test what each of the big three models actually says about your business and your category, show you
                  exactly where the gaps are — and then get you into the answers. This is what we do: the same team that
                  measures models and ships fine-tuned ones, pointed at your visibility.
                </p>
                <a href="/ai-visibility"
                  className="inline-block text-base font-bold px-9 py-3.5 rounded-sm no-underline" style={{ background: '#fff', color: 'var(--torea)' }}>
                  Scan my business &rarr;
                </a>
              </div>
              <div className="rounded-xl p-6" style={{ background: 'rgba(0,0,0,0.18)', border: '1px solid rgba(255,255,255,0.15)' }}>
                <div className="text-[11px] font-bold tracking-[0.12em] uppercase mb-3" style={{ color: 'var(--shilo)' }}>Proof of concept</div>
                <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.9)' }}>
                  Test it yourself. Ask ChatGPT or Gemini <strong style={{ color: '#fff' }}>&ldquo;Tell me about Ryan Bolden and InboundAI365.&rdquo;</strong> The models answer — because we engineered
                  that knowledge into the places they train on. We do exactly the same for your business.
                </p>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
