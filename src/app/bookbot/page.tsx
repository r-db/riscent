'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Link from 'next/link';
import { conversations as convoData } from './conversations';

/* ══════════════════════════════════════════════════════════════ */

// ONE brand palette. Orange is the only accent. No multi-color chaos.
const c = {
  bg: '#FAFAF8', white: '#FFFFFF', black: '#1A1A1A', text: '#444444',
  muted: '#888888', border: '#E8E8E4', orange: '#FF7A00', orangeL: '#FFF3E8',
  green: '#16A34A', greenL: '#F0FDF4', // green = semantic only (checkmarks, success states)
};

function useReveal(t = 0.1) {
  const ref = useRef<HTMLDivElement>(null);
  const [v, setV] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setV(true); obs.disconnect(); } }, { threshold: t });
    obs.observe(el);
    return () => obs.disconnect();
  }, [t]);
  return { ref, v };
}

function useOnScreen(t = 0.3) {
  const ref = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => setOn(e.isIntersecting), { threshold: t });
    obs.observe(el);
    return () => obs.disconnect();
  }, [t]);
  return { ref, on };
}

const fade = (v: boolean, d = 0): React.CSSProperties => ({
  opacity: v ? 1 : 0, transform: v ? 'translateY(0)' : 'translateY(16px)',
  transition: `all 0.5s cubic-bezier(0.22,1,0.36,1) ${d}s`,
});

/* ── Conversation Player — deep realistic convos with auto-scroll ── */
function ConversationPlayer({ active }: { active: boolean }) {
  const [convoIdx, setConvoIdx] = useState(0);
  const [step, setStep] = useState(-1);
  const [transitioning, setTransitioning] = useState(false);
  const timerRef = useRef<NodeJS.Timeout[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom as new messages appear
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [step]);

  const playConvo = useCallback((idx: number) => {
    timerRef.current.forEach(clearTimeout);
    timerRef.current = [];
    setTransitioning(true);
    setStep(-1);

    const t0 = setTimeout(() => {
      setConvoIdx(idx);
      setTransitioning(false);
      if (scrollRef.current) scrollRef.current.scrollTop = 0;
      const convo = convoData[idx];

      // Calculate realistic timing per message
      // ~2.5x real speed: word count drives duration, role adds natural pauses
      let cumulative = 800; // initial pause before first message
      convo.lines.forEach((line, i) => {
        const words = line.text.split(' ').length;
        const t = setTimeout(() => setStep(i), cumulative);
        timerRef.current.push(t);

        if (line.role === 'tool') {
          // Tool calls: quick system action
          cumulative += 1500;
        } else if (line.role === 'system') {
          // System confirmation: let it sit
          cumulative += 3000;
        } else if (line.role === 'ai') {
          // AI speaking: ~100ms per word (2.5x real speech speed) + 800ms pause after
          cumulative += Math.max(1800, words * 100) + 800;
        } else {
          // Caller: thinking pause (1s) + speaking (~120ms/word at 2.5x) + pause after
          cumulative += 1000 + Math.max(1500, words * 120) + 600;
        }
      });

      const nextT = setTimeout(() => {
        playConvo((idx + 1) % convoData.length);
      }, cumulative + 4000); // 4s pause between conversations
      timerRef.current.push(nextT);
    }, 600);
    timerRef.current.push(t0);
  }, []);

  useEffect(() => {
    if (active) playConvo(0);
    return () => timerRef.current.forEach(clearTimeout);
  }, [active, playConvo]);

  const convo = convoData[convoIdx];

  return (
    <div style={{
      maxWidth: 420, width: '100%', margin: '0 auto',
      background: c.white, borderRadius: 24,
      border: `1px solid #E5E2DC`,
      boxShadow: '0 12px 48px rgba(0,0,0,0.06), 0 2px 8px rgba(0,0,0,0.04)',
      padding: 0,
      opacity: transitioning ? 0.3 : 1,
      transition: 'opacity 0.4s ease',
      overflow: 'hidden',
    }}>
      {/* Header bar — iOS-style, clean, orange accent */}
      <div style={{
        background: 'linear-gradient(135deg, #FF7A00, #FF9A33)',
        padding: '16px 20px',
        display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <div style={{
          width: 38, height: 38, borderRadius: '50%',
          background: 'rgba(255,255,255,0.2)',
          backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 16, color: '#fff',
        }}>📞</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#fff', letterSpacing: '-0.01em' }}>{convo.biz}</div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.75)' }}>{convo.caller}</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#4ADE80', boxShadow: '0 0 6px rgba(74,222,128,0.6)', animation: 'pulse 2s infinite' }} />
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', fontWeight: 500 }}>Live</span>
        </div>
      </div>

      {/* Scenario subtitle */}
      <div style={{ fontSize: 11, color: c.muted, textAlign: 'center', padding: '10px 20px 6px', fontStyle: 'italic' }}>{convo.scenario}</div>

      {/* Messages — fixed height, auto-scroll, iOS-style bubbles */}
      <div ref={scrollRef} style={{
        display: 'flex', flexDirection: 'column', gap: 6,
        height: 400, overflowY: 'auto', scrollbarWidth: 'none',
        padding: '8px 16px 16px',
      }}>
        {convo.lines.map((m, i) => {
          if (i > step) return null;
          const isSys = m.role === 'system';
          const isTool = m.role === 'tool';
          const isAi = m.role === 'ai';
          const isCaller = m.role === 'caller';
          return (
            <div key={`${convoIdx}-${i}`} style={{
              alignSelf: isCaller ? 'flex-end' : 'flex-start',
              maxWidth: isSys ? '100%' : isTool ? '88%' : '80%',
              padding: isTool ? '5px 10px' : '10px 14px',
              borderRadius: isAi ? '18px 18px 18px 6px' : isSys ? 14 : isTool ? 8 : '18px 18px 6px 18px',
              // iOS-style: AI = orange gradient, Caller = light gray, System = elegant green
              background: isSys
                ? 'linear-gradient(135deg, #F0FDF4, #ECFCE5)'
                : isTool
                  ? '#F5F5F3'
                  : isAi
                    ? 'linear-gradient(135deg, #FF7A00, #FF8F2D)'
                    : '#F0F0ED',
              border: isSys ? '1px solid #C6F6D5' : 'none',
              fontSize: isTool ? 11 : 14, lineHeight: 1.5,
              // AI text is white on orange, everything else is dark
              color: isAi ? '#fff' : isSys ? '#15803D' : isTool ? c.muted : c.black,
              fontWeight: isSys ? 600 : isTool ? 500 : 400,
              fontFamily: isTool ? 'monospace' : 'inherit',
              letterSpacing: isAi ? '-0.005em' : '0',
              animation: i === step ? 'msgIn 0.3s ease forwards' : 'none',
              opacity: i === step ? 0 : 1,
              boxShadow: isAi ? '0 1px 3px rgba(255,122,0,0.15)' : isCaller ? '0 1px 2px rgba(0,0,0,0.04)' : 'none',
            }}>{m.text}</div>
          );
        })}
        {step >= 0 && step < convo.lines.length - 1 && (
          <div style={{ alignSelf: 'flex-start', display: 'flex', gap: 5, padding: '8px 14px' }}>
            {[0,1,2].map(i => <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: '#FFB366', animation: 'typing 1.2s ease-in-out infinite', animationDelay: `${i*0.15}s` }} />)}
          </div>
        )}
      </div>

      {/* Convo indicator */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginTop: 16 }}>
        {convoData.map((_, i) => (
          <div key={i} style={{
            width: i === convoIdx ? 16 : 6, height: 6, borderRadius: 3,
            background: i === convoIdx ? c.orange : c.border,
            transition: 'all 0.3s ease',
          }} />
        ))}
      </div>
    </div>
  );
}

/* ── FAQ ── */
function Faq({ q, a: ans, open: init = false }: { q: string; a: string; open?: boolean }) {
  const [open, setOpen] = useState(init);
  return (
    <div style={{ borderBottom: `1px solid ${c.border}` }}>
      <button onClick={() => setOpen(!open)} aria-expanded={open} style={{
        width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '20px 0', background: 'none', border: 'none',
        color: c.black, fontSize: 16, fontWeight: 600, textAlign: 'left',
        cursor: 'pointer', lineHeight: 1.4, fontFamily: 'inherit',
      }}>
        <span style={{ flex: 1, paddingRight: 16 }}>{q}</span>
        <span style={{ fontSize: 20, color: c.orange, transition: 'transform 0.2s', transform: open ? 'rotate(45deg)' : 'rotate(0)' }}>+</span>
      </button>
      <div style={{ maxHeight: open ? 200 : 0, overflow: 'hidden', transition: 'max-height 0.3s ease' }}>
        <p style={{ padding: '0 0 20px', fontSize: 15, lineHeight: 1.6, color: c.text, margin: 0 }}>{ans}</p>
      </div>
    </div>
  );
}

/* ═══════════════════════ PAGE ═══════════════════════ */
export default function BookBotPage() {
  const hero = useReveal(0.05);
  const demoSection = useOnScreen(0.2);
  const how  = useReveal(0.08);
  const why  = useReveal(0.08);
  const listen = useReveal(0.08);
  const vid  = useReveal(0.08);
  const addons = useReveal(0.08);
  const price = useReveal(0.08);
  const faqS = useReveal(0.08);
  const cta  = useReveal(0.08);

  const section: React.CSSProperties = { maxWidth: 980, margin: '0 auto', padding: '80px 24px' };
  const label: React.CSSProperties = { fontSize: 12, fontWeight: 700, color: c.orange, letterSpacing: '0.08em', textTransform: 'uppercase' as const, marginBottom: 16 };
  const h2Style: React.CSSProperties = { fontSize: 'clamp(28px, 3.5vw, 40px)', letterSpacing: '-0.02em', fontWeight: 700, lineHeight: 1.1 };

  return (
    <main style={{ background: c.bg, color: c.black, minHeight: '100vh', fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', fontSize: 16, lineHeight: 1.6 }}>
      <style>{`
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}
        @keyframes typing{0%,100%{opacity:.3;transform:translateY(0)}50%{opacity:1;transform:translateY(-2px)}}
        @keyframes msgIn{to{opacity:1;transform:translateY(0)}}
        @media(prefers-reduced-motion:reduce){*{animation-duration:.01ms!important;transition-duration:.01ms!important}}
        @media(max-width:768px){
          .bb-h1{font-size:36px!important}
          .bb-g3{grid-template-columns:1fr!important}
          .bb-g2{grid-template-columns:1fr!important}
          .bb-ctas{flex-direction:column!important}
          .bb-ctas a{width:100%!important;text-align:center!important;justify-content:center!important}
          .bb-s{padding-left:20px!important;padding-right:20px!important}
          .bb-foot{flex-direction:column!important;text-align:center!important;gap:16px!important}
          .bb-split{flex-direction:column!important}
        }
      `}</style>

      {/* ═══ NAV ═══ */}
      <header className="bb-s" style={{ borderBottom: `1px solid ${c.border}`, padding: '14px 24px', maxWidth: 980, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: c.orange }} />
            <span style={{ fontWeight: 700, fontSize: 14, color: c.muted, letterSpacing: '0.02em' }}>RISCENT</span>
          </Link>
          <span style={{ color: c.border }}>/</span>
          <span style={{ fontWeight: 700, fontSize: 14, color: c.orange }}>BookBot</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <a href="#pricing" style={{ color: c.text, textDecoration: 'none', fontSize: 14, fontWeight: 500 }}>Pricing</a>
          <a href="mailto:ryan@riscent.com?subject=BookBot" style={{ background: c.black, color: c.white, padding: '9px 20px', borderRadius: 8, fontSize: 14, fontWeight: 700, textDecoration: 'none' }}>Get Started</a>
        </div>
      </header>

      {/* ═══ HERO ═══ */}
      <section ref={hero.ref} style={{ ...section, padding: '100px 24px 80px', textAlign: 'center' }}>
        <div style={{ marginBottom: 24, ...fade(hero.v) }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: c.orange, letterSpacing: '0.06em', textTransform: 'uppercase', background: c.orangeL, padding: '6px 16px', borderRadius: 100 }}>AI PHONE RECEPTIONIST</span>
        </div>
        <h1 className="bb-h1" style={{ fontSize: 'clamp(40px, 6vw, 72px)', lineHeight: 1.05, letterSpacing: '-0.03em', fontWeight: 700, marginBottom: 24, maxWidth: 700, margin: '0 auto 24px', ...fade(hero.v, 0.06) }}>
          Your phone.<br /><span style={{ color: c.orange }}>Always answered.</span>
        </h1>
        <p style={{ fontSize: 18, lineHeight: 1.6, color: c.text, maxWidth: 520, margin: '0 auto 36px', ...fade(hero.v, 0.12) }}>
          BookBot answers calls, books appointments, and knows your customers — 24/7. Built for service businesses.
        </p>
        <div className="bb-ctas" style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 16, ...fade(hero.v, 0.18) }}>
          <a href="mailto:ryan@riscent.com?subject=BookBot%20Trial" style={{ background: c.orange, color: '#fff', padding: '16px 36px', borderRadius: 10, fontSize: 16, fontWeight: 700, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8, boxShadow: '0 2px 12px rgba(255,122,0,0.25)' }}>Start Free Trial <span>↗</span></a>
          <a href="#demo" style={{ background: 'transparent', color: c.black, padding: '16px 36px', borderRadius: 10, fontSize: 16, fontWeight: 600, textDecoration: 'none', border: `1px solid ${c.border}` }}>See BookBot in action</a>
        </div>
        <p style={{ fontSize: 14, color: c.muted, ...fade(hero.v, 0.24) }}>14-day free trial · No credit card required</p>
      </section>

      {/* ═══ LIVE CONVERSATIONS — 10 scenarios, loops on scroll ═══ */}
      <section id="demo" ref={demoSection.ref} style={{ ...section, padding: '0 24px 80px' }}>
        <p style={{ textAlign: 'center', fontSize: 12, fontWeight: 700, color: c.orange, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 16 }}>Live demo</p>
        <p style={{ textAlign: 'center', fontSize: 14, color: c.muted, marginBottom: 32 }}>Real conversations. Deep back-and-forth across plumbing, HVAC, electrical, dental, and after-hours emergencies.</p>
        <ConversationPlayer active={demoSection.on} />
      </section>

      {/* ═══ LISTEN — Sample call audio ═══ */}
      <section ref={listen.ref} style={{ ...section, borderTop: `1px solid ${c.border}` }}>
        <div style={{ textAlign: 'center', maxWidth: 560, margin: '0 auto' }}>
          <p style={{ ...label, ...fade(listen.v) }}>Hear it yourself</p>
          <h2 style={{ ...h2Style, marginBottom: 16, ...fade(listen.v, 0.06) }}>Listen to a real BookBot call.</h2>
          <p style={{ fontSize: 16, color: c.text, marginBottom: 32, ...fade(listen.v, 0.1) }}>A 60-second sample call. No scripts. Real AI handling a real scenario.</p>
          {/* Audio player placeholder */}
          <div style={{
            background: c.white, border: `1px solid ${c.border}`, borderRadius: 14,
            padding: '24px 28px', display: 'flex', alignItems: 'center', gap: 16,
            maxWidth: 420, margin: '0 auto',
            ...fade(listen.v, 0.14),
          }}>
            <button style={{
              width: 52, height: 52, borderRadius: '50%', border: 'none',
              background: c.orange, color: '#fff', fontSize: 20, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>▶</button>
            <div style={{ flex: 1 }}>
              <div style={{ height: 4, background: c.border, borderRadius: 2, marginBottom: 8 }}>
                <div style={{ width: '0%', height: '100%', background: c.orange, borderRadius: 2 }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: c.muted }}>
                <span>0:00</span><span>1:04</span>
              </div>
            </div>
          </div>
          <p style={{ fontSize: 13, color: c.muted, marginTop: 12, ...fade(listen.v, 0.18) }}>Wilson Plumbing — Emergency pipe repair booking</p>
        </div>
      </section>

      {/* ═══ VIDEO TESTIMONIAL ═══ */}
      <section ref={vid.ref} style={{ ...section, borderTop: `1px solid ${c.border}` }}>
        <div style={{ textAlign: 'center', maxWidth: 640, margin: '0 auto' }}>
          <p style={{ ...label, ...fade(vid.v) }}>What customers say</p>
          <h2 style={{ ...h2Style, marginBottom: 32, ...fade(vid.v, 0.06) }}>See why businesses switch to BookBot.</h2>
          {/* Video placeholder */}
          <div style={{
            background: c.black, borderRadius: 14, aspectRatio: '16/9',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            position: 'relative', overflow: 'hidden', cursor: 'pointer',
            ...fade(vid.v, 0.1),
          }}>
            <div style={{
              width: 72, height: 72, borderRadius: '50%', background: 'rgba(255,255,255,0.15)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.2)',
            }}>
              <span style={{ fontSize: 28, color: '#fff', marginLeft: 4 }}>▶</span>
            </div>
            <div style={{ position: 'absolute', bottom: 20, left: 24, color: '#fff' }}>
              <div style={{ fontSize: 15, fontWeight: 700 }}>Coming soon</div>
              <div style={{ fontSize: 13, opacity: 0.7 }}>Customer testimonial video</div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ HOW IT WORKS ═══ */}
      <section ref={how.ref} style={{ ...section, borderTop: `1px solid ${c.border}` }}>
        <p style={{ ...label, ...fade(how.v) }}>How it works</p>
        <h2 style={{ ...h2Style, marginBottom: 48, maxWidth: 500, ...fade(how.v, 0.06) }}>Three steps. Live in 48 hours.</h2>
        <div className="bb-g3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24 }}>
          {[
            { n: '1', title: 'Forward your number', desc: 'Point your existing line to BookBot, or use a new dedicated number. Takes 2 minutes.' },
            { n: '2', title: 'BookBot answers', desc: 'AI picks up, greets callers by name, looks up history, books appointments in real time.' },
            { n: '3', title: 'You run your business', desc: 'Review transcripts, see bookings, get SMS notifications. That\'s it.' },
          ].map((s, i) => (
            <div key={s.n} style={{ ...fade(how.v, 0.1 + i * 0.06) }}>
              <div style={{ fontSize: 48, fontWeight: 800, color: c.border, lineHeight: 1, marginBottom: 12 }}>{s.n}</div>
              <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>{s.title}</div>
              <p style={{ fontSize: 15, lineHeight: 1.6, color: c.text }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ WHY BOOKBOT ═══ */}
      <section ref={why.ref} style={{ ...section, borderTop: `1px solid ${c.border}` }}>
        <p style={{ ...label, ...fade(why.v) }}>Why BookBot</p>
        <h2 style={{ ...h2Style, marginBottom: 48, maxWidth: 500, ...fade(why.v, 0.06) }}>Everything a receptionist does. None of the overhead.</h2>
        <div className="bb-g2" style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 20 }}>
          {[
            { title: 'Answers every call', desc: '24/7, holidays, weekends. Under 2 seconds. Every single time.' },
            { title: 'Knows your customers', desc: 'Greets returning callers by name. Pulls up service history and address.' },
            { title: 'Books appointments', desc: 'Checks real-time availability. Confirms details. Sends SMS confirmation.' },
            { title: 'Costs a fraction', desc: 'Starting at $99/mo vs $400-800/mo for a human receptionist with limited hours.' },
          ].map((f, i) => (
            <div key={f.title} style={{ padding: 28, background: c.white, border: `1px solid ${c.border}`, borderRadius: 14, ...fade(why.v, 0.1 + i * 0.06) }}>
              <div style={{ fontSize: 17, fontWeight: 700, marginBottom: 8 }}>{f.title}</div>
              <p style={{ fontSize: 15, lineHeight: 1.6, color: c.text }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ ADD-ONS — Chat widget + Website + Custom ═══ */}
      <section ref={addons.ref} style={{ ...section, borderTop: `1px solid ${c.border}` }}>
        <p style={{ ...label, ...fade(addons.v) }}>Add more</p>
        <h2 style={{ ...h2Style, marginBottom: 16, maxWidth: 560, ...fade(addons.v, 0.06) }}>BookBot handles your phone. Need help with your website too?</h2>
        <p style={{ fontSize: 16, color: c.text, marginBottom: 48, maxWidth: 500, ...fade(addons.v, 0.1) }}>Phone and chat are separate products — use one or both. We also build websites.</p>

        <div className="bb-g3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20 }}>
          {/* Chat widget */}
          <div style={{ padding: 28, background: c.white, border: `1px solid ${c.border}`, borderRadius: 14, ...fade(addons.v, 0.14) }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: c.orange, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 12 }}>Chatterbox</div>
            <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>AI Chat Widget</div>
            <p style={{ fontSize: 15, lineHeight: 1.6, color: c.text, marginBottom: 16 }}>Add an AI chat agent to your website that answers questions and captures leads 24/7. Separate from phone.</p>
            <div style={{ fontSize: 14, color: c.muted, marginBottom: 16 }}>From <strong style={{ color: c.black }}>$49/mo</strong></div>
            <Link href="/chatterbox" style={{ color: c.orange, fontSize: 14, fontWeight: 600, textDecoration: 'none' }}>Learn more →</Link>
          </div>

          {/* Website build */}
          <div style={{ padding: 28, background: c.white, border: `1px solid ${c.border}`, borderRadius: 14, ...fade(addons.v, 0.2) }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: c.orange, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 12 }}>Website</div>
            <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>New Website Build</div>
            <p style={{ fontSize: 15, lineHeight: 1.6, color: c.text, marginBottom: 16 }}>Need a modern website for your business? We design and build it — mobile-friendly, fast, with BookBot built in.</p>
            <div style={{ fontSize: 14, color: c.muted, marginBottom: 16 }}>From <strong style={{ color: c.black }}>$2,499</strong> + $79.99/mo hosting</div>
            <a href="mailto:ryan@riscent.com?subject=Website%20Build" style={{ color: c.orange, fontSize: 14, fontWeight: 600, textDecoration: 'none' }}>Get a quote →</a>
          </div>

          {/* Custom */}
          <div style={{ padding: 28, background: c.white, border: `1px solid ${c.border}`, borderRadius: 14, ...fade(addons.v, 0.26) }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: c.orange, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 12 }}>Custom</div>
            <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Custom Configuration</div>
            <p style={{ fontSize: 15, lineHeight: 1.6, color: c.text, marginBottom: 16 }}>Custom voice persona, CRM integrations, multi-location routing, HIPAA compliance, or anything else you need.</p>
            <div style={{ fontSize: 14, color: c.muted, marginBottom: 16 }}>Custom pricing</div>
            <a href="mailto:ryan@riscent.com?subject=BookBot%20Custom" style={{ color: c.orange, fontSize: 14, fontWeight: 600, textDecoration: 'none' }}>Talk to us →</a>
          </div>
        </div>
      </section>

      {/* ═══ PRICING ═══ */}
      <section id="pricing" ref={price.ref} style={{ ...section, borderTop: `1px solid ${c.border}` }}>
        <p style={{ ...label, ...fade(price.v) }}>Pricing</p>
        <h2 style={{ ...h2Style, marginBottom: 12, ...fade(price.v, 0.06) }}>Simple pricing. No surprises.</h2>
        <p style={{ fontSize: 16, color: c.text, marginBottom: 12, ...fade(price.v, 0.1) }}>Every plan includes a dedicated phone number, 24/7 answering, and SMS confirmations.</p>
        <p style={{ fontSize: 14, color: c.muted, marginBottom: 48, ...fade(price.v, 0.12) }}>Use our number or forward your existing line. Both options included.</p>
        <div className="bb-g3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, alignItems: 'stretch' }}>
          {[
            { name: 'Starter', price: '$99', sub: '100 min/mo · 1 number', items: ['24/7 answering', 'Appointment booking', 'SMS confirmations', 'English + Spanish', 'Call transcripts'] },
            { name: 'Pro', price: '$249', sub: '500 min/mo · 3 numbers', items: ['Everything in Starter', 'CRM integration', 'Customer history lookup', 'Reschedule & cancel flows', 'Priority support'], hl: true },
            { name: 'Clinic', price: '$499', sub: '2,000 min/mo · Unlimited', items: ['Everything in Pro', 'HIPAA compliant', 'Multi-location routing', 'Custom voice persona', 'Dedicated onboarding'] },
          ].map((p, i) => (
            <div key={p.name} style={{
              padding: 28, display: 'flex', flexDirection: 'column',
              background: c.white, borderRadius: 14, position: 'relative',
              border: p.hl ? `2px solid ${c.orange}` : `1px solid ${c.border}`,
              ...fade(price.v, 0.14 + i * 0.08),
            }}>
              {p.hl && <div style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', background: c.orange, color: '#fff', fontSize: 11, fontWeight: 700, padding: '3px 14px', borderRadius: 100 }}>MOST POPULAR</div>}
              <div style={{ fontSize: 14, fontWeight: 600, color: p.hl ? c.orange : c.muted, marginBottom: 8 }}>{p.name}</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 2, marginBottom: 4 }}>
                <span style={{ fontSize: 40, fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1 }}>{p.price}</span>
                <span style={{ fontSize: 15, color: c.muted }}>/mo</span>
              </div>
              <div style={{ fontSize: 13, color: c.muted, marginBottom: 24 }}>{p.sub}</div>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px', display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
                {p.items.map(f => <li key={f} style={{ fontSize: 14, color: c.text, display: 'flex', alignItems: 'flex-start' }}><span style={{ color: c.green, fontWeight: 700, marginRight: 8 }}>✓</span>{f}</li>)}
              </ul>
              <a href={`mailto:ryan@riscent.com?subject=BookBot%20${p.name}`} style={{
                display: 'block', textAlign: 'center', padding: '12px 20px', borderRadius: 8,
                fontSize: 14, fontWeight: 700, textDecoration: 'none',
                background: p.hl ? c.orange : 'transparent', color: p.hl ? '#fff' : c.black,
                border: p.hl ? 'none' : `1px solid ${c.border}`,
              }}>{p.hl ? 'Start Free Trial' : p.name === 'Clinic' ? 'Contact Us' : 'Start Free Trial'}</a>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ FAQ ═══ */}
      <section ref={faqS.ref} style={{ ...section, borderTop: `1px solid ${c.border}` }}>
        <h2 style={{ ...h2Style, marginBottom: 32, ...fade(faqS.v) }}>Questions</h2>
        <div style={{ maxWidth: 640, ...fade(faqS.v, 0.06) }}>
          {[
            { q: 'Do I need a new phone number?', a: 'No. You can forward your existing business line to BookBot, or use the dedicated number we provide. Both options are included in every plan.' },
            { q: 'What about chat and text?', a: 'BookBot handles phone calls. For website chat, check out Chatterbox — our AI chat widget ($49/mo). They work great together but are separate products so you only pay for what you need.' },
            { q: 'How much does each call cost?', a: 'Nothing extra within your plan\'s minutes. Starter includes 100 min/mo, Pro 500 min/mo, Clinic 2,000 min/mo. Overage is billed per-minute with advance notice at 80% usage.' },
            { q: 'Can it handle emergencies?', a: 'Yes. You set triage rules — emergencies transfer to your on-call phone instantly. Non-emergencies get booked normally.' },
            { q: 'How long does setup take?', a: '48 hours. We configure your services, hours, and voice. You review one test call and approve.' },
            { q: 'Any contracts?', a: 'No. Month-to-month. Cancel in 30 seconds. 14-day free trial — full access, no credit card.' },
          ].map((f, i) => <Faq key={i} q={f.q} a={f.a} open={i === 0} />)}
        </div>
      </section>

      {/* ═══ FINAL CTA ═══ */}
      <section ref={cta.ref} style={{ ...section, borderTop: `1px solid ${c.border}`, textAlign: 'center' }}>
        <h2 style={{ ...h2Style, marginBottom: 16, ...fade(cta.v) }}>Stop losing calls.<br /><span style={{ color: c.orange }}>Start today.</span></h2>
        <p style={{ fontSize: 17, color: c.text, maxWidth: 440, margin: '0 auto 32px', ...fade(cta.v, 0.06) }}>14 days free. No credit card. No contracts. Just answered phones.</p>
        <a href="mailto:ryan@riscent.com?subject=BookBot%20Trial" style={{
          background: c.orange, color: '#fff', padding: '16px 40px', borderRadius: 10,
          fontSize: 17, fontWeight: 700, textDecoration: 'none', display: 'inline-flex',
          alignItems: 'center', gap: 8, boxShadow: '0 2px 12px rgba(255,122,0,0.25)',
          ...fade(cta.v, 0.12),
        }}>Start Free Trial <span>↗</span></a>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="bb-foot bb-s" style={{ borderTop: `1px solid ${c.border}`, padding: '24px', maxWidth: 980, margin: '0 auto', fontSize: 13, color: c.muted, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <div><Link href="/" style={{ textDecoration: 'none', fontWeight: 700, color: c.text, fontSize: 13 }}>RISCENT</Link> · AI for businesses that can&apos;t afford to miss a call.</div>
        <div style={{ display: 'flex', gap: 20 }}>
          <Link href="/" style={{ color: c.muted, textDecoration: 'none' }}>Products</Link>
          <Link href="/chatterbox" style={{ color: c.muted, textDecoration: 'none' }}>Chatterbox</Link>
          <a href="mailto:ryan@riscent.com" style={{ color: c.orange, textDecoration: 'none', fontWeight: 600 }}>ryan@riscent.com</a>
        </div>
      </footer>
    </main>
  );
}
