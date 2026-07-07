import { NextRequest, NextResponse } from 'next/server';
import { getOfferedAvailability } from '@/lib/booking';
import { getIPHash } from '@/lib/ip-hash';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const date = url.searchParams.get('date') || '';
    const device = (url.searchParams.get('device') || '').slice(0, 64);
    const ipHash = getIPHash(request);
    const { slots, offeredCount } = await getOfferedAvailability(date, ipHash, device);
    return NextResponse.json({ slots, offeredCount });
  } catch (err) {
    console.error('[book/availability]', err);
    return NextResponse.json({ error: 'Could not load availability.' }, { status: 500 });
  }
}
