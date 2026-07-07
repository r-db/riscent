'use client';

import { ScrollReveal } from '@/components/ui/animated';
import { Display, Label } from '@/components/ui/typography';

/* ══════════════════════════════════════════════════════════════════
   SLM SELECTION STUDY + FINE-TUNING
   Every number is measured (2026-07-06) and re-runnable.
   Source: our own Qwen3-4B vs Gemma-4 E4B head-to-head.
   ══════════════════════════════════════════════════════════════════ */

const QWEN = '#B5AAA2';   // muted (text-whisper) — the model that lost
const GEMMA = '#5992C6';  // danube — the model that shipped

/* checks passed per task, 3 trials each (0–3 scale) */
const taskChecks = [
  { task: 'Routing', full: 'routing decision correct', qwen: 3, gemma: 3 },
  { task: 'JSON pure', full: 'JSON output pure (no prose)', qwen: 0, gemma: 3 },
  { task: 'JSON valid', full: 'JSON valid (schema + types)', qwen: 0, gemma: 3 },
  { task: 'JSON intent', full: 'JSON intent correct', qwen: 0, gemma: 3 },
  { task: 'Draft prompt', full: 'delegation prompt complete', qwen: 3, gemma: 3 },
];

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-2 text-[13px] font-semibold" style={{ color: 'var(--text-secondary)' }}>
      <span className="w-3 h-3 rounded-sm" style={{ background: color }} />
      {label}
    </span>
  );
}

/* ── Chart A: grouped bars, checks passed per task (the JSON cliff) ── */
function ChartGroupedBars() {
  const H = 200; // px track height, 0–3 scale
  return (
    <figure className="m-0">
      <figcaption className="flex flex-wrap items-baseline justify-between gap-3 mb-6">
        <span className="text-sm font-bold tracking-[-0.01em]" style={{ color: 'var(--cocoa)' }}>
          Checks passed per task <span className="font-medium" style={{ color: 'var(--text-muted)' }}>(out of 3 trials)</span>
        </span>
        <span className="flex gap-5">
          <LegendDot color={QWEN} label="Qwen3-4B" />
          <LegendDot color={GEMMA} label="Gemma-4 E4B" />
        </span>
      </figcaption>

      <div className="relative">
        {/* gridlines 0–3 */}
        <div className="absolute inset-x-0 top-0 flex flex-col justify-between pointer-events-none" style={{ height: H }}>
          {[3, 2, 1, 0].map(n => (
            <div key={n} className="flex items-center gap-2">
              <span className="text-[10px] w-2 tabular-nums" style={{ color: 'var(--text-whisper)' }}>{n}</span>
              <span className="flex-1 border-t" style={{ borderColor: 'var(--border-light)' }} />
            </div>
          ))}
        </div>

        {/* bars */}
        <div className="relative flex items-end gap-2 md:gap-5 pl-5" style={{ height: H }}>
          {taskChecks.map(t => (
            <div key={t.task} className="flex-1 flex items-end justify-center gap-1.5 md:gap-2.5 h-full">
              {([['Qwen', t.qwen, QWEN], ['Gemma', t.gemma, GEMMA]] as const).map(([who, val, color]) => (
                <div key={who} className="relative flex flex-col items-center justify-end h-full w-1/2 max-w-[46px]">
                  <span className="text-[11px] md:text-xs font-black mb-1 tabular-nums" style={{ color: val === 0 ? 'var(--voiceguard)' : color }}>
                    {val}
                  </span>
                  <div
                    className="w-full rounded-t-md transition-all"
                    style={{
                      height: `${(val / 3) * 100}%`,
                      minHeight: val === 0 ? 3 : undefined,
                      background: val === 0 ? 'repeating-linear-gradient(45deg,var(--voiceguard),var(--voiceguard) 2px,transparent 2px,transparent 4px)' : color,
                      opacity: val === 0 ? 0.55 : 1,
                    }}
                    aria-label={`${who} ${val} of 3`}
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* x labels */}
      <div className="flex gap-2 md:gap-5 pl-5 mt-3">
        {taskChecks.map(t => (
          <div key={t.task} className="flex-1 text-center text-[10px] md:text-[11px] font-semibold leading-tight" style={{ color: 'var(--text-muted)' }}>
            {t.task}
          </div>
        ))}
      </div>
      <p className="text-[12px] md:text-[13px] leading-relaxed mt-5 pl-5" style={{ color: 'var(--text-muted)' }}>
        The three JSON / tool-call tasks are the cliff: <strong style={{ color: 'var(--voiceguard)' }}>Qwen 0/3 on every one</strong>, Gemma 3/3 on all fifteen.
      </p>
    </figure>
  );
}

/* ── Chart B: overall score, 15/15 vs 6/15 ── */
function ChartOverall() {
  const rows = [
    { who: 'Gemma-4 E4B', score: 15, color: GEMMA },
    { who: 'Qwen3-4B', score: 6, color: QWEN },
  ];
  return (
    <figure className="m-0">
      <figcaption className="text-sm font-bold tracking-[-0.01em] mb-6" style={{ color: 'var(--cocoa)' }}>
        Overall score <span className="font-medium" style={{ color: 'var(--text-muted)' }}>(15 checks total)</span>
      </figcaption>
      <div className="space-y-5">
        {rows.map(r => (
          <div key={r.who}>
            <div className="flex items-baseline justify-between mb-2">
              <span className="text-sm font-semibold" style={{ color: 'var(--cocoa)' }}>{r.who}</span>
              <span className="text-lg font-black tabular-nums" style={{ color: r.color }}>{r.score}<span className="text-sm font-bold" style={{ color: 'var(--text-muted)' }}>/15</span></span>
            </div>
            <div className="h-4 rounded-full overflow-hidden" style={{ background: 'var(--bg-tertiary)' }}>
              <div className="h-full rounded-full transition-all" style={{ width: `${(r.score / 15) * 100}%`, background: r.color }} />
            </div>
          </div>
        ))}
      </div>
    </figure>
  );
}

/* ── Chart C: median tok/s with a "24 = usable" reference line ── */
function ChartSpeed() {
  const H = 170;
  const MAX = 36;
  const REF = 24;
  const bars = [
    { who: 'Qwen3-4B', v: 32.7, color: QWEN },
    { who: 'Gemma-4 E4B', v: 26.5, color: GEMMA },
  ];
  return (
    <figure className="m-0">
      <figcaption className="flex items-baseline justify-between gap-2 mb-6">
        <span className="text-sm font-bold tracking-[-0.01em]" style={{ color: 'var(--cocoa)' }}>
          Median speed <span className="font-medium" style={{ color: 'var(--text-muted)' }}>(tokens / sec)</span>
        </span>
        <span className="flex items-center gap-1.5 text-[11px] font-bold shrink-0" style={{ color: 'var(--torea)' }}>
          <span className="inline-block w-4 border-t border-dashed" style={{ borderColor: 'var(--torea)' }} /> 24 = usable
        </span>
      </figcaption>
      <div className="relative flex items-end justify-around gap-6" style={{ height: H }}>
        {/* reference line at 24 (both models clear it) — labelled in the caption legend */}
        <div className="absolute inset-x-0 border-t border-dashed pointer-events-none" style={{ bottom: `${(REF / MAX) * 100}%`, borderColor: 'var(--torea)' }} />
        {bars.map(b => (
          <div key={b.who} className="relative flex flex-col items-center justify-end h-full w-24">
            <span className="text-base font-black mb-1.5 tabular-nums" style={{ color: b.color }}>{b.v}</span>
            <div className="w-full rounded-t-md" style={{ height: `${(b.v / MAX) * 100}%`, background: b.color }} />
          </div>
        ))}
      </div>
      <div className="flex justify-around gap-6 mt-3">
        {bars.map(b => (
          <div key={b.who} className="w-24 text-center text-[11px] font-semibold" style={{ color: 'var(--text-muted)' }}>{b.who}</div>
        ))}
      </div>
      <p className="text-[12px] md:text-[13px] leading-relaxed mt-5" style={{ color: 'var(--text-muted)' }}>
        Speed didn&apos;t decide it — both cleared 24 tok/s, and Qwen was actually <strong>faster</strong>. Reliability decided it.
      </p>
    </figure>
  );
}

const dangers = [
  { t: 'Catastrophic forgetting', d: 'It gains your task and loses general ability.' },
  { t: 'Overfitting', d: 'Memorizes a tiny dataset, fails on anything new.' },
  { t: 'Tool-call / format regression', d: 'The exact failure above — induced by bad tuning.' },
  { t: 'Evaluation on training data', d: 'The classic false-green: “97%” on data it already saw.' },
  { t: 'Data leakage', d: 'Secrets or PII baked into weights you can’t un-bake.' },
];

export default function SlmStudy() {
  return (
    <>
      {/* ═══ SECTION 1 — Measure your model ═══ */}
      <section id="benchmark" className="py-28 px-6" style={{ background: 'var(--bg-warm)' }}>
        <div className="max-w-[1100px] mx-auto">
          <ScrollReveal className="mb-14">
            <Label color="var(--danube)" className="mb-3">Case study — measured, not quoted</Label>
            <Display size="md" className="mb-6">
              Measure your model.<br />Don&apos;t trust the leaderboard.
            </Display>
            <p className="text-lg leading-relaxed max-w-[680px]" style={{ color: 'var(--text-secondary)' }}>
              We ran two leading ≤4B open models — <strong>Qwen3-4B</strong> and <strong>Gemma-4 E4B</strong> —
              head-to-head as a local agent brain on an Apple M4 Mac mini (16&nbsp;GB), Q4 via ollama.
              Not leaderboard trivia: an objective, machine-scored harness (grep / parse, 3 trials each)
              measuring what actually breaks agents in production — routing, clean tool-call JSON, and complete hand-offs.
            </p>
          </ScrollReveal>

          {/* callout stat */}
          <ScrollReveal delay={0.05}>
            <div className="rounded-2xl p-8 md:p-10 mb-12 flex flex-col md:flex-row md:items-center gap-6 md:gap-12"
              style={{ background: 'var(--cocoa)' }}>
              <div className="text-sm font-semibold tracking-[0.12em] uppercase md:w-[180px] shrink-0" style={{ color: 'var(--shilo)' }}>
                Tool-call reliability
              </div>
              <div className="flex flex-wrap items-end gap-x-10 gap-y-4">
                <div>
                  <div className="text-4xl md:text-5xl font-black tracking-[-0.03em]" style={{ color: '#fff' }}>
                    0<span className="text-2xl md:text-3xl" style={{ color: 'rgba(255,255,255,0.5)' }}>/9</span>
                  </div>
                  <div className="text-[13px] font-medium mt-1" style={{ color: 'rgba(255,255,255,0.6)' }}>Qwen3-4B — clean tool calls</div>
                </div>
                <div>
                  <div className="text-4xl md:text-5xl font-black tracking-[-0.03em]" style={{ color: 'var(--danube-light)' }}>
                    9<span className="text-2xl md:text-3xl" style={{ color: 'rgba(255,255,255,0.5)' }}>/9</span>
                  </div>
                  <div className="text-[13px] font-medium mt-1" style={{ color: 'rgba(255,255,255,0.6)' }}>Gemma-4 E4B — clean tool calls</div>
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* charts */}
          <ScrollReveal delay={0.1}>
            <div className="rounded-2xl p-6 md:p-10 mb-6" style={{ background: '#fff', boxShadow: 'var(--shadow-md)' }}>
              <ChartGroupedBars />
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <ScrollReveal delay={0.12}>
              <div className="rounded-2xl p-6 md:p-10 h-full" style={{ background: '#fff', boxShadow: 'var(--shadow-md)' }}>
                <ChartOverall />
              </div>
            </ScrollReveal>
            <ScrollReveal delay={0.16}>
              <div className="rounded-2xl p-6 md:p-10 h-full" style={{ background: '#fff', boxShadow: 'var(--shadow-md)' }}>
                <ChartSpeed />
              </div>
            </ScrollReveal>
          </div>

          {/* finding + thesis */}
          <ScrollReveal delay={0.1}>
            <div className="grid md:grid-cols-2 gap-10 md:gap-14 border-t pt-12" style={{ borderColor: 'var(--border-medium)' }}>
              <div>
                <div className="text-[11px] font-bold tracking-[0.14em] uppercase mb-3" style={{ color: 'var(--danube)' }}>The finding</div>
                <p className="text-base leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  Qwen3-4B — even with thinking mode <em>off</em> — refused to emit a clean tool call.
                  It monologues its reasoning in the response body (&ldquo;We are given a query… Step 1…&rdquo;)
                  and never produces parseable JSON. Gemma-4 E4B followed the tool-call contract every time
                  (<strong style={{ color: 'var(--cocoa)' }}>15/15</strong>), at comparable speed.
                </p>
              </div>
              <div>
                <div className="text-[11px] font-bold tracking-[0.14em] uppercase mb-3" style={{ color: 'var(--torea)' }}>The thesis</div>
                <p className="text-base leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  A &ldquo;smarter&rdquo; model that won&apos;t emit a parseable tool call is useless for an agent.
                  Model selection must be measured on <em>your</em> production criteria — objective, reproducible,
                  machine-checked — not brand or leaderboard. We even caught our own bias: we leaned Qwen; the
                  measurement flipped the decision. Proof over preference is what we sell.
                </p>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.15}>
            <p className="text-[13px] tracking-[0.02em] mt-10 flex flex-wrap items-center gap-x-2 gap-y-1" style={{ color: 'var(--text-whisper)' }}>
              <span className="inline-flex items-center gap-1.5 font-semibold" style={{ color: 'var(--danube)' }}>
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--danube)' }} /> Measured 2026-07-06 on an Apple M4 Mac mini
              </span>
              · every number is re-runnable · <strong style={{ color: 'var(--text-muted)' }}>benchmark reproducible on request.</strong>
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* ═══ SECTION 2 — Fine-tuning: multiplier + minefield ═══ */}
      <section id="finetuning" className="py-28 px-6" style={{ background: 'var(--bg-primary)' }}>
        <div className="max-w-[1100px] mx-auto">
          <ScrollReveal className="mb-14">
            <Label color="var(--shilo)" className="mb-3">Fine-tuning capability</Label>
            <Display size="md" className="mb-6">
              The multiplier,<br />and the minefield.
            </Display>
            <p className="text-lg leading-relaxed max-w-[680px]" style={{ color: 'var(--text-secondary)' }}>
              A properly fine-tuned small model is a force multiplier. Done wrong, it <em>looks</em> like it
              worked and doesn&apos;t. We treat &ldquo;it works&rdquo; as a machine-proven claim — never a vibe.
            </p>
          </ScrollReveal>

          {/* 75% -> 95% highlight */}
          <ScrollReveal delay={0.05}>
            <div className="rounded-2xl p-8 md:p-10 mb-12 flex flex-col sm:flex-row items-start sm:items-center gap-6 sm:gap-10"
              style={{ background: 'linear-gradient(120deg, var(--danube-pale), var(--shilo-pale))', border: '1px solid var(--border-light)' }}>
              <div className="flex items-center gap-4">
                <span className="text-4xl md:text-5xl font-black tabular-nums" style={{ color: 'var(--text-muted)' }}>75%</span>
                <span className="text-3xl font-black" style={{ color: 'var(--danube)' }}>→</span>
                <span className="text-5xl md:text-6xl font-black tabular-nums tracking-[-0.03em]" style={{ color: 'var(--torea)' }}>95%</span>
              </div>
              <p className="text-base leading-relaxed" style={{ color: 'var(--cocoa-soft)' }}>
                A Qwen3-4B classifier we fine-tuned in-house — <strong>75% → 95%</strong> on its task, in a single short run.
                A 4B model can match or beat a model <strong>30× its size</strong> on <em>your</em> narrow domain, running
                local, offline, and cheap — on hardware as modest as a 6&nbsp;GB-VRAM laptop. You own the weights and the data.
              </p>
            </div>
          </ScrollReveal>

          {/* benefit / danger two-column */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <ScrollReveal delay={0.08}>
              <div className="rounded-2xl p-8 md:p-10 h-full" style={{ background: '#fff', boxShadow: 'var(--shadow-md)' }}>
                <div className="text-[11px] font-bold tracking-[0.14em] uppercase mb-5" style={{ color: 'var(--linguareach)' }}>The benefit</div>
                <ul className="space-y-4">
                  {[
                    ['Beats models 30× larger', 'on a narrow, well-scoped domain.'],
                    ['Local, offline, low-latency', 'runs on a 6 GB-VRAM laptop — no API bill.'],
                    ['You own it', 'the weights and the training data are yours.'],
                  ].map(([t, d]) => (
                    <li key={t} className="flex gap-3">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0" style={{ background: 'var(--linguareach)' }} />
                      <span className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                        <strong style={{ color: 'var(--cocoa)' }}>{t}</strong> — {d}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={0.12}>
              <div className="rounded-2xl p-8 md:p-10 h-full" style={{ background: '#fff', boxShadow: 'var(--shadow-md)' }}>
                <div className="text-[11px] font-bold tracking-[0.14em] uppercase mb-5" style={{ color: 'var(--voiceguard)' }}>The danger — why most fine-tuning quietly fails</div>
                <ul className="space-y-4">
                  {dangers.map(x => (
                    <li key={x.t} className="flex gap-3">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0" style={{ background: 'var(--voiceguard)' }} />
                      <span className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                        <strong style={{ color: 'var(--cocoa)' }}>{x.t}</strong> — {x.d}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </ScrollReveal>
          </div>

          {/* why us */}
          <ScrollReveal delay={0.1}>
            <div className="rounded-2xl p-8 md:p-12" style={{ background: 'var(--cocoa)' }}>
              <div className="text-[11px] font-bold tracking-[0.14em] uppercase mb-5" style={{ color: 'var(--shilo)' }}>Why Riscent is good at it</div>
              <div className="grid md:grid-cols-2 gap-x-12 gap-y-6 mb-8">
                {[
                  ['Base chosen by measurement', 'We pick the base model the way we ran the study above — not by brand.'],
                  ['Held-out, red-first gate', 'The tuned model must pass objective checks it never trained on before we ship it.'],
                  ['Attested, not assumed', 'Every claim maps to a re-runnable test — coverage and verification are proven.'],
                  ['Local by default', 'Your proprietary data never leaves your hardware.'],
                ].map(([t, d]) => (
                  <div key={t}>
                    <div className="text-base font-bold mb-1.5" style={{ color: '#fff' }}>{t}</div>
                    <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>{d}</p>
                  </div>
                ))}
              </div>
              <p className="text-sm leading-relaxed border-t pt-6 max-w-[720px]" style={{ color: 'rgba(255,255,255,0.72)', borderColor: 'rgba(255,255,255,0.12)' }}>
                <strong style={{ color: 'var(--shilo)' }}>The one honest trade:</strong> fine-tuning is powerful <em>because</em> it&apos;s narrow.
                We scope it, prove it on held-out data, and tell you plainly where the model&apos;s competence ends. That honesty is the product.
              </p>
              <div className="mt-8">
                <a href="mailto:ryan@riscent.com?subject=Fine-tune%20a%20model%20for%20my%20job%20—%20Riscent"
                  className="inline-block text-base font-bold px-9 py-3.5 rounded-sm no-underline"
                  style={{ background: 'var(--shilo)', color: 'var(--cocoa)' }}>
                  Get a model built for your job &rarr;
                </a>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
