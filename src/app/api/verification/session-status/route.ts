/**
 * GET /api/verification/session-status
 * Check if current session has phone verification
 */

import { NextRequest, NextResponse } from 'next/server';
import { queryOne } from '@/lib/db';

export const dynamic = 'force-dynamic';

interface SessionVerification {
  user_id: string;
  phone_verified: boolean;
  verified_at: string;
  full_name: string;
  phone_number: string;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');
    const visitorId = searchParams.get('visitorId');

    if (!sessionId || !visitorId) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    // Check for session verification
    const sessionVerification = await queryOne<SessionVerification>(
      `SELECT
        sv.user_id,
        sv.phone_verified,
        sv.verified_at,
        vu.full_name,
        vu.phone_number
      FROM session_verifications sv
      JOIN verified_users vu ON sv.user_id = vu.user_id
      WHERE sv.session_id = $1::uuid
        AND sv.phone_verified = TRUE`,
      [sessionId]
    );

    if (sessionVerification) {
      return NextResponse.json({
        verified: true,
        userId: sessionVerification.user_id,
        fullName: sessionVerification.full_name,
        phoneNumber: sessionVerification.phone_number.slice(0, -4) + '****',
        verifiedAt: sessionVerification.verified_at,
      });
    }

    // Check if visitor has a verified user record (for returning users)
    const existingUser = await queryOne<{ user_id: string; full_name: string; phone_number: string }>(
      `SELECT user_id, full_name, phone_number
      FROM verified_users
      WHERE visitor_id = $1::uuid
        AND phone_verified = TRUE`,
      [visitorId]
    );

    if (existingUser) {
      // User exists but hasn't verified this session
      return NextResponse.json({
        verified: false,
        hasExistingUser: true,
        userId: existingUser.user_id,
        fullName: existingUser.full_name,
        phoneNumber: existingUser.phone_number.slice(0, -4) + '****',
        message: 'Please verify your phone number for this session',
      });
    }

    return NextResponse.json({
      verified: false,
      hasExistingUser: false,
    });
  } catch (error) {
    console.error('[API] Session status error:', error);
    return NextResponse.json(
      { error: 'Failed to check session status' },
      { status: 500 }
    );
  }
}
