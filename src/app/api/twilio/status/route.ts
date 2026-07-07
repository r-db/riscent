/**
 * Twilio SMS status callback.
 * Twilio POSTs delivery status here (queued -> sending -> sent -> delivered | undelivered | failed).
 * Configure this URL as the Messaging Service / number "status callback", or it is attached
 * automatically to every message we send (see lib/twilio.ts).
 *
 * URL: https://riscent.com/api/twilio/status
 */
import { NextRequest, NextResponse } from 'next/server';
import { createHmac, timingSafeEqual } from 'node:crypto';
import { sql } from '@/lib/db';

export const dynamic = 'force-dynamic';

// Twilio request signature (HMAC-SHA1 over full URL + sorted params, base64).
function validSignature(authToken: string, signature: string, url: string, params: Record<string, string>): boolean {
  const data = Object.keys(params).sort().reduce((acc, k) => acc + k + params[k], url);
  const expected = createHmac('sha1', authToken).update(Buffer.from(data, 'utf-8')).digest('base64');
  try { return timingSafeEqual(Buffer.from(expected), Buffer.from(signature)); } catch { return false; }
}

function mask(phone: string): string {
  return phone ? phone.slice(0, -4).replace(/\d/g, '•') + phone.slice(-4) : '';
}

export async function POST(request: NextRequest) {
  try {
    const form = await request.formData();
    const params: Record<string, string> = {};
    form.forEach((v, k) => { params[k] = String(v); });

    // Verify it's really Twilio (best-effort — log mismatch, don't drop the callback).
    const token = process.env.TWILIO_AUTH_TOKEN;
    const sig = request.headers.get('x-twilio-signature');
    const host = request.headers.get('x-forwarded-host') || request.headers.get('host') || 'riscent.com';
    const url = `https://${host}/api/twilio/status`;
    const verified = Boolean(token && sig && validSignature(token, sig, url, params));
    if (token && sig && !verified) console.warn('[twilio/status] signature mismatch — possible spoof');

    const sid = params.MessageSid || params.SmsSid || '';
    const status = params.MessageStatus || params.SmsStatus || 'unknown';
    const to = params.To || '';
    const errorCode = params.ErrorCode || null;

    console.log(`[twilio/status] ${sid} -> ${status}${errorCode ? ` (error ${errorCode})` : ''} to ${mask(to)}${verified ? '' : ' [unverified]'}`);

    if (sid) {
      await sql`
        CREATE TABLE IF NOT EXISTS sms_delivery (
          message_sid text PRIMARY KEY,
          status text NOT NULL,
          to_masked text,
          error_code text,
          verified boolean NOT NULL DEFAULT false,
          updated_at timestamptz NOT NULL DEFAULT now()
        )`;
      await sql`
        INSERT INTO sms_delivery (message_sid, status, to_masked, error_code, verified, updated_at)
        VALUES (${sid}, ${status}, ${mask(to)}, ${errorCode}, ${verified}, now())
        ON CONFLICT (message_sid) DO UPDATE
          SET status = EXCLUDED.status, error_code = EXCLUDED.error_code, verified = EXCLUDED.verified, updated_at = now()`;
    }

    // Twilio expects a 2xx; empty body is fine.
    return new NextResponse(null, { status: 204 });
  } catch (err) {
    console.error('[twilio/status]', err);
    // Still 200 so Twilio does not retry-storm on our internal error.
    return new NextResponse(null, { status: 200 });
  }
}

// Health check so you can confirm the URL is live before pasting it into Twilio.
export async function GET() {
  return NextResponse.json({ ok: true, endpoint: 'twilio-sms-status-callback', method: 'POST' });
}
