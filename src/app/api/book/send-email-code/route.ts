import { NextRequest, NextResponse } from 'next/server';
import { sendBookingEmailCode } from '@/lib/booking';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();
    if (!email) return NextResponse.json({ error: 'Email is required.' }, { status: 400 });
    const r = await sendBookingEmailCode(email);
    if (!r.ok) return NextResponse.json({ error: r.error }, { status: 400 });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[book/send-email-code]', err);
    return NextResponse.json({ error: 'Could not send the code.' }, { status: 500 });
  }
}
