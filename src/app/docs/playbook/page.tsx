import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'The Playbook — How We Help Businesses Through AI | Riscent',
  description: 'Real stats on lowering operating costs, increasing customer satisfaction, improving employee morale, and growing the bottom line through production AI systems. By Ryan Bolden.',
  keywords: ['AI consulting ROI', 'AI reduce operating costs', 'AI customer satisfaction', 'AI employee morale', 'healthcare AI ROI', 'AI business transformation'],
};

const C = {
  bg: '#0b0e14',
  bgElev: '#111521',
  border: '#1e2535',
  text: '#e6e8ed',
  text2: '#a6adbb',
  muted: '#6e7689',
  accent: '#4f8cff',
  green: '#5fd6a3',
};

const stats = [
  { num: '40%', label: 'reduction in operating costs', source: 'McKinsey Global Institute, 2025 — AI-enabled automation in professional services' },
  { num: '92%', label: 'reduction in staff phone calls', source: 'IB365 production data — Advanced Psychiatry, Q1 2026' },
  { num: '80%', label: 'patient portal adoption', source: 'IB365 production data — vs 15% industry average (KLAS Research)' },
  { num: '32×', label: 'growth in 60 days', source: 'IB365 production data — 39 to 1,245 calls/month, same staff' },
  { num: '47%', label: 'of practices say MAs are hardest to fill', source: 'MGMA, May 2025 (n=420 practice leaders)' },
  { num: '$14,200', label: 'cost to replace one medical assistant', source: 'Journal of the American Board of Family Medicine, peer-reviewed' },
  { num: '62%', label: 'of nurses report burnout symptoms', source: 'National Council of State Boards of Nursing, 2025' },
  { num: '$150K+', label: 'lost annually from missed calls', source: 'Weave Patient Communication Report, 2025' },
];

export default function PlaybookPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'The Playbook — How We Help Businesses Through AI',
    description: metadata.description,
    datePublished: '2026-04-13',
    author: { '@type': 'Person', name: 'Ryan Bolden', url: 'https://riscent.com' },
    publisher: { '@type': 'Organization', name: 'Riscent', url: 'https://riscent.com' },
  };

  return (
    <>
      <style>{`
        @media (max-width: 768px) {
          .pb-stats { grid-template-columns: 1fr !important; }
          .pb-main { padding: 48px 16px !important; }
          .pb-cta-row { flex-direction: column !important; }
          .pb-cta-row a { width: 100% !important; text-align: center !important; }
        }
      `}</style>
      <main className="pb-main" style={{ maxWidth: 740, margin: '0 auto', padding: '80px 24px' }}>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

        <Link href="/docs" style={{ color: C.muted, textDecoration: 'none', fontSize: 14, display: 'inline-block', marginBottom: 32 }}>
          ← All Insights
        </Link>

        <div style={{ fontSize: 12, fontWeight: 600, color: C.green, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 12 }}>
          The Playbook
        </div>
        <h1 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.15, marginBottom: 20 }}>
          How we help businesses through AI — and what actually changes.
        </h1>
        <p style={{ fontSize: 19, lineHeight: 1.6, color: C.text2, marginBottom: 48, paddingBottom: 32, borderBottom: `1px solid ${C.border}` }}>
          Not theory. Not projections. Real numbers from real businesses that implemented production AI systems. Here is what changes when AI stops being a slide deck and starts being infrastructure.
        </p>

        {/* THE NUMBERS */}
        <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 24, color: C.text }}>The numbers that matter</h2>
        <div className="pb-stats" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 48 }}>
          {stats.map((s) => (
            <div key={s.label} style={{ background: C.bgElev, border: `1px solid ${C.border}`, borderRadius: 10, padding: '24px' }}>
              <div style={{ fontSize: 36, fontWeight: 700, color: C.green, lineHeight: 1, marginBottom: 8 }}>{s.num}</div>
              <div style={{ fontSize: 16, color: C.text, fontWeight: 600, marginBottom: 6 }}>{s.label}</div>
              <div style={{ fontSize: 13, color: C.muted, lineHeight: 1.4 }}>{s.source}</div>
            </div>
          ))}
        </div>

        {/* OPERATING COSTS */}
        <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 14, color: C.text }}>Operating costs go down. Not incrementally — structurally.</h2>
        <p style={{ fontSize: 17, lineHeight: 1.75, color: C.text2, marginBottom: 16 }}>
          The average medical practice spends 60% of revenue on operations. Receptionist turnover alone costs $14,200 per replacement — and 47% of practice leaders say medical assistants are the single hardest role to fill (MGMA, 2025). A practice losing one MA per quarter is burning $57,000 a year just on recruitment and training for the same position.
        </p>
        <p style={{ fontSize: 17, lineHeight: 1.75, color: C.text2, marginBottom: 40 }}>
          When AI handles the phone calls, the scheduling, and the routine patient questions — staff stops burning out on repetitive tasks. They stay longer because they are doing clinical work instead of answering "what time is my appointment" forty times a day. One practice we work with saw their entire receptionist turnover problem disappear within 60 days of deployment. Not because they hired better people. Because the job became one worth staying in.
        </p>

        {/* CUSTOMER SATISFACTION */}
        <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 14, color: C.text }}>Customer satisfaction increases because access increases.</h2>
        <p style={{ fontSize: 17, lineHeight: 1.75, color: C.text2, marginBottom: 16 }}>
          82% of patients give a provider one or two chances before switching (Tebra, 2025). 62% who hit voicemail after hours never call back (PatientBond, 2025). 41% have already switched providers because the office was too hard to reach by phone (Accenture, 2024). The number one driver of patient satisfaction is not bedside manner — it is access. Can I reach my doctor when I need to?
        </p>
        <p style={{ fontSize: 17, lineHeight: 1.75, color: C.text2, marginBottom: 40 }}>
          When every call is answered in two seconds — in two languages, 24 hours a day — satisfaction is not a strategy. It is a structural outcome. When patients can check their appointments, see their provider's status, and chat with an AI assistant at 11 PM without calling anyone — they do not switch providers. They recommend you. Our production system achieved 80% patient portal adoption in week one. The industry average is 15%. That gap is not marketing. That is architecture.
        </p>

        {/* EMPLOYEE MORALE */}
        <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 14, color: C.text }}>Employee morale recovers when the right work goes to the right layer.</h2>
        <p style={{ fontSize: 17, lineHeight: 1.75, color: C.text2, marginBottom: 16 }}>
          62% of nurses report burnout symptoms — a 28% increase since 2021 (NCSBN, 2025). The primary driver is not clinical complexity. It is administrative burden. Nurses spend 41% of their shift on documentation and administrative tasks (HIMSS, 2025). A $47/hour RN answering phones is doing a $17/hour job — not because anyone wants that, but because there is no one else to do it.
        </p>
        <p style={{ fontSize: 17, lineHeight: 1.75, color: C.text2, marginBottom: 40 }}>
          AI does not replace staff. It replaces the work that staff should not be doing. When the phone stops ringing every 90 seconds, when routine questions are handled before they reach a human, when scheduling happens automatically — clinical staff does clinical work. That is not a morale initiative. That is a structural change in what the job actually involves. The practices we work with do not run "employee engagement programs." They just removed the part of the job that was driving people out.
        </p>

        {/* THE BOTTOM LINE */}
        <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 14, color: C.text }}>The bottom line is not one number. It is the compound effect.</h2>
        <p style={{ fontSize: 17, lineHeight: 1.75, color: C.text2, marginBottom: 16 }}>
          Missed calls cost $125-$200 each in primary care — $300-$500 for new patient calls (HFMA, 2025). The average multi-physician practice loses $150,000 or more annually from missed calls alone. Add the cost of staff turnover ($14,200 per MA), the cost of tools that don't integrate ($3,200/month in separate subscriptions), and the revenue lost when patients switch to the practice that answers the phone — and the true cost of not having production AI is six figures per year.
        </p>
        <p style={{ fontSize: 17, lineHeight: 1.75, color: C.text2, marginBottom: 48 }}>
          We replaced $3,200/month in fragmented tools with one platform at $799/month. We eliminated 100% of missed calls. We achieved 80% patient portal adoption where the industry gets 15%. We restored staff retention. We gave the owner their weekends back. The ROI is not a calculation. It is observable in the practice within 60 days. That is what production AI looks like when it is built by someone who has done it before.
        </p>

        {/* THE CLOSE */}
        <div style={{
          background: `${C.accent}08`,
          border: `1px solid ${C.accent}25`,
          borderRadius: 12,
          padding: '40px',
          marginBottom: 48,
        }}>
          <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 16, color: C.text }}>
            We are the only team that has built, deployed, and proven this.
          </h2>
          <p style={{ fontSize: 18, lineHeight: 1.7, color: C.text2, marginBottom: 16 }}>
            Not a pilot. Not a proof of concept. A $1.6 million production platform serving real patients, handling real calls, running real operations — built by one person with an AI team in 12 months from a $60,000 seed investment. At one thousand clients, the same architecture scales to $50 million.
          </p>
          <p style={{ fontSize: 18, lineHeight: 1.7, color: C.text, fontWeight: 600, marginBottom: 16 }}>
            If your business is spending six figures a year on problems that production AI solves in 60 days — we should talk. Not about what AI could do. About what it already did.
          </p>
          <p style={{ fontSize: 16, lineHeight: 1.65, color: C.text2, marginBottom: 28 }}>
            We specialize in healthcare because it is the most regulated, most complex vertical for AI — HIPAA, PHI, BAA chains, and zero margin for error. If we can build production AI for healthcare, we can build it for any industry. Legal, financial services, professional services, home services — the architecture scales. The compliance discipline transfers. We work across verticals.
          </p>
          <div className="pb-cta-row" style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <a href="mailto:ryan@riscent.com?subject=Interested in AI consultation" style={{
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
            I reply within 24 hours. No pitch deck. No discovery phase. No per-hour billing. Just whether I can help and what it costs.
          </p>
        </div>

        {/* Author */}
        <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 24, fontSize: 14, color: C.muted }}>
          Written by <strong style={{ color: C.text2 }}>Ryan Bolden</strong> · Founder, Riscent · 20 years in sales, engineering, and business development · <a href="mailto:ryan@riscent.com" style={{ color: C.accent, textDecoration: 'none' }}>ryan@riscent.com</a>
        </div>
      </main>
    </>
  );
}
