import { NextRequest, NextResponse } from 'next/server';
import { agentAuthorized, agentReschedule, agentCancel } from '@/lib/appointment_agent';

export const dynamic = 'force-dynamic';

// EDIT — PATCH /api/agent/appointments/:id  { slot: ISO }  (reschedule)
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!agentAuthorized(request)) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  try {
    const { id } = await params;
    const { slot } = await request.json();
    if (!slot) return NextResponse.json({ error: 'slot_required' }, { status: 400 });
    const r = await agentReschedule(id, slot);
    if (!r.ok) return NextResponse.json({ error: r.error }, { status: r.error === 'not_found' ? 404 : 409 });
    return NextResponse.json({ ok: true, label: r.label });
  } catch (e) { console.error('[agent/appts PATCH]', e); return NextResponse.json({ error: 'server_error' }, { status: 500 }); }
}

// EDIT — DELETE /api/agent/appointments/:id  (cancel)
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!agentAuthorized(request)) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  try {
    const { id } = await params;
    const r = await agentCancel(id);
    if (!r.ok) return NextResponse.json({ error: r.error }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch (e) { console.error('[agent/appts DELETE]', e); return NextResponse.json({ error: 'server_error' }, { status: 500 }); }
}
