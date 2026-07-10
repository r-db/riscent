/**
 * /team/appointments — employee view of booked calls.
 * Clerk-gated (route is not in the public matcher; auth() double-checks).
 * Shows who booked, when, verified contact, and what they want to talk about
 * (intake summary + topics + full transcript from the intake agent).
 */
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { query } from '@/lib/db';
import { ensureSchema } from '@/lib/booking';

export const dynamic = 'force-dynamic';

interface ApptRow {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  slot_start: string;
  status: string;
  created_at: string;
  intake_summary: string | null;
  intake_topics: string | null;
  intake_transcript: { role: string; content: string }[] | null;
}

const PT = new Intl.DateTimeFormat('en-US', {
  timeZone: 'America/Los_Angeles',
  weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit',
});

export default async function AppointmentsPage() {
  const { userId } = await auth();
  if (!userId) redirect('/sign-in?redirect_url=/team/appointments');

  await ensureSchema();
  const appts = await query<ApptRow>(
    `SELECT id, name, phone, email, slot_start, status, created_at,
            intake_summary, intake_topics, intake_transcript
     FROM appointments
     ORDER BY slot_start DESC
     LIMIT 200`
  );

  const upcoming = appts.filter((a) => a.status === 'booked' && new Date(a.slot_start) > new Date());
  const past = appts.filter((a) => !(a.status === 'booked' && new Date(a.slot_start) > new Date()));

  return (
    <main className="min-h-screen px-4 py-10 md:px-8" style={{ background: 'var(--bg-primary, #FAF8F4)' }}>
      <div className="max-w-4xl mx-auto">
        <h1 className="font-black tracking-[-0.03em] mb-1" style={{ color: 'var(--cocoa, #31241F)', fontSize: 30 }}>Appointments</h1>
        <p className="text-sm mb-8" style={{ color: 'var(--text-muted, #8A7E75)' }}>
          {upcoming.length} upcoming · booked through riscent.com/book · times shown in Pacific
        </p>

        <Section title="Upcoming" appts={upcoming} empty="Nothing on the calendar yet." />
        <Section title="Past & other" appts={past} empty="No history yet." />
      </div>
    </main>
  );
}

function Section({ title, appts, empty }: { title: string; appts: ApptRow[]; empty: string }) {
  return (
    <section className="mb-10">
      <h2 className="text-[12px] font-bold tracking-[0.12em] uppercase mb-3" style={{ color: 'var(--text-muted, #8A7E75)' }}>{title}</h2>
      {appts.length === 0 ? (
        <p className="text-sm" style={{ color: 'var(--text-muted, #8A7E75)' }}>{empty}</p>
      ) : (
        <div className="flex flex-col gap-3">
          {appts.map((a) => (
            <details key={a.id} className="rounded-2xl overflow-hidden" style={{ background: '#fff', border: '1px solid var(--border-light, #EAE4DB)' }}>
              <summary className="cursor-pointer px-5 py-4 flex flex-wrap items-baseline gap-x-4 gap-y-1 list-none">
                <span className="font-bold text-[15px]" style={{ color: 'var(--cocoa, #31241F)' }}>{a.name}</span>
                <span className="text-[13px] font-semibold" style={{ color: 'var(--torea, #2D3A8C)' }}>{PT.format(new Date(a.slot_start))} PT</span>
                <span className="text-[13px]" style={{ color: 'var(--text-muted, #8A7E75)' }}>{a.phone || a.email}</span>
                {a.status !== 'booked' && <span className="text-[11px] font-bold uppercase" style={{ color: '#B4552D' }}>{a.status}</span>}
                <span className="text-[13px] w-full" style={{ color: 'var(--text-secondary, #5A4F47)' }}>
                  {a.intake_summary || <em style={{ color: 'var(--text-muted, #8A7E75)' }}>No intake yet — they skipped the chat.</em>}
                </span>
              </summary>
              <div className="px-5 pb-5" style={{ borderTop: '1px solid var(--border-light, #EAE4DB)' }}>
                {a.intake_topics && (
                  <p className="text-[13px] mt-4"><strong style={{ color: 'var(--cocoa, #31241F)' }}>Topics:</strong> <span style={{ color: 'var(--text-secondary, #5A4F47)' }}>{a.intake_topics}</span></p>
                )}
                {a.intake_transcript && a.intake_transcript.length > 0 ? (
                  <div className="mt-4 flex flex-col gap-2">
                    {a.intake_transcript.map((m, i) => (
                      <div key={i} className={`max-w-[85%] px-3.5 py-2 rounded-xl text-[13px] leading-relaxed ${m.role === 'user' ? 'self-end' : 'self-start'}`}
                        style={m.role === 'user' ? { background: 'var(--danube-pale, #E8ECFA)', color: 'var(--cocoa, #31241F)' } : { background: 'var(--bg-primary, #FAF8F4)', color: 'var(--text-secondary, #5A4F47)', border: '1px solid var(--border-light, #EAE4DB)' }}>
                        <span className="block text-[10px] font-bold uppercase tracking-wide opacity-60">{m.role === 'user' ? a.name.split(' ')[0] : 'Assistant'}</span>
                        {m.content}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[13px] mt-4" style={{ color: 'var(--text-muted, #8A7E75)' }}>No conversation recorded.</p>
                )}
                <p className="text-[11px] mt-4" style={{ color: 'var(--text-muted, #8A7E75)' }}>Booked {PT.format(new Date(a.created_at))} PT</p>
              </div>
            </details>
          ))}
        </div>
      )}
    </section>
  );
}
