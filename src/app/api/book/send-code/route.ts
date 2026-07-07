import { NextRequest, NextResponse } from 'next/server';
import { sendBookingCode } from '@/lib/booking';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { phone } = await request.json();
    if (!phone || typeof phone !== 'string') {
      return NextResponse.json({ error: 'Phone number is required.' }, { status: 400 });
    }
    const res = await sendBookingCode(phone);
    if (!res.ok) return NextResponse.json({ error: res.error }, { status: 400 });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[book/send-code]', err);
    return NextResponse.json({ error: 'Could not send the code.' }, { status: 500 });
  }
}
