/**
 * Post-booking intake agent — the investigative chat that opens after a caller
 * verifies their phone and books. One Claude call per turn returns BOTH the
 * conversational reply and the running extraction (summary/topics), so what
 * employees read in /team/appointments can never drift from the conversation.
 */
import { anthropic } from './anthropic';

export interface IntakeMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface IntakeTurn {
  reply: string;
  summary: string;
  topics: string;
  complete: boolean;
}

const SYSTEM = `You are Riscent's intake assistant, chatting with someone who just booked a
30-minute call with Ryan Bolden (Riscent's founder — AI consulting: agentic deployment,
SLM fine-tuning, AI memory systems, AI visibility). Their phone is already verified and
the call is already booked — never ask for contact details or scheduling changes.

Your job is a short, warm, investigative conversation so Ryan arrives prepared:
- who they are (role, company, industry)
- why they're interested in Riscent / what prompted the call
- what specifically they want to talk about, and any constraints (timeline, budget signals, current stack)

Style: one question at a time, build on their answers, plain language, genuinely curious —
a great concierge, not a form. Keep replies to 1-3 sentences. After you have the essentials
(usually 3-5 exchanges), thank them, tell them Ryan will come prepared, and mark the
conversation complete. If they want to stop at any point, wrap up gracefully and mark complete.

With every turn, also maintain the extraction fields:
- summary: 1-3 sentences for Ryan — who this is and what they want (write in third person)
- topics: comma-separated topic list for the call
Correct spelling and grammar in the extraction fields; never alter their meaning.`;

const TURN_SCHEMA = {
  type: 'object',
  properties: {
    reply: { type: 'string', description: 'Your next conversational message to the visitor.' },
    summary: { type: 'string', description: 'Running 1-3 sentence brief for Ryan, third person, cleaned up.' },
    topics: { type: 'string', description: 'Comma-separated topics they want to discuss.' },
    complete: { type: 'boolean', description: 'True once the essentials are gathered or the visitor is done.' },
  },
  required: ['reply', 'summary', 'topics', 'complete'],
  additionalProperties: false,
} as const;

export async function intakeTurn(name: string, messages: IntakeMessage[]): Promise<IntakeTurn> {
  const response = await anthropic.messages.create({
    model: 'claude-opus-4-8',
    max_tokens: 2048,
    system: [{ type: 'text', text: SYSTEM, cache_control: { type: 'ephemeral' } }],
    // output_config is a current API param; the installed SDK (0.71.x) predates
    // its typings but passes unknown fields through on the wire.
    ...({ output_config: { format: { type: 'json_schema', schema: TURN_SCHEMA } } } as Record<string, unknown>),
    messages: [
      // Consecutive user messages are allowed — the API folds them into one turn.
      { role: 'user', content: `(Context, not from the visitor: their booking name is ${name}.)` },
      ...messages,
    ],
  });

  const text = response.content.find((b) => b.type === 'text');
  if (!text || text.type !== 'text') throw new Error('intake: no text block in response');
  return JSON.parse(text.text) as IntakeTurn;
}
