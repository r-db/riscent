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

/* ── HOOKS ── */
function useReveal(threshold = 0.15) {
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

/* ── ANIMATION ── */
const anim = (visible: boolean, delay = 0): React.CSSProperties => ({
  opacity: visible ? 1 : 0,
  transform: visible ? 'translateY(0)' : 'translateY(16px)',
  transition: `all 0.7s cubic-bezier(0.22,1,0.36,1) ${delay}s`,
});

/* ── DATA ── */
const problems = [
  {
    pain: 'Leads visit your site after hours, can\'t get answers, and go to whoever responds first.',
    fix: 'Chatterbox answers instantly at 2 AM — captures their info and books the next available slot.',
  },
  {
    pain: 'Your staff spends 40% of their day answering the same 10 questions over and over.',
    fix: 'Train it once. Chatterbox handles "What are your hours?", "Do you take insurance?", and every FAQ from there.',
  },
  {
    pain: 'You\'ve tried chatbots before. They were scripted, robotic, and sent customers running.',
    fix: 'This isn\'t 2019-era decision trees. It reads context, asks follow-ups, and sounds like a real person.',
  },
  {
    pain: 'Your competitor just added chat to their site. They\'re responding to your leads in 30 seconds.',
    fix: 'You respond in under 2 seconds. Every time. On every page. Without hiring anyone.',
  },
];

const steps = [
  {
    num: '01',
    title: 'We learn your business',
    time: 'Day 1',
    desc: 'We onboard your services, pricing, hours, FAQs, booking flow, and brand voice. You fill out a form — we do the rest.',
  },
  {
    num: '02',
    title: 'Your agent goes live',
    time: 'Days 2–5',
    desc: 'We configure, test, and embed the widget on your website. One line of code. Works on any site — WordPress, Squarespace, Webflow, custom.',
  },
  {
    num: '03',
    title: 'It gets smarter every week',
    time: 'Ongoing',
    desc: 'Every conversation teaches it. We review what worked, what didn\'t, and tune the agent monthly. It compounds.',
  },
];

const features = [
  {
    title: 'Answers like your best employee',
    desc: 'Knows your services, prices, policies, and hours. Handles objections. Refers to your team by name if you want.',
  },
  {
    title: 'Books appointments & captures leads',
    desc: 'Collects name, phone, email, and intent. Connects to your booking system or sends you a summary instantly.',
  },
  {
    title: 'Speaks your brand voice',
    desc: 'Warm and professional? Casual and direct? We configure the tone to match how you talk to customers.',
  },
  {
    title: 'Gets smarter from every conversation',
    desc: 'Real conversations surface gaps and edge cases. Monthly tuning cycles keep it current and accurate.',
  },
  {
    title: 'Hands off to humans seamlessly',
    desc: 'Set rules for when to escalate. Complex questions, upset customers, or high-value leads go straight to your inbox or phone.',
  },
  {
    title: 'Works with your existing tools',
    desc: 'Email, CRM, booking software, Zapier — if you use it, we can connect to it. No ripping out your stack.',
  },
];

const pricingTiers = [
  {
    name: 'Starter',
    price: '$49',
    period: '/mo',
    highlight: false,
    items: [
      '500 conversations/mo',
      '1 website widget',
      'FAQ + lead capture',
      'Email handoff',
      'Standard onboarding',
    ],
    cta: 'Get started',
  },
  {
    name: 'Growth',
    price: '$99',
    period: '/mo',
    highlight: true,
    items: [
      '2,000 conversations/mo',
      '3 website widgets',
      'Booking integrations',
      'Conversation analytics',
      'Monthly tuning session',
    ],
    cta: 'Most popular',
  },
  {
    name: 'Scale',
    price: '$199',
    period: '/mo',
    highlight: false,
    items: [
      '10,000 conversations/mo',
      'Unlimited widgets',
      'White-label (your brand)',
      'API access',
      'Priority support',
    ],
    cta: 'Get started',
  },
];

const industries = [
  'Medical & Dental',
  'Law Firms',
  'Real Estate',
  'Home Services',
  'Restaurants',
  'Fitness & Wellness',
  'Auto & Dealerships',
  'E-commerce',
];

/* ════════════════════════════════════════════════ */
export default function ChatterboxPage() {
  const hero     = useReveal(0.1);
  const problem  = useReveal(0.1);
  const howIt    = useReveal(0.1);
  const whatIt   = useReveal(0.1);
  const pricing  = useReveal(0.1);
  const ind      = useReveal(0.1);
  const close    = useReveal(0.1);

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
        @keyframes dotPulse {
          0%,100% { opacity: 1; box-shadow: 0 0 8px #4f8cff80; }
          50% { opacity: 0.6; box-shadow: 0 0 20px #4f8cff60; }
        }
        @keyframes glowPulse {
          0%,100% { box-shadow: 0 0 0 rgba(79,140,255,0); }
          50% { box-shadow: 0 0 24px rgba(79,140,255,0.06); }
        }
        .cb-card { transition: all 0.3s ease; }
        .cb-card:hover { border-color: #2a3a55 !important; box-shadow: 0 0 20px rgba(79,140,255,0.07); transform: translateY(-2px); }
        .cb-cta-primary { transition: all 0.2s ease; }
        .cb-cta-primary:hover { background: #3a7aee !important; transform: translateY(-1px); }
        .cb-cta-ghost { transition: all 0.2s ease; }
        .cb-cta-ghost:hover { border-color: #4f8cff !important; color: #4f8cff !important; }
        .cb-step-num { line-height: 1; }
        @media (max-width: 768px) {
          .cb-grid-2 { grid-template-columns: 1fr !important; }
          .cb-grid-3 { grid-template-columns: 1fr !important; }
          .cb-grid-4 { grid-template-columns: repeat(2, 1fr) !important; }
          .cb-section { padding-left: 16px !important; padding-right: 16px !important; }
          .cb-hero-h1 { font-size: 32px !important; }
          .cb-cta-row { flex-direction: column !important; }
          .cb-cta-row a { width: 100% !important; text-align: center !important; justify-content: center !important; }
          .cb-footer { flex-direction: column !important; text-align: center !important; gap: 12px !important; }
          .cb-nav-right { gap: 12px !important; font-size: 13px !important; }
          .cb-pricing-grid { grid-template-columns: 1fr !important; }
          .cb-industry-pills { gap: 8px !important; }
        }
        @media (max-width: 480px) {
          .cb-grid-4 { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* ── NAV ── */}
      <header className="cb-section" style={{
        borderBottom: `1px solid ${C.border}`,
        padding: '16px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        maxWidth: 1100,
        margin: '0 auto',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', color: 'inherit' }}>
            <div style={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              background: C.accent,
              animation: 'dotPulse 3s ease-in-out infinite',
            }} />
            <span style={{ fontWeight: 700, letterSpacing: '-0.01em', fontSize: 16, color: C.text }}>RISCENT</span>
          </Link>
          <span style={{ color: C.border, fontSize: 18, fontWeight: 300 }}>/</span>
          <span style={{ fontWeight: 600, fontSize: 15, color: C.accent }}>Chatterbox</span>
        </div>
        <div className="cb-nav-right" style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <Link href="/#products" style={{ color: C.text2, textDecoration: 'none', fontSize: 14, fontWeight: 500 }}>All Products</Link>
          <a
            href="mailto:ryan@riscent.com?subject=Chatterbox"
            style={{
              background: C.accent,
              color: C.bg,
              padding: '8px 18px',
              borderRadius: 6,
              fontSize: 14,
              fontWeight: 700,
              textDecoration: 'none',
            }}
          >
            Get Chatterbox
          </a>
        </div>
      </header>

      {/* ── HERO ── */}
      <section ref={hero.ref} className="cb-section" style={{ maxWidth: 1100, margin: '0 auto', padding: '80px 24px 72px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20, ...anim(hero.visible) }}>
          <span style={{
            fontSize: 12,
            fontWeight: 700,
            color: C.accent,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            background: `${C.accent}18`,
            border: `1px solid ${C.accent}40`,
            padding: '4px 12px',
            borderRadius: 100,
          }}>
            AI Chat Widget
          </span>
        </div>
        <h1 className="cb-hero-h1" style={{
          fontSize: 'clamp(34px, 5vw, 58px)',
          lineHeight: 1.08,
          letterSpacing: '-0.025em',
          fontWeight: 700,
          marginBottom: 28,
          maxWidth: 820,
          ...anim(hero.visible, 0.1),
        }}>
          Your website should work<br />
          <span style={{ color: C.accent }}>as hard as you do.</span>
        </h1>
        <p style={{ fontSize: 20, lineHeight: 1.6, color: C.text2, maxWidth: 660, marginBottom: 16, ...anim(hero.visible, 0.2) }}>
          Chatterbox is an AI chat agent that answers questions, books appointments, and captures leads — on your website, 24 hours a day, 7 days a week.
        </p>
        <p style={{ fontSize: 17, lineHeight: 1.6, color: C.text, fontWeight: 600, maxWidth: 660, marginBottom: 40, ...anim(hero.visible, 0.25) }}>
          No scripts. No decision trees. No robotic responses. A real AI that knows your business and talks to your customers like a person.
        </p>
        <div className="cb-cta-row" style={{ display: 'flex', gap: 12, flexWrap: 'wrap', ...anim(hero.visible, 0.35) }}>
          <a
            href="mailto:ryan@riscent.com?subject=Chatterbox"
            className="cb-cta-primary"
            style={{
              background: C.accent,
              color: C.bg,
              padding: '16px 32px',
              borderRadius: 8,
              fontSize: 17,
              fontWeight: 700,
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
            }}
          >
            Get Chatterbox &rarr;
          </a>
          <a
            href="#how-it-works"
            className="cb-cta-ghost"
            style={{
              background: 'transparent',
              color: C.text,
              border: `1px solid ${C.border}`,
              padding: '16px 32px',
              borderRadius: 8,
              fontSize: 17,
              fontWeight: 600,
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
            }}
          >
            See how it works &darr;
          </a>
        </div>
        <p style={{ fontSize: 14, color: C.muted, marginTop: 20, ...anim(hero.visible, 0.45) }}>
          Live on your site in under 5 days. Starting at $49/mo.
        </p>
      </section>

      {/* ── THE PROBLEM ── */}
      <section ref={problem.ref} className="cb-section" style={{ maxWidth: 1100, margin: '0 auto', padding: '64px 24px', borderTop: `1px solid ${C.border}` }}>
        <p style={{ fontSize: 13, fontWeight: 600, color: C.warn, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 12, ...anim(problem.visible) }}>
          The problem
        </p>
        <h2 style={{ fontSize: 'clamp(26px, 3.5vw, 36px)', lineHeight: 1.15, letterSpacing: '-0.015em', fontWeight: 700, marginBottom: 12, maxWidth: 700, ...anim(problem.visible, 0.1) }}>
          Leads don&apos;t wait. Your website shouldn&apos;t make them.
        </h2>
        <p style={{ fontSize: 17, color: C.text2, maxWidth: 640, marginBottom: 40, ...anim(problem.visible, 0.15) }}>
          Every unanswered question is a lead that went to your competitor. Here&apos;s what&apos;s happening right now on sites without Chatterbox.
        </p>
        <div className="cb-grid-2" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 18 }}>
          {problems.map((p, i) => (
            <div
              key={i}
              className="cb-card"
              style={{
                background: C.bgElev,
                border: `1px solid ${C.border}`,
                borderRadius: 10,
                padding: '28px 24px',
                ...anim(problem.visible, 0.2 + i * 0.1),
              }}
            >
              <p style={{ fontSize: 15, lineHeight: 1.6, color: C.text2, marginBottom: 16 }}>
                {p.pain}
              </p>
              <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 16 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: C.green, letterSpacing: '0.06em', textTransform: 'uppercase', marginRight: 8 }}>Instead:</span>
                <span style={{ fontSize: 15, lineHeight: 1.6, color: C.green }}>{p.fix}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section ref={howIt.ref} id="how-it-works" className="cb-section" style={{ maxWidth: 1100, margin: '0 auto', padding: '64px 24px', borderTop: `1px solid ${C.border}` }}>
        <p style={{ fontSize: 13, fontWeight: 600, color: C.accent, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 12, ...anim(howIt.visible) }}>
          How it works
        </p>
        <h2 style={{ fontSize: 'clamp(26px, 3.5vw, 36px)', lineHeight: 1.15, letterSpacing: '-0.015em', fontWeight: 700, marginBottom: 12, maxWidth: 700, ...anim(howIt.visible, 0.1) }}>
          From zero to live in under a week.
        </h2>
        <p style={{ fontSize: 17, color: C.text2, maxWidth: 640, marginBottom: 40, ...anim(howIt.visible, 0.15) }}>
          We handle the setup. You handle your business.
        </p>
        <div className="cb-grid-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18 }}>
          {steps.map((s, i) => (
            <div
              key={s.num}
              className="cb-card"
              style={{
                background: C.bgElev,
                border: `1px solid ${C.border}`,
                borderTop: `3px solid ${C.accent}`,
                borderRadius: 10,
                padding: '28px 24px',
                ...anim(howIt.visible, 0.2 + i * 0.12),
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                <span
                  className="cb-step-num"
                  style={{
                    fontSize: 40,
                    fontWeight: 700,
                    color: `${C.accent}30`,
                    letterSpacing: '-0.04em',
                  }}
                >
                  {s.num}
                </span>
                <span style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: C.accent,
                  background: `${C.accent}18`,
                  border: `1px solid ${C.accent}35`,
                  padding: '3px 10px',
                  borderRadius: 100,
                  whiteSpace: 'nowrap',
                }}>
                  {s.time}
                </span>
              </div>
              <div style={{ fontSize: 18, fontWeight: 700, color: C.text, marginBottom: 10 }}>{s.title}</div>
              <p style={{ fontSize: 15, lineHeight: 1.6, color: C.text2 }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── WHAT IT DOES ── */}
      <section ref={whatIt.ref} className="cb-section" style={{ maxWidth: 1100, margin: '0 auto', padding: '64px 24px', borderTop: `1px solid ${C.border}` }}>
        <p style={{ fontSize: 13, fontWeight: 600, color: C.green, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 12, ...anim(whatIt.visible) }}>
          What it does
        </p>
        <h2 style={{ fontSize: 'clamp(26px, 3.5vw, 36px)', lineHeight: 1.15, letterSpacing: '-0.015em', fontWeight: 700, marginBottom: 12, maxWidth: 700, ...anim(whatIt.visible, 0.1) }}>
          Everything a great front-desk person does. Automatically.
        </h2>
        <p style={{ fontSize: 17, color: C.text2, maxWidth: 640, marginBottom: 40, ...anim(whatIt.visible, 0.15) }}>
          Chatterbox isn&apos;t a tool you manage — it&apos;s an agent that works. Here&apos;s what it handles out of the box.
        </p>
        <div className="cb-grid-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {features.map((f, i) => (
            <div
              key={f.title}
              className="cb-card"
              style={{
                background: C.bgElev,
                border: `1px solid ${C.border}`,
                borderRadius: 10,
                padding: '24px',
                animation: 'glowPulse 4s ease-in-out infinite',
                animationDelay: `${i * 0.6}s`,
                ...anim(whatIt.visible, 0.15 + i * 0.08),
              }}
            >
              <div style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                background: `${C.green}18`,
                border: `1px solid ${C.green}35`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 14,
              }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: C.green }} />
              </div>
              <div style={{ fontSize: 16, fontWeight: 700, color: C.text, marginBottom: 8 }}>{f.title}</div>
              <p style={{ fontSize: 14, lineHeight: 1.55, color: C.text2 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── PRICING ── */}
      <section ref={pricing.ref} className="cb-section" style={{ maxWidth: 1100, margin: '0 auto', padding: '64px 24px', borderTop: `1px solid ${C.border}` }}>
        <p style={{ fontSize: 13, fontWeight: 600, color: C.accent, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 12, ...anim(pricing.visible) }}>
          Pricing
        </p>
        <h2 style={{ fontSize: 'clamp(26px, 3.5vw, 36px)', lineHeight: 1.15, letterSpacing: '-0.015em', fontWeight: 700, marginBottom: 12, maxWidth: 700, ...anim(pricing.visible, 0.1) }}>
          Simple pricing. No contracts. Cancel anytime.
        </h2>
        <p style={{ fontSize: 17, color: C.text2, maxWidth: 600, marginBottom: 40, ...anim(pricing.visible, 0.15) }}>
          Start with what you need. Upgrade when you grow.
        </p>
        <div className="cb-pricing-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18 }}>
          {pricingTiers.map((tier, i) => (
            <div
              key={tier.name}
              className="cb-card"
              style={{
                background: tier.highlight ? `${C.accent}10` : C.bgElev,
                border: `1px solid ${tier.highlight ? C.accent : C.border}`,
                borderRadius: 10,
                padding: '32px 28px',
                position: 'relative',
                ...anim(pricing.visible, 0.2 + i * 0.12),
              }}
            >
              {tier.highlight && (
                <div style={{
                  position: 'absolute',
                  top: -12,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: C.accent,
                  color: C.bg,
                  fontSize: 12,
                  fontWeight: 700,
                  padding: '4px 14px',
                  borderRadius: 100,
                  whiteSpace: 'nowrap',
                  letterSpacing: '0.04em',
                }}>
                  MOST POPULAR
                </div>
              )}
              <div style={{ fontSize: 13, fontWeight: 600, color: tier.highlight ? C.accent : C.muted, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 12 }}>
                {tier.name}
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, marginBottom: 24 }}>
                <span style={{ fontSize: 44, fontWeight: 700, color: C.text, letterSpacing: '-0.03em', lineHeight: 1 }}>{tier.price}</span>
                <span style={{ fontSize: 16, color: C.muted, paddingBottom: 4 }}>{tier.period}</span>
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 28px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                {tier.items.map((item) => (
                  <li key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 15, color: C.text2 }}>
                    <span style={{ color: C.green, fontWeight: 700, flexShrink: 0, marginTop: 2 }}>&#10003;</span>
                    {item}
                  </li>
                ))}
              </ul>
              <a
                href="mailto:ryan@riscent.com?subject=Chatterbox"
                style={{
                  display: 'block',
                  textAlign: 'center',
                  background: tier.highlight ? C.accent : 'transparent',
                  color: tier.highlight ? C.bg : C.text,
                  border: `1px solid ${tier.highlight ? C.accent : C.border}`,
                  padding: '13px 0',
                  borderRadius: 7,
                  fontSize: 15,
                  fontWeight: 700,
                  textDecoration: 'none',
                  transition: 'all 0.2s ease',
                }}
              >
                {tier.cta}
              </a>
            </div>
          ))}
        </div>
        <p style={{ fontSize: 14, color: C.muted, marginTop: 20, textAlign: 'center', ...anim(pricing.visible, 0.55) }}>
          All plans include setup, onboarding, and a 14-day free trial. No credit card required to start.
        </p>
      </section>

      {/* ── INDUSTRIES ── */}
      <section ref={ind.ref} className="cb-section" style={{ maxWidth: 1100, margin: '0 auto', padding: '64px 24px', borderTop: `1px solid ${C.border}` }}>
        <p style={{ fontSize: 13, fontWeight: 600, color: C.muted, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 12, ...anim(ind.visible) }}>
          Industries
        </p>
        <h2 style={{ fontSize: 'clamp(26px, 3.5vw, 36px)', lineHeight: 1.15, letterSpacing: '-0.015em', fontWeight: 700, marginBottom: 12, ...anim(ind.visible, 0.1) }}>
          It works for yours.
        </h2>
        <p style={{ fontSize: 17, color: C.text2, maxWidth: 600, marginBottom: 36, ...anim(ind.visible, 0.15) }}>
          Chatterbox has been deployed across every major industry. If your business has a website and customers with questions, Chatterbox works.
        </p>
        <div className="cb-industry-pills" style={{ display: 'flex', flexWrap: 'wrap', gap: 12, ...anim(ind.visible, 0.2) }}>
          {industries.map((name, i) => (
            <div
              key={name}
              style={{
                background: C.bgElev,
                border: `1px solid ${C.border}`,
                borderRadius: 100,
                padding: '10px 20px',
                fontSize: 15,
                fontWeight: 600,
                color: C.text2,
                opacity: ind.visible ? 1 : 0,
                transform: ind.visible ? 'translateY(0)' : 'translateY(8px)',
                transition: `all 0.5s cubic-bezier(0.22,1,0.36,1) ${0.2 + i * 0.05}s`,
              }}
            >
              {name}
            </div>
          ))}
        </div>
      </section>

      {/* ── CLOSE ── */}
      <section ref={close.ref} className="cb-section" style={{ maxWidth: 1100, margin: '0 auto', padding: '80px 24px', borderTop: `1px solid ${C.border}` }}>
        <div style={{
          background: C.bgElev,
          border: `1px solid ${C.border}`,
          borderRadius: 14,
          padding: 'clamp(36px, 5vw, 60px)',
          maxWidth: 800,
          animation: 'glowPulse 4s ease-in-out infinite',
        }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: C.accent, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 16, ...anim(close.visible) }}>
            Ready?
          </p>
          <h2 style={{ fontSize: 'clamp(24px, 3.5vw, 36px)', lineHeight: 1.2, letterSpacing: '-0.015em', fontWeight: 700, marginBottom: 20, ...anim(close.visible, 0.1) }}>
            Your competitor&apos;s website answers questions at midnight.<br />
            <span style={{ color: C.text2 }}>Does yours?</span>
          </h2>
          <p style={{ fontSize: 17, lineHeight: 1.65, color: C.text2, marginBottom: 36, ...anim(close.visible, 0.2) }}>
            Every hour your site sits silent is an hour your competitors are capturing leads you should have won. Chatterbox is live in under 5 days and pays for itself with the first conversation it captures.
          </p>
          <div className="cb-cta-row" style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 20, ...anim(close.visible, 0.3) }}>
            <a
              href="mailto:ryan@riscent.com?subject=Chatterbox"
              className="cb-cta-primary"
              style={{
                background: C.accent,
                color: C.bg,
                padding: '18px 36px',
                borderRadius: 8,
                fontSize: 17,
                fontWeight: 700,
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
              }}
            >
              Get Chatterbox &rarr;
            </a>
            <a
              href="mailto:ryan@riscent.com?subject=Chatterbox question"
              className="cb-cta-ghost"
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
              Ask a question
            </a>
          </div>
          <p style={{ fontSize: 14, color: C.muted, ...anim(close.visible, 0.4) }}>
            Response within 24 hours. No pitch decks. No lengthy discovery process. Just whether it&apos;s a fit.
          </p>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer
        className="cb-footer cb-section"
        style={{
          borderTop: `1px solid ${C.border}`,
          padding: '28px 24px',
          maxWidth: 1100,
          margin: '0 auto',
          color: C.muted,
          fontSize: 13,
          display: 'flex',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 16,
          alignItems: 'center',
        }}
      >
        <div>
          <Link href="/" style={{ fontWeight: 700, color: C.text2, textDecoration: 'none', display: 'block', marginBottom: 4 }}>
            RISCENT
          </Link>
          <div>AI products for businesses that want to stop losing customers.</div>
        </div>
        <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', alignItems: 'center' }}>
          <Link href="/" style={{ color: C.muted, textDecoration: 'none' }}>Home</Link>
          <Link href="/bookbot" style={{ color: C.muted, textDecoration: 'none' }}>BookBot</Link>
          <Link href="/linguareach" style={{ color: C.muted, textDecoration: 'none' }}>LinguaReach</Link>
          <Link href="/voiceguard" style={{ color: C.muted, textDecoration: 'none' }}>VoiceGuard</Link>
          <Link href="/case-study" style={{ color: C.muted, textDecoration: 'none' }}>Case Studies</Link>
          <a href="mailto:ryan@riscent.com" style={{ color: C.muted, textDecoration: 'none' }}>ryan@riscent.com</a>
        </div>
      </footer>
    </main>
  );
}
