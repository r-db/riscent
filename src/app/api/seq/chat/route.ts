/**
 * POST /api/seq/chat
 * Conversation with Seq
 *
 * IP-based cost tracking with $0.30 limit for anonymous users.
 * Logged-in users get $1.00+ limit tracked by account.
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { sql, query, queryOne } from '@/lib/db';
import { chatWithSeq, type ChatMessage } from '@/lib/anthropic';
import { buildSeqSystemPrompt, type VisitorContext } from '@/lib/seq/identity';
import { audit } from '@/lib/audit';
import { getIPHash } from '@/lib/ip-hash';

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

interface IPCostStatus {
  total_cost: number;
  gate_reached: boolean;
  limit_cents: number;
  is_linked_user: boolean;
  user_id: string | null;
}

interface CostUpdateResult {
  new_cost: number;
  gate_reached: boolean;
  limit_cents: number;
}

interface User {
  user_id: string;
  clerk_user_id: string;
  email: string | null;
  full_name: string | null;
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

    // Get IP hash for tracking
    const ipHash = getIPHash(request);

    // Check if user is logged in (optional - chat is public)
    // Clerk production keys fail on localhost — graceful fallback
    let clerkUserId: string | null = null;
    try {
      const authResult = await auth();
      clerkUserId = authResult.userId;
    } catch {
      // Clerk domain mismatch on localhost — proceed as anonymous
    }
    let dbUser: User | null = null;

    if (clerkUserId) {
      // Get or create user record
      dbUser = await queryOne<User>(
        `SELECT user_id, clerk_user_id, email, full_name
         FROM users WHERE clerk_user_id = $1`,
        [clerkUserId]
      );

      // If logged in but no user record, they haven't been synced yet
      // This shouldn't happen if webhook is working, but handle gracefully
      if (!dbUser) {
        // Create minimal user record - webhook will fill in details later
        dbUser = await queryOne<User>(
          `INSERT INTO users (clerk_user_id)
           VALUES ($1)
           ON CONFLICT (clerk_user_id) DO UPDATE SET last_active_at = NOW()
           RETURNING user_id, clerk_user_id, email, full_name`,
          [clerkUserId]
        );

        // Link IP to user (graceful if migration 003 not applied)
        try {
          await sql`SELECT link_ip_to_user(${ipHash}, ${dbUser!.user_id}::uuid)`;
        } catch { /* ip_visitors table may not exist yet */ }
      }
    }

    // Check IP cost status BEFORE processing (graceful if migration 003 not applied)
    let costStatus: IPCostStatus | null = null;
    try {
      costStatus = await queryOne<IPCostStatus>(
        `SELECT * FROM get_ip_cost_status($1)`,
        [ipHash]
      );
    } catch (costErr: unknown) {
      // get_ip_cost_status function or ip_visitors table may not exist yet
      // (migration 003 not applied). Allow the conversation through.
      console.warn('[API] Cost tracking unavailable (migration 003 not applied?):', (costErr as Error).message);
    }

    // If cost gate reached and NOT logged in, reject with 402
    if (costStatus?.gate_reached && !clerkUserId) {
      return NextResponse.json(
        {
          error: 'cost_gate_reached',
          message: 'Your IP has visited before and reached our $0.30 trial limit. Sign in to continue exploring with Seq.',
          currentCostCents: costStatus.total_cost,
          limitCents: costStatus.limit_cents,
          loginRequired: true,
        },
        { status: 402 }
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

    // Store user message with IP hash
    await sql`
      INSERT INTO seq_messages (conversation_id, role, content, ip_hash)
      VALUES (${conversationId}::uuid, 'visitor', ${message}, ${ipHash})
    `;

    // Store Seq's response with token breakdown
    await sql`
      INSERT INTO seq_messages (conversation_id, role, content, thinking, tokens_used, input_tokens, output_tokens, ip_hash)
      VALUES (
        ${conversationId}::uuid,
        'seq',
        ${response.message},
        ${response.thinking || null},
        ${response.tokensUsed},
        ${response.inputTokens},
        ${response.outputTokens},
        ${ipHash}
      )
    `;

    // Update cost tracking using IP-based function (graceful if migration 003 not applied)
    let currentCostCents = 0;
    let costGateReached = false;
    let limitCents = 30;
    try {
      const costResult = await queryOne<CostUpdateResult>(
        `SELECT * FROM update_ip_visitor_cost($1, $2, $3)`,
        [ipHash, response.inputTokens, response.outputTokens]
      );
      currentCostCents = costResult?.new_cost || 0;
      costGateReached = costResult?.gate_reached || false;
      limitCents = costResult?.limit_cents || 30;
    } catch {
      // Cost tracking functions not available — allow conversation
    }

    // Update conversation metadata and link to user if logged in
    if (dbUser) {
      await sql`
        UPDATE seq_conversations
        SET
          last_message_at = NOW(),
          message_count = message_count + 2,
          user_id = ${dbUser.user_id}::uuid
        WHERE conversation_id = ${conversationId}::uuid
      `;

      // Update user conversation count
      await sql`
        UPDATE users
        SET conversation_count = conversation_count + 1
        WHERE user_id = ${dbUser.user_id}::uuid
      `;

      // Link conversation to user (for easy lookup)
      await sql`
        INSERT INTO user_conversations (user_id, conversation_id)
        VALUES (${dbUser.user_id}::uuid, ${conversationId}::uuid)
        ON CONFLICT (user_id, conversation_id) DO NOTHING
      `;
    } else {
      await sql`
        UPDATE seq_conversations
        SET
          last_message_at = NOW(),
          message_count = message_count + 2
        WHERE conversation_id = ${conversationId}::uuid
      `;
    }

    // Audit the message exchange
    await audit({
      action: 'conversation_message',
      entityType: 'seq_conversation',
      entityId: conversationId,
      actorType: dbUser ? 'admin' : 'visitor',
      actorId: dbUser ? dbUser.user_id : visitorId,
      metadata: {
        userMessageLength: message.length,
        seqResponseLength: response.message.length,
        tokensUsed: response.tokensUsed,
        inputTokens: response.inputTokens,
        outputTokens: response.outputTokens,
        currentCostCents,
        limitCents,
        costGateReached,
        ipHash: ipHash.substring(0, 8) + '...', // Truncated for privacy in logs
        isAuthenticated: !!dbUser,
      },
    });

    return NextResponse.json({
      conversationId,
      message: response.message,
      thinking: response.thinking,
      tokensUsed: response.tokensUsed,
      inputTokens: response.inputTokens,
      outputTokens: response.outputTokens,
      currentCostCents,
      limitCents,
      costGateReached,
      isAuthenticated: !!dbUser,
    });
  } catch (error) {
    console.error('[API] Seq chat error:', error);
    return NextResponse.json(
      { error: 'Failed to chat with Seq' },
      { status: 500 }
    );
  }
}
