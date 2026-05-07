'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const c = {
  bg: '#F8F9FC',
  white: '#FFFFFF',
  black: '#0F1117',
  text: '#374151',
  muted: '#9CA3AF',
  border: '#E5E7EB',
  accent: '#FF7A00',
  accentL: '#FFF3E8',
}

const FAILURES = [
  { tool: 'get_services', calls: 558, cost: '$2,100', cause: 'Assumed service record existed and was active. It wasn\'t.' },
  { tool: 'create_appointment', calls: 197, cost: '$740', cause: 'Passed service name instead of UUID. Exact match failed on case differences.' },
  { tool: 'transfer_to_number', calls: 89, cost: '$335', cause: 'Backend function didn\'t exist. Every call returned "Unknown tool."' },
  { tool: 'create_note', calls: 156, cost: '$585', cause: 'Default value violated database CHECK constraint. Silent failure.' },
]

export default function GroundworkPage() {
  const router = useRouter()
  const [selected, setSelected] = useState<string | null>(null)

  return (
    <div style={{ minHeight: '100vh', background: c.bg, fontFamily: 'var(--font-geist-sans)' }}>
      {/* Nav */}
      <nav style={{
        borderBottom: `1px solid ${c.border}`,
        background: c.white,
        padding: '0 32px',
        height: 56,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <a href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 15, fontWeight: 700, color: c.black, letterSpacing: '-0.02em' }}>Riscent</span>
          <span style={{ color: c.border }}>·</span>
          <span style={{ fontSize: 14, fontWeight: 600, color: c.accent }}>Groundwork</span>
        </a>
        <a
          href="/groundwork/studio"
          style={{
            fontSize: 13,
            color: c.muted,
            textDecoration: 'none',
            padding: '6px 12px',
            border: `1px solid ${c.border}`,
            borderRadius: 6,
          }}
        >
          Skip to Studio →
        </a>
      </nav>

      {/* Hero */}
      <div style={{ maxWidth: 740, margin: '0 auto', padding: '80px 32px 40px' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          background: c.accentL,
          border: `1px solid ${c.accent}22`,
          borderRadius: 100,
          padding: '4px 12px',
          marginBottom: 24,
          fontSize: 11,
          fontWeight: 600,
          color: c.accent,
          letterSpacing: '0.06em',
          textTransform: 'uppercase' as const,
        }}>
          ◈ System Design Studio
        </div>

        <h1 style={{
          fontSize: 'clamp(32px, 5vw, 52px)',
          fontWeight: 800,
          lineHeight: 1.1,
          letterSpacing: '-0.03em',
          color: c.black,
          margin: '0 0 20px',
        }}>
          Build systems right<br />the first time.
        </h1>

        <p style={{ fontSize: 17, color: c.text, lineHeight: 1.65, margin: '0 0 32px', maxWidth: 560 }}>
          An interview that extracts what&apos;s in your head — actors, triggers, decisions,
          error states, monitoring specs — and turns it into documentation any engineer
          or AI can build from without follow-up questions.
        </p>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' as const }}>
          {['20 questions', 'Live visual canvas', 'AI Build Spec output', 'Free to start'].map(tag => (
            <span key={tag} style={{
              fontSize: 12,
              color: c.muted,
              background: c.white,
              border: `1px solid ${c.border}`,
              borderRadius: 100,
              padding: '4px 10px',
            }}>{tag}</span>
          ))}
        </div>
      </div>

      {/* System type selector */}
      <div style={{ maxWidth: 740, margin: '0 auto', padding: '0 32px 40px' }}>
        <p style={{ fontSize: 13, fontWeight: 600, color: c.muted, letterSpacing: '0.08em', textTransform: 'uppercase' as const, marginBottom: 16 }}>
          Choose a system to map
        </p>

        <div style={{ display: 'grid', gap: 12 }}>
          {[
            {
              id: 'voice_phone',
              label: 'Voice / Phone System',
              desc: 'Call routing, voice agents, IVR, after-hours handling',
              available: true,
              badge: 'Available',
            },
            {
              id: 'client_intake',
              label: 'Client Intake Flow',
              desc: 'Onboarding, forms, identity verification, welcome sequences',
              available: false,
              badge: 'Coming Soon',
            },
            {
              id: 'scheduling',
              label: 'Appointment Scheduling',
              desc: 'Booking, availability, confirmations, rescheduling',
              available: false,
              badge: 'Coming Soon',
            },
            {
              id: 'billing',
              label: 'Billing & Payments',
              desc: 'Invoicing, payment processing, dunning, reconciliation',
              available: false,
              badge: 'Coming Soon',
            },
          ].map(s => (
            <button
              key={s.id}
              onClick={() => s.available && setSelected(s.id)}
              disabled={!s.available}
              style={{
                background: selected === s.id ? c.accentL : c.white,
                border: `1.5px solid ${selected === s.id ? c.accent : c.border}`,
                borderRadius: 10,
                padding: '16px 20px',
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                cursor: s.available ? 'pointer' : 'not-allowed',
                opacity: s.available ? 1 : 0.5,
                textAlign: 'left' as const,
                transition: 'border-color 0.15s, background 0.15s',
              }}
            >
              <div style={{
                width: 20,
                height: 20,
                borderRadius: '50%',
                border: `2px solid ${selected === s.id ? c.accent : c.border}`,
                background: selected === s.id ? c.accent : 'transparent',
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                {selected === s.id && <div style={{ width: 8, height: 8, borderRadius: '50%', background: c.white }} />}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: c.black, marginBottom: 2 }}>{s.label}</div>
                <div style={{ fontSize: 12, color: c.muted }}>{s.desc}</div>
              </div>
              <span style={{
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: '0.06em',
                textTransform: 'uppercase' as const,
                color: s.available ? c.accent : c.muted,
                background: s.available ? c.accentL : '#F3F4F6',
                padding: '3px 8px',
                borderRadius: 100,
                flexShrink: 0,
              }}>{s.badge}</span>
            </button>
          ))}
        </div>

        <button
          onClick={() => selected && router.push('/groundwork/studio')}
          disabled={!selected}
          style={{
            marginTop: 24,
            width: '100%',
            padding: '14px 24px',
            background: selected ? c.accent : c.border,
            color: selected ? c.white : c.muted,
            border: 'none',
            borderRadius: 10,
            fontSize: 15,
            fontWeight: 700,
            cursor: selected ? 'pointer' : 'not-allowed',
            transition: 'background 0.15s',
            letterSpacing: '-0.01em',
          }}
        >
          Start Building →
        </button>
      </div>

      {/* Failure callout */}
      <div style={{ maxWidth: 740, margin: '0 auto', padding: '0 32px 80px' }}>
        <div style={{
          background: c.white,
          border: `1px solid ${c.border}`,
          borderRadius: 12,
          padding: '24px',
          borderLeft: `4px solid ${c.accent}`,
        }}>
          <p style={{ fontSize: 13, fontWeight: 700, color: c.black, margin: '0 0 4px' }}>
            Why this exists
          </p>
          <p style={{ fontSize: 13, color: c.text, lineHeight: 1.6, margin: '0 0 20px' }}>
            These are four real production failures from a single voice agent system —
            all discovered after deployment, all preventable with one hour of upfront system design.
          </p>
          <div style={{ display: 'grid', gap: 8 }}>
            {FAILURES.map(f => (
              <div key={f.tool} style={{
                display: 'flex',
                gap: 16,
                padding: '10px 12px',
                background: '#FEF2F2',
                borderRadius: 8,
                alignItems: 'flex-start',
              }}>
                <div style={{ fontFamily: 'var(--font-geist-mono)', fontSize: 11, color: '#991B1B', fontWeight: 600, flexShrink: 0, paddingTop: 1 }}>
                  {f.calls} calls
                </div>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: '#1F2937', marginBottom: 1 }}>{f.tool}</div>
                  <div style={{ fontSize: 11, color: '#6B7280', lineHeight: 1.4 }}>{f.cause}</div>
                </div>
                <div style={{ marginLeft: 'auto', fontSize: 12, fontWeight: 700, color: '#EF4444', flexShrink: 0 }}>{f.cost}</div>
              </div>
            ))}
          </div>
          <p style={{ fontSize: 11, color: c.muted, margin: '16px 0 0', textAlign: 'right' as const }}>
            Total: $3,760 in direct booking losses + 40+ hours of debugging
          </p>
        </div>
      </div>
    </div>
  )
}
