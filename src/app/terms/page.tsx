import type { Metadata } from 'next';
import SiteNav from '@/components/SiteNav';

export const metadata: Metadata = {
  title: 'Terms of Service | Riscent',
  description: 'The terms that govern your use of riscent.com and Riscent services.',
  alternates: { canonical: 'https://riscent.com/terms' },
};

const H = ({ children }: { children: React.ReactNode }) => (
  <h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--cocoa)', margin: '32px 0 10px', letterSpacing: '-0.02em' }}>{children}</h2>
);
const P = ({ children }: { children: React.ReactNode }) => (
  <p style={{ fontSize: 16, lineHeight: 1.7, color: 'var(--text-secondary)', margin: '0 0 12px' }}>{children}</p>
);

export default function TermsPage() {
  return (
    <main style={{ background: 'var(--bg-primary)', minHeight: '100vh' }}>
      <SiteNav />
      <div style={{ maxWidth: 760, margin: '0 auto', padding: '110px 24px 80px' }}>
        <p style={{ fontSize: 13, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--danube)', marginBottom: 10 }}>Legal</p>
        <h1 style={{ fontSize: 'clamp(32px,6vw,46px)', fontWeight: 900, letterSpacing: '-0.04em', color: 'var(--cocoa)', lineHeight: 1.05 }}>Terms of Service</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: 14, marginTop: 10 }}>Last updated: July 7, 2026 · Riscent, LLC · riscent.com</p>

        <div style={{ marginTop: 20 }}>
          <P>These terms govern your use of riscent.com and services provided by Riscent, LLC (&ldquo;Riscent&rdquo;). By using the site or booking a call, you agree to them. Questions: <a href="mailto:ryan@riscent.com" style={{ color: 'var(--torea)' }}>ryan@riscent.com</a>.</P>

          <H>What we provide</H>
          <P>Riscent is an AI consulting agency. Through this site you can read our research and book a call with us. Any engagement (custom build or consultation) is governed by a separate written agreement.</P>

          <H>Booking &amp; text verification</H>
          <P>To book a call you submit your name and mobile number, and we text you a one-time verification code to confirm the number is yours. By requesting the code you consent to receive that message and appointment-related texts. Message and data rates may apply; reply STOP to opt out. See our <a href="/privacy" style={{ color: 'var(--torea)' }}>Privacy Policy</a>.</P>

          <H>Acceptable use</H>
          <P>Don&apos;t misuse the site: no attempts to disrupt or gain unauthorized access, no automated abuse of the booking or verification system, no unlawful or infringing use, and no submitting phone numbers you don&apos;t control.</P>

          <H>Intellectual property</H>
          <P>The site&apos;s content is owned by Riscent unless stated otherwise. Our open-source projects (for example, Phantom Vault) are licensed under their own terms, which control for those projects.</P>

          <H>No warranty</H>
          <P>The site and any information on it are provided &ldquo;as is,&rdquo; without warranties of any kind. Research figures are our own measurements or cited sources; they are provided for information, not as a guarantee of results.</P>

          <H>Limitation of liability</H>
          <P>To the fullest extent permitted by law, Riscent is not liable for any indirect, incidental, or consequential damages arising from your use of the site.</P>

          <H>Changes</H>
          <P>We may update these terms; we&apos;ll change the date above when we do. Continued use means you accept the changes.</P>

          <H>Contact</H>
          <P>Riscent, LLC — <a href="mailto:ryan@riscent.com" style={{ color: 'var(--torea)' }}>ryan@riscent.com</a> · <a href="/privacy" style={{ color: 'var(--torea)' }}>Privacy Policy</a></P>
        </div>
      </div>
    </main>
  );
}
