/**
 * POST /api/visitor/session
 * Create or end a visitor session
 */

import { NextRequest, NextResponse } from 'next/server';
import { sql, queryOne } from '@/lib/db';

// Prevent prerendering during build
export const dynamic = 'force-dynamic';

interface SessionRequest {
  visitorId: string;
  action: 'start' | 'end';
  sessionId?: string;
  entryPage?: string;
  exitPage?: string;
  temporalState?: Record<string, unknown>;
}

interface Session {
  session_id: string;
  visitor_id: string;
  started_at: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: SessionRequest = await request.json();
    const { visitorId, action, sessionId, entryPage, exitPage, temporalState } = body;

    if (!visitorId) {
      return NextResponse.json(
        { error: 'Missing visitorId' },
        { status: 400 }
      );
    }

    if (action === 'start') {
      const userAgent = request.headers.get('user-agent') || '';
      const referrer = request.headers.get('referer') || '';

      // Detect device type
      let deviceType = 'desktop';
      if (/mobile/i.test(userAgent)) {
        deviceType = 'mobile';
      } else if (/tablet/i.test(userAgent)) {
        deviceType = 'tablet';
      }

      const result = await queryOne<Session>(
        `INSERT INTO visitor_sessions (
          visitor_id,
          entry_page,
          user_agent,
          device_type,
          referrer
        )
        VALUES ($1::uuid, $2, $3, $4, $5)
        RETURNING session_id, visitor_id, started_at`,
        [visitorId, entryPage || '/', userAgent, deviceType, referrer]
      );

      return NextResponse.json({
        sessionId: result!.session_id,
        startedAt: result!.started_at,
      });
    }

    if (action === 'end' && sessionId) {
      await sql`
        UPDATE visitor_sessions
        SET
          ended_at = NOW(),
          duration_seconds = EXTRACT(EPOCH FROM (NOW() - started_at))::integer,
          exit_page = ${exitPage || null},
          temporal_state = ${temporalState ? JSON.stringify(temporalState) : '{}'}::jsonb
        WHERE session_id = ${sessionId}::uuid
      `;

      // Also update visitor's total time
      await sql`
        UPDATE visitors
        SET total_time_seconds = total_time_seconds + (
          SELECT COALESCE(duration_seconds, 0)
          FROM visitor_sessions
          WHERE session_id = ${sessionId}::uuid
        )
        WHERE visitor_id = ${visitorId}::uuid
      `;

      return NextResponse.json({ success: true });
    }

    return NextResponse.json(
      { error: 'Invalid action or missing sessionId' },
      { status: 400 }
    );
  } catch (error) {
    console.error('[API] Session error:', error);
    return NextResponse.json(
      { error: 'Failed to manage session' },
      { status: 500 }
    );
  }
}
