import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Case Study: 5-Provider Behavioral Health Practice | Riscent',
  description: 'Before and after: how a 5-provider psychiatric practice replaced 4 disconnected tools with one AI-powered system. 1,710 calls handled, zero missed, 80% portal adoption, staff stopped quitting.',
  keywords: ['healthcare AI case study', 'medical practice AI', 'voice agent results', 'patient portal adoption', 'AI answering service', 'behavioral health AI', 'practice management AI'],
};

const C = {
  bg: '#0b0e14',
  bgElev: '#111521',
  bgElev2: '#161b29',
  border: '#1e2535',
  text: '#e6e8ed',
  text2: '#a6adbb',
  muted: '#6e7689',
  accent: '#4f8cff',
  green: '#5fd6a3',
  warn: '#f0b45b',
  red: '#f87171',
};

export default function CaseStudyPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Case Study: 5-Provider Behavioral Health Practice — Before and After',
    description: metadata.description,
    datePublished: '2026-04-13',
    author: { '@type': 'Person', name: 'Ryan Bolden', url: 'https://riscent.com' },
    publisher: { '@type': 'Organization', name: 'Riscent', url: 'https://riscent.com' },
  };

  return (
    <>
      <style>{`
        @media (max-width: 768px) {
          .cs-main { padding: 48px 16px !important; }
          .cs-grid { grid-template-columns: 1fr !important; }
          .cs-compare { grid-template-columns: 1fr !important; }
          .cs-cta-row { flex-direction: column !important; }
          .cs-cta-row a { width: 100% !important; text-align: center !important; }
        }
      `}</style>
      <div style={{ background: C.bg, color: C.text, minHeight: '100vh', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Inter, sans-serif' }}>
        {/* NAV */}
        <header style={{ borderBottom: `1px solid ${C.border}`, padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: 1100, margin: '0 auto' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', color: C.text }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: C.green }} />
            <span style={{ fontWeight: 700, fontSize: 16 }}>RISCENT</span>
          </Link>
          <div style={{ display: 'flex', gap: 24 }}>
            <Link href="/docs" style={{ color: C.text2, textDecoration: 'none', fontSize: 14, fontWeight: 500 }}>Articles</Link>
            <a href="mailto:ryan@riscent.com" style={{ color: C.text2, textDecoration: 'none', fontSize: 14, fontWeight: 500 }}>ryan@riscent.com</a>
          </div>
        </header>

        <main className="cs-main" style={{ maxWidth: 860, margin: '0 auto', padding: '80px 24px' }}>
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

          <Link href="/" style={{ color: C.muted, textDecoration: 'none', fontSize: 14, display: 'inline-block', marginBottom: 32 }}>
            ← Back to Riscent
          </Link>

          <div style={{ fontSize: 12, fontWeight: 600, color: C.green, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 12 }}>
            Case Study & Proof
          </div>
          <h1 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 700, letterSpacing: '-0.025em', lineHeight: 1.1, marginBottom: 20 }}>
            5-Provider Behavioral Health Practice<br />
            <span style={{ color: C.text2 }}>Before and After.</span>
          </h1>
          <p style={{ fontSize: 19, lineHeight: 1.6, color: C.text2, marginBottom: 48, maxWidth: 700 }}>
            A multi-location psychiatric practice in the Southwest replaced four disconnected tools with one AI-powered system. These are the real numbers from the first 90 days.
          </p>

          {/* PRACTICE PROFILE */}
          <div className="cs-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 56 }}>
            {[
              { num: '5', label: 'Providers' },
              { num: '2', label: 'Locations' },
              { num: '~18K', label: 'Patients' },
              { num: 'Psychiatry', label: 'Specialty' },
            ].map((s) => (
              <div key={s.label} style={{ background: C.bgElev, border: `1px solid ${C.border}`, borderRadius: 10, padding: '20px' }}>
                <div style={{ fontSize: 28, fontWeight: 700, color: C.text, lineHeight: 1 }}>{s.num}</div>
                <div style={{ fontSize: 14, color: C.muted, marginTop: 6 }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* BEFORE / AFTER COMPARISON */}
          <h2 style={{ fontSize: 28, fontWeight: 700, marginBottom: 32, letterSpacing: '-0.015em' }}>Before vs. After</h2>

          <div className="cs-compare" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, marginBottom: 56 }}>
            {/* BEFORE */}
            <div style={{ background: C.bgElev, borderRadius: '12px 0 0 12px', padding: '32px 28px' }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: C.red, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 20 }}>Before</div>
              {[
                { metric: 'Monthly tool spend', value: '$3,200', note: '4 vendors, 4 logins, zero integration' },
                { metric: 'Missed call rate', value: '30%+', note: 'Answering service overwhelmed at peak, offline after hours' },
                { metric: 'Patient portal adoption', value: '<10%', note: 'Username + password + email verification' },
                { metric: 'After-hours coverage', value: 'None', note: 'Voicemail only. 62% of patients who hit voicemail never call back.' },
                { metric: 'Spanish-language support', value: 'Business hours only', note: 'If a bilingual staff member was available' },
                { metric: 'Staff phone time', value: '20+ hrs/week', note: 'Same 5 questions, 40x/day. MAs doing receptionist work.' },
                { metric: 'MA turnover', value: 'Chronic', note: 'Burnout from phone duty. 47% of practices say MAs are hardest to fill (MGMA).' },
                { metric: 'Owner weekends', value: 'Working', note: 'Had not taken a Saturday off in 2 years' },
                { metric: 'Data integration', value: 'Manual', note: 'Staff copying data between 4 systems' },
                { metric: 'Crisis call handling', value: 'Voicemail', note: 'In behavioral health, a missed crisis call is a patient who does not get help' },
              ].map((r) => (
                <div key={r.metric} style={{ marginBottom: 18 }}>
                  <div style={{ fontSize: 13, color: C.muted, marginBottom: 2 }}>{r.metric}</div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: C.red }}>{r.value}</div>
                  <div style={{ fontSize: 13, color: C.text2, marginTop: 2 }}>{r.note}</div>
                </div>
              ))}
            </div>

            {/* AFTER */}
            <div style={{ background: C.bgElev, borderRadius: '0 12px 12px 0', padding: '32px 28px' }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: C.green, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 20 }}>After — 90 Days</div>
              {[
                { metric: 'Monthly tool spend', value: '$799', note: 'One system. Voice, portal, CRM, scheduling, monitoring.' },
                { metric: 'Missed call rate', value: '0%', note: '1,710 calls handled. Every single one answered.' },
                { metric: 'Patient portal adoption', value: '80%', note: 'Phone + birthday. No password. No app. 5 seconds to log in.' },
                { metric: 'After-hours coverage', value: '24/7', note: 'AI voice agent answers every call in under 2 seconds' },
                { metric: 'Spanish-language support', value: '24/7 native', note: 'Bilingual AI. No translation layer. No staff dependency.' },
                { metric: 'Staff phone time', value: 'Near zero', note: 'Patients self-serve via portal and voice agent' },
                { metric: 'MA turnover', value: 'Stopped', note: 'Staff doing clinical work instead of answering phones' },
                { metric: 'Owner weekends', value: 'Off', note: 'First Saturday off in 2 years. System runs without him.' },
                { metric: 'Data integration', value: 'Automatic', note: 'Every call, appointment, and patient interaction in one system' },
                { metric: 'Crisis call handling', value: 'Immediate', note: 'Every call answered. Emergencies routed to on-call provider instantly.' },
              ].map((r) => (
                <div key={r.metric} style={{ marginBottom: 18 }}>
                  <div style={{ fontSize: 13, color: C.muted, marginBottom: 2 }}>{r.metric}</div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: C.green }}>{r.value}</div>
                  <div style={{ fontSize: 13, color: C.text2, marginTop: 2 }}>{r.note}</div>
                </div>
              ))}
            </div>
          </div>

          {/* GROWTH TIMELINE */}
          <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 24 }}>Growth Timeline</h2>
          <div className="cs-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 20 }}>
            {[
              { month: 'Month 1', calls: '39', note: 'Soft launch. Partial line routing. Testing.' },
              { month: 'Month 2', calls: '125', note: '3.2x growth. More lines routed because month 1 worked.' },
              { month: 'Month 3', calls: '1,245', note: '10x month 2. Full adoption. Organic expansion.' },
              { month: 'Total Q1', calls: '1,710', note: 'Zero missed. 1.9 min avg duration.' },
            ].map((m) => (
              <div key={m.month} style={{ background: C.bgElev, border: `1px solid ${C.border}`, borderRadius: 10, padding: '20px' }}>
                <div style={{ fontSize: 13, color: C.muted, marginBottom: 6 }}>{m.month}</div>
                <div style={{ fontSize: 32, fontWeight: 700, color: C.green, lineHeight: 1 }}>{m.calls}</div>
                <div style={{ fontSize: 13, color: C.text2, marginTop: 8 }}>{m.note}</div>
              </div>
            ))}
          </div>
          <p style={{ fontSize: 15, color: C.muted, marginBottom: 56 }}>
            Growth was organic. No marketing campaign. No mandatory adoption. The practice expanded the system's role because it worked. Patients called back because they got through.
          </p>

          {/* WHAT WE BUILT */}
          <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 24 }}>What We Deployed in 60 Days</h2>
          <div className="cs-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 56 }}>
            {[
              { name: 'AI Voice Receptionist', desc: 'Answers every call in under 2 seconds. English and Spanish. 24/7. Schedules, reschedules, routes emergencies, answers questions. No menu tree. Natural conversation.' },
              { name: 'Passwordless Patient Portal', desc: 'Phone number + birthday. 80% adoption week one. Appointments, provider status, telehealth one-tap, AI chat. Works on any phone. No app download.' },
              { name: 'Unified CRM', desc: 'Every call, appointment, patient record, and communication in one system. No more copying data between tools. Staff sees the full picture instantly.' },
              { name: 'HIPAA Infrastructure', desc: 'Row-level security. Audit logging. Encryption at rest. Business Associate Agreement. Built for healthcare from day one, not bolted on.' },
              { name: 'Multi-Provider Scheduling', desc: 'Provider calendars, availability detection, recurring appointments. The voice agent and portal both read from the same real-time source.' },
              { name: 'Production Monitoring', desc: '24 autonomous triggers watching system health. Alerts within 60 seconds of any failure. Daily operations digest every morning.' },
            ].map((item) => (
              <div key={item.name} style={{ background: C.bgElev, border: `1px solid ${C.border}`, borderRadius: 10, padding: '24px' }}>
                <div style={{ fontSize: 16, fontWeight: 700, color: C.text, marginBottom: 8 }}>{item.name}</div>
                <div style={{ fontSize: 15, lineHeight: 1.6, color: C.text2 }}>{item.desc}</div>
              </div>
            ))}
          </div>

          {/* THE HUMAN STORY */}
          <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 16 }}>The Part That Matters</h2>
          <div style={{ fontSize: 18, lineHeight: 1.75, color: C.text2, marginBottom: 20 }}>
            <p style={{ marginBottom: 18 }}>
              The staff stopped quitting. Medical assistants went back to clinical work — intake, charts, supporting providers — instead of answering the same five phone questions forty times a day. A $47/hour nurse was no longer doing a $17/hour job.
            </p>
            <p style={{ marginBottom: 18 }}>
              The owner took a Saturday off for the first time in two years. Not because he delegated. Because the system handled it. The phones were answered. The patients were served. The operation ran. And he was not there.
            </p>
            <p style={{ marginBottom: 18 }}>
              A Spanish-speaking mother scheduled her son's psychiatry appointment at 11 PM on a weeknight. No translator needed. No callback required. No waiting until business hours.
            </p>
            <p style={{ marginBottom: 18 }}>
              A patient in crisis at 2 AM called and got through. Not to voicemail. Not to a recording. To a system that understood what they needed and connected them to help.
            </p>
            <p style={{ marginBottom: 0, color: C.text, fontWeight: 600 }}>
              These are not metrics on a dashboard. These are the reasons the system exists.
            </p>
          </div>

          {/* ECONOMICS */}
          <div style={{ background: C.bgElev2, border: `1px solid ${C.border}`, borderRadius: 12, padding: '32px', marginTop: 48, marginBottom: 48 }}>
            <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 20 }}>The Economics</h2>
            <div className="cs-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, marginBottom: 20 }}>
              <div>
                <div style={{ fontSize: 13, color: C.muted }}>Monthly savings</div>
                <div style={{ fontSize: 28, fontWeight: 700, color: C.green }}>$2,401</div>
                <div style={{ fontSize: 13, color: C.text2 }}>$3,200 → $799/month</div>
              </div>
              <div>
                <div style={{ fontSize: 13, color: C.muted }}>Annual savings</div>
                <div style={{ fontSize: 28, fontWeight: 700, color: C.green }}>$28,812</div>
                <div style={{ fontSize: 13, color: C.text2 }}>Tools alone. Staff time not counted.</div>
              </div>
              <div>
                <div style={{ fontSize: 13, color: C.muted }}>Revenue protected</div>
                <div style={{ fontSize: 28, fontWeight: 700, color: C.green }}>$150K+/yr</div>
                <div style={{ fontSize: 13, color: C.text2 }}>Zero missed calls × $125-500 each (HFMA)</div>
              </div>
            </div>
            <p style={{ fontSize: 15, color: C.text2, lineHeight: 1.6, margin: 0 }}>
              Built for one practice. Architected for a thousand. Same infrastructure, same codebase. At one client: $1.6M valuation from $60K seed. At a thousand clients: $9.6M ARR on architecture that was built once.
            </p>
          </div>

          {/* CTA */}
          <div style={{
            background: `${C.accent}08`,
            border: `1px solid ${C.accent}25`,
            borderRadius: 12,
            padding: '40px',
            marginBottom: 48,
          }}>
            <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 16, color: C.text }}>
              This is what production AI looks like.
            </h2>
            <p style={{ fontSize: 18, lineHeight: 1.7, color: C.text2, marginBottom: 16 }}>
              Not a pilot. Not a controlled test. Real patients, real calls, real outcomes over 90 days. We built it. We run it. We can build it for you.
            </p>
            <p style={{ fontSize: 15, lineHeight: 1.6, color: C.text2, marginBottom: 28 }}>
              We specialize in healthcare because it is the hardest vertical — strict HIPAA regulation, PHI handling, and zero tolerance for failure. If we can ship it in healthcare, we can ship it anywhere. We work across industries.
            </p>
            <div className="cs-cta-row" style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <a href="mailto:ryan@riscent.com?subject=Interested after reading the case study" style={{
                display: 'inline-block', background: C.accent, color: C.bg,
                padding: '18px 36px', borderRadius: 8, fontSize: 17, fontWeight: 700, textDecoration: 'none',
              }}>
                Talk to Ryan →
              </a>
              <a href="tel:+18882523019" style={{
                display: 'inline-block', background: 'transparent', color: C.text,
                border: `1px solid ${C.border}`, padding: '18px 36px', borderRadius: 8, fontSize: 17, fontWeight: 600, textDecoration: 'none',
              }}>
                (888) 252-3019
              </a>
            </div>
            <p style={{ fontSize: 14, color: C.muted, marginTop: 16 }}>
              I reply within 24 hours. No pitch deck. No discovery phase. Just whether I can help and what it costs.
            </p>
          </div>

          {/* AUTHOR */}
          <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 24, fontSize: 14, color: C.muted }}>
            Written by <strong style={{ color: C.text2 }}>Ryan Bolden</strong> · Founder, Riscent · 20 years in sales, engineering, and business development · <a href="mailto:ryan@riscent.com" style={{ color: C.accent, textDecoration: 'none' }}>ryan@riscent.com</a>
          </div>
        </main>
      </div>
    </>
  );
}
