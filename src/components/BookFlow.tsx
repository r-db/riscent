'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const EASE = [0.2, 0.7, 0.2, 1] as const;
const DAYS_AHEAD = 21;

type Slot = { iso: string; label: string; period: string; taken: boolean; offered: boolean };
type Step = 'day' | 'slot' | 'details' | 'verify' | 'done';

function deviceId(): string {
  try {
    let d = localStorage.getItem('riscent_device');
    if (!d) { d = (crypto.randomUUID ? crypto.randomUUID() : String(Date.now()) + Math.random().toString(36).slice(2)); localStorage.setItem('riscent_device', d); }
    return d;
  } catch { return ''; }
}
const timeOf = (label: string) => (label.split(',').pop() || label).replace('PT', '').trim();

const ymd = (y: number, m: number, d: number) => `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
const WD = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MO = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export default function BookFlow() {
  const today = new Date();
  const todayStr = ymd(today.getFullYear(), today.getMonth(), today.getDate());
  const max = new Date(today); max.setDate(max.getDate() + DAYS_AHEAD);
  const maxStr = ymd(max.getFullYear(), max.getMonth(), max.getDate());

  const [view, setView] = useState({ y: today.getFullYear(), m: today.getMonth() });
  const [step, setStep] = useState<Step>('day');
  const [dayLabel, setDayLabel] = useState('');
  const [slots, setSlots] = useState<Slot[]>([]);
  const [offeredCount, setOfferedCount] = useState(0);
  const [slot, setSlot] = useState<{ iso: string; label: string } | null>(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [confirmed, setConfirmed] = useState('');

  const canPrev = `${view.y}-${String(view.m + 1).padStart(2, '0')}` > `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
  const canNext = `${view.y}-${String(view.m + 1).padStart(2, '0')}` < maxStr.slice(0, 7);

  const daysInMonth = new Date(view.y, view.m + 1, 0).getDate();
  const firstWeekday = new Date(view.y, view.m, 1).getDay();
  const cells: (number | null)[] = [...Array(firstWeekday).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];

  function bookable(day: number) {
    const ds = ymd(view.y, view.m, day);
    const wd = new Date(view.y, view.m, day).getDay();
    return wd !== 0 && wd !== 6 && ds >= todayStr && ds <= maxStr;
  }

  async function pickDay(day: number) {
    const ds = ymd(view.y, view.m, day);
    setError(''); setLoading(true);
    setDayLabel(new Date(view.y, view.m, day).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }));
    setStep('slot');
    try {
      const r = await fetch(`/api/book/availability?date=${ds}&device=${encodeURIComponent(deviceId())}`, { cache: 'no-store' });
      const d = await r.json();
      setSlots(d.slots || []);
      setOfferedCount(d.offeredCount || 0);
    } catch { setError('Could not load times. Try again.'); setSlots([]); }
    setLoading(false);
  }

  async function sendCode() {
    setError('');
    if (name.trim().length < 2) return setError('Enter your name.');
    if (phone.replace(/\D/g, '').length < 10) return setError('Enter a valid mobile number.');
    setLoading(true);
    try {
      const r = await fetch('/api/book/send-code', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ phone }) });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error || 'Could not send the code.');
      setStep('verify');
    } catch (e) { setError((e as Error).message); }
    setLoading(false);
  }

  async function confirm() {
    setError('');
    if (code.trim().length < 6) return setError('Enter the 6-digit code.');
    setLoading(true);
    try {
      const r = await fetch('/api/book/confirm', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, phone, code, slot: slot?.iso }) });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error || 'Could not confirm.');
      setConfirmed(d.label || slot?.label || '');
      setStep('done');
    } catch (e) { setError((e as Error).message); }
    setLoading(false);
  }

  useEffect(() => { setError(''); }, [step]);

  const C = {
    card: { background: '#fff', border: '1px solid var(--border-light)', borderRadius: 20, boxShadow: 'var(--shadow-lg)' } as const,
  };

  return (
    <div className="w-full max-w-[560px] mx-auto">
      {/* progress dots */}
      {step !== 'done' && (
        <div className="flex items-center justify-center gap-2 mb-6">
          {(['day', 'slot', 'details', 'verify'] as Step[]).map((s, i) => {
            const active = ['day', 'slot', 'details', 'verify'].indexOf(step) >= i;
            return <span key={s} className="h-1.5 rounded-full transition-all duration-300" style={{ width: active ? 26 : 14, background: active ? 'var(--torea)' : 'var(--border-medium)' }} />;
          })}
        </div>
      )}

      <div className="p-6 md:p-8" style={C.card}>
        <AnimatePresence mode="wait">
          {/* STEP 1 — pick a day */}
          {step === 'day' && (
            <motion.div key="day" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.3, ease: EASE }}>
              <div className="flex items-center justify-between mb-5">
                <button onClick={() => canPrev && setView(v => ({ y: v.m === 0 ? v.y - 1 : v.y, m: (v.m + 11) % 12 }))} disabled={!canPrev} aria-label="Previous month" className="w-9 h-9 rounded-full grid place-items-center disabled:opacity-25" style={{ border: '1px solid var(--border-light)' }}>&larr;</button>
                <div className="font-black tracking-[-0.02em]" style={{ color: 'var(--cocoa)', fontSize: 18 }}>{MO[view.m]} {view.y}</div>
                <button onClick={() => canNext && setView(v => ({ y: v.m === 11 ? v.y + 1 : v.y, m: (v.m + 1) % 12 }))} disabled={!canNext} aria-label="Next month" className="w-9 h-9 rounded-full grid place-items-center disabled:opacity-25" style={{ border: '1px solid var(--border-light)' }}>&rarr;</button>
              </div>
              <div className="grid grid-cols-7 gap-1 mb-1">
                {WD.map(d => <div key={d} className="text-center text-[11px] font-bold uppercase tracking-wide py-1" style={{ color: 'var(--text-whisper)' }}>{d[0]}</div>)}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {cells.map((day, i) => day === null ? <div key={i} /> : (
                  <button key={i} disabled={!bookable(day)} onClick={() => pickDay(day)}
                    className="aspect-square rounded-xl text-sm font-semibold transition-all disabled:opacity-25 disabled:cursor-not-allowed enabled:hover:-translate-y-0.5"
                    style={bookable(day)
                      ? { background: 'var(--danube-pale)', color: 'var(--torea)', border: '1px solid transparent' }
                      : { background: 'transparent', color: 'var(--text-muted)' }}>
                    {day}
                  </button>
                ))}
              </div>
              <p className="text-[12px] mt-5 text-center" style={{ color: 'var(--text-muted)' }}>30-minute call with Ryan · weekdays · morning, afternoon &amp; evening (Pacific)</p>
            </motion.div>
          )}

          {/* STEP 2 — pick a slot */}
          {step === 'slot' && (
            <motion.div key="slot" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.3, ease: EASE }}>
              <button onClick={() => setStep('day')} className="text-[13px] font-semibold mb-4" style={{ color: 'var(--text-muted)' }}>&larr; Back</button>
              <div className="font-black tracking-[-0.02em] mb-1" style={{ color: 'var(--cocoa)', fontSize: 18 }}>{dayLabel}</div>
              <p className="text-[13px] mb-5" style={{ color: 'var(--text-muted)' }}>Times are Pacific. The open ones narrow the longer you wait.</p>
              {loading ? <p className="text-sm py-6 text-center" style={{ color: 'var(--text-muted)' }}>Loading times…</p>
                : slots.length === 0 ? <p className="text-sm py-6 text-center" style={{ color: 'var(--text-muted)' }}>No open times that day. Try another.</p>
                : (
                  <>
                    <div className="rounded-xl px-4 py-3 mb-5 text-[13px] font-semibold" style={{ background: 'rgba(245,166,35,.12)', color: '#9A6400', border: '1px solid rgba(245,166,35,.35)' }}>
                      Only <strong>{offeredCount}</strong> {offeredCount === 1 ? 'time is' : 'times are'} still open to you — they drop each time you leave and come back. Grab one now.
                    </div>
                    {(['Morning', 'Afternoon', 'Evening'] as const).map(p => {
                      const ps = slots.filter(s => s.period === p);
                      if (!ps.length) return null;
                      return (
                        <div key={p} className="mb-4">
                          <div className="text-[11px] font-bold tracking-[0.12em] uppercase mb-2" style={{ color: 'var(--text-muted)' }}>{p}</div>
                          <div className="grid grid-cols-3 gap-2">
                            {ps.map(s => (
                              <button key={s.iso} disabled={!s.offered} onClick={() => { setSlot({ iso: s.iso, label: s.label }); setStep('details'); }}
                                className="py-2.5 rounded-xl text-[13px] font-bold transition-all disabled:cursor-not-allowed enabled:hover:-translate-y-0.5"
                                style={s.offered
                                  ? { border: '1px solid var(--torea)', color: 'var(--torea)', background: 'var(--danube-pale)' }
                                  : { border: '1px solid var(--border-light)', color: 'var(--text-whisper)', background: 'transparent', textDecoration: 'line-through', opacity: 0.5 }}>
                                {timeOf(s.label)}
                              </button>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </>
                )}
            </motion.div>
          )}

          {/* STEP 3 — details */}
          {step === 'details' && (
            <motion.div key="details" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.3, ease: EASE }}>
              <button onClick={() => setStep('slot')} className="text-[13px] font-semibold mb-4" style={{ color: 'var(--text-muted)' }}>&larr; Back</button>
              <div className="rounded-xl px-4 py-3 mb-5 text-sm font-semibold" style={{ background: 'var(--danube-pale)', color: 'var(--torea)' }}>{slot?.label}</div>
              <label className="block text-[13px] font-semibold mb-1.5" style={{ color: 'var(--cocoa)' }}>Your name</label>
              <input value={name} onChange={e => setName(e.target.value)} placeholder="First and last" className="w-full mb-4 px-4 py-3 rounded-xl text-[15px] outline-none" style={{ border: '1px solid var(--border-medium)', color: 'var(--cocoa)' }} />
              <label className="block text-[13px] font-semibold mb-1.5" style={{ color: 'var(--cocoa)' }}>Mobile number</label>
              <input value={phone} onChange={e => setPhone(e.target.value)} inputMode="tel" placeholder="(555) 555-5555" className="w-full px-4 py-3 rounded-xl text-[15px] outline-none" style={{ border: '1px solid var(--border-medium)', color: 'var(--cocoa)' }} />
              <p className="text-[12px] mt-3 leading-relaxed" style={{ color: 'var(--text-muted)' }}>We&apos;ll text a one-time code to confirm it&apos;s you — no bots, no spam. Msg &amp; data rates may apply; reply STOP to opt out. By continuing you agree to our <a href="/privacy" target="_blank" rel="noopener" style={{ color: 'var(--torea)', textDecoration: 'underline' }}>Privacy Policy</a> and <a href="/terms" target="_blank" rel="noopener" style={{ color: 'var(--torea)', textDecoration: 'underline' }}>Terms</a>.</p>
              <button onClick={sendCode} disabled={loading} className="w-full mt-5 py-4 rounded-sm font-bold text-[15px] disabled:opacity-60" style={{ background: 'var(--torea)', color: '#fff' }}>{loading ? 'Sending…' : 'Text me a code →'}</button>
            </motion.div>
          )}

          {/* STEP 4 — verify */}
          {step === 'verify' && (
            <motion.div key="verify" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.3, ease: EASE }}>
              <button onClick={() => setStep('details')} className="text-[13px] font-semibold mb-4" style={{ color: 'var(--text-muted)' }}>&larr; Back</button>
              <div className="font-black tracking-[-0.02em] mb-1" style={{ color: 'var(--cocoa)', fontSize: 18 }}>Enter the code</div>
              <p className="text-[13px] mb-5" style={{ color: 'var(--text-muted)' }}>We texted a 6-digit code to {phone}.</p>
              <input value={code} onChange={e => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))} inputMode="numeric" placeholder="••••••" className="w-full px-4 py-4 rounded-xl text-center text-2xl font-black tracking-[0.4em] outline-none" style={{ border: '1px solid var(--border-medium)', color: 'var(--cocoa)' }} />
              <button onClick={confirm} disabled={loading} className="w-full mt-5 py-4 rounded-sm font-bold text-[15px] disabled:opacity-60" style={{ background: 'var(--torea)', color: '#fff' }}>{loading ? 'Confirming…' : 'Confirm booking'}</button>
              <button onClick={sendCode} disabled={loading} className="w-full mt-3 text-[13px] font-semibold" style={{ color: 'var(--text-muted)' }}>Resend code</button>
            </motion.div>
          )}

          {/* STEP 5 — done */}
          {step === 'done' && (
            <motion.div key="done" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }} className="text-center py-4">
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 14, delay: 0.1 }}
                className="w-16 h-16 rounded-full grid place-items-center mx-auto mb-6" style={{ background: 'var(--growth, #0EA968)' }}>
                <motion.svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <motion.path d="M5 13l4 4L19 7" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.4, delay: 0.35, ease: EASE }} />
                </motion.svg>
              </motion.div>
              <div className="font-black tracking-[-0.03em] mb-2" style={{ color: 'var(--cocoa)', fontSize: 26 }}>You&apos;re booked.</div>
              <p className="text-base leading-relaxed mb-1" style={{ color: 'var(--text-secondary)' }}><strong style={{ color: 'var(--cocoa)' }}>{confirmed}</strong></p>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>Ryan just got a text and will call you then. A confirmation is on the way to your phone.</p>
            </motion.div>
          )}
        </AnimatePresence>

        {error && step !== 'done' && <p className="text-[13px] mt-4 text-center font-semibold" style={{ color: 'var(--voiceguard)' }}>{error}</p>}
      </div>
    </div>
  );
}
