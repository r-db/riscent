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
  rose: '#fb7185',
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

/* ── ANIMATION HELPER ── */
const anim = (visible: boolean, delay = 0): React.CSSProperties => ({
  opacity: visible ? 1 : 0,
  transform: visible ? 'translateY(0)' : 'translateY(18px)',
  transition: `opacity 0.65s cubic-bezier(0.22,1,0.36,1) ${delay}s, transform 0.65s cubic-bezier(0.22,1,0.36,1) ${delay}s`,
});

/* ── DETECTOR DATA ── */
const detectors = [
  {
    id: 'TOOL_ERROR',
    desc: 'Tool call failed silently. Agent kept talking as if it worked.',
    example: 'Appointment creation returned a 500. Agent said "You\'re all set."',
  },
  {
    id: 'FALSE_SUCCESS',
    desc: 'Agent confirmed an action that never completed.',
    example: '"I\'ve sent you a confirmation" — no message was ever sent.',
  },
  {
    id: 'TRANSFER_NO_IDENTITY',
    desc: 'Caller transferred to a department without identity verification.',
    example: 'Transferred to billing with no name, DOB, or account confirmation.',
  },
  {
    id: 'HIPAA_NO_VERIFY',
    desc: 'Protected health information disclosed before identity was confirmed.',
    example: 'Agent read appointment details to an unverified caller.',
  },
  {
    id: 'NO_CONNECT',
    desc: 'Call ended before the caller reached a resolution.',
    example: 'Caller disconnected mid-transfer. No callback triggered.',
  },
  {
    id: 'AGENT_HALLUCINATION',
    desc: 'Agent stated information not present in tools, data, or prompt.',
    example: '"Your doctor is available Thursday" — no availability was checked.',
  },
];

/* ── PIPELINE STEPS ── */
const pipeline = [
  { step: '01', label: 'PULL', desc: 'Fetch new conversations from ElevenLabs, Retell, Bland, or Synthflow via API.' },
  { step: '02', label: 'DETECT', desc: 'Run 6 detector passes over every transcript. Flag issues with confidence scores.' },
  { step: '03', label: 'DIAGNOSE', desc: 'LLM root-cause analysis on flagged calls. Determines whether the bug is in the prompt, tool schema, or flow.' },
  { step: '04', label: 'FIX', desc: 'Generate a candidate prompt patch targeting the diagnosed failure mode.' },
  { step: '05', label: 'TEST', desc: 'Run the patched agent against a regression suite on staging. No silent deploys.' },
  { step: '06', label: 'DEPLOY', desc: 'If all tests pass, apply the patch to production. Human approval gate available.' },
  { step: '07', label: 'VERIFY', desc: 'Monitor the next cycle. Confirm the issue rate dropped. Close the loop.' },
];

/* ── PLATFORMS ── */
const platforms = [
  { name: 'ElevenLabs', note: 'Conversational AI' },
  { name: 'Retell', note: 'Voice AI' },
  { name: 'Bland', note: 'Phone AI' },
  { name: 'Synthflow', note: 'No-code Voice AI' },
];

/* ── PRICING ── */
const plans = [
  {
    name: 'Monitor',
    price: '$199',
    sub: 'per month',
    highlight: false,
    features: [
      '500 calls / month',
      '6 detector types',
      'Daily issue reports',
      'Email alerts on P0 detections',
      'Dashboard access',
    ],
  },
  {
    name: 'Guard',
    price: '$499',
    sub: 'per month',
    highlight: true,
    features: [
      '2,000 calls / month',
      'Auto-fix with staging tests',
      'Slack alerts',
      'Compliance reports',
      'HIPAA_NO_VERIFY tracking',
      'Root-cause diagnosis',
    ],
  },
  {
    name: 'Enterprise',
    price: '$999',
    sub: 'per month',
    highlight: false,
    features: [
      'Unlimited calls',
      'Custom detectors',
      'HIPAA audit reporting',
      'Dedicated support',
      'API access',
      'SLA guarantee',
    ],
  },
];

/* ════════════════════════════════════════════════ */
export default function VoiceGuardPage() {
  const hero = useReveal(0.1);
  const problem = useReveal(0.1);
  const detect = useReveal(0.1);
  const pipeline = useReveal(0.1);
  const proof = useReveal(0.1);
  const pricing = useReveal(0.1);
  const compat = useReveal(0.1);
  const close = useReveal(0.1);

  return (
    <main style={{
      background: C.bg,
      color: C.text,
      minHeight: '100vh',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Inter, sans-serif',
      fontSize: 16,
      lineHeight: 1.6,
    }}>

      <style>{`
        @keyframes dotPulse { 0%,100% { opacity:1; box-shadow: 0 0 8px #fb718550; } 50% { opacity:0.6; box-shadow: 0 0 20px #fb718570; } }
        @keyframes scanLine { 0% { top: 0%; opacity: 0; } 10% { opacity: 1; } 90% { opacity: 1; } 100% { top: 100%; opacity: 0; } }
        .vg-card { transition: border-color 0.25s, box-shadow 0.25s, transform 0.25s; }
        .vg-card:hover { border-color: #2a3a55 !important; box-shadow: 0 0 24px rgba(251,113,133,0.07); transform: translateY(-2px); }
        .vg-pipe-step { transition: border-color 0.25s, background 0.25s; }
        .vg-pipe-step:hover { border-color: #fb7185 !important; background: #1a1324 !important; }
        @media (max-width: 768px) {
          .vg-section { padding-left: 16px !important; padding-right: 16px !important; }
          .vg-grid-2 { grid-template-columns: 1fr !important; }
          .vg-grid-3 { grid-template-columns: 1fr !important; }
          .vg-grid-4 { grid-template-columns: 1fr 1fr !important; }
          .vg-hero-h1 { font-size: 28px !important; }
          .vg-cta-row { flex-direction: column !important; }
          .vg-cta-row a { width: 100% !important; text-align: center !important; justify-content: center !important; }
          .vg-pipe { grid-template-columns: 1fr !important; }
          .vg-footer-inner { flex-direction: column !important; gap: 12px !important; text-align: center !important; }
          .vg-pricing-grid { grid-template-columns: 1fr !important; }
          .vg-platforms { grid-template-columns: 1fr 1fr !important; }
          .vg-proof-grid { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>

      {/* ── NAV ── */}
      <header className="vg-section" style={{
        borderBottom: `1px solid ${C.border}`,
        padding: '16px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        maxWidth: 1100,
        margin: '0 auto',
      }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', color: C.text }}>
          <div style={{
            width: 10, height: 10, borderRadius: '50%',
            background: C.rose,
            animation: 'dotPulse 2.5s ease-in-out infinite',
          }} />
          <span style={{ fontWeight: 700, letterSpacing: '-0.01em', fontSize: 16 }}>RISCENT</span>
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <span style={{
            fontSize: 13, fontWeight: 600, color: C.rose,
            letterSpacing: '0.04em', textTransform: 'uppercase',
          }}>VoiceGuard</span>
          <Link href="/" style={{ color: C.muted, textDecoration: 'none', fontSize: 14 }}>← All Products</Link>
        </div>
      </header>

      {/* ── HERO ── */}
      <section ref={hero.ref} className="vg-section" style={{ maxWidth: 1100, margin: '0 auto', padding: '88px 24px 72px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20, ...anim(hero.visible) }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: C.rose }} />
          <span style={{ fontSize: 12, fontWeight: 700, color: C.rose, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            Voice Agent QA
          </span>
        </div>

        <h1 className="vg-hero-h1" style={{
          fontSize: 'clamp(30px, 4.5vw, 52px)',
          lineHeight: 1.1,
          letterSpacing: '-0.025em',
          fontWeight: 700,
          marginBottom: 24,
          maxWidth: 820,
          ...anim(hero.visible, 0.1),
        }}>
          Your AI agent said{' '}
          <span style={{
            color: C.rose,
            background: `${C.rose}14`,
            borderRadius: 6,
            padding: '0 6px',
            fontStyle: 'italic',
          }}>"You're all set."</span>
          <br />
          The appointment was never booked.
        </h1>

        <p style={{ fontSize: 19, lineHeight: 1.65, color: C.text2, maxWidth: 720, marginBottom: 12, ...anim(hero.visible, 0.2) }}>
          Autonomous QA that catches what your voice agent gets wrong — and fixes it before customers complain.
        </p>
        <p style={{ fontSize: 16, lineHeight: 1.65, color: C.muted, maxWidth: 680, marginBottom: 40, ...anim(hero.visible, 0.25) }}>
          Works with ElevenLabs, Retell, Bland, and Synthflow. Every call. Every failure mode. Closed-loop remediation with no manual review queue.
        </p>

        <div className="vg-cta-row" style={{ display: 'flex', gap: 12, flexWrap: 'wrap', ...anim(hero.visible, 0.35) }}>
          <a
            href="mailto:ryan@riscent.com?subject=VoiceGuard"
            style={{
              background: C.rose,
              color: '#fff',
              padding: '16px 32px',
              borderRadius: 8,
              fontSize: 16,
              fontWeight: 700,
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            Get VoiceGuard &rarr;
          </a>
          <a
            href="#how-it-works"
            style={{
              background: 'transparent',
              color: C.text,
              border: `1px solid ${C.border}`,
              padding: '16px 32px',
              borderRadius: 8,
              fontSize: 16,
              fontWeight: 600,
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
            }}
          >
            See how it works
          </a>
        </div>

        {/* inline proof badge */}
        <div style={{ display: 'flex', gap: 32, marginTop: 48, flexWrap: 'wrap', ...anim(hero.visible, 0.45) }}>
          {[
            { val: '2,261', lbl: 'calls analyzed' },
            { val: '619', lbl: 'issues detected' },
            { val: '58.7%', lbl: 'clean rate achieved' },
            { val: '6', lbl: 'detector types' },
          ].map((s) => (
            <div key={s.lbl}>
              <div style={{ fontSize: 26, fontWeight: 700, color: C.text, letterSpacing: '-0.02em', lineHeight: 1 }}>{s.val}</div>
              <div style={{ fontSize: 13, color: C.muted, marginTop: 4 }}>{s.lbl}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── THE PROBLEM ── */}
      <section ref={problem.ref} className="vg-section" style={{ maxWidth: 1100, margin: '0 auto', padding: '64px 24px', borderTop: `1px solid ${C.border}` }}>
        <p style={{ fontSize: 12, fontWeight: 700, color: C.warn, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 12, ...anim(problem.visible) }}>
          The problem
        </p>
        <h2 style={{ fontSize: 'clamp(24px, 3.2vw, 36px)', lineHeight: 1.15, letterSpacing: '-0.02em', fontWeight: 700, marginBottom: 12, maxWidth: 760, ...anim(problem.visible, 0.1) }}>
          AI voice agents fail in ways that are invisible until a customer calls back angry.
        </h2>
        <p style={{ fontSize: 17, color: C.text2, maxWidth: 680, lineHeight: 1.65, marginBottom: 40, ...anim(problem.visible, 0.15) }}>
          The agent sounds confident. The transcript looks clean. But the action never happened — or the wrong data was shared with the wrong person. Manual QA reviews 2–5% of calls. The other 95% go unaudited.
        </p>

        <div className="vg-grid-2" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
          {[
            {
              tag: 'FALSE_SUCCESS',
              title: 'Agent confirms actions that actually failed.',
              problem: '"Your appointment is booked!" — the calendar API returned an error the agent ignored.',
              fix: 'VoiceGuard cross-references tool call outcomes against agent utterances. Every mismatch is flagged.',
            },
            {
              tag: 'TRANSFER_NO_IDENTITY',
              title: 'Transfers without verifying caller identity.',
              problem: 'Agent hands off a caller to billing or scheduling with zero verification. Anyone can get through.',
              fix: 'VoiceGuard checks every transfer event for a preceding identity-confirmation step.',
            },
            {
              tag: 'HIPAA_NO_VERIFY',
              title: 'Shares private information before verification.',
              problem: 'PHI — appointment dates, provider names, balances — disclosed to unverified callers. HIPAA exposure.',
              fix: 'VoiceGuard audits every disclosure against verification status in the transcript timeline.',
            },
            {
              tag: 'COVERAGE GAP',
              title: 'Manual QA covers 2–5% of calls.',
              problem: 'At 500 calls/month, your QA team reviews 10–25. The other 475 are invisible.',
              fix: 'VoiceGuard reviews 100% of calls automatically. Nothing goes unreviewed.',
            },
          ].map((card, i) => (
            <div
              key={card.tag}
              className="vg-card"
              style={{
                background: C.bgElev,
                border: `1px solid ${C.border}`,
                borderRadius: 12,
                padding: '28px 24px',
                ...anim(problem.visible, 0.2 + i * 0.08),
              }}
            >
              <div style={{ fontSize: 11, fontWeight: 700, color: C.rose, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 10 }}>
                {card.tag}
              </div>
              <div style={{ fontSize: 17, fontWeight: 700, color: C.text, marginBottom: 12, lineHeight: 1.3 }}>{card.title}</div>
              <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.6, marginBottom: 14 }}>{card.problem}</p>
              <div style={{
                fontSize: 14,
                color: C.green,
                lineHeight: 1.55,
                paddingTop: 12,
                borderTop: `1px solid ${C.border}`,
                display: 'flex',
                gap: 8,
              }}>
                <span style={{ flexShrink: 0, fontWeight: 700 }}>FIX:</span>
                <span>{card.fix}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── WHAT WE DETECT ── */}
      <section ref={detect.ref} className="vg-section" style={{ maxWidth: 1100, margin: '0 auto', padding: '64px 24px', borderTop: `1px solid ${C.border}` }}>
        <p style={{ fontSize: 12, fontWeight: 700, color: C.rose, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 12, ...anim(detect.visible) }}>
          What we detect
        </p>
        <h2 style={{ fontSize: 'clamp(24px, 3.2vw, 36px)', lineHeight: 1.15, letterSpacing: '-0.02em', fontWeight: 700, marginBottom: 12, maxWidth: 700, ...anim(detect.visible, 0.1) }}>
          6 detector types. Every call. Automatic.
        </h2>
        <p style={{ fontSize: 17, color: C.text2, maxWidth: 640, lineHeight: 1.65, marginBottom: 40, ...anim(detect.visible, 0.15) }}>
          Each detector is a separate analysis pass over the transcript and tool call log. They run in parallel on every conversation.
        </p>

        <div className="vg-grid-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
          {detectors.map((d, i) => (
            <div
              key={d.id}
              className="vg-card"
              style={{
                background: C.bgElev,
                border: `1px solid ${C.border}`,
                borderRadius: 10,
                padding: '22px 20px',
                ...anim(detect.visible, 0.2 + i * 0.07),
              }}
            >
              <div style={{
                display: 'inline-block',
                fontSize: 11,
                fontWeight: 700,
                color: C.rose,
                background: `${C.rose}15`,
                border: `1px solid ${C.rose}30`,
                borderRadius: 4,
                padding: '3px 8px',
                letterSpacing: '0.06em',
                marginBottom: 12,
              }}>
                {d.id}
              </div>
              <p style={{ fontSize: 14, color: C.text, lineHeight: 1.55, fontWeight: 500, marginBottom: 10 }}>{d.desc}</p>
              <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.5, fontStyle: 'italic', margin: 0 }}>
                e.g. {d.example}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section ref={pipeline.ref} id="how-it-works" className="vg-section" style={{ maxWidth: 1100, margin: '0 auto', padding: '64px 24px', borderTop: `1px solid ${C.border}` }}>
        <p style={{ fontSize: 12, fontWeight: 700, color: C.accent, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 12, ...anim(pipeline.visible) }}>
          How it works
        </p>
        <h2 style={{ fontSize: 'clamp(24px, 3.2vw, 36px)', lineHeight: 1.15, letterSpacing: '-0.02em', fontWeight: 700, marginBottom: 12, maxWidth: 700, ...anim(pipeline.visible, 0.1) }}>
          A 7-step autonomous loop. Runs without you.
        </h2>
        <p style={{ fontSize: 17, color: C.text2, maxWidth: 640, lineHeight: 1.65, marginBottom: 40, ...anim(pipeline.visible, 0.15) }}>
          VoiceGuard isn't a dashboard you check. It's a closed-loop system that catches failures, diagnoses root causes, generates fixes, tests them, and deploys them — on a continuous cycle.
        </p>

        <div className="vg-pipe" style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 8 }}>
          {[
            { step: '01', label: 'PULL', desc: 'Fetch new conversations from your platform via API.' },
            { step: '02', label: 'DETECT', desc: 'Run 6 detector passes over every transcript.' },
            { step: '03', label: 'DIAGNOSE', desc: 'LLM root-cause analysis on flagged calls.' },
            { step: '04', label: 'FIX', desc: 'Generate a candidate prompt patch.' },
            { step: '05', label: 'TEST', desc: 'Run the patch against a regression suite on staging.' },
            { step: '06', label: 'DEPLOY', desc: 'Apply to production if all tests pass.' },
            { step: '07', label: 'VERIFY', desc: 'Confirm the issue rate dropped in the next cycle.' },
          ].map((s, i) => (
            <div
              key={s.step}
              className="vg-pipe-step"
              style={{
                background: C.bgElev,
                border: `1px solid ${C.border}`,
                borderRadius: 10,
                padding: '18px 14px',
                textAlign: 'center',
                position: 'relative',
                ...anim(pipeline.visible, 0.15 + i * 0.07),
              }}
            >
              {/* connector arrow — all but last */}
              {i < 6 && (
                <div style={{
                  position: 'absolute',
                  right: -12,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: C.muted,
                  fontSize: 14,
                  zIndex: 1,
                  display: 'flex',
                  alignItems: 'center',
                }}>›</div>
              )}
              <div style={{ fontSize: 11, color: C.muted, fontWeight: 700, letterSpacing: '0.04em', marginBottom: 6 }}>{s.step}</div>
              <div style={{
                fontSize: 12,
                fontWeight: 700,
                color: C.rose,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                marginBottom: 8,
              }}>{s.label}</div>
              <p style={{ fontSize: 12, color: C.text2, lineHeight: 1.5, margin: 0 }}>{s.desc}</p>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 24, padding: '16px 20px', background: `${C.accent}0a`, border: `1px solid ${C.accent}20`, borderRadius: 8, display: 'flex', gap: 12, alignItems: 'flex-start', ...anim(pipeline.visible, 0.7) }}>
          <div style={{ color: C.accent, fontSize: 18, flexShrink: 0, lineHeight: 1 }}>&#9432;</div>
          <p style={{ fontSize: 14, color: C.text2, margin: 0, lineHeight: 1.6 }}>
            A human approval gate is available on the DEPLOY step. Default is auto-deploy on pass. Enterprise customers can require sign-off before any production change.
          </p>
        </div>
      </section>

      {/* ── PROOF ── */}
      <section ref={proof.ref} className="vg-section" style={{ maxWidth: 1100, margin: '0 auto', padding: '64px 24px', borderTop: `1px solid ${C.border}` }}>
        <p style={{ fontSize: 12, fontWeight: 700, color: C.green, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 12, ...anim(proof.visible) }}>
          Production numbers
        </p>
        <h2 style={{ fontSize: 'clamp(24px, 3.2vw, 36px)', lineHeight: 1.15, letterSpacing: '-0.02em', fontWeight: 700, marginBottom: 12, maxWidth: 700, ...anim(proof.visible, 0.1) }}>
          These are real numbers from a live deployment.
        </h2>
        <p style={{ fontSize: 17, color: C.text2, maxWidth: 640, lineHeight: 1.65, marginBottom: 40, ...anim(proof.visible, 0.15) }}>
          Not a demo. Not a benchmark. Running in production on a healthcare voice agent with strict HIPAA requirements.
        </p>

        <div className="vg-proof-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
          {[
            { val: '2,261', lbl: 'Conversations analyzed', color: C.text },
            { val: '619', lbl: 'Issues detected', color: C.rose },
            { val: '58.7%', lbl: 'Clean rate achieved', color: C.green },
            { val: '6', lbl: 'Detector types active', color: C.accent },
          ].map((s, i) => (
            <div
              key={s.lbl}
              className="vg-card"
              style={{
                background: C.bgElev,
                border: `1px solid ${C.border}`,
                borderRadius: 10,
                padding: '28px 20px',
                ...anim(proof.visible, 0.2 + i * 0.1),
              }}
            >
              <div style={{ fontSize: 40, fontWeight: 700, color: s.color, letterSpacing: '-0.025em', lineHeight: 1, marginBottom: 8 }}>{s.val}</div>
              <div style={{ fontSize: 14, color: C.text2, lineHeight: 1.4 }}>{s.lbl}</div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 20, fontSize: 14, color: C.muted, ...anim(proof.visible, 0.6) }}>
          Deployment: Advanced Psychiatry, multi-location behavioral health practice. Voice platform: ElevenLabs.{' '}
          <Link href="/case-study" style={{ color: C.accent, textDecoration: 'none' }}>Read the full case study &rarr;</Link>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section ref={pricing.ref} className="vg-section" style={{ maxWidth: 1100, margin: '0 auto', padding: '64px 24px', borderTop: `1px solid ${C.border}` }}>
        <p style={{ fontSize: 12, fontWeight: 700, color: C.muted, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 12, ...anim(pricing.visible) }}>
          Pricing
        </p>
        <h2 style={{ fontSize: 'clamp(24px, 3.2vw, 36px)', lineHeight: 1.15, letterSpacing: '-0.02em', fontWeight: 700, marginBottom: 12, maxWidth: 700, ...anim(pricing.visible, 0.1) }}>
          Start monitoring. Upgrade to auto-fix.
        </h2>
        <p style={{ fontSize: 17, color: C.text2, maxWidth: 640, lineHeight: 1.65, marginBottom: 40, ...anim(pricing.visible, 0.15) }}>
          Every plan runs the full 6-detector suite. The difference is volume and automation depth.
        </p>

        <div className="vg-pricing-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18 }}>
          {plans.map((plan, i) => (
            <div
              key={plan.name}
              className="vg-card"
              style={{
                background: plan.highlight ? `${C.rose}0c` : C.bgElev,
                border: `1px solid ${plan.highlight ? C.rose + '50' : C.border}`,
                borderTop: `3px solid ${plan.highlight ? C.rose : C.border}`,
                borderRadius: 12,
                padding: '32px 24px',
                position: 'relative',
                ...anim(pricing.visible, 0.2 + i * 0.1),
              }}
            >
              {plan.highlight && (
                <div style={{
                  position: 'absolute',
                  top: -1,
                  right: 20,
                  background: C.rose,
                  color: '#fff',
                  fontSize: 11,
                  fontWeight: 700,
                  padding: '4px 10px',
                  borderRadius: '0 0 6px 6px',
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                }}>Most Popular</div>
              )}
              <div style={{ fontSize: 12, fontWeight: 700, color: plan.highlight ? C.rose : C.muted, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 8 }}>
                {plan.name}
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 4 }}>
                <span style={{ fontSize: 40, fontWeight: 700, color: C.text, letterSpacing: '-0.025em', lineHeight: 1 }}>{plan.price}</span>
                <span style={{ fontSize: 14, color: C.muted }}>{plan.sub}</span>
              </div>
              <div style={{ borderTop: `1px solid ${C.border}`, marginTop: 20, paddingTop: 20 }}>
                {plan.features.map((f) => (
                  <div key={f} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 10 }}>
                    <span style={{ color: plan.highlight ? C.rose : C.green, fontSize: 14, lineHeight: '21px', flexShrink: 0 }}>&#10003;</span>
                    <span style={{ fontSize: 14, color: C.text2, lineHeight: 1.5 }}>{f}</span>
                  </div>
                ))}
              </div>
              <a
                href="mailto:ryan@riscent.com?subject=VoiceGuard"
                style={{
                  display: 'block',
                  marginTop: 24,
                  padding: '14px',
                  borderRadius: 8,
                  textAlign: 'center',
                  fontSize: 15,
                  fontWeight: 700,
                  textDecoration: 'none',
                  background: plan.highlight ? C.rose : 'transparent',
                  color: plan.highlight ? '#fff' : C.text,
                  border: plan.highlight ? 'none' : `1px solid ${C.border}`,
                }}
              >
                Get started &rarr;
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* ── WORKS WITH ── */}
      <section ref={compat.ref} className="vg-section" style={{ maxWidth: 1100, margin: '0 auto', padding: '64px 24px', borderTop: `1px solid ${C.border}` }}>
        <p style={{ fontSize: 12, fontWeight: 700, color: C.muted, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 12, ...anim(compat.visible) }}>
          Compatible platforms
        </p>
        <h2 style={{ fontSize: 'clamp(22px, 2.8vw, 32px)', lineHeight: 1.2, letterSpacing: '-0.015em', fontWeight: 700, marginBottom: 32, ...anim(compat.visible, 0.1) }}>
          Already running a voice agent? VoiceGuard wraps around it.
        </h2>

        <div className="vg-platforms" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
          {[
            { name: 'ElevenLabs', note: 'Conversational AI' },
            { name: 'Retell', note: 'Voice AI' },
            { name: 'Bland', note: 'Phone AI' },
            { name: 'Synthflow', note: 'No-code Voice AI' },
          ].map((p, i) => (
            <div
              key={p.name}
              className="vg-card"
              style={{
                background: C.bgElev,
                border: `1px solid ${C.border}`,
                borderRadius: 10,
                padding: '22px 20px',
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                ...anim(compat.visible, 0.15 + i * 0.08),
              }}
            >
              <div style={{
                width: 36,
                height: 36,
                borderRadius: 8,
                background: `${C.rose}18`,
                border: `1px solid ${C.rose}30`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                fontSize: 14,
                fontWeight: 700,
                color: C.rose,
              }}>
                {p.name[0]}
              </div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 700, color: C.text }}>{p.name}</div>
                <div style={{ fontSize: 13, color: C.muted }}>{p.note}</div>
              </div>
            </div>
          ))}
        </div>

        <p style={{ fontSize: 15, color: C.muted, marginTop: 20, lineHeight: 1.6, ...anim(compat.visible, 0.55) }}>
          Not on this list? If your platform exposes a conversation API, we can connect to it.{' '}
          <a href="mailto:ryan@riscent.com?subject=VoiceGuard platform question" style={{ color: C.accent, textDecoration: 'none' }}>Ask us.</a>
        </p>
      </section>

      {/* ── CLOSE ── */}
      <section ref={close.ref} className="vg-section" style={{ maxWidth: 1100, margin: '0 auto', padding: '80px 24px', borderTop: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: 740 }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: C.rose, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 12, ...anim(close.visible) }}>
            The question you should be asking
          </p>
          <h2 style={{ fontSize: 'clamp(26px, 3.5vw, 40px)', lineHeight: 1.15, letterSpacing: '-0.02em', fontWeight: 700, marginBottom: 20, ...anim(close.visible, 0.1) }}>
            95% of your AI calls go unreviewed.
            <span style={{ color: C.rose }}> What are they saying?</span>
          </h2>
          <p style={{ fontSize: 18, lineHeight: 1.7, color: C.text2, marginBottom: 16, ...anim(close.visible, 0.2) }}>
            Every call your voice agent handles is a customer interaction with your business. When it confirms a booking that didn't happen, when it shares PHI to the wrong person, when it makes up information — you don't find out until the complaint lands.
          </p>
          <p style={{ fontSize: 16, lineHeight: 1.65, color: C.text2, marginBottom: 36, ...anim(close.visible, 0.25) }}>
            VoiceGuard runs in the background, reviews everything, and closes the loop before it becomes a pattern. The longer you run a voice agent without it, the larger the blind spot grows.
          </p>
          <div className="vg-cta-row" style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 20, ...anim(close.visible, 0.35) }}>
            <a
              href="mailto:ryan@riscent.com?subject=VoiceGuard"
              style={{
                background: C.rose,
                color: '#fff',
                padding: '18px 36px',
                borderRadius: 8,
                fontSize: 17,
                fontWeight: 700,
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
              }}
            >
              Get VoiceGuard &rarr;
            </a>
            <a
              href="mailto:ryan@riscent.com?subject=VoiceGuard question"
              style={{
                background: 'transparent',
                color: C.text,
                border: `1px solid ${C.border}`,
                padding: '18px 36px',
                borderRadius: 8,
                fontSize: 17,
                fontWeight: 600,
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
              }}
            >
              ryan@riscent.com
            </a>
          </div>
          <p style={{ fontSize: 14, color: C.muted, ...anim(close.visible, 0.45) }}>
            Response within 24 hours. I&apos;ll tell you whether we can connect to your platform before you sign anything.
          </p>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="vg-section" style={{
        borderTop: `1px solid ${C.border}`,
        padding: '28px 24px',
        maxWidth: 1100,
        margin: '0 auto',
      }}>
        <div className="vg-footer-inner" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 20 }}>
          <div>
            <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', marginBottom: 8 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: C.rose }} />
              <span style={{ fontWeight: 700, fontSize: 14, color: C.text2 }}>RISCENT</span>
            </Link>
            <div style={{ fontSize: 13, color: C.muted }}>Autonomous QA for AI voice agents.</div>
          </div>
          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', alignItems: 'center' }}>
            <Link href="/" style={{ color: C.muted, textDecoration: 'none', fontSize: 13 }}>riscent.com</Link>
            <Link href="/#products" style={{ color: C.muted, textDecoration: 'none', fontSize: 13 }}>Products</Link>
            <Link href="/case-study" style={{ color: C.muted, textDecoration: 'none', fontSize: 13 }}>Case Study</Link>
            <Link href="/docs" style={{ color: C.muted, textDecoration: 'none', fontSize: 13 }}>Articles</Link>
            <a href="mailto:ryan@riscent.com" style={{ color: C.muted, textDecoration: 'none', fontSize: 13 }}>Contact</a>
          </div>
        </div>
      </footer>

    </main>
  );
}
