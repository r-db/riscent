import { NextRequest, NextResponse } from 'next/server';
import {
  verifyBookingCode, isPhoneVerified, createAppointment,
  verifyBookingEmailCode, isEmailVerified, createAppointmentByEmail,
} from '@/lib/booking';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { name, phone, email, code, slot } = await request.json();
    if (!name || !slot || (!phone && !email)) {
      return NextResponse.json({ error: 'Name, a phone or email, and a time slot are required.' }, { status: 400 });
    }

    // Email booking path (Resend).
    if (email) {
      if (!(await isEmailVerified(email))) {
        if (!code) return NextResponse.json({ error: 'Enter the code we emailed you.' }, { status: 400 });
        const v = await verifyBookingEmailCode(email, code);
        if (!v.ok) return NextResponse.json({ error: v.error }, { status: 400 });
      }
      const r = await createAppointmentByEmail(name, email, slot);
      if (!r.ok) return NextResponse.json({ error: r.error }, { status: 409 });
      return NextResponse.json({ ok: true, label: r.label });
    }

    // Phone booking path (SMS). Verify the code unless verified in the last 30 minutes.
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
