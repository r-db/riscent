import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { VOICE_PHONE_QUESTIONS } from '@/lib/groundwork/questions'
import { GenerateRequest } from '@/lib/groundwork/types'

const client = new Anthropic()

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/groundwork/generate
// Accepts all 20 question answers, returns a complete AI Build Spec
// ─────────────────────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const body: GenerateRequest = await req.json()
    const { systemType, answers } = body

    if (!systemType || !answers?.length) {
      return NextResponse.json({ error: 'Missing systemType or answers' }, { status: 400 })
    }

    // Build a lookup of questionId → answer value
    const answerMap: Record<string, string> = {}
    for (const a of answers) {
      answerMap[a.questionId] = a.value
    }

    // Build the answered questions section for the prompt
    const questionLines = VOICE_PHONE_QUESTIONS.map(q => {
      const answer = answerMap[q.id] || '(not provided)'
      return `Q${q.number}. ${q.text}\nAnswer: ${answer}`
    }).join('\n\n')

    const systemName = answerMap['system_name'] || 'Unnamed System'
    const today = new Date().toISOString().split('T')[0]

    const prompt = `You are a senior software architect. A founder has answered 20 interview questions about a system they're building. Your job is to turn those answers into a complete AI Build Spec — a structured specification so precise that any engineer or LLM can build the system correctly on the first attempt, without follow-up questions.

The spec format must use exactly these sections in this order:
SYSTEM, VERSION, SUMMARY, ACTORS, TRIGGERS, PRECONDITIONS, PRECONDITION_FAILURES, DECISION_GATES, OUTPUTS, ERROR_STATES, DATA_COLLECTION, INTEGRATIONS, MONITORING_SPEC, CONSTRAINTS, ESCALATION_PATH, TEST_CASES

Rules:
- Use the exact section headers shown above (uppercase, no decorative characters except colons)
- Under each section, use bullet points starting with "  - " (two spaces + dash)
- DECISION_GATES: show the fork with → YES and → NO sub-bullets
- TEST_CASES: number them 1-5 minimum, format as "N. Scenario → Expected outcome"
- MONITORING_SPEC: include the specific metric, threshold, and alert channel
- Be concrete and actionable. No vague language like "handle appropriately" — name the specific action
- If an answer was vague, make a reasonable inference and note it as "[inferred from context]"
- Do not add sections not listed above
- Do not add any preamble, explanation, or closing commentary outside the spec

Here are the founder's answers:

${questionLines}

Generate the complete AI Build Spec now.`

    const message = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 2048,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      system: `You produce structured technical specifications. Output only the spec, nothing else. Start directly with "SYSTEM:" on the first line.`,
    })

    const specText = message.content[0].type === 'text' ? message.content[0].text : ''

    // Also return a parsed sections object for structured display
    const sections = parseSections(specText)

    return NextResponse.json({
      spec: specText,
      systemName,
      generatedAt: today,
      sections,
    })
  } catch (err) {
    console.error('[groundwork/generate] Error:', err)
    return NextResponse.json(
      { error: 'Failed to generate spec' },
      { status: 500 }
    )
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Parse spec text into sections for structured rendering
// ─────────────────────────────────────────────────────────────────────────────

function parseSections(spec: string): Record<string, string[]> {
  const sections: Record<string, string[]> = {}
  let currentSection = ''
  const lines = spec.split('\n')

  for (const line of lines) {
    const trimmed = line.trim()
    // Section header: all caps word(s) ending with optional colon
    if (/^[A-Z][A-Z_\s]+:?\s*$/.test(trimmed) && trimmed.length < 40) {
      currentSection = trimmed.replace(/:$/, '').trim()
      sections[currentSection] = []
    } else if (currentSection && trimmed.startsWith('-')) {
      sections[currentSection].push(trimmed.replace(/^-\s*/, '').trim())
    } else if (currentSection && /^\d+\./.test(trimmed)) {
      sections[currentSection].push(trimmed)
    }
  }

  return sections
}
