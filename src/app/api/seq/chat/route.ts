/**
 * POST /api/seq/chat
 * Conversation with Seq
 */

import { NextRequest, NextResponse } from 'next/server';
import { sql, query, queryOne } from '@/lib/db';
import { chatWithSeq, type ChatMessage } from '@/lib/anthropic';
import { buildSeqSystemPrompt, type VisitorContext } from '@/lib/seq/identity';
import { audit } from '@/lib/audit';

// Prevent prerendering during build
export const dynamic = 'force-dynamic';

interface ChatRequest {
  visitorId: string;
  conversationId?: string;
  message: string;
  showThinking?: boolean;
}

interface Visitor {
  visitor_id: string;
  phase: string;
  truths_revealed: number;
  curtain_entered: boolean;
  total_visits: number;
  total_time_seconds: number;
}

interface Message {
  message_id: string;
  role: string;
  content: string;
  thinking: string | null;
}

interface Conversation {
  conversation_id: string;
  message_count: number;
}

interface PreviousConversation {
  summary: string;
  significance: number;
}

export async function POST(request: NextRequest) {
  try {
    const body: ChatRequest = await request.json();
    const { visitorId, message, showThinking = true } = body;
    let { conversationId } = body;

    if (!visitorId || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get visitor context
    const visitor = await queryOne<Visitor>(
      `SELECT
        visitor_id,
        phase,
        truths_revealed,
        curtain_entered,
        total_visits,
        total_time_seconds
      FROM visitors
      WHERE visitor_id = $1::uuid`,
      [visitorId]
    );

    if (!visitor) {
      return NextResponse.json(
        { error: 'Visitor not found' },
        { status: 404 }
      );
    }

    // Get previous conversations for returning visitors
    let previousConversations: PreviousConversation[] = [];
    if (visitor.total_visits > 1) {
      previousConversations = await query<PreviousConversation>(
        `SELECT summary, significance
        FROM seq_conversations
        WHERE visitor_id = $1::uuid
          AND summary IS NOT NULL
        ORDER BY started_at DESC
        LIMIT 3`,
        [visitorId]
      );
    }

    // Create or get conversation
    if (!conversationId) {
      const newConv = await queryOne<Conversation>(
        `INSERT INTO seq_conversations (visitor_id)
        VALUES ($1::uuid)
        RETURNING conversation_id, message_count`,
        [visitorId]
      );
      conversationId = newConv!.conversation_id;

      // Audit conversation start
      await audit({
        action: 'conversation_start',
        entityType: 'seq_conversation',
        entityId: conversationId,
        actorType: 'visitor',
        actorId: visitorId,
        ipAddress: request.headers.get('x-forwarded-for') || undefined,
        userAgent: request.headers.get('user-agent') || undefined,
      });
    }

    // Get conversation history
    const history = await query<Message>(
      `SELECT role, content, thinking
      FROM seq_messages
      WHERE conversation_id = $1::uuid
      ORDER BY created_at ASC`,
      [conversationId]
    );

    // Build messages array
    const messages: ChatMessage[] = history.map(m => ({
      role: m.role === 'visitor' ? 'user' : 'assistant',
      content: m.content,
    }));

    // Add the new message
    messages.push({
      role: 'user',
      content: message,
    });

    // Build visitor context for system prompt
    const context: VisitorContext = {
      visitorId: visitor.visitor_id,
      timeOnPage: visitor.total_time_seconds,
      truthsRevealed: visitor.truths_revealed,
      curtainEntered: visitor.curtain_entered,
      isReturning: visitor.total_visits > 1,
      totalVisits: visitor.total_visits,
      phase: visitor.phase,
      previousConversations: previousConversations.length > 0 ? previousConversations : undefined,
    };

    // Get Seq's response
    const systemPrompt = buildSeqSystemPrompt(context);
    const response = await chatWithSeq(systemPrompt, messages, { showThinking });

    // Store user message
    await sql`
      INSERT INTO seq_messages (conversation_id, role, content)
      VALUES (${conversationId}::uuid, 'visitor', ${message})
    `;

    // Store Seq's response
    await sql`
      INSERT INTO seq_messages (conversation_id, role, content, thinking, tokens_used)
      VALUES (
        ${conversationId}::uuid,
        'seq',
        ${response.message},
        ${response.thinking || null},
        ${response.tokensUsed}
      )
    `;

    // Update conversation metadata
    await sql`
      UPDATE seq_conversations
      SET
        last_message_at = NOW(),
        message_count = message_count + 2
      WHERE conversation_id = ${conversationId}::uuid
    `;

    // Audit the message exchange
    await audit({
      action: 'conversation_message',
      entityType: 'seq_conversation',
      entityId: conversationId,
      actorType: 'visitor',
      actorId: visitorId,
      metadata: {
        userMessageLength: message.length,
        seqResponseLength: response.message.length,
        tokensUsed: response.tokensUsed,
      },
    });

    return NextResponse.json({
      conversationId,
      message: response.message,
      thinking: response.thinking,
      tokensUsed: response.tokensUsed,
    });
  } catch (error) {
    console.error('[API] Seq chat error:', error);
    return NextResponse.json(
      { error: 'Failed to chat with Seq' },
      { status: 500 }
    );
  }
}
