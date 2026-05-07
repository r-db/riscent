'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import dynamic from 'next/dynamic'
import { Node, Edge } from '@xyflow/react'
import { VOICE_PHONE_QUESTIONS } from '@/lib/groundwork/questions'
import { mapAnswer } from '@/lib/groundwork/canvas-mapper'
import { Answer } from '@/lib/groundwork/types'

// Dynamic import to avoid SSR issues with React Flow
const Canvas = dynamic(() => import('@/components/groundwork/Canvas'), {
  ssr: false,
  loading: () => (
    <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9CA3AF', fontSize: 13 }}>
      Loading canvas...
    </div>
  ),
})

// ─────────────────────────────────────────────────────────────────────────────
// Color palette
// ─────────────────────────────────────────────────────────────────────────────

const c = {
  bg: '#F8F9FC',
  white: '#FFFFFF',
  black: '#0F1117',
  text: '#374151',
  muted: '#9CA3AF',
  mutedL: '#D1D5DB',
  border: '#E5E7EB',
  borderDark: '#D1D5DB',
  accent: '#FF7A00',
  accentL: '#FFF3E8',
  accentDark: '#E06900',
  success: '#10B981',
  canvas: '#F9FAFB',
}

// ─────────────────────────────────────────────────────────────────────────────
// Completed answer chip — shows previous answers above current question
// ─────────────────────────────────────────────────────────────────────────────

function AnswerHistory({ answers, currentQ }: { answers: Record<number, string>, currentQ: number }) {
  const recent = Object.entries(answers)
    .filter(([i]) => Number(i) < currentQ)
    .slice(-3) // show last 3

  if (!recent.length) return null

  return (
    <div style={{ marginBottom: 20 }}>
      {recent.map(([idx, val]) => {
        const q = VOICE_PHONE_QUESTIONS[Number(idx)]
        if (!q) return null
        return (
          <div key={idx} style={{ marginBottom: 10 }}>
            <div style={{ fontSize: 10, fontWeight: 600, color: c.muted, textTransform: 'uppercase' as const, letterSpacing: '0.07em', marginBottom: 3 }}>
              Q{q.number}
            </div>
            <div style={{
              fontSize: 12,
              color: c.text,
              background: c.white,
              border: `1px solid ${c.border}`,
              borderRadius: 8,
              padding: '8px 12px',
              lineHeight: 1.5,
              maxHeight: 52,
              overflow: 'hidden',
              position: 'relative' as const,
            }}>
              {val.length > 120 ? val.slice(0, 120) + '…' : val}
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Teaching panel — "Why this matters"
// ─────────────────────────────────────────────────────────────────────────────

function WhyPanel({ why, failure }: { why: string; failure?: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div style={{ marginTop: 12 }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          background: 'none',
          border: 'none',
          padding: 0,
          cursor: 'pointer',
          fontSize: 11,
          color: c.accent,
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: 4,
          fontFamily: 'var(--font-geist-sans)',
        }}
      >
        <span style={{ transform: open ? 'rotate(90deg)' : 'rotate(0)', transition: 'transform 0.15s', display: 'inline-block' }}>▶</span>
        Why this matters
      </button>
      {open && (
        <div style={{
          marginTop: 8,
          padding: '12px 14px',
          background: c.accentL,
          borderRadius: 8,
          border: `1px solid ${c.accent}22`,
        }}>
          <p style={{ margin: 0, fontSize: 12, color: c.text, lineHeight: 1.6 }}>{why}</p>
          {failure && (
            <div style={{
              marginTop: 10,
              padding: '8px 10px',
              background: '#FEF2F2',
              border: '1px solid #FECACA',
              borderRadius: 6,
            }}>
              <span style={{ fontSize: 10, fontWeight: 700, color: '#991B1B', letterSpacing: '0.06em', textTransform: 'uppercase' as const }}>
                Real failure ·{' '}
              </span>
              <span style={{ fontSize: 11, color: '#374151', lineHeight: 1.5 }}>{failure}</span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Progress dots
// ─────────────────────────────────────────────────────────────────────────────

function ProgressDots({ current, total }: { current: number; total: number }) {
  return (
    <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' as const, marginBottom: 24 }}>
      {Array.from({ length: total }, (_, i) => (
        <div
          key={i}
          style={{
            width: i === current ? 20 : 6,
            height: 6,
            borderRadius: 3,
            background: i < current ? c.accent : i === current ? c.accent : c.border,
            opacity: i > current ? 0.4 : 1,
            transition: 'width 0.2s, background 0.2s',
          }}
        />
      ))}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Spec output viewer
// ─────────────────────────────────────────────────────────────────────────────

function SpecOutput({ spec, systemName }: { spec: string; systemName: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(spec)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = () => {
    const blob = new Blob([spec], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${systemName.toLowerCase().replace(/\s+/g, '-')}-build-spec.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  // Parse sections for color-coded display
  const lines = spec.split('\n')
  const SECTION_HEADERS = new Set([
    'SYSTEM', 'VERSION', 'SUMMARY', 'ACTORS', 'TRIGGERS', 'PRECONDITIONS',
    'PRECONDITION_FAILURES', 'DECISION_GATES', 'OUTPUTS', 'ERROR_STATES',
    'DATA_COLLECTION', 'INTEGRATIONS', 'MONITORING_SPEC', 'CONSTRAINTS',
    'ESCALATION_PATH', 'TEST_CASES',
  ])

  return (
    <div style={{ maxWidth: 960, margin: '0 auto', padding: '40px 32px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: c.black, letterSpacing: '-0.02em' }}>
            AI Build Spec
          </h2>
          <p style={{ margin: '4px 0 0', fontSize: 13, color: c.muted }}>
            {systemName} · {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={handleCopy}
            style={{
              padding: '8px 16px',
              background: c.white,
              border: `1px solid ${c.border}`,
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 600,
              color: c.text,
              cursor: 'pointer',
              fontFamily: 'var(--font-geist-sans)',
            }}
          >
            {copied ? '✓ Copied' : 'Copy'}
          </button>
          <button
            onClick={handleDownload}
            style={{
              padding: '8px 16px',
              background: c.accent,
              border: 'none',
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 700,
              color: c.white,
              cursor: 'pointer',
              fontFamily: 'var(--font-geist-sans)',
            }}
          >
            Download .txt
          </button>
        </div>
      </div>

      {/* Spec content */}
      <div style={{
        background: c.white,
        border: `1px solid ${c.border}`,
        borderRadius: 12,
        padding: '28px 32px',
        fontFamily: 'var(--font-geist-mono)',
        fontSize: 12.5,
        lineHeight: 1.7,
        whiteSpace: 'pre-wrap' as const,
        overflowX: 'auto',
      }}>
        {lines.map((line, i) => {
          const trimmed = line.trim()
          const isHeader = SECTION_HEADERS.has(trimmed.replace(/:$/, ''))
          const isSubItem = trimmed.startsWith('-') || /^\d+\./.test(trimmed)
          const isYes = trimmed.includes('→ YES')
          const isNo = trimmed.includes('→ NO')
          const isEmpty = trimmed === ''

          if (isEmpty) return <div key={i} style={{ height: 8 }} />
          if (isHeader) {
            return (
              <div key={i} style={{
                marginTop: i > 0 ? 20 : 0,
                marginBottom: 4,
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: '0.1em',
                color: c.accent,
                fontFamily: 'var(--font-geist-mono)',
              }}>
                {line}
              </div>
            )
          }
          if (isYes) return (
            <div key={i} style={{ color: '#065F46', paddingLeft: 16 }}>{line}</div>
          )
          if (isNo) return (
            <div key={i} style={{ color: '#991B1B', paddingLeft: 16 }}>{line}</div>
          )
          if (isSubItem) return (
            <div key={i} style={{ color: c.text, paddingLeft: 12 }}>{line}</div>
          )
          return <div key={i} style={{ color: c.text }}>{line}</div>
        })}
      </div>

      {/* What this prevents */}
      <div style={{
        marginTop: 24,
        padding: '20px 24px',
        background: '#F0FDF4',
        border: '1px solid #BBF7D0',
        borderRadius: 12,
      }}>
        <p style={{ margin: '0 0 8px', fontSize: 13, fontWeight: 700, color: '#065F46' }}>
          ✓ What this spec prevents
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 8 }}>
          {[
            'Silent tool failures with no error logging',
            'Missing precondition checks before operations',
            'Undefined error states causing customer confusion',
            'No monitoring until a customer complains',
            'Undefined escalation paths leaving users stuck',
          ].map(item => (
            <div key={item} style={{ fontSize: 12, color: '#065F46', display: 'flex', gap: 6 }}>
              <span>·</span><span>{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Next steps */}
      <div style={{ marginTop: 20, display: 'flex', gap: 12, flexWrap: 'wrap' as const }}>
        <a
          href="/groundwork"
          style={{
            padding: '10px 18px',
            background: c.white,
            border: `1px solid ${c.border}`,
            borderRadius: 8,
            fontSize: 13,
            fontWeight: 600,
            color: c.text,
            textDecoration: 'none',
          }}
        >
          ← Map another system
        </a>
        <button
          onClick={() => navigator.clipboard.writeText(
            `Here is a complete AI Build Spec for a system I'm building. Use it as the primary context when helping me implement, debug, or iterate on this system.\n\n${spec}`
          )}
          style={{
            padding: '10px 18px',
            background: c.black,
            border: 'none',
            borderRadius: 8,
            fontSize: 13,
            fontWeight: 600,
            color: c.white,
            cursor: 'pointer',
            fontFamily: 'var(--font-geist-sans)',
          }}
        >
          Copy as AI prompt context
        </button>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Studio Page
// ─────────────────────────────────────────────────────────────────────────────

export default function StudioPage() {
  const [currentQ, setCurrentQ] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [inputValue, setInputValue] = useState('')
  const [showWhy, setShowWhy] = useState(false)
  const [phase, setPhase] = useState<'interview' | 'generating' | 'spec'>('interview')
  const [spec, setSpec] = useState<string | null>(null)
  const [systemName, setSystemName] = useState('Unnamed System')
  const [nodes, setNodes] = useState<Node[]>([])
  const [edges, setEdges] = useState<Edge[]>([])
  const [generating, setGenerating] = useState(false)
  const [genError, setGenError] = useState<string | null>(null)

  const inputRef = useRef<HTMLTextAreaElement>(null)
  const total = VOICE_PHONE_QUESTIONS.length

  // Focus input on question change
  useEffect(() => {
    inputRef.current?.focus()
    setInputValue('')
    setShowWhy(false)
  }, [currentQ])

  const currentQuestion = VOICE_PHONE_QUESTIONS[currentQ]
  const isLast = currentQ === total - 1
  const allAnswered = phase === 'spec'

  const handleNext = useCallback(() => {
    if (!inputValue.trim()) return

    const newAnswers = { ...answers, [currentQ]: inputValue.trim() }
    setAnswers(newAnswers)

    // Track system name
    if (currentQuestion.id === 'system_name') {
      setSystemName(inputValue.trim())
    }

    // Map answer to canvas nodes/edges
    const { newNodes, newEdges } = mapAnswer(
      currentQuestion.id,
      inputValue.trim(),
      nodes,
      edges
    )
    if (newNodes.length) {
      setNodes(prev => [...prev, ...newNodes])
      setEdges(prev => [...prev, ...newEdges])
    }

    if (isLast) {
      // Move to generation phase
      setPhase('generating')
    } else {
      setCurrentQ(q => q + 1)
    }
  }, [inputValue, answers, currentQ, currentQuestion, nodes, edges, isLast])

  // Auto-generate when phase changes to 'generating'
  useEffect(() => {
    if (phase !== 'generating') return
    if (generating) return
    setGenerating(true)
    setGenError(null)

    const allAnswers: Answer[] = Object.entries(answers).map(([idx, value]) => ({
      questionId: VOICE_PHONE_QUESTIONS[Number(idx)].id,
      value,
    }))

    fetch('/api/groundwork/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ systemType: 'voice_phone', answers: allAnswers }),
    })
      .then(r => r.json())
      .then(data => {
        if (data.error) throw new Error(data.error)
        setSpec(data.spec)
        if (data.systemName) setSystemName(data.systemName)
        setPhase('spec')
        setGenerating(false)
      })
      .catch(err => {
        setGenError(err.message || 'Generation failed')
        setGenerating(false)
        setPhase('interview') // revert so user can retry
      })
  }, [phase, answers, generating])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && !currentQuestion.isMultiline) {
      e.preventDefault()
      handleNext()
    }
  }

  const handleSkip = () => {
    setAnswers(prev => ({ ...prev, [currentQ]: '(skipped)' }))
    setInputValue('')
    if (isLast) {
      setPhase('generating')
    } else {
      setCurrentQ(q => q + 1)
    }
  }

  // ── Spec phase ─────────────────────────────────────────────────────────────
  if (phase === 'spec' && spec) {
    return (
      <div style={{ minHeight: '100vh', background: c.bg, fontFamily: 'var(--font-geist-sans)' }}>
        <nav style={{
          borderBottom: `1px solid ${c.border}`,
          background: c.white,
          padding: '0 32px',
          height: 52,
          display: 'flex',
          alignItems: 'center',
          gap: 12,
        }}>
          <a href="/groundwork" style={{ textDecoration: 'none', fontSize: 14, fontWeight: 700, color: c.black }}>
            Groundwork
          </a>
          <span style={{ color: c.border }}>/</span>
          <span style={{ fontSize: 13, color: c.muted }}>{systemName}</span>
          <div style={{
            marginLeft: 'auto',
            fontSize: 11,
            fontWeight: 700,
            color: c.success,
            background: '#ECFDF5',
            padding: '3px 10px',
            borderRadius: 100,
            letterSpacing: '0.06em',
          }}>
            ✓ SPEC COMPLETE
          </div>
        </nav>
        <SpecOutput spec={spec} systemName={systemName} />
      </div>
    )
  }

  // ── Interview + Canvas phase ───────────────────────────────────────────────
  return (
    <div style={{
      height: '100vh',
      display: 'flex',
      flexDirection: 'column' as const,
      background: c.bg,
      fontFamily: 'var(--font-geist-sans)',
      overflow: 'hidden',
    }}>
      {/* Top bar */}
      <nav style={{
        borderBottom: `1px solid ${c.border}`,
        background: c.white,
        padding: '0 24px',
        height: 52,
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        flexShrink: 0,
        zIndex: 10,
      }}>
        <a href="/groundwork" style={{ textDecoration: 'none', fontSize: 14, fontWeight: 700, color: c.black }}>
          Groundwork
        </a>
        <span style={{ color: c.border }}>/</span>
        <span style={{ fontSize: 13, color: c.muted }}>Voice / Phone System</span>

        {phase === 'generating' && (
          <div style={{
            marginLeft: 'auto',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            fontSize: 12,
            color: c.accent,
            fontWeight: 600,
          }}>
            <div style={{
              width: 14,
              height: 14,
              border: `2px solid ${c.accent}33`,
              borderTop: `2px solid ${c.accent}`,
              borderRadius: '50%',
              animation: 'spin 0.8s linear infinite',
            }} />
            Generating AI Build Spec...
          </div>
        )}

        {genError && (
          <div style={{ marginLeft: 'auto', fontSize: 12, color: '#EF4444', fontWeight: 600 }}>
            {genError} — <button onClick={() => setPhase('generating')} style={{ background: 'none', border: 'none', color: c.accent, cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>retry</button>
          </div>
        )}

        <div style={{
          marginLeft: phase === 'interview' ? 'auto' : 0,
          fontSize: 12,
          color: c.muted,
        }}>
          {currentQ + 1} / {total}
        </div>
      </nav>

      {/* Main split */}
      <div style={{
        flex: 1,
        display: 'flex',
        overflow: 'hidden',
      }}>
        {/* ── Left: Interview panel ────────────────────────────────────── */}
        <div style={{
          width: '42%',
          minWidth: 340,
          maxWidth: 500,
          borderRight: `1px solid ${c.border}`,
          background: c.white,
          display: 'flex',
          flexDirection: 'column' as const,
          overflow: 'hidden',
        }}>
          {/* Scrollable content */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '28px 28px 16px',
          }}>
            <ProgressDots current={currentQ} total={total} />

            {/* Answer history */}
            <AnswerHistory answers={answers} currentQ={currentQ} />

            {/* Current question */}
            <div>
              <div style={{
                fontSize: 10,
                fontWeight: 700,
                color: c.accent,
                letterSpacing: '0.1em',
                textTransform: 'uppercase' as const,
                marginBottom: 10,
              }}>
                Question {currentQ + 1} of {total}
              </div>

              <p style={{
                fontSize: 17,
                fontWeight: 700,
                color: c.black,
                lineHeight: 1.4,
                margin: '0 0 16px',
                letterSpacing: '-0.01em',
              }}>
                {currentQuestion.text}
              </p>

              <textarea
                ref={inputRef}
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={currentQuestion.placeholder}
                rows={currentQuestion.isMultiline ? 4 : 2}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  border: `1.5px solid ${inputValue ? c.accent : c.border}`,
                  borderRadius: 8,
                  fontSize: 13,
                  color: c.black,
                  background: c.bg,
                  resize: 'vertical' as const,
                  fontFamily: 'var(--font-geist-sans)',
                  lineHeight: 1.5,
                  outline: 'none',
                  transition: 'border-color 0.15s',
                  boxSizing: 'border-box' as const,
                }}
              />

              {currentQuestion.isMultiline && (
                <p style={{ fontSize: 10, color: c.muted, margin: '4px 0 0' }}>
                  List multiple items separated by commas or new lines
                </p>
              )}

              {!currentQuestion.isMultiline && (
                <p style={{ fontSize: 10, color: c.muted, margin: '4px 0 0' }}>
                  Press Enter to continue
                </p>
              )}

              <WhyPanel why={currentQuestion.why} failure={currentQuestion.failure} />
            </div>
          </div>

          {/* Action row — pinned to bottom */}
          <div style={{
            padding: '16px 28px 20px',
            borderTop: `1px solid ${c.border}`,
            display: 'flex',
            gap: 8,
            background: c.white,
          }}>
            {currentQ > 0 && (
              <button
                onClick={() => {
                  setCurrentQ(q => q - 1)
                  setInputValue(answers[currentQ - 1] || '')
                }}
                style={{
                  padding: '10px 14px',
                  background: 'none',
                  border: `1px solid ${c.border}`,
                  borderRadius: 8,
                  fontSize: 13,
                  color: c.muted,
                  cursor: 'pointer',
                  fontFamily: 'var(--font-geist-sans)',
                }}
              >
                ← Back
              </button>
            )}

            <button
              onClick={handleNext}
              disabled={!inputValue.trim() || phase === 'generating'}
              style={{
                flex: 1,
                padding: '10px 20px',
                background: inputValue.trim() ? c.accent : c.border,
                border: 'none',
                borderRadius: 8,
                fontSize: 14,
                fontWeight: 700,
                color: inputValue.trim() ? c.white : c.muted,
                cursor: inputValue.trim() ? 'pointer' : 'not-allowed',
                fontFamily: 'var(--font-geist-sans)',
                transition: 'background 0.15s',
              }}
            >
              {isLast ? 'Generate AI Build Spec →' : 'Next →'}
            </button>

            <button
              onClick={handleSkip}
              style={{
                padding: '10px 14px',
                background: 'none',
                border: `1px solid ${c.border}`,
                borderRadius: 8,
                fontSize: 12,
                color: c.muted,
                cursor: 'pointer',
                fontFamily: 'var(--font-geist-sans)',
              }}
            >
              Skip
            </button>
          </div>
        </div>

        {/* ── Right: Canvas panel ───────────────────────────────────────── */}
        <div style={{
          flex: 1,
          background: c.canvas,
          position: 'relative' as const,
          overflow: 'hidden',
        }}>
          {/* Canvas type legend */}
          {nodes.length > 0 && (
            <div style={{
              position: 'absolute' as const,
              top: 16,
              left: 16,
              zIndex: 5,
              display: 'flex',
              flexWrap: 'wrap' as const,
              gap: 6,
              maxWidth: 320,
            }}>
              {[
                { type: 'actor', label: 'Actor', color: '#3B82F6' },
                { type: 'trigger', label: 'Trigger', color: '#8B5CF6' },
                { type: 'precondition', label: 'Precondition', color: '#F59E0B' },
                { type: 'decision', label: 'Decision', color: '#EC4899' },
                { type: 'output', label: 'Output', color: '#10B981' },
                { type: 'error', label: 'Error State', color: '#EF4444' },
                { type: 'integration', label: 'Integration', color: '#14B8A6' },
                { type: 'monitoring', label: 'Monitoring', color: '#6366F1' },
              ].filter(item =>
                nodes.some(n => n.data?.nodeType === item.type)
              ).map(item => (
                <span key={item.type} style={{
                  fontSize: 10,
                  fontWeight: 600,
                  color: item.color,
                  background: c.white,
                  border: `1px solid ${item.color}44`,
                  borderRadius: 100,
                  padding: '2px 8px',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.06)',
                }}>
                  {item.label}
                </span>
              ))}
            </div>
          )}

          <Canvas
            incomingNodes={nodes}
            incomingEdges={edges}
            isEmpty={nodes.length === 0}
          />
        </div>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
