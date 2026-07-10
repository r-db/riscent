import { NextRequest, NextResponse } from 'next/server';
import { isPhoneVerified, findUpcomingAppointmentByPhone, saveIntake } from '@/lib/booking';
import { intakeTurn, type IntakeMessage } from '@/lib/intake';

export const dynamic = 'force-dynamic';

const MAX_TURNS = 30;      // hard stop on conversation length
const MAX_CHARS = 1500;    // per message

export async function POST(request: NextRequest) {
  try {
    const { phone, messages } = await request.json();
    if (typeof phone !== 'string' || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: 'phone and messages are required.' }, { status: 400 });
    }
    const clean: IntakeMessage[] = messages
      .filter((m) => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
      .map((m) => ({ role: m.role, content: m.content.slice(0, MAX_CHARS) }));
    if (clean.length === 0 || clean.length > MAX_TURNS || clean[clean.length - 1].role !== 'user') {
      return NextResponse.json({ error: 'Invalid conversation.' }, { status: 400 });
    }

    // The gate: only a phone verified in the last 30 minutes, with a real upcoming
    // booking, may talk to the intake agent.
    if (!(await isPhoneVerified(phone))) {
      return NextResponse.json({ error: 'Phone not verified.' }, { status: 403 });
    }
    const appt = await findUpcomingAppointmentByPhone(phone);
    if (!appt) {
      return NextResponse.json({ error: 'No upcoming appointment for this phone.' }, { status: 403 });
    }

    const turn = await intakeTurn(appt.name, clean);

    // Persist every turn — a visitor who closes the tab mid-chat still leaves
    // Ryan whatever was gathered so far.
    const transcript = [...clean, { role: 'assistant', content: turn.reply }];
    await saveIntake(appt.id, transcript, turn.summary, turn.topics);

    return NextResponse.json({ reply: turn.reply, complete: turn.complete });
  } catch (err) {
    console.error('[book/intake]', err);
    return NextResponse.json({ error: 'The assistant hit a snag. Try again.' }, { status: 500 });
  }
}
