'use client';

/**
 * Riscent Landing Page — v3
 *
 * Structural rewrite for Dr. Raj primary avatar (stuck healthtech founder).
 * Dark mode aesthetic. Code visible. Failure-mode list up front.
 * No breathing animations. No sage palette. No warm trust-building.
 *
 * Register: Ryan's Sales DNA (co-conspirator + specificity + inevitability).
 * Voice source: ~/.claude/projects/-Users-riscentrdb-nous/memory/project_ryan_sales_dna.md
 * System source: ~/Desktop/IB365_DOCS/direction/VOICE_AND_VISUAL_SYSTEM.md
 * Avatars: ~/Desktop/IB365_DOCS/direction/RISCENT_AVATARS.md
 */

import { useRouter } from 'next/navigation';
import { useVisitor } from '@/hooks/useVisitor';

// Dark-mode palette for technical buyers.
// Dr. Raj reads at night. Marcus reads on a laptop in an office.
// Both tolerate dark; neither tolerates decorative pastels.
const colors = {
  bg: '#0b0e14',
  bgElev: '#111521',
  bgElev2: '#161b29',
  border: '#1e2535',
  borderAccent: '#2a3347',
  textPrimary: '#e6e8ed',
  textSecondary: '#a6adbb',
  textMuted: '#6e7689',
  accent: '#4f8cff',      // electric blue — code link, CTA
  accentDim: '#3a6dcc',
  accent2: '#5fd6a3',     // green — proof/verified
  warn: '#f0b45b',        // amber — the failure-mode warnings
  code: '#f2f5ff',
};

const failureModes = [
  {
    bug: 'Voice agent hallucinates on hyphenated last names',
    fix: 'Deterministic name-parser layer in front of the LLM. Never fixed by prompt-engineering alone.',
  },
  {
    bug: 'Session state poisoned across tenants',
    fix: 'Per-request SQLAlchemy session scoping. Missing NOT NULL columns silently corrupt the shared session. I have the scar tissue.',
  },
  {
    bug: 'Tool-call schemas fail because the LLM returns wrong types',
    fix: 'Strict JSON-schema validation + retry-with-correction loop. Keep tool params to ≤4 strings. No enums, no booleans.',
  },
  {
    bug: 'HIPAA is "we signed a BAA with OpenAI"',
    fix: 'That is not HIPAA. You need row-level security, audit logs, encryption at rest, a real BAA chain, and a minimum-necessary data flow. I\'ve built it.',
  },
  {
    bug: 'EHR integration assumed FHIR would just work',
    fix: 'It doesn\'t. Most real integrations are HL7 v2 over SFTP with a quarterly phone call to the vendor\'s integration team. I\'ve built this plumbing for Tebra, Elation, and custom EHRs.',
  },
  {
    bug: 'ElevenLabs headers contain nullable dynamic variables',
    fix: 'That crashes production the first time a variable is missing. Move them to the body payload. Kept one production outage going for 3 hours once. Never again.',
  },
];

const engagements = [
  {
    name: 'Strategic Deep Dive',
    price: '$7,500',
    duration: '1 week',
    what: 'I embed with you and the team. End of week: a written diagnostic — what\'s broken, what to ship next, what to kill — plus a working proof-of-concept for the critical piece. Fixed fee. No scope creep.',
    who: 'Founders who need clarity fast. Investor demo in 3 weeks.',
  },
  {
    name: 'Build + Transfer',
    price: '$15K – $150K',
    duration: '2 – 12 weeks',
    what: 'I build the working production system, transfer the code to your team on day 30, stay on-call for 30 more days. You own the repo. Fixed scope. One invoice.',
    who: 'Teams with a clear mandate who need to ship, not strategize.',
  },
  {
    name: 'Embedded Advisory',
    price: '$5K – $15K / mo',
    duration: 'Ongoing',
    what: 'Fractional technical leadership. Architecture reviews, specs, hiring, pair-coding, Slack Connect. 10 – 20 hrs/week.',
    who: 'Funded startups without a technical co-founder yet.',
  },
];

export default function LandingPage() {
  const router = useRouter();
  const { trackEvent } = useVisitor();

  const handleCTA = (which: string) => {
    trackEvent('curtain_peek', { which });
    // For now, route to the existing behind-the-curtain flow; Praxis can wire up a
    // contact/Slack flow later.
    setTimeout(() => router.push('/behind-the-curtain'), 100);
  };

  return (
    <main
      style={{
        backgroundColor: colors.bg,
        color: colors.textPrimary,
        minHeight: '100vh',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "SF Pro Text", Inter, sans-serif',
        fontSize: '16px',
        lineHeight: 1.6,
      }}
    >
      {/* TOP BAR — minimal, phone visible */}
      <header
        style={{
          borderBottom: `1px solid ${colors.border}`,
          padding: '16px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          maxWidth: 1180,
          margin: '0 auto',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              background: colors.accent2,
              boxShadow: `0 0 12px ${colors.accent2}80`,
            }}
          />
          <span style={{ fontWeight: 700, letterSpacing: '-0.01em', fontSize: 16 }}>
            RISCENT
          </span>
          <span style={{ color: colors.textMuted, fontSize: 13, marginLeft: 4 }}>
            / AI consulting — healthcare first
          </span>
        </div>
        <a
          href="mailto:ryan@riscent.com"
          style={{
            color: colors.textSecondary,
            textDecoration: 'none',
            fontSize: 14,
            fontWeight: 500,
          }}
        >
          ryan@riscent.com
        </a>
      </header>

      {/* HERO — Dr. Raj opens here */}
      <section
        style={{
          maxWidth: 1180,
          margin: '0 auto',
          padding: '72px 24px 56px',
        }}
      >
        <div
          style={{
            display: 'inline-block',
            padding: '6px 12px',
            borderRadius: 6,
            background: `${colors.accent}14`,
            border: `1px solid ${colors.accent}33`,
            color: colors.accent,
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            marginBottom: 24,
          }}
        >
          Shipped, not pitched.
        </div>

        <h1
          style={{
            fontSize: 'clamp(34px, 5vw, 56px)',
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
            fontWeight: 700,
            marginBottom: 24,
            maxWidth: 920,
          }}
        >
          Your AI works in the demo.
          <br />
          <span style={{ color: colors.textMuted }}>It won&apos;t survive production.</span>
          <br />
          I shipped one of the hardest ones.
        </h1>

        <p
          style={{
            fontSize: 19,
            lineHeight: 1.55,
            color: colors.textSecondary,
            maxWidth: 760,
            marginBottom: 36,
          }}
        >
          Let&apos;s be honest — <strong style={{ color: colors.textPrimary }}>if everything was working you wouldn&apos;t be on this page.</strong>{' '}
          88% of AI proofs-of-concept never reach production.{' '}
          <a
            href="https://www.healthtechdigital.com/the-ai-implementation-gap-why-80-of-healthcare-ai-projects-fail-to-scale-beyond-pilot-phase/"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: colors.textMuted, textDecoration: 'underline' }}
          >
            In healthcare, 80% never scale past pilot.
          </a>{' '}
          I built a HIPAA-compliant voice receptionist + patient portal + multi-tenant CRM{' '}
          <strong style={{ color: colors.textPrimary }}>solo, in five months, for under $10,000</strong>.
          It runs in production today. First customer has handled{' '}
          <strong style={{ color: colors.accent2 }}>1,710 calls with zero missed</strong> in 60 days.
          English and Spanish. 24/7.
        </p>

        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 48 }}>
          <button
            onClick={() => handleCTA('primary')}
            style={{
              background: colors.accent,
              color: colors.bg,
              border: 'none',
              padding: '14px 22px',
              borderRadius: 8,
              fontSize: 15,
              fontWeight: 600,
              cursor: 'pointer',
              letterSpacing: '-0.01em',
            }}
          >
            Scope a project →
          </button>
          <a
            href="mailto:ryan@riscent.com?subject=Quick%20question"
            style={{
              background: 'transparent',
              color: colors.textPrimary,
              border: `1px solid ${colors.border}`,
              padding: '14px 22px',
              borderRadius: 8,
              fontSize: 15,
              fontWeight: 600,
              textDecoration: 'none',
              letterSpacing: '-0.01em',
            }}
          >
            Shoot an email
          </a>
          <button
            onClick={() => handleCTA('code')}
            style={{
              background: 'transparent',
              color: colors.textMuted,
              border: `1px solid ${colors.border}`,
              padding: '14px 22px',
              borderRadius: 8,
              fontSize: 15,
              fontWeight: 500,
              cursor: 'pointer',
              letterSpacing: '-0.01em',
            }}
          >
            See the code
          </button>
        </div>

        {/* Code block — the trust anchor Dr. Raj needs in the first fold */}
        <div
          style={{
            background: colors.bgElev,
            border: `1px solid ${colors.border}`,
            borderRadius: 12,
            overflow: 'hidden',
            maxWidth: 920,
          }}
        >
          <div
            style={{
              display: 'flex',
              gap: 6,
              padding: '12px 16px',
              borderBottom: `1px solid ${colors.border}`,
              background: colors.bgElev2,
              alignItems: 'center',
            }}
          >
            <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ff5f56' }} />
            <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ffbd2e' }} />
            <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#27c93f' }} />
            <span
              style={{
                marginLeft: 12,
                fontSize: 12,
                color: colors.textMuted,
                fontFamily: 'ui-monospace, "SF Mono", Consolas, monospace',
              }}
            >
              crm-block-theory/backend/blocks/elevenlabs/block.py
            </span>
          </div>
          <pre
            style={{
              margin: 0,
              padding: '20px 24px',
              fontFamily: 'ui-monospace, "SF Mono", Consolas, monospace',
              fontSize: 13,
              lineHeight: 1.65,
              color: colors.code,
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
            }}
          >
{`# Aveena — the voice agent that runs in production
async def handle_incoming_call(call: IncomingCall) -> CallOutcome:
    tenant = await get_tenant_by_dnis(call.to)         # multi-tenant lookup
    ctx = await load_tenant_context(tenant.id)         # RLS, BAA, audit
    if is_emergency(call.transcript):
        return await transfer_to_oncall(tenant)        # humans stay in the loop
    intent = await classify_intent(call, ctx)          # deterministic > vibes
    handler = INTENT_HANDLERS[intent]                  # strict tool schemas
    result = await handler.execute(call, ctx)          # fact-check critic wraps this
    await log_hipaa_audit(tenant, call, result)        # every action, every tenant
    return result

# 415 routes. 700K lines. Solo. 5 months. <$10K.
# That is not a pitch. That is the repo.`}
          </pre>
        </div>
      </section>

      {/* FAILURE MODES — the specificity move */}
      <section
        style={{
          maxWidth: 1180,
          margin: '0 auto',
          padding: '56px 24px',
          borderTop: `1px solid ${colors.border}`,
        }}
      >
        <div style={{ marginBottom: 40, maxWidth: 720 }}>
          <div
            style={{
              color: colors.warn,
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              marginBottom: 10,
            }}
          >
            You and I both know what&apos;s actually broken
          </div>
          <h2
            style={{
              fontSize: 'clamp(26px, 3.5vw, 36px)',
              lineHeight: 1.15,
              letterSpacing: '-0.015em',
              fontWeight: 700,
              marginBottom: 14,
            }}
          >
            I&apos;ve shipped the fix for the thing you haven&apos;t described yet.
          </h2>
          <p
            style={{
              fontSize: 17,
              lineHeight: 1.6,
              color: colors.textSecondary,
            }}
          >
            If you recognize any of these, we should talk. If you recognize more than two, we
            should talk today.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: 16,
          }}
        >
          {failureModes.map((fm) => (
            <div
              key={fm.bug}
              style={{
                background: colors.bgElev,
                border: `1px solid ${colors.border}`,
                borderLeft: `3px solid ${colors.warn}`,
                borderRadius: 8,
                padding: '18px 20px',
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  color: colors.warn,
                  marginBottom: 8,
                }}
              >
                Bug in production
              </div>
              <div
                style={{
                  fontSize: 15,
                  fontWeight: 600,
                  lineHeight: 1.4,
                  color: colors.textPrimary,
                  marginBottom: 10,
                }}
              >
                {fm.bug}
              </div>
              <div
                style={{
                  fontSize: 13,
                  lineHeight: 1.55,
                  color: colors.textSecondary,
                }}
              >
                <span style={{ color: colors.accent2, fontWeight: 600 }}>FIX: </span>
                {fm.fix}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CASE STUDY — Advanced Psychiatry */}
      <section
        style={{
          maxWidth: 1180,
          margin: '0 auto',
          padding: '56px 24px',
          borderTop: `1px solid ${colors.border}`,
        }}
      >
        <div
          style={{
            color: colors.textMuted,
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            marginBottom: 12,
          }}
        >
          The proof, not the deck
        </div>
        <h2
          style={{
            fontSize: 'clamp(26px, 3.5vw, 36px)',
            lineHeight: 1.15,
            letterSpacing: '-0.015em',
            fontWeight: 700,
            marginBottom: 28,
            maxWidth: 860,
          }}
        >
          1,710 calls. Zero missed. 32x growth. 60 days.
        </h2>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 16,
            marginBottom: 28,
          }}
        >
          {[
            { big: '1,710', small: 'calls handled' },
            { big: '0', small: 'missed' },
            { big: '32×', small: 'growth (2 months)' },
            { big: '80%', small: 'portal adoption (industry: 15%)' },
          ].map((stat) => (
            <div
              key={stat.small}
              style={{
                background: colors.bgElev,
                border: `1px solid ${colors.border}`,
                borderRadius: 10,
                padding: '20px 22px',
              }}
            >
              <div
                style={{
                  fontSize: 36,
                  fontWeight: 700,
                  color: colors.accent2,
                  letterSpacing: '-0.02em',
                  lineHeight: 1,
                  marginBottom: 6,
                }}
              >
                {stat.big}
              </div>
              <div style={{ fontSize: 13, color: colors.textSecondary }}>{stat.small}</div>
            </div>
          ))}
        </div>

        <p style={{ color: colors.textSecondary, fontSize: 15, maxWidth: 780 }}>
          Advanced Psychiatry, Las Vegas. 5 providers. Before us: a human receptionist, an
          answering service, a patient portal nobody used, a scheduling tool that didn&apos;t talk
          to anything, and an EHR that swallowed data and returned nothing. In 60 days I
          shipped a voice receptionist in two languages, a passwordless patient portal, a
          multi-tenant CRM tying calls/appointments/provider-status together, and
          HIPAA-compliant infrastructure with BAA. Staff stopped quitting. Owner stopped
          working Saturdays.
        </p>
      </section>

      {/* ENGAGEMENT TIERS */}
      <section
        style={{
          maxWidth: 1180,
          margin: '0 auto',
          padding: '56px 24px',
          borderTop: `1px solid ${colors.border}`,
        }}
      >
        <div
          style={{
            color: colors.textMuted,
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            marginBottom: 12,
          }}
        >
          Three ways to work with me
        </div>
        <h2
          style={{
            fontSize: 'clamp(26px, 3.5vw, 36px)',
            lineHeight: 1.15,
            letterSpacing: '-0.015em',
            fontWeight: 700,
            marginBottom: 32,
            maxWidth: 720,
          }}
        >
          Fixed scope. Fixed price. You own everything on day 30.
        </h2>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: 18,
          }}
        >
          {engagements.map((e) => (
            <div
              key={e.name}
              style={{
                background: colors.bgElev,
                border: `1px solid ${colors.border}`,
                borderRadius: 10,
                padding: '24px',
              }}
            >
              <div
                style={{
                  fontSize: 12,
                  color: colors.textMuted,
                  fontWeight: 600,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  marginBottom: 8,
                }}
              >
                {e.duration}
              </div>
              <div
                style={{
                  fontSize: 20,
                  fontWeight: 700,
                  color: colors.textPrimary,
                  marginBottom: 6,
                }}
              >
                {e.name}
              </div>
              <div
                style={{
                  fontSize: 24,
                  fontWeight: 700,
                  color: colors.accent,
                  marginBottom: 14,
                  letterSpacing: '-0.01em',
                }}
              >
                {e.price}
              </div>
              <div
                style={{
                  fontSize: 14,
                  lineHeight: 1.55,
                  color: colors.textSecondary,
                  marginBottom: 14,
                }}
              >
                {e.what}
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: colors.textMuted,
                  paddingTop: 14,
                  borderTop: `1px solid ${colors.border}`,
                }}
              >
                <strong style={{ color: colors.textSecondary }}>Who it&apos;s for: </strong>
                {e.who}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* WHAT I DON'T DO — the transparency layer */}
      <section
        style={{
          maxWidth: 1180,
          margin: '0 auto',
          padding: '56px 24px',
          borderTop: `1px solid ${colors.border}`,
        }}
      >
        <div
          style={{
            color: colors.textMuted,
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            marginBottom: 12,
          }}
        >
          What I don&apos;t do
        </div>
        <h2
          style={{
            fontSize: 'clamp(24px, 3vw, 32px)',
            lineHeight: 1.2,
            letterSpacing: '-0.01em',
            fontWeight: 700,
            marginBottom: 20,
            maxWidth: 760,
          }}
        >
          I know you understand this — but I want to be clear.
        </h2>
        <ul
          style={{
            listStyle: 'none',
            padding: 0,
            margin: 0,
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: 12,
            color: colors.textSecondary,
            fontSize: 15,
            lineHeight: 1.6,
          }}
        >
          {[
            'AI strategy decks',
            'Zapier integrations',
            '"AI readiness assessments"',
            'Four-workshop discovery phases',
            'Retainers without deliverables',
            'Projects where nobody on your side can explain what winning looks like',
            'Per-hour billing',
            'Open-ended contracts',
            'Subcontracting to juniors',
          ].map((item) => (
            <li
              key={item}
              style={{
                background: colors.bgElev,
                border: `1px solid ${colors.border}`,
                borderRadius: 6,
                padding: '14px 16px',
              }}
            >
              <span style={{ color: colors.warn, marginRight: 8 }}>✗</span>
              {item}
            </li>
          ))}
        </ul>
        <p
          style={{
            fontSize: 14,
            color: colors.textMuted,
            marginTop: 20,
            maxWidth: 720,
            fontStyle: 'italic',
          }}
        >
          If you&apos;re looking for any of those, there are good firms that do them. I&apos;m
          not those firms. I&apos;m the person you call when you need something shipped.
        </p>
      </section>

      {/* INEVITABILITY CLOSE */}
      <section
        style={{
          maxWidth: 1180,
          margin: '0 auto',
          padding: '72px 24px',
          borderTop: `1px solid ${colors.border}`,
        }}
      >
        <div style={{ maxWidth: 800 }}>
          <div
            style={{
              color: colors.accent,
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              marginBottom: 12,
            }}
          >
            The new expectation
          </div>
          <h2
            style={{
              fontSize: 'clamp(26px, 3.5vw, 36px)',
              lineHeight: 1.2,
              letterSpacing: '-0.015em',
              fontWeight: 700,
              marginBottom: 20,
            }}
          >
            The internet wasn&apos;t always around either.
          </h2>
          <p
            style={{
              fontSize: 17,
              lineHeight: 1.65,
              color: colors.textSecondary,
              marginBottom: 18,
            }}
          >
            It wasn&apos;t that long ago people were afraid to bank online. Now a bank that
            doesn&apos;t offer mobile deposit feels broken. Amazon didn&apos;t sell anyone a
            feature — they convinced all of us we deserved free two-day shipping. Today, you
            can feel it when a store doesn&apos;t have it.
          </p>
          <p
            style={{
              fontSize: 17,
              lineHeight: 1.65,
              color: colors.textPrimary,
              fontWeight: 600,
              marginBottom: 28,
            }}
          >
            Healthcare AI is at that inflection point right now. Your patients already expect
            a call picked up in two seconds, a portal that opens on their phone at 11 PM, a
            scheduling system that knows what time their kid&apos;s next appointment is. They
            will get it from someone. The only question is whether that someone is you or the
            practice down the street.
          </p>

          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <button
              onClick={() => handleCTA('final')}
              style={{
                background: colors.accent,
                color: colors.bg,
                border: 'none',
                padding: '16px 26px',
                borderRadius: 8,
                fontSize: 16,
                fontWeight: 700,
                cursor: 'pointer',
                letterSpacing: '-0.01em',
              }}
            >
              Tell me what you&apos;re trying to ship →
            </button>
            <a
              href="mailto:ryan@riscent.com?subject=Quick%20question"
              style={{
                background: 'transparent',
                color: colors.textPrimary,
                border: `1px solid ${colors.border}`,
                padding: '16px 26px',
                borderRadius: 8,
                fontSize: 16,
                fontWeight: 600,
                textDecoration: 'none',
                letterSpacing: '-0.01em',
              }}
            >
              ryan@riscent.com
            </a>
          </div>
          <p
            style={{
              fontSize: 13,
              color: colors.textMuted,
              marginTop: 16,
            }}
          >
            Reply within 24 hours with two 15-minute slots. No calendly dance. No pitch deck.
            No discovery phase. Just whether I can help.
          </p>
        </div>
      </section>

      {/* FOOTER */}
      <footer
        style={{
          borderTop: `1px solid ${colors.border}`,
          padding: '28px 24px',
          maxWidth: 1180,
          margin: '0 auto',
          color: colors.textMuted,
          fontSize: 13,
          display: 'flex',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 16,
        }}
      >
        <div>
          <div style={{ fontWeight: 700, color: colors.textSecondary, marginBottom: 4 }}>
            RISCENT / Riscen Software Labs
          </div>
          <div>
            Built with Claude · Deployed on Vercel · Hosted on Railway · Backed by Neon · Zero
            venture capital.
          </div>
        </div>
        <div style={{ display: 'flex', gap: 24 }}>
          <a href="/research" style={{ color: colors.textMuted, textDecoration: 'none' }}>
            Research
          </a>
          <a href="/thoughts" style={{ color: colors.textMuted, textDecoration: 'none' }}>
            Thoughts
          </a>
          <a
            href="https://ib365.ai"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: colors.textMuted, textDecoration: 'none' }}
          >
            IB365 (the product)
          </a>
        </div>
      </footer>
    </main>
  );
}
