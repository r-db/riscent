/**
 * Appointment-setter tool layer — for a text or voice LLM agent (e.g. paired with
 * IB365) to read / write / edit appointments with low latency. Trusted access via
 * an API key (APPT_API_KEY); direct Neon queries, no per-turn round-trips.
 *
 * This is the standalone-product surface: no consumer OTP (the agent is trusted),
 * no scarcity narrowing — clean CRUD an LLM can call.
 */
import { query, queryOne } from '@/lib/db';
import { sendSMS, formatPhoneNumber } from '@/lib/twilio';
import { ensureSchema, isRealSlot, slotLabel } from '@/lib/booking';

const SLOT_MIN = 30;

export function agentAuthorized(request: Request): boolean {
  const key = process.env.APPT_API_KEY;
  if (!key) return false; // secure default: no key configured => locked
  const auth = request.headers.get('authorization') || '';
  const bearer = auth.startsWith('Bearer ') ? auth.slice(7) : '';
  const alt = request.headers.get('x-api-key') || '';
  return bearer === key || alt === key;
}

export interface Appt {
  id: string; name: string; phone: string;
  slot_start: string; slot_end: string; status: string; created_at: string;
}

/** READ — list/find appointments by phone and/or window. Newest-relevant first. */
export async function listAppointments(opts: { phone?: string; from?: string; to?: string; status?: string; limit?: number }): Promise<Appt[]> {
  await ensureSchema();
  const where: string[] = [];
  const params: unknown[] = [];
  if (opts.phone) { params.push(formatPhoneNumber(opts.phone)); where.push(`phone = $${params.length}`); }
  if (opts.from) { params.push(new Date(opts.from).toISOString()); where.push(`slot_start >= $${params.length}::timestamptz`); }
  if (opts.to) { params.push(new Date(opts.to).toISOString()); where.push(`slot_start < $${params.length}::timestamptz`); }
  params.push(opts.status || 'booked'); where.push(`status = $${params.length}`);
  params.push(Math.min(opts.limit || 50, 200));
  const rows = await query<Appt>(
    `SELECT id, name, phone, slot_start, slot_end, status, created_at FROM appointments
     WHERE ${where.join(' AND ')} ORDER BY slot_start ASC LIMIT $${params.length}`, params);
  return rows;
}

async function alertRyan(msg: string) {
  const ryan = process.env.RYAN_ALERT_PHONE;
  if (ryan) { try { await sendSMS(ryan, msg); } catch { /* non-blocking */ } }
}

/** WRITE — the agent books on a caller's behalf (no OTP; trusted agent). */
export async function agentCreate(name: string, phone: string, slotIso: string): Promise<{ ok: boolean; id?: string; label?: string; error?: string }> {
  await ensureSchema();
  const cleanName = (name || '').trim().slice(0, 120);
  if (cleanName.length < 2) return { ok: false, error: 'name_required' };
  const p = formatPhoneNumber(phone || '');
  if (!/^\+\d{10,15}$/.test(p)) return { ok: false, error: 'invalid_phone' };
  if (!isRealSlot(slotIso)) return { ok: false, error: 'slot_unavailable' };
  const start = new Date(slotIso);
  const end = new Date(start.getTime() + SLOT_MIN * 60000);
  try {
    const row = await queryOne<{ id: string }>(
      `INSERT INTO appointments (name, phone, slot_start, slot_end) VALUES ($1,$2,$3::timestamptz,$4::timestamptz) RETURNING id`,
      [cleanName, p, start.toISOString(), end.toISOString()]);
    await alertRyan(`New Riscent call (via agent): ${cleanName} (${p}) — ${slotLabel(slotIso)}.`);
    return { ok: true, id: row!.id, label: slotLabel(slotIso) };
  } catch { return { ok: false, error: 'slot_taken' }; }
}

/** EDIT — move an existing appointment to a new slot. */
export async function agentReschedule(id: string, newSlotIso: string): Promise<{ ok: boolean; label?: string; error?: string }> {
  await ensureSchema();
  if (!isRealSlot(newSlotIso)) return { ok: false, error: 'slot_unavailable' };
  const appt = await queryOne<Appt>(`SELECT * FROM appointments WHERE id = $1::uuid AND status = 'booked'`, [id]);
  if (!appt) return { ok: false, error: 'not_found' };
  const start = new Date(newSlotIso);
  const end = new Date(start.getTime() + SLOT_MIN * 60000);
  try {
    await query(`UPDATE appointments SET slot_start = $2::timestamptz, slot_end = $3::timestamptz WHERE id = $1::uuid`,
      [id, start.toISOString(), end.toISOString()]);
    await alertRyan(`Rescheduled: ${appt.name} (${appt.phone}) -> ${slotLabel(newSlotIso)}.`);
    return { ok: true, label: slotLabel(newSlotIso) };
  } catch { return { ok: false, error: 'slot_taken' }; }
}

/** EDIT — cancel (soft delete, frees the slot). */
export async function agentCancel(id: string): Promise<{ ok: boolean; error?: string }> {
  await ensureSchema();
  const appt = await queryOne<Appt>(`SELECT * FROM appointments WHERE id = $1::uuid AND status = 'booked'`, [id]);
  if (!appt) return { ok: false, error: 'not_found' };
  await query(`UPDATE appointments SET status = 'cancelled' WHERE id = $1::uuid`, [id]);
  await alertRyan(`Cancelled: ${appt.name} (${appt.phone}) — ${slotLabel(appt.slot_start)}.`);
  return { ok: true };
}
