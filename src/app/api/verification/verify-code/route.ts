/**
 * POST /api/verification/verify-code
 * Verify the SMS code and create/update verified user
 */

import { NextRequest, NextResponse } from 'next/server';
import { queryOne, sql } from '@/lib/db';
import { formatPhoneNumber } from '@/lib/twilio';
import { audit } from '@/lib/audit';

export const dynamic = 'force-dynamic';

interface VerifyCodeRequest {
  phoneNumber: string;
  code: string;
  fullName: string;
  visitorId: string;
  sessionId: string;
  smsConsent: boolean;
  callConsent: boolean;
}

interface PendingVerification {
  verification_id: string;
  attempts: number;
}

interface VerifiedUser {
  user_id: string;
  full_name: string;
  phone_number: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: VerifyCodeRequest = await request.json();
    const { phoneNumber, code, fullName, visitorId, sessionId, smsConsent, callConsent } = body;

    if (!phoneNumber || !code || !fullName || !visitorId || !sessionId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const formattedPhone = formatPhoneNumber(phoneNumber);

    // Find pending verification
    const verification = await queryOne<PendingVerification>(
      `SELECT verification_id, attempts
      FROM phone_verifications
      WHERE phone_number = $1
        AND code = $2
        AND status = 'pending'
        AND expires_at > NOW()`,
      [formattedPhone, code]
    );

    if (!verification) {
      // Check if there's a pending verification with different code (wrong code)
      const wrongCode = await queryOne<PendingVerification>(
        `SELECT verification_id, attempts
        FROM phone_verifications
        WHERE phone_number = $1
          AND status = 'pending'
          AND expires_at > NOW()
        ORDER BY created_at DESC
        LIMIT 1`,
        [formattedPhone]
      );

      if (wrongCode) {
        // Increment attempts
        await sql`
          UPDATE phone_verifications
          SET attempts = attempts + 1
          WHERE verification_id = ${wrongCode.verification_id}::uuid
        `;

        const newAttempts = wrongCode.attempts + 1;

        if (newAttempts >= 3) {
          // Mark as failed after 3 attempts
          await sql`
            UPDATE phone_verifications
            SET status = 'failed'
            WHERE verification_id = ${wrongCode.verification_id}::uuid
          `;

          return NextResponse.json(
            { error: 'Too many incorrect attempts. Please request a new code.' },
            { status: 403 }
          );
        }

        return NextResponse.json(
          { error: 'Invalid verification code', attemptsRemaining: 3 - newAttempts },
          { status: 400 }
        );
      }

      return NextResponse.json(
        { error: 'Verification code expired or not found' },
        { status: 400 }
      );
    }

    // Mark verification as verified
    await sql`
      UPDATE phone_verifications
      SET status = 'verified'
      WHERE verification_id = ${verification.verification_id}::uuid
    `;

    // Create or update verified user
    const existingUser = await queryOne<VerifiedUser>(
      `SELECT user_id, full_name, phone_number
      FROM verified_users
      WHERE phone_number = $1`,
      [formattedPhone]
    );

    let userId: string;

    if (existingUser) {
      // Update existing user
      await sql`
        UPDATE verified_users
        SET
          full_name = ${fullName},
          phone_verified = TRUE,
          phone_verified_at = NOW(),
          sms_consent = ${smsConsent},
          call_consent = ${callConsent},
          visitor_id = ${visitorId}::uuid,
          updated_at = NOW()
        WHERE user_id = ${existingUser.user_id}::uuid
      `;
      userId = existingUser.user_id;
    } else {
      // Create new verified user
      const newUser = await queryOne<{ user_id: string }>(
        `INSERT INTO verified_users (full_name, phone_number, phone_verified, phone_verified_at, sms_consent, call_consent, visitor_id)
        VALUES ($1, $2, TRUE, NOW(), $3, $4, $5::uuid)
        RETURNING user_id`,
        [fullName, formattedPhone, smsConsent, callConsent, visitorId]
      );
      userId = newUser!.user_id;
    }

    // Create session verification record
    await sql`
      INSERT INTO session_verifications (session_id, user_id, phone_verified, verified_at)
      VALUES (${sessionId}::uuid, ${userId}::uuid, TRUE, NOW())
      ON CONFLICT (session_id, user_id) DO UPDATE
      SET phone_verified = TRUE, verified_at = NOW()
    `;

    // Update visitor with known name
    await sql`
      UPDATE visitors
      SET known_name = ${fullName}
      WHERE visitor_id = ${visitorId}::uuid
    `;

    // Audit the verification
    await audit({
      action: 'phone_verified',
      entityType: 'verified_user',
      entityId: userId,
      actorType: 'visitor',
      actorId: visitorId,
      metadata: {
        phoneNumber: formattedPhone.slice(0, -4) + '****',
        smsConsent,
        callConsent,
      },
      ipAddress: request.headers.get('x-forwarded-for') || undefined,
      userAgent: request.headers.get('user-agent') || undefined,
    });

    return NextResponse.json({
      success: true,
      userId,
      message: 'Phone verified successfully',
    });
  } catch (error) {
    console.error('[API] Verify code error:', error);
    return NextResponse.json(
      { error: 'Failed to verify code' },
      { status: 500 }
    );
  }
}
