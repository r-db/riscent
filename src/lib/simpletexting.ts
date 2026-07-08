/**
 * SimpleTexting SMS sender — drop-in alternative to Twilio.
 *
 * Selected at runtime by SMS_PROVIDER=simpletexting (see lib/twilio.ts sendSMS dispatcher).
 * Lets us test the OTP + confirmation flow during SimpleTexting's 14-day trial while
 * Twilio A2P 10DLC approval is pending — no changes to the booking code.
 *
 * Env:
 *   SIMPLETEXTING_API_TOKEN    — API token from the SimpleTexting dashboard (Settings → API)
 *   SIMPLETEXTING_ACCOUNT_PHONE— your SimpleTexting sending number, E.164 (e.g. +19165551234)
 *
 * Returns the SAME shape as twilio.sendSMS: { success, messageId?, error? }.
 */
import { withCircuitBreaker } from './circuit-breaker';

const token = process.env.SIMPLETEXTING_API_TOKEN || '';
const accountPhone = process.env.SIMPLETEXTING_ACCOUNT_PHONE || '';

// SimpleTexting REST API v2 — single outbound SMS.
const ST_ENDPOINT = process.env.SIMPLETEXTING_API_URL || 'https://api-app2.simpletexting.com/v2/api/messages';

export function isSimpleTextingConfigured(): boolean {
  return Boolean(token && accountPhone);
}

export async function sendViaSimpleTexting(
  to: string,
  body: string
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  if (!isSimpleTextingConfigured()) {
    console.warn('[SimpleTexting] Not configured - SMS would be sent to:', to);
    console.log('[SimpleTexting] Message body:', body);
    return { success: true, messageId: 'dev-mode-st-' + Date.now() };
  }

  return withCircuitBreaker('simpletexting', async () => {
    const response = await fetch(ST_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        contactPhone: to,
        accountPhone,
        mode: 'SINGLE_SMS_STANDARD',
        text: body,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('[SimpleTexting] SMS send failed:', error);
      return { success: false, error: 'Failed to send SMS' };
    }

    const data = await response.json().catch(() => ({}));
    return { success: true, messageId: data.id || data.messageId || 'st-sent' };
  }, {
    timeout: 10000,
    errorThreshold: 3,
  });
}
