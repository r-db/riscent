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
  cyan: '#22d3ee',
};

/* ── REVEAL HOOK ── */
function useReveal(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

/* ── REVEAL WRAPPER ── */
function Reveal({
  children,
  delay = 0,
  style,
}: {
  children: React.ReactNode;
  delay?: number;
  style?: React.CSSProperties;
}) {
  const { ref, visible } = useReveal();
  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(24px)',
        transition: `opacity 0.55s ease ${delay}ms, transform 0.55s ease ${delay}ms`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/* ── PROBLEM CARDS ── */
const problems = [
  {
    icon: '📋',
    label: 'Scattered everywhere',
    desc: 'Customer info is split across notebooks, text messages, spreadsheets, and memory. Nothing talks to each other.',
    fix: 'One place for every client — notes, history, contact info, jobs.',
  },
  {
    icon: '🔔',
    label: 'Forgotten follow-ups',
    desc: "A job ends. You move on. The client never hears from you again — until they call a competitor next season.",
    fix: 'Automated reminders go out for you, on schedule, every time.',
  },
  {
    icon: '⚖️',
    label: 'Wrong-sized software',
    desc: "Jobber doesn't do enough. ServiceTitan costs a fortune and takes months to set up. There's nothing in between.",
    fix: 'Built for small-to-mid field service teams. Powerful where it matters, simple everywhere else.',
  },
  {
    icon: '📅',
    label: 'No seasonal outreach',
    desc: "Summer AC tune-ups, fall furnace checks, spring landscaping — you know the cycle, but you're not capitalizing on it.",
    fix: 'Drip campaigns send seasonal reminders automatically based on last service date.',
  },
];

/* ── FEATURE CARDS ── */
const features = [
  {
    icon: '👤',
    title: 'Client Database',
    desc: 'Every customer in one place. Full job history, contact info, notes, equipment records, and communication log.',
    color: C.cyan,
  },
  {
    icon: '📆',
    title: 'Job Scheduling',
    desc: 'Calendar view for your team. Assign jobs, set time windows, track status from scheduled to completed.',
    color: C.accent,
  },
  {
    icon: '💧',
    title: 'Drip Campaigns',
    desc: 'Set it once. Send seasonal reminders, maintenance follow-ups, and re-engagement messages automatically.',
    color: C.green,
  },
  {
    icon: '🤖',
    title: 'AI Outreach',
    desc: "Tell it what you want to say — it writes the email. Personalized, professional, and on-brand. You just review and send.",
    color: C.warn,
  },
  {
    icon: '🔧',
    title: 'Service Records',
    desc: 'Log what was done, what was replaced, and what needs attention next visit. Every technician sees the full picture.',
    color: C.cyan,
  },
  {
    icon: '🌐',
    title: 'Multilingual Support',
    desc: 'Reach Spanish-speaking and other non-English clients in their language. Powered by LinguaReach integration.',
    color: C.accent,
  },
];

/* ── INDUSTRIES ── */
const industries = [
  { name: 'HVAC', icon: '❄️' },
  { name: 'Plumbing', icon: '🔩' },
  { name: 'Electrical', icon: '⚡' },
  { name: 'Roofing', icon: '🏠' },
  { name: 'Landscaping', icon: '🌿' },
  { name: 'Cleaning', icon: '✨' },
  { name: 'General Contracting', icon: '🏗️' },
  { name: 'Pool Service', icon: '🏊' },
];

/* ── PRICING ── */
const plans = [
  {
    name: 'Solo',
    price: '$49',
    period: '/mo',
    color: C.cyan,
    features: [
      '100 clients',
      '1 drip campaign',
      'Job scheduling',
      'Service records',
      'Email support',
    ],
    cta: 'Get Started',
  },
  {
    name: 'Team',
    price: '$99',
    period: '/mo',
    color: C.accent,
    badge: 'Most Popular',
    features: [
      '500 clients',
      'AI-powered outreach',
      'Translation (LinguaReach)',
      '3 users',
      'Unlimited drip campaigns',
    ],
    cta: 'Get Started',
  },
  {
    name: 'Business',
    price: '$199',
    period: '/mo',
    color: C.green,
    features: [
      'Unlimited clients',
      'API access',
      '10 users',
      'White-label option',
      'Priority support',
    ],
    cta: 'Get Started',
  },
];

/* ── MAIN PAGE ── */
export default function DripForcePage() {
  return (
    <div style={{ background: C.bg, color: C.text, minHeight: '100vh', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <style>{`
        * { box-sizing: border-box; }
        ::selection { background: ${C.cyan}33; }
        a { color: inherit; text-decoration: none; }

        .nav-inner {
          max-width: 1100px;
          margin: 0 auto;
          padding: 0 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 60px;
        }
        .wrap {
          max-width: 1100px;
          margin: 0 auto;
          padding: 0 24px;
        }
        .grid-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }
        .grid-3 {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }
        .grid-4 {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 14px;
        }
        .card {
          background: ${C.bgElev};
          border: 1px solid ${C.border};
          border-radius: 12px;
          padding: 24px;
        }
        .pill {
          display: inline-block;
          padding: 4px 12px;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }
        .cta-btn {
          display: inline-block;
          padding: 14px 32px;
          border-radius: 8px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: opacity 0.2s, transform 0.15s;
          border: none;
          text-decoration: none;
        }
        .cta-btn:hover { opacity: 0.88; transform: translateY(-1px); }
        .cta-btn-outline {
          display: inline-block;
          padding: 13px 30px;
          border-radius: 8px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: opacity 0.2s, transform 0.15s;
          border: 1.5px solid;
          text-decoration: none;
          background: transparent;
        }
        .cta-btn-outline:hover { opacity: 0.8; transform: translateY(-1px); }
        .section-label {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          margin-bottom: 12px;
        }
        .divider {
          border: none;
          border-top: 1px solid ${C.border};
          margin: 0;
        }

        @media (max-width: 860px) {
          .grid-3 { grid-template-columns: 1fr 1fr; }
          .grid-4 { grid-template-columns: repeat(4, 1fr); }
          .plans-grid { grid-template-columns: 1fr !important; max-width: 420px; margin: 0 auto; }
        }
        @media (max-width: 640px) {
          .grid-2 { grid-template-columns: 1fr; }
          .grid-3 { grid-template-columns: 1fr; }
          .grid-4 { grid-template-columns: repeat(2, 1fr); }
          .hero-ctas { flex-direction: column; align-items: flex-start; }
          .hero-h1 { font-size: clamp(28px, 7vw, 52px) !important; }
        }
      `}</style>

      {/* ── NAV ── */}
      <nav style={{ background: C.bg, borderBottom: `1px solid ${C.border}`, position: 'sticky', top: 0, zIndex: 100 }}>
        <div className="nav-inner">
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <Link href="/" style={{ fontSize: 15, fontWeight: 700, color: C.text, letterSpacing: '0.04em' }}>
              RISCENT
            </Link>
            <span style={{ color: C.border, fontSize: 18, lineHeight: 1 }}>|</span>
            <span style={{ fontSize: 15, fontWeight: 700, color: C.cyan, letterSpacing: '0.01em' }}>DripForce</span>
          </div>
          <a
            href="mailto:ryan@riscent.com?subject=DripForce"
            className="cta-btn"
            style={{ background: C.cyan, color: '#0b0e14', padding: '9px 22px', fontSize: 13 }}
          >
            Get DripForce
          </a>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={{ padding: '96px 0 80px', textAlign: 'center' }}>
        <div className="wrap">
          <Reveal>
            <div style={{ marginBottom: 20 }}>
              <span className="pill" style={{ background: `${C.cyan}18`, color: C.cyan, border: `1px solid ${C.cyan}44` }}>
                Field Service CRM + AI Outreach
              </span>
            </div>
          </Reveal>

          <Reveal delay={80}>
            <h1
              className="hero-h1"
              style={{
                fontSize: 'clamp(32px, 5.5vw, 58px)',
                fontWeight: 800,
                lineHeight: 1.12,
                letterSpacing: '-0.02em',
                margin: '0 auto 24px',
                maxWidth: 760,
                color: C.text,
              }}
            >
              Your clients, your schedule,{' '}
              <span style={{ color: C.cyan }}>your outreach</span> — in one place.
            </h1>
          </Reveal>

          <Reveal delay={160}>
            <p style={{ fontSize: 18, color: C.text2, maxWidth: 560, margin: '0 auto 36px', lineHeight: 1.65 }}>
              A CRM built for service businesses with AI-powered follow-ups. Stop losing repeat customers to forgetfulness.
            </p>
          </Reveal>

          <Reveal delay={240}>
            <div className="hero-ctas" style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
              <a
                href="mailto:ryan@riscent.com?subject=DripForce"
                className="cta-btn"
                style={{ background: C.cyan, color: '#0b0e14' }}
              >
                Get DripForce
              </a>
              <a
                href="#what-it-does"
                className="cta-btn-outline"
                style={{ borderColor: C.border, color: C.text2 }}
              >
                See what it does
              </a>
            </div>
          </Reveal>

          {/* Hero visual strip */}
          <Reveal delay={320}>
            <div style={{
              marginTop: 60,
              background: C.bgElev,
              border: `1px solid ${C.border}`,
              borderRadius: 16,
              padding: '28px 32px',
              maxWidth: 800,
              margin: '60px auto 0',
              display: 'flex',
              gap: 0,
              flexWrap: 'wrap',
              justifyContent: 'space-around',
            }}>
              {[
                { label: 'Client history', sub: 'Every job, every note', color: C.cyan },
                { label: 'Auto follow-ups', sub: 'Set once, runs forever', color: C.green },
                { label: 'AI-written emails', sub: 'You approve, it sends', color: C.warn },
                { label: 'Multilingual', sub: 'Built-in LinguaReach', color: C.accent },
              ].map((item) => (
                <div key={item.label} style={{ textAlign: 'center', padding: '12px 20px' }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: item.color, marginBottom: 4 }}>{item.label}</div>
                  <div style={{ fontSize: 12, color: C.muted }}>{item.sub}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <hr className="divider" />

      {/* ── THE PROBLEM ── */}
      <section style={{ padding: '80px 0' }}>
        <div className="wrap">
          <Reveal>
            <div className="section-label" style={{ color: C.warn, textAlign: 'center' }}>The Problem</div>
            <h2 style={{ fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: 700, textAlign: 'center', marginBottom: 12, marginTop: 0 }}>
              Running a service business is hard enough.
            </h2>
            <p style={{ color: C.text2, textAlign: 'center', maxWidth: 500, margin: '0 auto 48px', lineHeight: 1.6 }}>
              The admin side shouldn't be what holds you back.
            </p>
          </Reveal>

          <div className="grid-2">
            {problems.map((p, i) => (
              <Reveal key={p.label} delay={i * 80}>
                <div className="card" style={{ height: '100%' }}>
                  <div style={{ fontSize: 28, marginBottom: 12 }}>{p.icon}</div>
                  <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 8, color: C.text }}>{p.label}</div>
                  <p style={{ color: C.text2, fontSize: 14, lineHeight: 1.65, marginBottom: 16, marginTop: 0 }}>{p.desc}</p>
                  <div style={{
                    background: `${C.green}12`,
                    border: `1px solid ${C.green}33`,
                    borderRadius: 8,
                    padding: '10px 14px',
                    fontSize: 13,
                    color: C.green,
                    lineHeight: 1.5,
                  }}>
                    {p.fix}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <hr className="divider" />

      {/* ── WHAT IT DOES ── */}
      <section id="what-it-does" style={{ padding: '80px 0' }}>
        <div className="wrap">
          <Reveal>
            <div className="section-label" style={{ color: C.cyan, textAlign: 'center' }}>What It Does</div>
            <h2 style={{ fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: 700, textAlign: 'center', marginBottom: 12, marginTop: 0 }}>
              Everything a field service business actually needs.
            </h2>
            <p style={{ color: C.text2, textAlign: 'center', maxWidth: 500, margin: '0 auto 48px', lineHeight: 1.6 }}>
              No bloat. No modules you'll never open. Just the tools that drive repeat business.
            </p>
          </Reveal>

          <div className="grid-3">
            {features.map((f, i) => (
              <Reveal key={f.title} delay={i * 70}>
                <div className="card" style={{ height: '100%', borderTop: `2px solid ${f.color}` }}>
                  <div style={{ fontSize: 26, marginBottom: 12 }}>{f.icon}</div>
                  <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 8, color: f.color }}>{f.title}</div>
                  <p style={{ color: C.text2, fontSize: 13.5, lineHeight: 1.65, margin: 0 }}>{f.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <hr className="divider" />

      {/* ── BUILT FOR ── */}
      <section style={{ padding: '80px 0', background: C.bgElev }}>
        <div className="wrap">
          <Reveal>
            <div className="section-label" style={{ color: C.accent, textAlign: 'center' }}>Built For</div>
            <h2 style={{ fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: 700, textAlign: 'center', marginBottom: 8, marginTop: 0 }}>
              If you go to a job site, this is for you.
            </h2>
            <p style={{ color: C.text2, textAlign: 'center', maxWidth: 480, margin: '0 auto 48px', lineHeight: 1.6 }}>
              DripForce was designed around the realities of field service — seasonal demand, recurring maintenance, and customers who need reminders.
            </p>
          </Reveal>

          <div className="grid-4">
            {industries.map((ind, i) => (
              <Reveal key={ind.name} delay={i * 50}>
                <div
                  className="card"
                  style={{
                    textAlign: 'center',
                    padding: '20px 16px',
                    borderColor: C.border,
                    transition: 'border-color 0.2s',
                  }}
                >
                  <div style={{ fontSize: 28, marginBottom: 8 }}>{ind.icon}</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{ind.name}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <hr className="divider" />

      {/* ── PRICING ── */}
      <section style={{ padding: '80px 0' }}>
        <div className="wrap">
          <Reveal>
            <div className="section-label" style={{ color: C.green, textAlign: 'center' }}>Pricing</div>
            <h2 style={{ fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: 700, textAlign: 'center', marginBottom: 8, marginTop: 0 }}>
              Straightforward pricing. No per-seat surprises.
            </h2>
            <p style={{ color: C.text2, textAlign: 'center', maxWidth: 460, margin: '0 auto 48px', lineHeight: 1.6 }}>
              Pick the plan that matches your team size. Upgrade anytime.
            </p>
          </Reveal>

          <div
            className="plans-grid"
            style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}
          >
            {plans.map((plan, i) => (
              <Reveal key={plan.name} delay={i * 100}>
                <div
                  className="card"
                  style={{
                    position: 'relative',
                    border: `1px solid ${plan.badge ? plan.color + '55' : C.border}`,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  {plan.badge && (
                    <div style={{
                      position: 'absolute',
                      top: -12,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      background: plan.color,
                      color: '#0b0e14',
                      fontSize: 11,
                      fontWeight: 700,
                      padding: '3px 12px',
                      borderRadius: 999,
                      letterSpacing: '0.05em',
                      whiteSpace: 'nowrap',
                    }}>
                      {plan.badge}
                    </div>
                  )}

                  <div style={{ marginBottom: 4 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: plan.color, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 12 }}>
                      {plan.name}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 2, marginBottom: 20 }}>
                      <span style={{ fontSize: 36, fontWeight: 800, color: C.text }}>{plan.price}</span>
                      <span style={{ fontSize: 14, color: C.muted }}>{plan.period}</span>
                    </div>
                  </div>

                  <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px', flex: 1 }}>
                    {plan.features.map((feat) => (
                      <li key={feat} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 10, fontSize: 13.5, color: C.text2 }}>
                        <span style={{ color: plan.color, flexShrink: 0, marginTop: 1 }}>✓</span>
                        {feat}
                      </li>
                    ))}
                  </ul>

                  <a
                    href={`mailto:ryan@riscent.com?subject=DripForce ${plan.name} Plan`}
                    className="cta-btn"
                    style={{
                      background: plan.badge ? plan.color : 'transparent',
                      color: plan.badge ? '#0b0e14' : plan.color,
                      border: `1.5px solid ${plan.color}`,
                      textAlign: 'center',
                      display: 'block',
                    }}
                  >
                    {plan.cta}
                  </a>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <hr className="divider" />

      {/* ── CLOSE ── */}
      <section style={{ padding: '96px 0', textAlign: 'center' }}>
        <div className="wrap">
          <Reveal>
            <div style={{ marginBottom: 20 }}>
              <span className="pill" style={{ background: `${C.green}18`, color: C.green, border: `1px solid ${C.green}44` }}>
                Repeat business is earned
              </span>
            </div>
          </Reveal>

          <Reveal delay={80}>
            <h2 style={{
              fontSize: 'clamp(26px, 4.5vw, 44px)',
              fontWeight: 800,
              letterSpacing: '-0.02em',
              lineHeight: 1.2,
              maxWidth: 680,
              margin: '0 auto 20px',
            }}>
              Your best customers are the ones{' '}
              <span style={{ color: C.cyan }}>you already have.</span>
            </h2>
          </Reveal>

          <Reveal delay={160}>
            <p style={{ fontSize: 17, color: C.text2, maxWidth: 480, margin: '0 auto 36px', lineHeight: 1.65 }}>
              Are you staying in touch? With DripForce, the follow-up happens automatically — so you can focus on the work.
            </p>
          </Reveal>

          <Reveal delay={240}>
            <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
              <a
                href="mailto:ryan@riscent.com?subject=DripForce"
                className="cta-btn"
                style={{ background: C.cyan, color: '#0b0e14' }}
              >
                Get DripForce
              </a>
              <a
                href="mailto:ryan@riscent.com?subject=DripForce Demo Request"
                className="cta-btn-outline"
                style={{ borderColor: C.border, color: C.text2 }}
              >
                Request a demo
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      <hr className="divider" />

      {/* ── FOOTER ── */}
      <footer style={{ padding: '40px 0', color: C.muted }}>
        <div className="wrap">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 28 }}>
            {/* Brand */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <Link href="/" style={{ fontSize: 14, fontWeight: 700, color: C.text2, letterSpacing: '0.05em' }}>
                  RISCENT
                </Link>
                <span style={{ color: C.border }}>·</span>
                <span style={{ fontSize: 14, fontWeight: 700, color: C.cyan }}>DripForce</span>
              </div>
              <p style={{ fontSize: 13, margin: 0, lineHeight: 1.6, maxWidth: 260 }}>
                Field Service CRM with AI-powered outreach. Built for the businesses that keep things running.
              </p>
            </div>

            {/* Links */}
            <div style={{ display: 'flex', gap: 48, flexWrap: 'wrap' }}>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12, color: C.text2 }}>
                  Products
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {[
                    { label: 'Chatterbox', href: '/chatterbox' },
                    { label: 'BookBot', href: '/bookbot' },
                    { label: 'LinguaReach', href: '/linguareach' },
                    { label: 'DripForce', href: '/dripforce' },
                  ].map((l) => (
                    <Link key={l.label} href={l.href} style={{ fontSize: 13, color: C.muted, transition: 'color 0.2s' }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = C.text2)}
                      onMouseLeave={(e) => (e.currentTarget.style.color = C.muted)}
                    >
                      {l.label}
                    </Link>
                  ))}
                </div>
              </div>

              <div>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12, color: C.text2 }}>
                  Company
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {[
                    { label: 'Riscent.com', href: '/' },
                    { label: 'Case Studies', href: '/case-study' },
                    { label: 'Contact', href: 'mailto:ryan@riscent.com' },
                  ].map((l) => (
                    <Link key={l.label} href={l.href} style={{ fontSize: 13, color: C.muted, transition: 'color 0.2s' }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = C.text2)}
                      onMouseLeave={(e) => (e.currentTarget.style.color = C.muted)}
                    >
                      {l.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div style={{ borderTop: `1px solid ${C.border}`, marginTop: 36, paddingTop: 24, fontSize: 12, color: C.muted, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
            <span>© 2026 Riscent. All rights reserved.</span>
            <a href="mailto:ryan@riscent.com" style={{ color: C.muted, transition: 'color 0.2s' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = C.text2)}
              onMouseLeave={(e) => (e.currentTarget.style.color = C.muted)}
            >
              ryan@riscent.com
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
