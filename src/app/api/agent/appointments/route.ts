import { NextRequest, NextResponse } from 'next/server';
import { agentAuthorized, listAppointments, agentCreate } from '@/lib/appointment_agent';

export const dynamic = 'force-dynamic';

// READ — GET /api/agent/appointments?phone=&from=&to=&status=
export async function GET(request: NextRequest) {
  if (!agentAuthorized(request)) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  try {
    const q = new URL(request.url).searchParams;
    const appts = await listAppointments({
      phone: q.get('phone') || undefined,
      from: q.get('from') || undefined,
      to: q.get('to') || undefined,
      status: q.get('status') || undefined,
      limit: q.get('limit') ? Number(q.get('limit')) : undefined,
    });
    return NextResponse.json({ appointments: appts });
  } catch (e) { console.error('[agent/appts GET]', e); return NextResponse.json({ error: 'server_error' }, { status: 500 }); }
}

// WRITE — POST { name, phone, slot }  (slot = ISO 8601 start)
export async function POST(request: NextRequest) {
  if (!agentAuthorized(request)) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  try {
    const { name, phone, slot } = await request.json();
    const r = await agentCreate(name, phone, slot);
    if (!r.ok) return NextResponse.json({ error: r.error }, { status: 409 });
    return NextResponse.json({ ok: true, id: r.id, label: r.label });
  } catch (e) { console.error('[agent/appts POST]', e); return NextResponse.json({ error: 'server_error' }, { status: 500 }); }
}
