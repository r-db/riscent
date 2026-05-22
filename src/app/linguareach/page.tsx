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
  purple: '#a78bfa',
};

/* ── SCROLL REVEAL HOOK ── */
function useReveal(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) { setVisible(true); obs.disconnect(); }
      },
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
        transform: visible ? 'translateY(0)' : 'translateY(28px)',
        transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

/* ── LIVE TRANSLATION PREVIEW ── */
const TRANSLATIONS = [
  { lang: 'Spanish',    flag: '🇪🇸', text: 'Su cita está confirmada para el martes a las 2:00 PM. Por favor llámenos si necesita cambiar la hora.' },
  { lang: 'Chinese',    flag: '🇨🇳', text: '您的预约已确认为周二下午2:00。如需更改时间，请致电我们。' },
  { lang: 'Vietnamese', flag: '🇻🇳', text: 'Cuộc hẹn của bạn đã được xác nhận vào thứ Ba lúc 2:00 chiều. Vui lòng gọi cho chúng tôi nếu bạn cần thay đổi giờ.' },
  { lang: 'Russian',    flag: '🇷🇺', text: 'Ваша встреча подтверждена на вторник в 14:00. Пожалуйста, позвоните нам, если вам нужно изменить время.' },
  { lang: 'Arabic',     flag: '🇸🇦', text: 'تم تأكيد موعدك يوم الثلاثاء الساعة 2:00 مساءً. يرجى الاتصال بنا إذا كنت بحاجة إلى تغيير الوقت.' },
  { lang: 'Korean',     flag: '🇰🇷', text: '화요일 오후 2시에 예약이 확인되었습니다. 시간 변경이 필요하시면 연락 주세요.' },
];

function LiveTranslationPreview() {
  const [idx, setIdx] = useState(0);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setAnimating(true);
      setTimeout(() => {
        setIdx(i => (i + 1) % TRANSLATIONS.length);
        setAnimating(false);
      }, 300);
    }, 2800);
    return () => clearInterval(timer);
  }, []);

  const t = TRANSLATIONS[idx];

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 2,
      borderRadius: 14,
      overflow: 'hidden',
      border: `1px solid ${C.border}`,
      maxWidth: 680,
      margin: '0 auto',
      fontFamily: 'monospace',
      fontSize: 14,
    }}>
      {/* Left: English input */}
      <div style={{ background: C.bgElev, padding: '20px 24px' }}>
        <div style={{ color: C.muted, fontSize: 11, letterSpacing: '0.08em', marginBottom: 10, textTransform: 'uppercase' }}>You write (English)</div>
        <div style={{ color: C.text, lineHeight: 1.65 }}>
          Your appointment is confirmed for Tuesday at 2:00 PM. Please call us if you need to change the time.
        </div>
        <div style={{ marginTop: 12, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {['Professional', 'Warm'].map(tag => (
            <span key={tag} style={{ fontSize: 11, padding: '2px 8px', borderRadius: 99, background: C.bg, border: `1px solid ${C.border}`, color: C.muted }}>{tag}</span>
          ))}
        </div>
      </div>
      {/* Right: Translation output */}
      <div style={{ background: C.bg, padding: '20px 24px' }}>
        <div style={{ color: C.muted, fontSize: 11, letterSpacing: '0.08em', marginBottom: 10, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 6 }}>
          <span>They read</span>
          <span style={{
            color: C.purple,
            opacity: animating ? 0 : 1,
            transition: 'opacity 0.3s',
          }}>({t.flag} {t.lang})</span>
        </div>
        <div style={{
          color: C.text,
          lineHeight: 1.65,
          opacity: animating ? 0 : 1,
          transform: animating ? 'translateY(6px)' : 'translateY(0)',
          transition: 'opacity 0.3s, transform 0.3s',
          direction: t.lang === 'Arabic' ? 'rtl' : 'ltr',
        }}>
          {t.text}
        </div>
        <div style={{ marginTop: 12 }}>
          <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 99, background: `${C.purple}18`, border: `1px solid ${C.purple}44`, color: C.purple }}>
            AI-tuned, not literal
          </span>
        </div>
      </div>
    </div>
  );
}

/* ── LANGUAGES DATA ── */
const LANGUAGES = [
  { name: 'English',    flag: '🇺🇸', native: 'English' },
  { name: 'Spanish',    flag: '🇪🇸', native: 'Español' },
  { name: 'Chinese',    flag: '🇨🇳', native: '中文' },
  { name: 'Vietnamese', flag: '🇻🇳', native: 'Tiếng Việt' },
  { name: 'Russian',    flag: '🇷🇺', native: 'Русский' },
  { name: 'Arabic',     flag: '🇸🇦', native: 'العربية' },
  { name: 'Japanese',   flag: '🇯🇵', native: '日本語' },
  { name: 'Korean',     flag: '🇰🇷', native: '한국어' },
  { name: 'French',     flag: '🇫🇷', native: 'Français' },
  { name: 'German',     flag: '🇩🇪', native: 'Deutsch' },
  { name: 'Portuguese', flag: '🇧🇷', native: 'Português' },
  { name: 'Italian',    flag: '🇮🇹', native: 'Italiano' },
];

/* ── PROBLEM CARDS ── */
const PROBLEMS = [
  {
    problem: 'Google Translate sounds broken — or worse, offensive',
    fix: 'LinguaReach uses context-aware AI that sounds like a native professional, not a robot.',
  },
  {
    problem: 'One bilingual staff member handles ALL Spanish requests',
    fix: 'Any team member can send professional translations in seconds — no bottleneck.',
  },
  {
    problem: 'Vietnamese, Chinese, Arabic, Russian communities are unreachable',
    fix: '12 languages ready now. Your whole market, not just the loudest segment.',
  },
  {
    problem: 'No record of what was sent in what language, to whom',
    fix: 'Every message is logged with the language, recipient, date, and open status.',
  },
];

/* ── FEATURE CARDS ── */
const FEATURES = [
  {
    title: 'Real-time translation as you type',
    desc: 'See the translation appear on the right side as you write in English. No extra step, no copy-paste.',
    color: C.purple,
    icon: '⚡',
  },
  {
    title: 'Professional tone, not literal',
    desc: 'AI adjusts phrasing, formality, and cultural nuance. "We apologize for the inconvenience" lands differently in Japanese vs. Spanish — it handles that.',
    color: C.purple,
    icon: '✦',
  },
  {
    title: 'Client profiles with preferred language',
    desc: 'Tag each contact with their language. When you message them, LinguaReach auto-selects the right language before you type a word.',
    color: C.purple,
    icon: '◈',
  },
  {
    title: 'Outreach logging with stats',
    desc: 'See every message sent, in what language, to whom, when — and whether it was opened. Finally, visibility into your multilingual outreach.',
    color: C.purple,
    icon: '◎',
  },
  {
    title: 'Email templates in any language',
    desc: 'Build a library of reusable templates: appointment reminders, follow-ups, promotions. One template, 12 languages, ready to send.',
    color: C.purple,
    icon: '▦',
  },
  {
    title: 'Contact management with language preferences',
    desc: 'Import your contacts and assign language preferences in bulk or one-by-one. Segment your list by language for targeted campaigns.',
    color: C.purple,
    icon: '◐',
  },
];

/* ── PRICING DATA ── */
const PLANS = [
  {
    name: 'Solo',
    price: '$39',
    period: '/mo',
    tagline: 'For solo operators and small shops',
    features: [
      '200 translations/month',
      '1 user seat',
      '5 languages',
      'Email outreach',
      'Contact language profiles',
      'Outreach log',
    ],
    cta: 'Get Started',
    highlight: false,
  },
  {
    name: 'Team',
    price: '$79',
    period: '/mo',
    tagline: 'For growing teams serving diverse markets',
    features: [
      '1,000 translations/month',
      '5 user seats',
      'All 12 languages',
      'Email + SMS outreach',
      'Contact management',
      'Template library',
      'Open tracking',
    ],
    cta: 'Get Started',
    highlight: true,
  },
  {
    name: 'Agency',
    price: '$149',
    period: '/mo',
    tagline: 'For agencies and multi-location businesses',
    features: [
      '5,000 translations/month',
      'Unlimited user seats',
      'All 12 languages',
      'Email + SMS outreach',
      'API access',
      'White-label option',
      'Priority support',
      'Bulk import',
    ],
    cta: 'Get Started',
    highlight: false,
  },
];

/* ── SHARED STYLES ── */
const s = {
  section: {
    padding: '80px 24px',
  } as React.CSSProperties,
  wrap: {
    maxWidth: 1100,
    margin: '0 auto',
  } as React.CSSProperties,
  label: {
    fontSize: 12,
    letterSpacing: '0.1em',
    textTransform: 'uppercase' as const,
    color: C.purple,
    fontWeight: 600,
    marginBottom: 12,
  },
  h2: {
    fontSize: 'clamp(26px, 4vw, 40px)',
    fontWeight: 700,
    color: C.text,
    lineHeight: 1.2,
    marginBottom: 16,
  } as React.CSSProperties,
  sub: {
    fontSize: 17,
    color: C.text2,
    lineHeight: 1.7,
    maxWidth: 600,
  } as React.CSSProperties,
  card: {
    background: C.bgElev,
    border: `1px solid ${C.border}`,
    borderRadius: 14,
    padding: '28px 28px',
  } as React.CSSProperties,
  grid2: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: 20,
  } as React.CSSProperties,
  grid3: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: 20,
  } as React.CSSProperties,
};

/* ═══════════════════════════════ PAGE ═══════════════════════════════ */
export default function LinguaReachPage() {
  return (
    <div style={{ background: C.bg, color: C.text, minHeight: '100vh', fontFamily: 'system-ui, -apple-system, sans-serif' }}>

      {/* ── NAV ── */}
      <nav style={{
        borderBottom: `1px solid ${C.border}`,
        padding: '0 24px',
        height: 60,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: `${C.bg}ee`,
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontWeight: 800, fontSize: 16, color: C.text, letterSpacing: '-0.02em' }}>RISCENT</span>
          </Link>
          <span style={{ color: C.border }}>|</span>
          <span style={{ fontWeight: 700, fontSize: 15, color: C.purple, letterSpacing: '-0.01em' }}>LinguaReach</span>
        </div>
        <a
          href="mailto:ryan@riscent.com?subject=LinguaReach"
          style={{
            background: C.purple,
            color: '#fff',
            fontWeight: 700,
            fontSize: 13,
            padding: '8px 18px',
            borderRadius: 8,
            textDecoration: 'none',
            letterSpacing: '0.01em',
          }}
        >
          Get LinguaReach
        </a>
      </nav>

      {/* ══════════════════════════════════════════════════
          1. HERO
      ══════════════════════════════════════════════════ */}
      <section style={{ ...s.section, paddingTop: 96, paddingBottom: 96 }}>
        <div style={{ ...s.wrap, textAlign: 'center' }}>
          <div style={{ ...s.label, display: 'inline-block' }}>AI-Powered Multilingual Outreach</div>
          <h1 style={{
            fontSize: 'clamp(32px, 6vw, 62px)',
            fontWeight: 800,
            lineHeight: 1.1,
            letterSpacing: '-0.03em',
            color: C.text,
            marginBottom: 20,
            marginTop: 8,
          }}>
            Write in English.{' '}
            <span style={{ color: C.purple }}>Your customers read it<br />in their language.</span>
          </h1>
          <p style={{ ...s.sub, margin: '0 auto 16px', fontSize: 19 }}>
            LinguaReach translates your business outreach into 12 languages — professionally, instantly, and automatically. No bilingual staff required.
          </p>
          <p style={{ color: C.muted, fontSize: 15, marginBottom: 40 }}>
            Spanish · Chinese · Vietnamese · Russian · Arabic · Japanese · Korean · French · German · Portuguese · Italian · English
          </p>

          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 64 }}>
            <a
              href="mailto:ryan@riscent.com?subject=LinguaReach"
              style={{
                background: C.purple,
                color: '#fff',
                fontWeight: 700,
                fontSize: 16,
                padding: '14px 32px',
                borderRadius: 10,
                textDecoration: 'none',
                display: 'inline-block',
              }}
            >
              Get LinguaReach
            </a>
            <a
              href="#how-it-works"
              style={{
                background: 'transparent',
                color: C.text2,
                fontWeight: 600,
                fontSize: 16,
                padding: '14px 32px',
                borderRadius: 10,
                textDecoration: 'none',
                border: `1px solid ${C.border}`,
                display: 'inline-block',
              }}
            >
              See how it works
            </a>
          </div>

          <LiveTranslationPreview />
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          2. THE PROBLEM
      ══════════════════════════════════════════════════ */}
      <section style={{ ...s.section, borderTop: `1px solid ${C.border}` }}>
        <div style={s.wrap}>
          <Reveal>
            <div style={{ marginBottom: 48 }}>
              <div style={s.label}>The Problem</div>
              <h2 style={s.h2}>You're already losing customers to the language gap.</h2>
              <p style={s.sub}>Every business in a diverse market runs into the same four walls.</p>
            </div>
          </Reveal>

          <div style={s.grid2}>
            {PROBLEMS.map((p, i) => (
              <Reveal key={i} delay={i * 80}>
                <div style={{
                  ...s.card,
                  borderLeft: `3px solid ${C.border}`,
                }}>
                  <div style={{ marginBottom: 16 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: C.warn, marginBottom: 8 }}>
                      The Problem
                    </div>
                    <p style={{ color: C.text, fontSize: 16, lineHeight: 1.6, margin: 0 }}>
                      {p.problem}
                    </p>
                  </div>
                  <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 16 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: C.green, marginBottom: 8 }}>
                      The Fix
                    </div>
                    <p style={{ color: C.text2, fontSize: 15, lineHeight: 1.6, margin: 0 }}>
                      {p.fix}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          3. HOW IT WORKS
      ══════════════════════════════════════════════════ */}
      <section id="how-it-works" style={{ ...s.section, borderTop: `1px solid ${C.border}`, background: C.bgElev }}>
        <div style={s.wrap}>
          <Reveal>
            <div style={{ textAlign: 'center', marginBottom: 56 }}>
              <div style={s.label}>How It Works</div>
              <h2 style={{ ...s.h2, margin: '0 auto 16px' }}>Three steps. That's it.</h2>
              <p style={{ ...s.sub, margin: '0 auto' }}>No training. No technical setup. Any office manager can use it on day one.</p>
            </div>
          </Reveal>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: 0,
            border: `1px solid ${C.border}`,
            borderRadius: 16,
            overflow: 'hidden',
          }}>
            {[
              {
                step: '01',
                title: 'Write in English',
                desc: 'Type your message, appointment reminder, or follow-up exactly as you normally would in English.',
                detail: 'The left panel is just a normal text box.',
              },
              {
                step: '02',
                title: 'See it in their language — live',
                desc: 'As you type, the right panel shows the professional translation in real-time. Adjust tone: formal, friendly, or urgent.',
                detail: 'Select the language once per contact. Done.',
              },
              {
                step: '03',
                title: 'Send and track',
                desc: 'Hit send. The message goes out in the customer\'s language. Your log shows delivery, opens, and the full translation history.',
                detail: 'Your whole team can see who got what.',
              },
            ].map((item, i) => (
              <Reveal key={i} delay={i * 100}>
                <div style={{
                  padding: '40px 36px',
                  borderRight: i < 2 ? `1px solid ${C.border}` : 'none',
                  height: '100%',
                  boxSizing: 'border-box',
                }}>
                  <div style={{
                    fontSize: 13,
                    fontWeight: 800,
                    color: C.purple,
                    letterSpacing: '0.08em',
                    marginBottom: 16,
                    fontFamily: 'monospace',
                  }}>
                    {item.step}
                  </div>
                  <h3 style={{ fontSize: 20, fontWeight: 700, color: C.text, marginBottom: 12, lineHeight: 1.3 }}>
                    {item.title}
                  </h3>
                  <p style={{ color: C.text2, fontSize: 15, lineHeight: 1.7, marginBottom: 12 }}>
                    {item.desc}
                  </p>
                  <p style={{ color: C.muted, fontSize: 13, fontStyle: 'italic', margin: 0 }}>
                    {item.detail}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          4. LANGUAGES
      ══════════════════════════════════════════════════ */}
      <section style={{ ...s.section, borderTop: `1px solid ${C.border}` }}>
        <div style={s.wrap}>
          <Reveal>
            <div style={{ textAlign: 'center', marginBottom: 48 }}>
              <div style={s.label}>Supported Languages</div>
              <h2 style={{ ...s.h2, margin: '0 auto 16px' }}>12 languages. Every major US community covered.</h2>
              <p style={{ ...s.sub, margin: '0 auto' }}>
                From the Spanish-speaking neighborhood next door to the Vietnamese and Arabic communities across town — if they live near you, LinguaReach reaches them.
              </p>
            </div>
          </Reveal>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
            gap: 12,
          }}>
            {LANGUAGES.map((lang, i) => (
              <Reveal key={lang.name} delay={i * 40}>
                <div style={{
                  ...s.card,
                  textAlign: 'center',
                  padding: '20px 16px',
                  borderColor: lang.name === 'English' ? `${C.purple}44` : C.border,
                }}>
                  <div style={{ fontSize: 28, marginBottom: 8 }}>{lang.flag}</div>
                  <div style={{ fontWeight: 700, fontSize: 14, color: C.text, marginBottom: 4 }}>{lang.name}</div>
                  <div style={{ fontSize: 13, color: C.muted }}>{lang.native}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          5. WHAT IT DOES
      ══════════════════════════════════════════════════ */}
      <section style={{ ...s.section, borderTop: `1px solid ${C.border}`, background: C.bgElev }}>
        <div style={s.wrap}>
          <Reveal>
            <div style={{ marginBottom: 48 }}>
              <div style={s.label}>Features</div>
              <h2 style={s.h2}>Everything your team needs to reach every customer.</h2>
              <p style={s.sub}>Six tools that replace the bilingual staff bottleneck permanently.</p>
            </div>
          </Reveal>

          <div style={s.grid3}>
            {FEATURES.map((f, i) => (
              <Reveal key={i} delay={i * 70}>
                <div style={{
                  ...s.card,
                  borderTop: `3px solid ${C.purple}`,
                }}>
                  <div style={{
                    width: 36,
                    height: 36,
                    borderRadius: 8,
                    background: `${C.purple}20`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 16,
                    marginBottom: 16,
                    color: C.purple,
                    fontWeight: 700,
                  }}>
                    {f.icon}
                  </div>
                  <h3 style={{ fontSize: 17, fontWeight: 700, color: C.text, marginBottom: 10, lineHeight: 1.4 }}>
                    {f.title}
                  </h3>
                  <p style={{ color: C.text2, fontSize: 14, lineHeight: 1.7, margin: 0 }}>
                    {f.desc}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          6. PRICING
      ══════════════════════════════════════════════════ */}
      <section style={{ ...s.section, borderTop: `1px solid ${C.border}` }}>
        <div style={s.wrap}>
          <Reveal>
            <div style={{ textAlign: 'center', marginBottom: 56 }}>
              <div style={s.label}>Pricing</div>
              <h2 style={{ ...s.h2, margin: '0 auto 16px' }}>One flat rate. No per-language fees.</h2>
              <p style={{ ...s.sub, margin: '0 auto' }}>
                Every plan includes professional-quality AI translation. Pay for what you use, not for how many languages you need.
              </p>
            </div>
          </Reveal>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 20,
            alignItems: 'start',
          }}>
            {PLANS.map((plan, i) => (
              <Reveal key={plan.name} delay={i * 80}>
                <div style={{
                  ...s.card,
                  border: plan.highlight ? `2px solid ${C.purple}` : `1px solid ${C.border}`,
                  position: 'relative',
                  boxShadow: plan.highlight ? `0 0 40px ${C.purple}22` : 'none',
                }}>
                  {plan.highlight && (
                    <div style={{
                      position: 'absolute',
                      top: -13,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      background: C.purple,
                      color: '#fff',
                      fontSize: 11,
                      fontWeight: 800,
                      letterSpacing: '0.08em',
                      padding: '4px 14px',
                      borderRadius: 99,
                      textTransform: 'uppercase',
                      whiteSpace: 'nowrap',
                    }}>
                      Most Popular
                    </div>
                  )}

                  <div style={{ marginBottom: 6 }}>
                    <span style={{ fontWeight: 800, fontSize: 18, color: plan.highlight ? C.purple : C.text }}>
                      {plan.name}
                    </span>
                  </div>
                  <p style={{ color: C.muted, fontSize: 13, marginBottom: 20 }}>{plan.tagline}</p>

                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 24 }}>
                    <span style={{ fontSize: 42, fontWeight: 800, color: C.text, letterSpacing: '-0.03em' }}>{plan.price}</span>
                    <span style={{ color: C.muted, fontSize: 15 }}>{plan.period}</span>
                  </div>

                  <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 28px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {plan.features.map(f => (
                      <li key={f} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: C.text2 }}>
                        <span style={{ color: C.green, fontSize: 16, flexShrink: 0 }}>✓</span>
                        {f}
                      </li>
                    ))}
                  </ul>

                  <a
                    href="mailto:ryan@riscent.com?subject=LinguaReach"
                    style={{
                      display: 'block',
                      textAlign: 'center',
                      padding: '12px',
                      borderRadius: 9,
                      fontWeight: 700,
                      fontSize: 15,
                      textDecoration: 'none',
                      background: plan.highlight ? C.purple : 'transparent',
                      color: plan.highlight ? '#fff' : C.purple,
                      border: plan.highlight ? 'none' : `1px solid ${C.purple}`,
                      transition: 'opacity 0.15s',
                    }}
                  >
                    {plan.cta}
                  </a>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={200}>
            <p style={{ textAlign: 'center', color: C.muted, fontSize: 13, marginTop: 28 }}>
              All plans include a 14-day free trial. No credit card required to start.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          7. CLOSE
      ══════════════════════════════════════════════════ */}
      <section style={{
        ...s.section,
        borderTop: `1px solid ${C.border}`,
        background: C.bgElev,
        textAlign: 'center',
      }}>
        <div style={{ ...s.wrap, maxWidth: 720 }}>
          <Reveal>
            <div style={{ marginBottom: 28 }}>
              <div style={{
                display: 'inline-block',
                background: `${C.purple}15`,
                border: `1px solid ${C.purple}44`,
                borderRadius: 10,
                padding: '12px 24px',
                color: C.purple,
                fontSize: 16,
                fontWeight: 600,
                marginBottom: 32,
              }}>
                30% of your customers speak a language you can't email in.
                <span style={{ color: C.text2, fontWeight: 400 }}> That's 30% you're not reaching.</span>
              </div>

              <h2 style={{
                fontSize: 'clamp(26px, 4.5vw, 44px)',
                fontWeight: 800,
                color: C.text,
                lineHeight: 1.2,
                letterSpacing: '-0.02em',
                marginBottom: 20,
              }}>
                Your competitors aren't reaching them either.<br />
                <span style={{ color: C.purple }}>Be the first one who does.</span>
              </h2>

              <p style={{ color: C.text2, fontSize: 17, lineHeight: 1.7, marginBottom: 36 }}>
                LinguaReach turns language diversity from a barrier into a competitive edge. The businesses that figure this out first will own those communities. Don't let it be someone else.
              </p>

              <a
                href="mailto:ryan@riscent.com?subject=LinguaReach"
                style={{
                  display: 'inline-block',
                  background: C.purple,
                  color: '#fff',
                  fontWeight: 700,
                  fontSize: 17,
                  padding: '16px 40px',
                  borderRadius: 10,
                  textDecoration: 'none',
                  letterSpacing: '0.01em',
                }}
              >
                Get LinguaReach
              </a>
              <p style={{ color: C.muted, fontSize: 13, marginTop: 16 }}>
                Email us and we'll get you set up. Usually same day.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{
        borderTop: `1px solid ${C.border}`,
        padding: '40px 24px',
        background: C.bg,
      }}>
        <div style={{
          ...s.wrap,
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: 32,
        }}>
          {/* Brand */}
          <div>
            <Link href="/" style={{ textDecoration: 'none' }}>
              <span style={{ fontWeight: 800, fontSize: 15, color: C.text, letterSpacing: '-0.02em' }}>RISCENT</span>
            </Link>
            <p style={{ color: C.muted, fontSize: 13, lineHeight: 1.7, marginTop: 10 }}>
              AI products for businesses that want to stop losing customers.
            </p>
          </div>

          {/* Products */}
          <div>
            <div style={{ fontWeight: 700, fontSize: 13, color: C.text2, marginBottom: 14, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Products
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { label: 'Chatterbox', href: '/chatterbox' },
                { label: 'BookBot', href: '/bookbot' },
                { label: 'LinguaReach', href: '/linguareach' },
                { label: 'VoiceGuard', href: '/voiceguard' },
              ].map(l => (
                <Link key={l.href} href={l.href} style={{ color: C.muted, fontSize: 14, textDecoration: 'none' }}>
                  {l.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Company */}
          <div>
            <div style={{ fontWeight: 700, fontSize: 13, color: C.text2, marginBottom: 14, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Company
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { label: 'riscent.com', href: '/' },
                { label: 'Research', href: '/research' },
                { label: 'Case Studies', href: '/case-study' },
              ].map(l => (
                <Link key={l.href} href={l.href} style={{ color: C.muted, fontSize: 14, textDecoration: 'none' }}>
                  {l.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <div style={{ fontWeight: 700, fontSize: 13, color: C.text2, marginBottom: 14, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Contact
            </div>
            <a
              href="mailto:ryan@riscent.com?subject=LinguaReach"
              style={{ color: C.muted, fontSize: 14, textDecoration: 'none', display: 'block', marginBottom: 8 }}
            >
              ryan@riscent.com
            </a>
            <p style={{ color: C.muted, fontSize: 13, margin: 0, lineHeight: 1.6 }}>
              Questions about LinguaReach? Email us directly.
            </p>
          </div>
        </div>

        <div style={{
          ...s.wrap,
          marginTop: 40,
          paddingTop: 24,
          borderTop: `1px solid ${C.border}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 12,
        }}>
          <p style={{ color: C.muted, fontSize: 13, margin: 0 }}>
            &copy; {new Date().getFullYear()} Riscent. All rights reserved.
          </p>
          <Link href="/" style={{ color: C.muted, fontSize: 13, textDecoration: 'none' }}>
            Back to riscent.com
          </Link>
        </div>
      </footer>

      {/* ── MOBILE RESPONSIVE STYLES ── */}
      <style>{`
        @media (max-width: 640px) {
          nav { padding: 0 16px !important; }
          nav a[href*="mailto"] { font-size: 12px !important; padding: 7px 14px !important; }

          section { padding: 56px 16px !important; }

          /* How it works: stack steps vertically, remove side border */
          #how-it-works > div > div:last-child > div > div {
            border-right: none !important;
            border-bottom: 1px solid ${C.border};
          }
          #how-it-works > div > div:last-child > div > div:last-child {
            border-bottom: none !important;
          }

          /* Live preview: stack columns */
          [style*="grid-template-columns: 1fr 1fr"] {
            grid-template-columns: 1fr !important;
          }

          /* Pricing: full width */
          [style*="minmax(280px"] {
            grid-template-columns: 1fr !important;
          }

          /* Languages grid */
          [style*="minmax(160px"] {
            grid-template-columns: repeat(3, 1fr) !important;
          }

          /* Footer grid */
          footer [style*="minmax(180px"] {
            grid-template-columns: 1fr 1fr !important;
          }
        }

        @media (max-width: 400px) {
          [style*="minmax(160px"] {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          footer [style*="minmax(180px"] {
            grid-template-columns: 1fr !important;
          }
        }

        a:hover { opacity: 0.82; }
      `}</style>
    </div>
  );
}
