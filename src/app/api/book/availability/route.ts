import { NextRequest, NextResponse } from 'next/server';
import { getAvailability } from '@/lib/booking';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const date = new URL(request.url).searchParams.get('date') || '';
    const slots = await getAvailability(date);
    return NextResponse.json({ slots });
  } catch (err) {
    console.error('[book/availability]', err);
    return NextResponse.json({ error: 'Could not load availability.' }, { status: 500 });
  }
}
