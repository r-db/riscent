/**
 * Booking core — 30-minute appointment slots with SMS-verified confirmation.
 * Slots are generated server-side in Pacific time (DST-safe) so the client
 * never computes timezones. Double-booking is prevented by a partial unique index.
 */

import { sql, query, queryOne } from '@/lib/db';
import { sendSMS, generateVerificationCode, formatPhoneNumber } from '@/lib/twilio';

export const TZ = 'America/Los_Angeles';
const DAYS_AHEAD = 21;          // booking window
const OPEN_HOUR = 9;            // 9:00 AM PT
const CLOSE_HOUR = 20;          // last slot ends 8:00 PM PT (morning / afternoon / evening)
const SLOT_MIN = 30;

// Scarcity: offer few, narrow on each return visit — drive the decision.
const START_OFFER = 5;          // max slots offered on a first visit
const FLOOR = 1;                // never below this — the last slot stays open until booked
const REDUCE_AFTER_MS = 20 * 60 * 1000; // a "come back" = a new visit after this gap

let schemaReady = false;

export async function ensureSchema(): Promise<void> {
  if (schemaReady) return;
  await sql`
    CREATE TABLE IF NOT EXISTS booking_verifications (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      phone text NOT NULL,
      code text NOT NULL,
      attempts int NOT NULL DEFAULT 0,
      status text NOT NULL DEFAULT 'pending',
      expires_at timestamptz NOT NULL,
      created_at timestamptz NOT NULL DEFAULT now()
    )`;
  await sql`CREATE INDEX IF NOT EXISTS idx_bv_phone ON booking_verifications (phone, created_at DESC)`;
  await sql`
    CREATE TABLE IF NOT EXISTS appointments (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      name text NOT NULL,
      phone text NOT NULL,
      slot_start timestamptz NOT NULL,
      slot_end timestamptz NOT NULL,
      status text NOT NULL DEFAULT 'booked',
      created_at timestamptz NOT NULL DEFAULT now()
    )`;
  await sql`CREATE UNIQUE INDEX IF NOT EXISTS uniq_active_slot ON appointments (slot_start) WHERE status = 'booked'`;
  await sql`
    CREATE TABLE IF NOT EXISTS booking_scarcity (
      ip_hash text NOT NULL,
      date text NOT NULL,
      device_id text NOT NULL DEFAULT '',
      target int NOT NULL DEFAULT 5,
      last_reduced_at timestamptz NOT NULL DEFAULT now(),
      updated_at timestamptz NOT NULL DEFAULT now(),
      PRIMARY KEY (ip_hash, date)
    )`;
  schemaReady = true;
}

/* Convert a Pacific wall-clock time to the correct UTC instant, DST-safe. */
function pacificToUtc(y: number, mo: number, d: number, h: number, mi: number): Date {
  const guess = Date.UTC(y, mo, d, h, mi);
  // Render the guessed instant in Pacific, read it back, and correct the delta.
  const asPacific = new Date(new Date(guess).toLocaleString('en-US', { timeZone: TZ }));
  const delta = guess - asPacific.getTime();
  return new Date(guess + delta);
}

export interface Slot { iso: string; label: string; }

/* Validate a YYYY-MM-DD is a weekday inside the booking window; returns parts or null. */
function parseBookableDate(dateStr: string): { y: number; mo: number; d: number } | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return null;
  const [y, mo, d] = dateStr.split('-').map(Number);
  // Weekday for this Pacific date, read at noon to avoid DST edges.
  const noonUtc = pacificToUtc(y, mo - 1, d, 12, 0);
  const wdName = new Intl.DateTimeFormat('en-US', { timeZone: TZ, weekday: 'short' }).format(noonUtc);
  if (wdName === 'Sat' || wdName === 'Sun') return null;
  // Window: [today, today + DAYS_AHEAD] compared as YYYY-MM-DD strings (Pacific).
  const todayStr = new Intl.DateTimeFormat('en-CA', { timeZone: TZ }).format(new Date());
  const [ty, tm, tdy] = todayStr.split('-').map(Number);
  const maxStr = new Date(Date.UTC(ty, tm - 1, tdy + DAYS_AHEAD)).toISOString().slice(0, 10);
  if (dateStr < todayStr || dateStr > maxStr) return null;
  return { y, mo: mo - 1, d };
}

/* Generate the day's slots in Pacific. Excludes past slots for today. */
export function generateSlots(dateStr: string): Slot[] {
  const parts = parseBookableDate(dateStr);
  if (!parts) return [];
  const { y, mo, d } = parts;
  const now = Date.now();
  const fmt = new Intl.DateTimeFormat('en-US', { timeZone: TZ, weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
  const slots: Slot[] = [];
  for (let h = OPEN_HOUR; h < CLOSE_HOUR; h++) {
    for (let m = 0; m < 60; m += SLOT_MIN) {
      const start = pacificToUtc(y, mo, d, h, m);
      if (start.getTime() < now + 60 * 60 * 1000) continue; // at least 1h lead time
      slots.push({ iso: start.toISOString(), label: fmt.format(start) + ' PT' });
    }
  }
  return slots;
}

export async function getAvailability(dateStr: string): Promise<{ iso: string; label: string; taken: boolean }[]> {
  await ensureSchema();
  const slots = generateSlots(dateStr);
  if (!slots.length) return [];
  const first = slots[0].iso;
  const last = new Date(new Date(slots[slots.length - 1].iso).getTime() + SLOT_MIN * 60000).toISOString();
  const rows = await query<{ slot_start: string }>(
    `SELECT slot_start FROM appointments WHERE status = 'booked' AND slot_start >= $1::timestamptz AND slot_start < $2::timestamptz`,
    [first, last]
  );
  const taken = new Set(rows.map(r => new Date(r.slot_start).toISOString()));
  return slots.map(s => ({ ...s, taken: taken.has(new Date(s.iso).toISOString()) }));
}

/* Period of a slot in Pacific: morning < 12, afternoon < 17, else evening. */
export function period(iso: string): 'Morning' | 'Afternoon' | 'Evening' {
  const h = Number(new Intl.DateTimeFormat('en-US', { timeZone: TZ, hour: 'numeric', hour12: false }).format(new Date(iso)));
  return h < 12 ? 'Morning' : h < 17 ? 'Afternoon' : 'Evening';
}

/* Order available slots one-per-period first (Morning, Afternoon, Evening), then
   the seconds, etc. The prime slot (index 0) is what survives when scarcity narrows. */
function curate(available: Slot[]): Slot[] {
  const buckets: Record<string, Slot[]> = { Morning: [], Afternoon: [], Evening: [] };
  for (const s of available) buckets[period(s.iso)].push(s);
  const order: Slot[] = [];
  for (let i = 0; ; i++) {
    let added = false;
    for (const p of ['Morning', 'Afternoon', 'Evening']) if (buckets[p][i]) { order.push(buckets[p][i]); added = true; }
    if (!added) break;
  }
  return order;
}

export interface OfferedSlot { iso: string; label: string; period: string; taken: boolean; offered: boolean; }

/* Real availability + per-visitor scarcity: offer few (one per period), narrow by one
   on each genuine return visit (same hashed IP + date), never below the floor. */
export async function getOfferedAvailability(dateStr: string, ipHash: string, deviceId: string): Promise<{ slots: OfferedSlot[]; offeredCount: number }> {
  await ensureSchema();
  const all = generateSlots(dateStr);
  if (!all.length) return { slots: [], offeredCount: 0 };
  const first = all[0].iso;
  const last = new Date(new Date(all[all.length - 1].iso).getTime() + SLOT_MIN * 60000).toISOString();
  const rows = await query<{ slot_start: string }>(
    `SELECT slot_start FROM appointments WHERE status = 'booked' AND slot_start >= $1::timestamptz AND slot_start < $2::timestamptz`,
    [first, last]
  );
  const taken = new Set(rows.map(r => new Date(r.slot_start).toISOString()));
  const available = all.filter(s => !taken.has(new Date(s.iso).toISOString()));
  const curated = curate(available);

  let target = START_OFFER;
  const existing = await queryOne<{ target: number; last_reduced_at: string }>(
    `SELECT target, last_reduced_at FROM booking_scarcity WHERE ip_hash = $1 AND date = $2`, [ipHash, dateStr]
  );
  if (!existing) {
    await query(
      `INSERT INTO booking_scarcity (ip_hash, date, device_id, target, last_reduced_at) VALUES ($1,$2,$3,$4,NOW())
       ON CONFLICT (ip_hash, date) DO NOTHING`, [ipHash, dateStr, deviceId || '', START_OFFER]
    );
  } else if (Date.now() - new Date(existing.last_reduced_at).getTime() > REDUCE_AFTER_MS) {
    target = Math.max(FLOOR, existing.target - 1);
    await query(`UPDATE booking_scarcity SET target = $3, device_id = $4, last_reduced_at = NOW(), updated_at = NOW() WHERE ip_hash = $1 AND date = $2`, [ipHash, dateStr, target, deviceId || '']);
  } else {
    target = existing.target;
  }

  const offeredCount = Math.min(Math.max(target, Math.min(FLOOR, curated.length)), curated.length);
  const offered = new Set(curated.slice(0, offeredCount).map(s => new Date(s.iso).toISOString()));
  const slots = all.map(s => {
    const key = new Date(s.iso).toISOString();
    const isTaken = taken.has(key);
    return { iso: s.iso, label: s.label, period: period(s.iso), taken: isTaken, offered: !isTaken && offered.has(key) };
  });
  return { slots, offeredCount };
}

/* Confirm a slot ISO is a genuine, still-open slot (regenerated, not client-trusted). */
export function isRealSlot(slotIso: string): boolean {
  const dt = new Date(slotIso);
  if (isNaN(dt.getTime())) return false;
  const dateStr = new Intl.DateTimeFormat('en-CA', { timeZone: TZ }).format(dt); // Pacific YYYY-MM-DD
  return generateSlots(dateStr).some(s => new Date(s.iso).getTime() === dt.getTime());
}

export function slotLabel(slotIso: string): string {
  return new Intl.DateTimeFormat('en-US', { timeZone: TZ, weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }).format(new Date(slotIso)) + ' PT';
}

/* ── SMS OTP (booking-scoped) ── */
export async function sendBookingCode(phoneRaw: string): Promise<{ ok: boolean; error?: string }> {
  await ensureSchema();
  const phone = formatPhoneNumber(phoneRaw);
  if (!/^\+\d{10,15}$/.test(phone)) return { ok: false, error: 'Enter a valid phone number.' };
  const recent = await queryOne<{ n: number }>(
    `SELECT COUNT(*)::int AS n FROM booking_verifications WHERE phone = $1 AND created_at > NOW() - INTERVAL '10 minutes'`,
    [phone]
  );
  if ((recent?.n ?? 0) >= 3) return { ok: false, error: 'Too many attempts. Try again in a few minutes.' };
  const code = generateVerificationCode();
  await sql`INSERT INTO booking_verifications (phone, code, expires_at) VALUES (${phone}, ${code}, NOW() + INTERVAL '10 minutes')`;
  const res = await sendSMS(phone, `Your Riscent verification code is ${code}. It expires in 10 minutes. Reply only if you requested a call with Ryan.`);
  if (!res.success) return { ok: false, error: 'Could not send the code. Check the number and try again.' };
  return { ok: true };
}

export async function verifyBookingCode(phoneRaw: string, code: string): Promise<{ ok: boolean; error?: string }> {
  await ensureSchema();
  const phone = formatPhoneNumber(phoneRaw);
  const match = await queryOne<{ id: string }>(
    `SELECT id FROM booking_verifications WHERE phone = $1 AND code = $2 AND status = 'pending' AND expires_at > NOW() ORDER BY created_at DESC LIMIT 1`,
    [phone, (code || '').trim()]
  );
  if (match) {
    await sql`UPDATE booking_verifications SET status = 'verified' WHERE id = ${match.id}::uuid`;
    return { ok: true };
  }
  const pending = await queryOne<{ id: string; attempts: number }>(
    `SELECT id, attempts FROM booking_verifications WHERE phone = $1 AND status = 'pending' AND expires_at > NOW() ORDER BY created_at DESC LIMIT 1`,
    [phone]
  );
  if (!pending) return { ok: false, error: 'Code expired. Request a new one.' };
  const attempts = pending.attempts + 1;
  if (attempts >= 3) {
    await sql`UPDATE booking_verifications SET status = 'failed', attempts = ${attempts} WHERE id = ${pending.id}::uuid`;
    return { ok: false, error: 'Too many incorrect codes. Request a new one.' };
  }
  await sql`UPDATE booking_verifications SET attempts = ${attempts} WHERE id = ${pending.id}::uuid`;
  return { ok: false, error: `Incorrect code. ${3 - attempts} tries left.` };
}

/* True only if the phone has a verified, unexpired booking verification. */
export async function isPhoneVerified(phoneRaw: string): Promise<boolean> {
  const phone = formatPhoneNumber(phoneRaw);
  const v = await queryOne<{ id: string }>(
    `SELECT id FROM booking_verifications WHERE phone = $1 AND status = 'verified' AND created_at > NOW() - INTERVAL '30 minutes' ORDER BY created_at DESC LIMIT 1`,
    [phone]
  );
  return Boolean(v);
}

export async function createAppointment(name: string, phoneRaw: string, slotIso: string): Promise<{ ok: boolean; error?: string; label?: string }> {
  await ensureSchema();
  const phone = formatPhoneNumber(phoneRaw);
  const cleanName = (name || '').trim().slice(0, 120);
  if (cleanName.length < 2) return { ok: false, error: 'Enter your name.' };
  if (!isRealSlot(slotIso)) return { ok: false, error: 'That time is no longer available.' };
  if (!(await isPhoneVerified(phone))) return { ok: false, error: 'Please verify your phone first.' };
  const start = new Date(slotIso);
  const end = new Date(start.getTime() + SLOT_MIN * 60000);
  try {
    await query(
      `INSERT INTO appointments (name, phone, slot_start, slot_end) VALUES ($1, $2, $3::timestamptz, $4::timestamptz)`,
      [cleanName, phone, start.toISOString(), end.toISOString()]
    );
  } catch {
    return { ok: false, error: 'That time was just booked. Please pick another.' };
  }
  const label = slotLabel(slotIso);
  // Alert Ryan — best-effort, never blocks the booking.
  const ryan = process.env.RYAN_ALERT_PHONE;
  if (ryan) {
    try { await sendSMS(ryan, `New Riscent call booked: ${cleanName} (${phone}) — ${label}.`); } catch { /* logged upstream */ }
  } else {
    console.warn('[booking] RYAN_ALERT_PHONE not set — appointment saved, no alert sent.');
  }
  return { ok: true, label };
}
