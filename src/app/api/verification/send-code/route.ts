/**
 * POST /api/verification/send-code
 * Send SMS verification code to phone number
 */

import { NextRequest, NextResponse } from 'next/server';
import { queryOne, sql } from '@/lib/db';
import { sendSMS, generateVerificationCode, formatPhoneNumber } from '@/lib/twilio';
import { audit } from '@/lib/audit';

export const dynamic = 'force-dynamic';

interface SendCodeRequest {
  phoneNumber: string;
  visitorId: string;
}

interface RateLimitCheck {
  check_verification_rate_limit: boolean;
}

export async function POST(request: NextRequest) {
  try {
    const body: SendCodeRequest = await request.json();
    const { phoneNumber, visitorId } = body;

    if (!phoneNumber || !visitorId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Format phone number
    const formattedPhone = formatPhoneNumber(phoneNumber);

    // Check rate limit (max 3 pending codes per phone in 10 minutes)
    const rateCheck = await queryOne<RateLimitCheck>(
      `SELECT check_verification_rate_limit($1)`,
      [formattedPhone]
    );

    if (!rateCheck?.check_verification_rate_limit) {
      return NextResponse.json(
        { error: 'Too many verification attempts. Please try again in 10 minutes.' },
        { status: 429 }
      );
    }

    // Generate code
    const code = generateVerificationCode();

    // Store verification record (expires in 10 minutes)
    await sql`
      INSERT INTO phone_verifications (phone_number, code, visitor_id, expires_at)
      VALUES (
        ${formattedPhone},
        ${code},
        ${visitorId}::uuid,
        NOW() + INTERVAL '10 minutes'
      )
    `;

    // Send SMS
    const smsResult = await sendSMS(
      formattedPhone,
      `Your Riscent verification code is: ${code}. This code expires in 10 minutes.`
    );

    if (!smsResult.success) {
      // Mark verification as failed
      await sql`
        UPDATE phone_verifications
        SET status = 'failed'
        WHERE phone_number = ${formattedPhone}
          AND code = ${code}
      `;

      return NextResponse.json(
        { error: 'Failed to send verification code' },
        { status: 500 }
      );
    }

    // Audit the verification attempt
    await audit({
      action: 'verification_code_sent',
      entityType: 'phone_verification',
      actorType: 'visitor',
      actorId: visitorId,
      metadata: {
        phoneNumber: formattedPhone.slice(0, -4) + '****', // Masked for logging
        messageId: smsResult.messageId,
      },
      ipAddress: request.headers.get('x-forwarded-for') || undefined,
      userAgent: request.headers.get('user-agent') || undefined,
    });

    return NextResponse.json({
      success: true,
      message: 'Verification code sent',
      // Don't return the code in production!
      ...(process.env.NODE_ENV === 'development' && { devCode: code }),
    });
  } catch (error) {
    console.error('[API] Send verification code error:', error);
    return NextResponse.json(
      { error: 'Failed to send verification code' },
      { status: 500 }
    );
  }
}
