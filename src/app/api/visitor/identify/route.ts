/**
 * POST /api/visitor/identify
 * Identifies a visitor by cookie, creates new record if needed
 */

import { NextRequest, NextResponse } from 'next/server';
import { sql, query, queryOne } from '@/lib/db';
import { auditCreate } from '@/lib/audit';
import { v4 as uuidv4 } from 'uuid';

// Prevent prerendering during build
export const dynamic = 'force-dynamic';

interface IdentifyRequest {
  cookieId?: string;
  fingerprint?: string;
}

interface Visitor {
  visitor_id: string;
  cookie_id: string;
  phase: string;
  truths_revealed: number;
  curtain_peeked: boolean;
  curtain_entered: boolean;
  total_visits: number;
  first_visit_at: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: IdentifyRequest = await request.json();
    let cookieId = body.cookieId;

    // Generate cookie ID if not provided
    if (!cookieId) {
      cookieId = uuidv4();
    }

    // Check for existing visitor
    const existingVisitor = await queryOne<Visitor>(
      `SELECT
        visitor_id,
        cookie_id,
        phase,
        truths_revealed,
        curtain_peeked,
        curtain_entered,
        total_visits,
        first_visit_at
      FROM visitors
      WHERE cookie_id = $1
      LIMIT 1`,
      [cookieId]
    );

    if (existingVisitor) {
      // Update last visit and increment count
      await sql`
        UPDATE visitors
        SET
          last_visit_at = NOW(),
          total_visits = total_visits + 1
        WHERE visitor_id = ${existingVisitor.visitor_id}
      `;

      return NextResponse.json({
        visitorId: existingVisitor.visitor_id,
        cookieId: existingVisitor.cookie_id,
        phase: existingVisitor.phase,
        truthsRevealed: existingVisitor.truths_revealed,
        curtainPeeked: existingVisitor.curtain_peeked,
        curtainEntered: existingVisitor.curtain_entered,
        isReturning: true,
        totalVisits: existingVisitor.total_visits + 1,
      });
    }

    // Create new visitor
    const visitor = await queryOne<Visitor>(
      `INSERT INTO visitors (cookie_id, fingerprint_hash)
      VALUES ($1, $2)
      RETURNING
        visitor_id,
        cookie_id,
        phase,
        truths_revealed,
        curtain_peeked,
        curtain_entered,
        total_visits`,
      [cookieId, body.fingerprint || null]
    );

    if (!visitor) {
      throw new Error('Failed to create visitor');
    }

    // Audit the creation
    await auditCreate(
      'visitor',
      visitor.visitor_id,
      { cookieId, fingerprint: body.fingerprint },
      {
        actorType: 'system',
        ipAddress: request.headers.get('x-forwarded-for') || undefined,
        userAgent: request.headers.get('user-agent') || undefined,
      }
    );

    return NextResponse.json({
      visitorId: visitor.visitor_id,
      cookieId: visitor.cookie_id,
      phase: visitor.phase,
      truthsRevealed: visitor.truths_revealed,
      curtainPeeked: visitor.curtain_peeked,
      curtainEntered: visitor.curtain_entered,
      isReturning: false,
      totalVisits: 1,
    });
  } catch (error) {
    console.error('[API] Visitor identify error:', error);
    return NextResponse.json(
      { error: 'Failed to identify visitor' },
      { status: 500 }
    );
  }
}
