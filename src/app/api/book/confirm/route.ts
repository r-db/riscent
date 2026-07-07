import { NextRequest, NextResponse } from 'next/server';
import { verifyBookingCode, isPhoneVerified, createAppointment } from '@/lib/booking';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { name, phone, code, slot } = await request.json();
    if (!name || !phone || !slot) {
      return NextResponse.json({ error: 'Name, phone, and a time slot are required.' }, { status: 400 });
    }
    // Verify the code unless this phone is already verified in the last 30 minutes.
    if (!(await isPhoneVerified(phone))) {
      if (!code) return NextResponse.json({ error: 'Enter the code we texted you.' }, { status: 400 });
      const v = await verifyBookingCode(phone, code);
      if (!v.ok) return NextResponse.json({ error: v.error }, { status: 400 });
    }
    const r = await createAppointment(name, phone, slot);
    if (!r.ok) return NextResponse.json({ error: r.error }, { status: 409 });
    return NextResponse.json({ ok: true, label: r.label });
  } catch (err) {
    console.error('[book/confirm]', err);
    return NextResponse.json({ error: 'Could not confirm the booking.' }, { status: 500 });
  }
}
