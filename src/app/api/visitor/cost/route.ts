/**
 * GET /api/visitor/cost
 * Get visitor's current cost status
 */

import { NextRequest, NextResponse } from 'next/server';
import { queryOne } from '@/lib/db';

export const dynamic = 'force-dynamic';

interface VisitorCost {
  visitor_id: string;
  total_tokens_used: number;
  total_input_tokens: number;
  total_output_tokens: number;
  total_cost_cents: number;
  cost_gate_reached: boolean;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const visitorId = searchParams.get('visitorId');

    if (!visitorId) {
      return NextResponse.json(
        { error: 'Missing visitorId parameter' },
        { status: 400 }
      );
    }

    const visitor = await queryOne<VisitorCost>(
      `SELECT
        visitor_id,
        total_tokens_used,
        total_input_tokens,
        total_output_tokens,
        total_cost_cents,
        cost_gate_reached
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

    return NextResponse.json({
      visitorId: visitor.visitor_id,
      totalTokensUsed: visitor.total_tokens_used,
      totalInputTokens: visitor.total_input_tokens,
      totalOutputTokens: visitor.total_output_tokens,
      currentCostCents: visitor.total_cost_cents,
      costGateReached: visitor.cost_gate_reached,
      threshold: 10, // 10 cents = $0.10
    });
  } catch (error) {
    console.error('[API] Get visitor cost error:', error);
    return NextResponse.json(
      { error: 'Failed to get cost status' },
      { status: 500 }
    );
  }
}
