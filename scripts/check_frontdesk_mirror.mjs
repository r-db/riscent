// Red-first check (2026-09-13): bookings mirrored to FrontDesk must carry Pacific wall-clock time,
// because FrontDesk's riscent tenant reads slots as local time in America/Los_Angeles.
// Run: node --experimental-strip-types scripts/check_frontdesk_mirror.mjs
import fs from 'node:fs';
let fails = 0;
const ok = (c, m) => { console.log((c ? 'PASS ' : 'FAIL ') + m); if (!c) fails++; };
const { toZonedLocal } = await import('../src/lib/tzlocal.ts');
ok(toZonedLocal('2026-09-21T17:00:00.000Z', 'America/Los_Angeles') === '2026-09-21T10:00:00', 'PDT: 17:00Z -> 10:00 local');
ok(toZonedLocal('2026-12-01T18:30:00.000Z', 'America/Los_Angeles') === '2026-12-01T10:30:00', 'PST: 18:30Z -> 10:30 local');
ok(toZonedLocal('2026-09-22T06:30:00.000Z', 'America/Los_Angeles') === '2026-09-21T23:30:00', 'date rolls back across midnight');
const src = fs.readFileSync(new URL('../src/lib/booking.ts', import.meta.url), 'utf8');
const seg = src.slice(src.indexOf('async function mirrorToFrontDesk'), src.indexOf('export async function createAppointment'));
ok(!/slotStart\.slice\(0,\s*19\)/.test(seg), 'mirror no longer sends the UTC slice');
ok(/toZonedLocal\(slotStart, TZ\)/.test(seg), 'mirror sends Pacific local time');
console.log(fails ? `FRONTDESK MIRROR CHECK: RED (${fails})` : 'FRONTDESK MIRROR CHECK: GREEN');
process.exit(fails ? 1 : 0);
