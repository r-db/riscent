'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

/* ── PALETTE ── */
const C = {
  bg: '#0b0e14',
  bgElev: '#111521',
  border: '#1e2535',
  text: '#e6e8ed',
  text2: '#a6adbb',
  muted: '#6e7689',
  accent: '#4f8cff',
  green: '#5fd6a3',
  warn: '#f0b45b',
};

/* ── REVEAL HOOK ── */
function useReveal(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

/* ── REVEAL WRAPPER ── */
function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const { ref, visible } = useReveal();
  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(24px)',
        transition: `opacity 0.55s ease ${delay}ms, transform 0.55s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

/* ── PIPELINE STEPS ── */
const pipelineSteps = [
  { label: 'Pull Conversations', icon: '⬇', desc: 'Ingest raw call transcripts from any voice platform' },
  { label: 'Score Quality', icon: '★', desc: 'Evaluate each conversation on task completion, accuracy, tone' },
  { label: 'Strip PII', icon: '🛡', desc: '5 regex patterns — names, phones, DOBs, SSNs, addresses removed' },
  { label: 'Generate SFT Pairs', icon: '✦', desc: 'Good examples packaged as supervised fine-tuning pairs' },
  { label: 'Generate DPO Pairs', icon: '⇌', desc: 'Good vs bad responses paired for preference learning' },
  { label: 'Export JSONL', icon: '↗', desc: 'OpenAI-compatible format, ready for any training platform' },
  { label: 'Train', icon: '⚙', desc: 'Run fine-tuning on your preferred infrastructure' },
  { label: 'Deploy', icon: '▶', desc: 'Improved model goes live — agent measurably better' },
];

/* ── PROBLEM CARDS ── */
const problems = [
  {
    problem: 'Generic prompts plateau after a few weeks',
    fix: 'Fine-tuned models keep improving as you feed them real production data',
  },
  {
    problem: 'No way to learn from production conversations',
    fix: 'VoiceTrain automatically ingests and processes every call you run',
  },
  {
    problem: 'Manual prompt tweaking is guesswork',
    fix: 'Quality scoring pinpoints exactly which call types need improvement',
  },
  {
    problem: 'Competitors who fine-tune outperform by 30–50% on task completion',
    fix: 'Get a fine-tuning pipeline running in days, not quarters',
  },
];

/* ── FEATURE CARDS ── */
const features = [
  {
    title: 'Automatic Conversation Ingestion',
    desc: 'Connect your voice platform. VoiceTrain pulls transcripts on a schedule — no manual exports, no CSV uploads.',
    icon: '⬇',
  },
  {
    title: 'Quality Scoring',
    desc: 'Every conversation scored on task completion, factual accuracy, and tone. Only high-signal data feeds your model.',
    icon: '★',
  },
  {
    title: 'PII Stripping',
    desc: '5 regex patterns detect and remove names, phone numbers, dates of birth, SSNs, and addresses. HIPAA-safe by default.',
    icon: '🛡',
  },
  {
    title: 'SFT Pair Generation',
    desc: 'High-quality conversations become supervised fine-tuning pairs — the gold standard for teaching an LLM new behavior.',
    icon: '✦',
  },
  {
    title: 'DPO Pair Generation',
    desc: 'Good and bad responses paired for preference learning. Teaches the model not just what\'s right, but what to avoid.',
    icon: '⇌',
  },
  {
    title: 'OpenAI-Compatible JSONL Export',
    desc: 'One click. Standard format. Works with Together AI, Fireworks, OpenAI, Axolotl, or any other training pipeline.',
    icon: '↗',
  },
];

/* ── STATS ── */
const stats = [
  { value: '1,095', label: 'SFT pairs generated', color: C.warn },
  { value: '336', label: 'DPO pairs generated', color: C.warn },
  { value: '5', label: 'PII patterns stripped', color: C.green },
  { value: 'Any', label: 'OpenAI-compatible platform supported', color: C.accent },
];

/* ── PRICING ── */
const plans = [
  {
    name: 'Pipeline',
    price: '$99',
    period: '/mo',
    highlight: false,
    features: [
      'Up to 1,000 conversations/mo',
      'Automatic ingestion',
      'Quality scoring',
      'PII stripping',
      'SFT pair generation',
      'JSONL export',
    ],
  },
  {
    name: 'Advanced',
    price: '$249',
    period: '/mo',
    highlight: true,
    features: [
      'Up to 5,000 conversations/mo',
      'Everything in Pipeline',
      'DPO pair generation',
      'Preference dataset export',
      'Priority support',
    ],
  },
  {
    name: 'Platform',
    price: '$499',
    period: '/mo',
    highlight: false,
    features: [
      'Unlimited conversations',
      'Everything in Advanced',
      'Hosted fine-tuning runs',
      'Model deployment pipeline',
      'Dedicated onboarding',
    ],
  },
];

/* ── PAGE ── */
export default function VoiceTrainPage() {
  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: ${C.bg}; color: ${C.text}; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
        a { color: inherit; text-decoration: none; }

        .vt-wrap { max-width: 1100px; margin: 0 auto; padding: 0 24px; }

        /* NAV */
        .vt-nav {
          position: sticky; top: 0; z-index: 50;
          background: ${C.bg}ee;
          backdrop-filter: blur(12px);
          border-bottom: 1px solid ${C.border};
        }
        .vt-nav-inner {
          max-width: 1100px; margin: 0 auto; padding: 0 24px;
          height: 60px; display: flex; align-items: center; justify-content: space-between;
        }
        .vt-nav-logo { font-size: 15px; font-weight: 700; letter-spacing: 0.08em; color: ${C.text}; text-transform: uppercase; }
        .vt-nav-logo span { color: ${C.warn}; }
        .vt-nav-product { font-size: 13px; font-weight: 600; color: ${C.warn}; letter-spacing: 0.06em; text-transform: uppercase; }

        /* HERO */
        .vt-hero { padding: 100px 24px 80px; text-align: center; }
        .vt-hero-tag {
          display: inline-block; margin-bottom: 20px;
          padding: 5px 14px; border-radius: 20px;
          background: ${C.warn}18; border: 1px solid ${C.warn}44;
          font-size: 12px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: ${C.warn};
        }
        .vt-hero h1 {
          font-size: clamp(36px, 6vw, 62px); font-weight: 800; line-height: 1.1;
          letter-spacing: -0.02em; color: ${C.text}; margin-bottom: 22px;
        }
        .vt-hero h1 em { font-style: normal; color: ${C.warn}; }
        .vt-hero-sub {
          font-size: clamp(16px, 2.2vw, 19px); color: ${C.text2}; line-height: 1.65;
          max-width: 620px; margin: 0 auto 36px;
        }
        .vt-cta-primary {
          display: inline-block; padding: 14px 32px; border-radius: 8px;
          background: ${C.warn}; color: #0b0e14; font-weight: 700; font-size: 15px;
          letter-spacing: 0.02em; transition: opacity 0.2s, transform 0.2s;
        }
        .vt-cta-primary:hover { opacity: 0.88; transform: translateY(-1px); }

        /* SECTION */
        .vt-section { padding: 80px 24px; }
        .vt-section-label {
          font-size: 11px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase;
          color: ${C.warn}; margin-bottom: 12px;
        }
        .vt-section-title {
          font-size: clamp(26px, 4vw, 40px); font-weight: 800; line-height: 1.18;
          letter-spacing: -0.02em; color: ${C.text}; margin-bottom: 14px;
        }
        .vt-section-sub {
          font-size: 16px; color: ${C.text2}; line-height: 1.65; max-width: 580px;
        }

        /* PROBLEM CARDS */
        .vt-problem-grid {
          display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; margin-top: 48px;
        }
        .vt-problem-card {
          background: ${C.bgElev}; border: 1px solid ${C.border}; border-radius: 12px; padding: 24px;
        }
        .vt-problem-card-bad {
          font-size: 14px; color: #f87171; line-height: 1.55; margin-bottom: 14px;
          padding-left: 14px; border-left: 2px solid #f87171;
        }
        .vt-problem-card-fix {
          font-size: 14px; color: ${C.green}; line-height: 1.55;
          padding-left: 14px; border-left: 2px solid ${C.green};
        }

        /* PIPELINE */
        .vt-pipeline { margin-top: 56px; }
        .vt-pipeline-steps {
          display: grid; grid-template-columns: repeat(4, 1fr); gap: 2px;
        }
        .vt-pipeline-step {
          background: ${C.bgElev}; border: 1px solid ${C.border}; padding: 20px 18px;
          position: relative;
        }
        .vt-pipeline-step:first-child { border-radius: 10px 0 0 10px; }
        .vt-pipeline-step:last-child { border-radius: 0 10px 10px 0; }
        .vt-pipeline-step-num {
          font-size: 10px; font-weight: 700; letter-spacing: 0.1em; color: ${C.muted}; margin-bottom: 8px;
        }
        .vt-pipeline-step-icon { font-size: 22px; margin-bottom: 8px; display: block; }
        .vt-pipeline-step-label { font-size: 13px; font-weight: 700; color: ${C.text}; margin-bottom: 6px; }
        .vt-pipeline-step-desc { font-size: 12px; color: ${C.muted}; line-height: 1.5; }
        .vt-pipeline-arrow {
          position: absolute; right: -10px; top: 50%; transform: translateY(-50%);
          width: 18px; height: 18px; background: ${C.warn}; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 9px; color: #0b0e14; font-weight: 900; z-index: 2;
        }
        .vt-pipeline-step:last-child .vt-pipeline-arrow { display: none; }

        /* FEATURE GRID */
        .vt-feature-grid {
          display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-top: 48px;
        }
        .vt-feature-card {
          background: ${C.bgElev}; border: 1px solid ${C.border}; border-radius: 12px; padding: 24px;
          transition: border-color 0.2s;
        }
        .vt-feature-card:hover { border-color: ${C.warn}55; }
        .vt-feature-icon {
          width: 40px; height: 40px; border-radius: 10px;
          background: ${C.warn}18; border: 1px solid ${C.warn}33;
          display: flex; align-items: center; justify-content: center;
          font-size: 18px; margin-bottom: 14px;
        }
        .vt-feature-title { font-size: 15px; font-weight: 700; color: ${C.text}; margin-bottom: 8px; }
        .vt-feature-desc { font-size: 13px; color: ${C.text2}; line-height: 1.6; }

        /* STATS */
        .vt-stats-grid {
          display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-top: 48px;
        }
        .vt-stat-card {
          background: ${C.bgElev}; border: 1px solid ${C.border}; border-radius: 12px;
          padding: 28px 20px; text-align: center;
        }
        .vt-stat-value { font-size: 40px; font-weight: 800; letter-spacing: -0.03em; line-height: 1; margin-bottom: 8px; }
        .vt-stat-label { font-size: 13px; color: ${C.text2}; line-height: 1.4; }

        /* PRICING */
        .vt-pricing-grid {
          display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-top: 48px;
        }
        .vt-pricing-card {
          background: ${C.bgElev}; border: 1px solid ${C.border}; border-radius: 14px;
          padding: 32px 28px; position: relative;
          transition: border-color 0.2s;
        }
        .vt-pricing-card.highlight {
          border-color: ${C.warn}; background: ${C.bgElev};
        }
        .vt-pricing-badge {
          position: absolute; top: -12px; left: 50%; transform: translateX(-50%);
          background: ${C.warn}; color: #0b0e14; font-size: 11px; font-weight: 700;
          letter-spacing: 0.08em; text-transform: uppercase;
          padding: 3px 12px; border-radius: 20px;
        }
        .vt-pricing-name { font-size: 13px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: ${C.muted}; margin-bottom: 12px; }
        .vt-pricing-price { font-size: 44px; font-weight: 800; letter-spacing: -0.03em; color: ${C.text}; line-height: 1; }
        .vt-pricing-period { font-size: 14px; color: ${C.muted}; margin-bottom: 24px; }
        .vt-pricing-divider { border: none; border-top: 1px solid ${C.border}; margin: 20px 0; }
        .vt-pricing-feature { display: flex; align-items: flex-start; gap: 10px; font-size: 14px; color: ${C.text2}; line-height: 1.5; margin-bottom: 10px; }
        .vt-pricing-feature-check { color: ${C.green}; flex-shrink: 0; margin-top: 1px; font-size: 13px; }
        .vt-pricing-cta {
          display: block; margin-top: 28px; padding: 12px 0;
          border-radius: 8px; text-align: center; font-size: 14px; font-weight: 700;
          background: transparent; border: 1px solid ${C.border}; color: ${C.text2};
          transition: border-color 0.2s, color 0.2s;
        }
        .vt-pricing-card.highlight .vt-pricing-cta {
          background: ${C.warn}; border-color: ${C.warn}; color: #0b0e14;
        }
        .vt-pricing-cta:hover { border-color: ${C.warn}; color: ${C.warn}; }
        .vt-pricing-card.highlight .vt-pricing-cta:hover { opacity: 0.88; color: #0b0e14; }

        /* CLOSE */
        .vt-close {
          padding: 100px 24px; text-align: center;
          background: linear-gradient(180deg, ${C.bg} 0%, ${C.bgElev} 50%, ${C.bg} 100%);
        }
        .vt-close-quote {
          font-size: clamp(22px, 3.5vw, 34px); font-weight: 700; line-height: 1.3;
          color: ${C.text}; max-width: 680px; margin: 0 auto 36px; letter-spacing: -0.01em;
        }
        .vt-close-quote em { font-style: normal; color: ${C.warn}; }

        /* FOOTER */
        .vt-footer {
          border-top: 1px solid ${C.border}; padding: 40px 24px;
        }
        .vt-footer-inner {
          max-width: 1100px; margin: 0 auto;
          display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 20px;
        }
        .vt-footer-logo { font-size: 13px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: ${C.muted}; }
        .vt-footer-links { display: flex; gap: 28px; }
        .vt-footer-link { font-size: 13px; color: ${C.muted}; transition: color 0.15s; }
        .vt-footer-link:hover { color: ${C.text}; }

        /* DIVIDER */
        .vt-divider { border: none; border-top: 1px solid ${C.border}; }

        /* RESPONSIVE */
        @media (max-width: 900px) {
          .vt-pipeline-steps { grid-template-columns: repeat(2, 1fr); }
          .vt-feature-grid { grid-template-columns: repeat(2, 1fr); }
          .vt-stats-grid { grid-template-columns: repeat(2, 1fr); }
          .vt-pricing-grid { grid-template-columns: 1fr; max-width: 420px; margin-left: auto; margin-right: auto; }
        }
        @media (max-width: 640px) {
          .vt-hero { padding: 72px 16px 56px; }
          .vt-section { padding: 60px 16px; }
          .vt-problem-grid { grid-template-columns: 1fr; }
          .vt-pipeline-steps { grid-template-columns: 1fr; }
          .vt-pipeline-step:first-child { border-radius: 10px 10px 0 0; }
          .vt-pipeline-step:last-child { border-radius: 0 0 10px 10px; }
          .vt-pipeline-arrow { display: none; }
          .vt-feature-grid { grid-template-columns: 1fr; }
          .vt-stats-grid { grid-template-columns: repeat(2, 1fr); }
          .vt-footer-inner { flex-direction: column; align-items: flex-start; }
          .vt-nav-inner { padding: 0 16px; }
        }
      `}</style>

      {/* ── NAV ── */}
      <nav className="vt-nav">
        <div className="vt-nav-inner">
          <Link href="/" className="vt-nav-logo">
            Ris<span>cent</span>
          </Link>
          <span className="vt-nav-product">VoiceTrain</span>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="vt-hero">
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <Reveal>
            <div className="vt-hero-tag">Voice Conversation Fine-Tuning Pipeline</div>
            <h1>
              Every conversation makes your<br />
              AI agent <em>smarter.</em>
            </h1>
            <p className="vt-hero-sub">
              Turn real production calls into training data. VoiceTrain ingests your voice conversations,
              scores quality, strips PII, and generates fine-tuning pairs automatically.
              Your agent improves every week — not every quarter.
            </p>
            <a
              href="mailto:ryan@riscent.com?subject=VoiceTrain"
              className="vt-cta-primary"
            >
              Get VoiceTrain
            </a>
          </Reveal>
        </div>
      </section>

      <hr className="vt-divider" />

      {/* ── THE PROBLEM ── */}
      <section className="vt-section">
        <div className="vt-wrap">
          <Reveal>
            <div className="vt-section-label">The Problem</div>
            <h2 className="vt-section-title">
              Prompt engineering has a ceiling.
            </h2>
            <p className="vt-section-sub">
              Every team hits it. The agent plateaus, conversations are forgotten, and the gap between
              you and teams that fine-tune keeps growing.
            </p>
          </Reveal>

          <div className="vt-problem-grid">
            {problems.map((p, i) => (
              <Reveal key={i} delay={i * 80}>
                <div className="vt-problem-card">
                  <p className="vt-problem-card-bad">✗ &nbsp;{p.problem}</p>
                  <p className="vt-problem-card-fix">✓ &nbsp;{p.fix}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <hr className="vt-divider" />

      {/* ── HOW IT WORKS ── */}
      <section className="vt-section">
        <div className="vt-wrap">
          <Reveal>
            <div className="vt-section-label">How It Works</div>
            <h2 className="vt-section-title">
              From raw call to trained model — automated.
            </h2>
            <p className="vt-section-sub">
              An eight-stage pipeline that runs on a schedule. No manual steps, no data science team required.
            </p>
          </Reveal>

          <Reveal delay={100}>
            <div className="vt-pipeline">
              <div className="vt-pipeline-steps">
                {pipelineSteps.map((step, i) => (
                  <div className="vt-pipeline-step" key={i}>
                    <div className="vt-pipeline-step-num">STEP {String(i + 1).padStart(2, '0')}</div>
                    <span className="vt-pipeline-step-icon">{step.icon}</span>
                    <div className="vt-pipeline-step-label">{step.label}</div>
                    <div className="vt-pipeline-step-desc">{step.desc}</div>
                    <div className="vt-pipeline-arrow">›</div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <hr className="vt-divider" />

      {/* ── WHAT IT DOES ── */}
      <section className="vt-section">
        <div className="vt-wrap">
          <Reveal>
            <div className="vt-section-label">Capabilities</div>
            <h2 className="vt-section-title">
              Everything the pipeline does.
            </h2>
            <p className="vt-section-sub">
              Six components working together to convert your call volume into a competitive advantage.
            </p>
          </Reveal>

          <div className="vt-feature-grid">
            {features.map((f, i) => (
              <Reveal key={i} delay={i * 60}>
                <div className="vt-feature-card">
                  <div className="vt-feature-icon">{f.icon}</div>
                  <div className="vt-feature-title">{f.title}</div>
                  <div className="vt-feature-desc">{f.desc}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <hr className="vt-divider" />

      {/* ── PROOF ── */}
      <section className="vt-section">
        <div className="vt-wrap">
          <Reveal>
            <div className="vt-section-label">By the Numbers</div>
            <h2 className="vt-section-title">
              Running in production.
            </h2>
            <p className="vt-section-sub">
              Built and battle-tested on real healthcare voice agent conversations.
            </p>
          </Reveal>

          <div className="vt-stats-grid">
            {stats.map((s, i) => (
              <Reveal key={i} delay={i * 80}>
                <div className="vt-stat-card">
                  <div className="vt-stat-value" style={{ color: s.color }}>{s.value}</div>
                  <div className="vt-stat-label">{s.label}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <hr className="vt-divider" />

      {/* ── PRICING ── */}
      <section className="vt-section">
        <div className="vt-wrap">
          <Reveal>
            <div className="vt-section-label">Pricing</div>
            <h2 className="vt-section-title">
              Simple, volume-based pricing.
            </h2>
            <p className="vt-section-sub">
              Every plan includes PII stripping, quality scoring, SFT export, and JSONL output.
              Pick the volume that matches your call load.
            </p>
          </Reveal>

          <div className="vt-pricing-grid">
            {plans.map((plan, i) => (
              <Reveal key={i} delay={i * 80}>
                <div className={`vt-pricing-card${plan.highlight ? ' highlight' : ''}`}>
                  {plan.highlight && <div className="vt-pricing-badge">Most Popular</div>}
                  <div className="vt-pricing-name">{plan.name}</div>
                  <div className="vt-pricing-price">{plan.price}</div>
                  <div className="vt-pricing-period">{plan.period}</div>
                  <hr className="vt-pricing-divider" />
                  {plan.features.map((feat, j) => (
                    <div className="vt-pricing-feature" key={j}>
                      <span className="vt-pricing-feature-check">✓</span>
                      <span>{feat}</span>
                    </div>
                  ))}
                  <a
                    href="mailto:ryan@riscent.com?subject=VoiceTrain"
                    className="vt-pricing-cta"
                  >
                    Get Started
                  </a>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── CLOSE ── */}
      <section className="vt-close">
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <Reveal>
            <p className="vt-close-quote">
              "The companies that fine-tune <em>win.</em><br />
              The ones that don't fall behind."
            </p>
            <p style={{ fontSize: 16, color: C.text2, marginBottom: 36, maxWidth: 480, margin: '0 auto 36px' }}>
              You already have the data. Every call your agent handles is a training signal you're
              not capturing. VoiceTrain changes that.
            </p>
            <a
              href="mailto:ryan@riscent.com?subject=VoiceTrain"
              className="vt-cta-primary"
            >
              Get VoiceTrain
            </a>
          </Reveal>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="vt-footer">
        <div className="vt-footer-inner">
          <Link href="/" className="vt-footer-logo">Riscent</Link>
          <div className="vt-footer-links">
            <Link href="/" className="vt-footer-link">Home</Link>
            <Link href="/#products" className="vt-footer-link">Products</Link>
            <a href="mailto:ryan@riscent.com" className="vt-footer-link">Contact</a>
          </div>
        </div>
      </footer>
    </>
  );
}
