'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

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

/* ── HOOKS ── */
function useReveal(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

function useCountUp(target: number, active: boolean, ms = 1200, delay = 0) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!active) return;
    const t = setTimeout(() => {
      const start = performance.now();
      const tick = () => {
        const p = Math.min((performance.now() - start) / ms, 1);
        setVal(Math.round(target * (1 - Math.pow(1 - p, 3))));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, delay);
    return () => clearTimeout(t);
  }, [active, target, ms, delay]);
  return val;
}

/* ── FEARS ── */
const fears = [
  {
    pain: "Your nephew's friend built it with Make.com. Your customer data is in 6 tools you've never heard of.",
    fix: 'I build one system. Your data stays in one place. You own it.',
  },
  {
    pain: 'The agency quoted $120K and 6 months. You got a slide deck.',
    fix: 'Fixed price. Fixed timeline. Working system or you don\'t pay.',
  },
  {
    pain: 'Your competitor hired an "AI company." Eight months later, nothing works.',
    fix: 'I ship in weeks, not quarters. You see it working before you pay the second invoice.',
  },
  {
    pain: "You're paying for 4 tools that don't talk to each other. Your staff copies data between them.",
    fix: 'One platform. Everything connected. Staff does real work instead of data entry.',
  },
];

/* ── OUTCOMES ── */
const outcomes = [
  { id: 'lines', label: 'lines of code', sub: 'One person. One year.' },
  { id: 'val', label: 'valuation — one client', sub: 'From $60K seed investment.' },
  { id: 'proj', label: 'projected at 1,000 clients', sub: 'Same system. Same infrastructure.' },
  { id: 'calls', label: 'calls in one month — one client', sub: 'Zero missed. Two languages. 24/7.' },
];

/* ── TIERS ── */
const tiers = [
  {
    name: 'Figure out what\'s broken',
    price: '$7,500',
    time: '1 week',
    what: 'I sit with you and your team for a week. At the end you get a written diagnosis: what to build, what to kill, what to fix — and a working proof that the fix works.',
    who: 'You need answers before you spend money.',
  },
  {
    name: 'Build it and hand it over',
    price: '$15K – $150K',
    time: '2 – 12 weeks',
    what: 'I build the working system, transfer everything to you on day 30, and stay on-call for another 30 days. You own the code. One invoice. No surprises.',
    who: 'You know what you need. You need someone who can ship it.',
  },
  {
    name: 'Stay and run it',
    price: '$5K – $15K / mo',
    time: 'Ongoing',
    what: 'I stay embedded with your team. Architecture, hiring, reviews, direct access. 10–20 hours a week of someone who has done this before.',
    who: 'You need a technical leader without the full-time salary.',
  },
];

/* ── DONT LIST ── */
const donts = [
  'Chatbots that annoy your customers',
  'AI that sounds like a robot',
  'Dashboards nobody looks at',
  'Consultants who send a PDF and disappear',
  'Per-hour billing that punishes you for asking questions',
  'Open-ended contracts with no deliverable',
  'Subcontracting to juniors you never meet',
  'Slide decks instead of working software',
];

/* ── ANIMATION STYLE ── */
const anim = (visible: boolean, delay = 0): React.CSSProperties => ({
  opacity: visible ? 1 : 0,
  transform: visible ? 'translateY(0)' : 'translateY(16px)',
  transition: `all 0.7s cubic-bezier(0.22,1,0.36,1) ${delay}s`,
});

/* ════════════════════════════════════════════════ */
export default function LandingPage() {
  const router = useRouter();
  const hero = useReveal(0.1);
  const fear = useReveal(0.1);
  const proof = useReveal(0.1);
  const work = useReveal(0.1);
  const dont = useReveal(0.1);
  const close = useReveal(0.1);

  const cCalls = useCountUp(1710, proof.visible, 1200, 800);

  return (
    <main style={{ background: C.bg, color: C.text, minHeight: '100vh', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Inter, sans-serif', fontSize: 16, lineHeight: 1.6 }}>

      {/* ANIMATIONS */}
      <style>{`
        @keyframes dotPulse { 0%,100% { opacity: 1; box-shadow: 0 0 8px #5fd6a380; } 50% { opacity: 0.5; box-shadow: 0 0 20px #5fd6a360; } }
        @keyframes borderShift { 0%,100% { border-color: #1e2535; } 50% { border-color: #2a3a55; } }
        @keyframes glowPulse { 0%,100% { box-shadow: 0 0 0 rgba(79,140,255,0); } 50% { box-shadow: 0 0 24px rgba(79,140,255,0.06); } }
        .rc-card { transition: all 0.3s ease; }
        .rc-card:hover { border-color: #2a3a55 !important; box-shadow: 0 0 20px rgba(79,140,255,0.05); }
        @media (max-width: 768px) {
          .rc-grid-2 { grid-template-columns: 1fr !important; }
          .rc-grid-3 { grid-template-columns: 1fr !important; }
          .rc-grid-4 { grid-template-columns: 1fr !important; }
          .rc-section { padding-left: 16px !important; padding-right: 16px !important; }
          .rc-hero-h1 { font-size: 32px !important; }
          .rc-cta-row { flex-direction: column !important; }
          .rc-cta-row a, .rc-cta-row button { width: 100% !important; text-align: center !important; justify-content: center !important; }
          .rc-footer { flex-direction: column !important; text-align: center !important; gap: 12px !important; }
          .rc-nav-links { gap: 16px !important; font-size: 13px !important; }
        }
      `}</style>

      {/* ── NAV ── */}
      <header className="rc-section" style={{ borderBottom: `1px solid ${C.border}`, padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: C.green, animation: 'dotPulse 3s ease-in-out infinite' }} />
          <span style={{ fontWeight: 700, letterSpacing: '-0.01em', fontSize: 16 }}>RISCENT</span>
        </div>
        <div className="rc-nav-links" style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <a href="/docs" style={{ color: C.text2, textDecoration: 'none', fontSize: 14, fontWeight: 500 }}>Articles</a>
          <a href="/case-study" style={{ color: C.text2, textDecoration: 'none', fontSize: 14, fontWeight: 500 }}>Case Studies &amp; Proof</a>
          <a href="mailto:ryan@riscent.com" style={{ color: C.text2, textDecoration: 'none', fontSize: 14, fontWeight: 500 }}>ryan@riscent.com</a>
        </div>
      </header>

      {/* ── HERO ── */}
      <section ref={hero.ref} className="rc-section" style={{ maxWidth: 1100, margin: '0 auto', padding: '80px 24px 64px' }}>
        <p style={{ fontSize: 13, fontWeight: 600, color: C.accent, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 20, ...anim(hero.visible) }}>
          You don&apos;t need another AI pitch.
        </p>
        <h1 className="rc-hero-h1" style={{ fontSize: 'clamp(36px, 5vw, 56px)', lineHeight: 1.08, letterSpacing: '-0.025em', fontWeight: 700, marginBottom: 28, maxWidth: 800, ...anim(hero.visible, 0.1) }}>
          You need someone who&apos;s <em style={{ fontStyle: 'normal', color: C.green }}>built it</em>,<br />
          not someone who&apos;s <em style={{ fontStyle: 'normal', color: C.muted }}>selling it</em>.
        </h1>
        <p style={{ fontSize: 19, lineHeight: 1.6, color: C.text2, maxWidth: 680, marginBottom: 28, ...anim(hero.visible, 0.2) }}>
          I&apos;m Ryan. 20 years in sales, engineering, and business development. Last year I went all in — 80-hour weeks — and built a HIPAA-compliant medical platform from scratch. Over a million lines of code. Voice agents in two languages. Patient portal. CRM. Marketing systems. Automations. SIP trunking. Data infrastructure. Everything.
        </p>
        <p style={{ fontSize: 19, lineHeight: 1.6, color: C.text, fontWeight: 600, maxWidth: 680, marginBottom: 28, ...anim(hero.visible, 0.3) }}>
          One client. $1.6 million valuation. $60K seed investment.<br />
          One thousand clients. $50 million. Same system.
        </p>
        <p style={{ fontSize: 17, lineHeight: 1.6, color: C.text2, maxWidth: 680, marginBottom: 40, ...anim(hero.visible, 0.35) }}>
          That&apos;s not a pitch. That&apos;s what I built last year. If your business needs AI that actually works — not a demo, not a deck, not a 23-year-old with a no-code tool — I&apos;m the person who builds it.
        </p>
        <div className="rc-cta-row" style={{ display: 'flex', gap: 12, flexWrap: 'wrap', ...anim(hero.visible, 0.4) }}>
          <button onClick={() => router.push('/behind-the-curtain')} style={{ background: C.accent, color: C.bg, border: 'none', padding: '16px 28px', borderRadius: 8, fontSize: 16, fontWeight: 700, cursor: 'pointer' }}>
            Tell me what&apos;s broken →
          </button>
          <a href="mailto:ryan@riscent.com?subject=Quick%20question" style={{ background: 'transparent', color: C.text, border: `1px solid ${C.border}`, padding: '16px 28px', borderRadius: 8, fontSize: 16, fontWeight: 600, textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}>
            ryan@riscent.com
          </a>
        </div>
      </section>

      {/* ── THE FEAR ── */}
      <section ref={fear.ref} className="rc-section" style={{ maxWidth: 1100, margin: '0 auto', padding: '64px 24px', borderTop: `1px solid ${C.border}` }}>
        <p style={{ fontSize: 13, fontWeight: 600, color: C.warn, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 12, ...anim(fear.visible) }}>
          Sound familiar?
        </p>
        <h2 style={{ fontSize: 'clamp(26px, 3.5vw, 36px)', lineHeight: 1.15, letterSpacing: '-0.015em', fontWeight: 700, marginBottom: 36, maxWidth: 700, ...anim(fear.visible, 0.1) }}>
          You&apos;ve been burned. I get it.
        </h2>
        <div className="rc-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {fears.map((f, i) => (
            <div key={i} className="rc-card" style={{ background: C.bgElev, border: `1px solid ${C.border}`, borderLeft: `3px solid ${C.warn}`, borderRadius: 10, padding: '22px 24px', animation: 'borderShift 6s ease-in-out infinite', animationDelay: `${i * 0.5}s`, ...anim(fear.visible, 0.15 + i * 0.1) }}>
              <p style={{ fontSize: 16, fontWeight: 600, color: C.text, lineHeight: 1.45, marginBottom: 14 }}>
                {f.pain}
              </p>
              <p style={{ fontSize: 15, color: C.text2, lineHeight: 1.5 }}>
                <span style={{ color: C.green, fontWeight: 600 }}>Instead: </span>{f.fix}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── PROOF ── */}
      <section ref={proof.ref} className="rc-section" style={{ maxWidth: 1100, margin: '0 auto', padding: '64px 24px', borderTop: `1px solid ${C.border}` }}>
        <p style={{ fontSize: 13, fontWeight: 600, color: C.muted, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 12, ...anim(proof.visible) }}>
          What it looks like when it works
        </p>
        <h2 style={{ fontSize: 'clamp(26px, 3.5vw, 36px)', lineHeight: 1.15, letterSpacing: '-0.015em', fontWeight: 700, marginBottom: 36, maxWidth: 800, ...anim(proof.visible, 0.1) }}>
          Built for one. Architected for a thousand.
        </h2>
        <div className="rc-grid-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 32 }}>
          {outcomes.map((o, i) => (
            <div key={o.label} className="rc-card" style={{ background: C.bgElev, border: `1px solid ${C.border}`, borderRadius: 10, padding: '24px', animation: 'glowPulse 4s ease-in-out infinite', animationDelay: `${i * 0.8}s`, ...anim(proof.visible, 0.15 + i * 0.1) }}>
              <div style={{ fontSize: 40, fontWeight: 700, color: o.id === 'proj' ? C.accent : C.green, letterSpacing: '-0.02em', lineHeight: 1, marginBottom: 6 }}>
                {o.id === 'lines' ? '1M+' : o.id === 'val' ? '$1.6M' : o.id === 'proj' ? '$50M+' : cCalls.toLocaleString()}
              </div>
              <div style={{ fontSize: 15, color: C.text, fontWeight: 500, marginBottom: 4 }}>{o.label}</div>
              <div style={{ fontSize: 14, color: C.muted }}>{o.sub}</div>
            </div>
          ))}
        </div>
        <p style={{ fontSize: 17, lineHeight: 1.65, color: C.text2, maxWidth: 740, ...anim(proof.visible, 0.5) }}>
          Advanced Psychiatry had 5 providers, an answering service that missed a third of calls, a patient portal nobody used, and staff burning out from phone duty. I replaced all of it — voice agents in English and Spanish, passwordless patient portal, multi-provider CRM, automated scheduling, telehealth integration, provider status system, HIPAA-compliant infrastructure with BAA. 415 API routes. Built, deployed, and running in production. Their patients book at midnight. Their staff does clinical work. The owner took a Saturday off for the first time in two years.
        </p>
      </section>

      {/* ── HOW I WORK ── */}
      <section ref={work.ref} className="rc-section" style={{ maxWidth: 1100, margin: '0 auto', padding: '64px 24px', borderTop: `1px solid ${C.border}` }}>
        <p style={{ fontSize: 13, fontWeight: 600, color: C.muted, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 12, ...anim(work.visible) }}>
          Three ways to work together
        </p>
        <h2 style={{ fontSize: 'clamp(26px, 3.5vw, 36px)', lineHeight: 1.15, letterSpacing: '-0.015em', fontWeight: 700, marginBottom: 36, maxWidth: 700, ...anim(work.visible, 0.1) }}>
          You know the price before we start.
        </h2>
        <div className="rc-grid-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18 }}>
          {tiers.map((t, i) => (
            <div key={t.name} className="rc-card" style={{ background: C.bgElev, border: `1px solid ${C.border}`, borderRadius: 10, padding: '28px 24px', ...anim(work.visible, 0.15 + i * 0.12) }}>
              <div style={{ fontSize: 13, color: C.muted, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 8 }}>{t.time}</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: C.text, marginBottom: 6 }}>{t.name}</div>
              <div style={{ fontSize: 26, fontWeight: 700, color: C.accent, marginBottom: 16, letterSpacing: '-0.01em' }}>{t.price}</div>
              <p style={{ fontSize: 15, lineHeight: 1.55, color: C.text2, marginBottom: 16 }}>{t.what}</p>
              <div style={{ fontSize: 14, color: C.muted, paddingTop: 14, borderTop: `1px solid ${C.border}` }}>
                <strong style={{ color: C.text2 }}>Best for: </strong>{t.who}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── WHAT I DON'T DO ── */}
      <section ref={dont.ref} className="rc-section" style={{ maxWidth: 1100, margin: '0 auto', padding: '64px 24px', borderTop: `1px solid ${C.border}` }}>
        <h2 style={{ fontSize: 'clamp(24px, 3vw, 32px)', lineHeight: 1.2, letterSpacing: '-0.01em', fontWeight: 700, marginBottom: 24, maxWidth: 700, ...anim(dont.visible) }}>
          What I don&apos;t do.
        </h2>
        <div className="rc-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
          {donts.map((d, i) => (
            <div key={d} className="rc-card" style={{ background: C.bgElev, border: `1px solid ${C.border}`, borderRadius: 8, padding: '16px 18px', fontSize: 15, color: C.text2, ...anim(dont.visible, 0.05 + i * 0.06) }}>
              <span style={{ color: C.warn, marginRight: 10 }}>✗</span>{d}
            </div>
          ))}
        </div>
        <p style={{ fontSize: 15, color: C.muted, maxWidth: 680, fontStyle: 'italic', ...anim(dont.visible, 0.5) }}>
          If you need any of those, there are firms that do them well. I&apos;m the person you call when you need something that works.
        </p>
      </section>

      {/* ── CLOSE ── */}
      <section ref={close.ref} className="rc-section" style={{ maxWidth: 1100, margin: '0 auto', padding: '80px 24px', borderTop: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: 740 }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: C.accent, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 12, ...anim(close.visible) }}>
            The real question
          </p>
          <h2 style={{ fontSize: 'clamp(26px, 3.5vw, 36px)', lineHeight: 1.2, letterSpacing: '-0.015em', fontWeight: 700, marginBottom: 24, ...anim(close.visible, 0.1) }}>
            The question isn&apos;t whether your business gets AI.<br />
            It&apos;s whether you get it from someone who&apos;s built it — or someone who&apos;s selling it.
          </h2>
          <p style={{ fontSize: 17, lineHeight: 1.65, color: C.text2, marginBottom: 36, ...anim(close.visible, 0.2) }}>
            Twenty years ago, people were afraid to bank online. Now a bank without an app feels broken. The same shift is happening to your industry right now. The businesses that move first don&apos;t just save money — they become the ones everyone else is trying to catch up to.
          </p>
          <div className="rc-cta-row" style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 20, ...anim(close.visible, 0.3) }}>
            <button onClick={() => router.push('/behind-the-curtain')} style={{ background: C.accent, color: C.bg, border: 'none', padding: '18px 32px', borderRadius: 8, fontSize: 17, fontWeight: 700, cursor: 'pointer' }}>
              Tell me what you&apos;re building →
            </button>
            <a href="mailto:ryan@riscent.com?subject=Quick%20question" style={{ background: 'transparent', color: C.text, border: `1px solid ${C.border}`, padding: '18px 32px', borderRadius: 8, fontSize: 17, fontWeight: 600, textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}>
              ryan@riscent.com
            </a>
          </div>
          <p style={{ fontSize: 14, color: C.muted, ...anim(close.visible, 0.4) }}>
            I reply within 24 hours. No pitch deck. No discovery phase. Just whether I can help.
          </p>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="rc-footer rc-section" style={{ borderTop: `1px solid ${C.border}`, padding: '28px 24px', maxWidth: 1100, margin: '0 auto', color: C.muted, fontSize: 13, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <div style={{ fontWeight: 700, color: C.text2, marginBottom: 4 }}>RISCENT / Riscen Software Labs</div>
          <div>$1.6M from one client. $50M+ from a thousand. One person built it.</div>
        </div>
        <div style={{ display: 'flex', gap: 24 }}>
          <a href="/docs" style={{ color: C.muted, textDecoration: 'none' }}>Articles</a>
          <a href="/case-study" style={{ color: C.muted, textDecoration: 'none' }}>Case Studies</a>
          <a href="https://ib365.ai" target="_blank" rel="noopener noreferrer" style={{ color: C.muted, textDecoration: 'none' }}>IB365</a>
          <a href="mailto:ryan@riscent.com" style={{ color: C.muted, textDecoration: 'none' }}>Contact</a>
        </div>
      </footer>
    </main>
  );
}
