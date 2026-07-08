/**
 * Twilio SMS Client
 * Wrapped with circuit breaker per Block Theory
 */

import { withCircuitBreaker } from './circuit-breaker';
import { sendViaSimpleTexting } from './simpletexting';

interface TwilioConfig {
  accountSid: string;
  authToken: string;
  fromNumber: string;
}

const config: TwilioConfig = {
  accountSid: process.env.TWILIO_ACCOUNT_SID || '',
  authToken: process.env.TWILIO_AUTH_TOKEN || '',
  fromNumber: process.env.TWILIO_PHONE_NUMBER || '',
};

/**
 * Check if Twilio is configured
 */
export function isTwilioConfigured(): boolean {
  return Boolean(config.accountSid && config.authToken && config.fromNumber);
}

/**
 * Send an SMS. Dispatches to the provider named by SMS_PROVIDER
 * ('simpletexting' or default 'twilio'). The number is normalized to E.164 once
 * here so every provider receives the same format. Booking code calls this and
 * never needs to know which provider is active.
 */
export async function sendSMS(
  to: string,
  body: string
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const dest = formatPhoneNumber(to);
  const provider = (process.env.SMS_PROVIDER || 'twilio').toLowerCase();
  if (provider === 'simpletexting') return sendViaSimpleTexting(dest, body);
  return sendViaTwilio(dest, body);
}

/**
 * Send SMS via Twilio API
 */
async function sendViaTwilio(
  to: string,
  body: string
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  if (!isTwilioConfigured()) {
    console.warn('[Twilio] Not configured - SMS would be sent to:', to);
    // In development, log the code instead of sending
    console.log('[Twilio] Message body:', body);
    return { success: true, messageId: 'dev-mode-' + Date.now() };
  }

  return withCircuitBreaker('twilio', async () => {
    const url = `https://api.twilio.com/2010-04-01/Accounts/${config.accountSid}/Messages.json`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: 'Basic ' + Buffer.from(`${config.accountSid}:${config.authToken}`).toString('base64'),
      },
      body: new URLSearchParams({
        To: to,
        From: config.fromNumber,
        Body: body,
        // Twilio POSTs delivery status here (see /api/twilio/status).
        StatusCallback: process.env.TWILIO_STATUS_CALLBACK_URL || 'https://riscent.com/api/twilio/status',
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('[Twilio] SMS send failed:', error);
      return { success: false, error: 'Failed to send SMS' };
    }

    const data = await response.json();
    return { success: true, messageId: data.sid };
  }, {
    timeout: 10000,
    errorThreshold: 3,
  });
}

/**
 * Generate a 6-digit verification code
 */
export function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Format phone number to E.164 format for Twilio
 */
export function formatPhoneNumber(phone: string): string {
  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, '');

  // If starts with 1 (US), add +
  if (digits.length === 11 && digits.startsWith('1')) {
    return '+' + digits;
  }

  // If 10 digits, assume US and add +1
  if (digits.length === 10) {
    return '+1' + digits;
  }

  // Otherwise return as-is with + prefix
  return '+' + digits;
}
