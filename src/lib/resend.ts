/**
 * Resend email sender — drop-in, no SDK (calls the REST API via fetch, same pattern as
 * lib/simpletexting.ts). Powers the email verification path on /book so bookings work even
 * while the SMS/A2P API is gated.
 *
 * Env:
 *   RESEND_API_KEY   — API key from the Resend dashboard (Settings → API Keys)
 *   RESEND_FROM      — verified sending identity, e.g. "Riscent <verify@riscent.com>"
 *                      (the domain must be verified in Resend → Domains)
 *   RYAN_ALERT_EMAIL — where new-booking alerts go (default ryan@riscent.com)
 *
 * Returns { success, id?, error? } like the SMS senders. No-ops with a log if unconfigured.
 */
const key = process.env.RESEND_API_KEY || '';
const FROM = process.env.RESEND_FROM || 'Riscent <verify@riscent.com>';
const RESEND_ENDPOINT = 'https://api.resend.com/emails';

export function isEmailConfigured(): boolean {
  return Boolean(key);
}

export async function sendEmail(opts: {
  to: string; subject: string; html: string; text?: string; from?: string; replyTo?: string;
}): Promise<{ success: boolean; id?: string; error?: string }> {
  if (!key) {
    console.warn('[Resend] Not configured — email would be sent to:', opts.to);
    console.log('[Resend] Subject:', opts.subject);
    return { success: false, error: 'not_configured' };
  }
  try {
    const res = await fetch(RESEND_ENDPOINT, {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: opts.from || FROM,
        to: [opts.to],
        subject: opts.subject,
        html: opts.html,
        ...(opts.text ? { text: opts.text } : {}),
        ...(opts.replyTo ? { reply_to: opts.replyTo } : {}),
      }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      console.error('[Resend] send failed:', data);
      return { success: false, error: data?.message || `HTTP ${res.status}` };
    }
    return { success: true, id: data?.id };
  } catch (err) {
    console.error('[Resend] send error:', err);
    return { success: false, error: (err as Error).message };
  }
}

/* Minimal, on-brand HTML for the one-time code email. */
export function otpEmailHtml(code: string, label?: string): string {
  const purpose = label
    ? `to confirm your 30-minute call with Ryan on <strong>${label}</strong>`
    : 'to verify it&rsquo;s you';
  return `<div style="font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;max-width:480px;margin:0 auto;padding:8px">
    <div style="font-weight:800;font-size:18px;color:#0A2A92;letter-spacing:-.02em;margin-bottom:16px">Riscent</div>
    <p style="font-size:15px;color:#31241F;line-height:1.5;margin:0 0 20px">Here&rsquo;s your verification code ${purpose}:</p>
    <div style="font-size:34px;font-weight:800;letter-spacing:.32em;color:#0A2A92;background:#EEF2FF;border-radius:12px;padding:18px 0;text-align:center;margin:0 0 20px">${code}</div>
    <p style="font-size:13px;color:#6B6560;line-height:1.5;margin:0 0 6px">It expires in 10 minutes. You&rsquo;re receiving this because you requested verification at riscent.com &mdash; if that wasn&rsquo;t you, ignore this email.</p>
    <p style="font-size:12px;color:#9A948E;line-height:1.5;margin:16px 0 0">Riscent, LLC &middot; This is a transactional message about your booking, not marketing.</p>
  </div>`;
}
