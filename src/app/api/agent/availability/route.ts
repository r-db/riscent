import { NextRequest, NextResponse } from 'next/server';
import { agentAuthorized } from '@/lib/appointment_agent';
import { getAvailability } from '@/lib/booking';

export const dynamic = 'force-dynamic';

// READ — GET /api/agent/availability?date=YYYY-MM-DD  → true open 30-min slots (no scarcity).
export async function GET(request: NextRequest) {
  if (!agentAuthorized(request)) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  try {
    const date = new URL(request.url).searchParams.get('date') || '';
    const slots = (await getAvailability(date)).filter(s => !s.taken);
    return NextResponse.json({ date, open: slots.map(s => ({ slot: s.iso, label: s.label })) });
  } catch (e) { console.error('[agent/availability]', e); return NextResponse.json({ error: 'server_error' }, { status: 500 }); }
}
