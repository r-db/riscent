/**
 * POST /api/visitor/track
 * Track visitor engagement events
 */

import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { audit } from '@/lib/audit';

// Prevent prerendering during build
export const dynamic = 'force-dynamic';

interface TrackEvent {
  type: 'scroll' | 'interaction' | 'revelation' | 'curtain_peek' | 'curtain_enter' | 'breathing_circle' | 'page_view';
  data?: Record<string, unknown>;
  timestamp?: string;
}

interface TrackRequest {
  visitorId: string;
  sessionId?: string;
  event: TrackEvent;
}

export async function POST(request: NextRequest) {
  try {
    const body: TrackRequest = await request.json();
    const { visitorId, sessionId, event } = body;

    if (!visitorId || !event?.type) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Update visitor based on event type
    switch (event.type) {
      case 'revelation':
        await sql`
          UPDATE visitors
          SET truths_revealed = truths_revealed + 1
          WHERE visitor_id = ${visitorId}::uuid
        `;
        break;

      case 'curtain_peek':
        await sql`
          UPDATE visitors
          SET curtain_peeked = true
          WHERE visitor_id = ${visitorId}::uuid
        `;
        break;

      case 'curtain_enter':
        await sql`
          UPDATE visitors
          SET
            curtain_entered = true,
            phase = 'engaged'
          WHERE visitor_id = ${visitorId}::uuid
        `;

        // Audit this significant event
        await audit({
          action: 'curtain_enter',
          entityType: 'visitor',
          entityId: visitorId,
          actorType: 'visitor',
          actorId: visitorId,
          metadata: event.data,
          ipAddress: request.headers.get('x-forwarded-for') || undefined,
          userAgent: request.headers.get('user-agent') || undefined,
        });
        break;

      case 'breathing_circle':
        await sql`
          UPDATE visitors
          SET breathing_circle_interactions = breathing_circle_interactions + 1
          WHERE visitor_id = ${visitorId}::uuid
        `;
        break;

      case 'scroll':
        const scrollDepth = (event.data?.depth as number) || 0;
        await sql`
          UPDATE visitors
          SET max_scroll_depth = GREATEST(max_scroll_depth, ${scrollDepth})
          WHERE visitor_id = ${visitorId}::uuid
        `;
        break;
    }

    // Log event to session if we have a session ID
    if (sessionId) {
      await sql`
        UPDATE visitor_sessions
        SET events = events || ${JSON.stringify({
          type: event.type,
          timestamp: event.timestamp || new Date().toISOString(),
          data: event.data,
        })}::jsonb
        WHERE session_id = ${sessionId}::uuid
      `;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[API] Track event error:', error);
    return NextResponse.json(
      { error: 'Failed to track event' },
      { status: 500 }
    );
  }
}
