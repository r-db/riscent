import type { Metadata } from 'next';
import SiteNav from '@/components/SiteNav';
import BookFlow from '@/components/BookFlow';

export const metadata: Metadata = {
  title: 'Talk to Ryan — Book a 30-Minute Call | Riscent',
  description: 'Book a 30-minute call with Ryan Bolden, founder of Riscent. Pick a time, verify your number by text, done. No forms, no back-and-forth.',
  alternates: { canonical: 'https://riscent.com/book' },
  robots: { index: true, follow: true },
};

export default function BookPage() {
  return (
    <main className="min-h-screen" style={{ background: 'var(--bg-secondary)' }}>
      <SiteNav />
      <section className="px-6 pt-[110px] pb-20">
        <div className="max-w-[560px] mx-auto text-center mb-10">
          <p className="text-[13px] font-semibold tracking-[0.15em] uppercase mb-3" style={{ color: 'var(--danube)' }}>Talk to Ryan</p>
          <h1 className="font-black tracking-[-0.04em] leading-[1.02]" style={{ color: 'var(--cocoa)', fontSize: 'clamp(30px,6vw,46px)' }}>
            Book a 30-minute call.
          </h1>
          <p className="text-base md:text-lg leading-relaxed mt-4" style={{ color: 'var(--text-secondary)' }}>
            Pick a time, confirm it&apos;s you with a quick text, and you&apos;re on Ryan&apos;s calendar. No forms, no waiting.
          </p>
        </div>
        <BookFlow />
      </section>
    </main>
  );
}
