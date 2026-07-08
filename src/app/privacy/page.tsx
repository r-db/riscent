import type { Metadata } from 'next';
import SiteNav from '@/components/SiteNav';

export const metadata: Metadata = {
  title: 'Privacy Policy | Riscent',
  description: 'How Riscent collects, uses, and protects your information — including SMS/text messaging consent and opt-out.',
  alternates: { canonical: 'https://riscent.com/privacy' },
};

const H = ({ children }: { children: React.ReactNode }) => (
  <h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--cocoa)', margin: '32px 0 10px', letterSpacing: '-0.02em' }}>{children}</h2>
);
const P = ({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) => (
  <p style={{ fontSize: 16, lineHeight: 1.7, color: 'var(--text-secondary)', margin: '0 0 12px', ...style }}>{children}</p>
);

export default function PrivacyPage() {
  return (
    <main style={{ background: 'var(--bg-primary)', minHeight: '100vh' }}>
      <SiteNav />
      <div style={{ maxWidth: 760, margin: '0 auto', padding: '110px 24px 80px' }}>
        <p style={{ fontSize: 13, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--danube)', marginBottom: 10 }}>Legal</p>
        <h1 style={{ fontSize: 'clamp(32px,6vw,46px)', fontWeight: 900, letterSpacing: '-0.04em', color: 'var(--cocoa)', lineHeight: 1.05 }}>Privacy Policy</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: 14, marginTop: 10 }}>Last updated: July 7, 2026 · Riscent, LLC · riscent.com</p>

        <div style={{ marginTop: 20 }}>
          <P>Riscent, LLC (&ldquo;Riscent,&rdquo; &ldquo;we,&rdquo; &ldquo;us&rdquo;) operates riscent.com. This policy explains what we collect, how we use it, and your choices. Questions: <a href="mailto:ryan@riscent.com" style={{ color: 'var(--torea)' }}>ryan@riscent.com</a>.</P>

          <H>Information we collect</H>
          <P>We collect only what you give us and basic technical data:</P>
          <ul style={{ color: 'var(--text-secondary)', fontSize: 16, lineHeight: 1.7, paddingLeft: 20, margin: '0 0 12px' }}>
            <li><strong>Contact details</strong> you submit — your name, mobile phone number, and email — for example when you book a call.</li>
            <li><strong>Booking details</strong> — the time slot you select.</li>
            <li><strong>Technical data</strong> — IP address and basic device/usage information, used for security and to prevent abuse.</li>
          </ul>

          <H>How we use it</H>
          <P>To verify your phone number, confirm and manage appointments, respond to your requests, secure the service, and comply with the law. We do not sell your personal information.</P>

          <H>SMS / text messaging</H>
          <P>When you enter your mobile number and check the consent box on our booking form at riscent.com/book, you consent to receive text messages from Riscent — a one-time verification passcode (OTP) and messages about your appointment. These are transactional messages, not marketing.</P>
          <P>Message frequency varies (typically 1–3 messages per booking). Message and data rates may apply. Reply <strong>STOP</strong> to opt out at any time, or <strong>HELP</strong> for help. You can also opt out by emailing ryan@riscent.com.</P>
          <P style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-light)', borderRadius: 10, padding: '14px 16px' }}>
            <strong>We do not share, sell, or otherwise provide your mobile phone number or SMS/text-messaging consent information to any third parties or affiliates for marketing or promotional purposes.</strong> No mobile opt-in data or consent information is shared with third parties for marketing under any circumstances.
          </P>

          <H>Service providers we rely on</H>
          <P>We do not sell your personal information, and we never share it for anyone&apos;s marketing. To run the service, we rely on a few providers that process data strictly on our behalf — Twilio to deliver the text messages, and our hosting and database providers (Vercel, Neon) to operate the site. They may use your information only to perform those services for us, never for their own or anyone else&apos;s marketing. As stated above, your mobile phone number and SMS consent data are never shared with third parties or affiliates for marketing or promotional purposes. We disclose information otherwise only if the law requires it.</P>

          <H>Data retention &amp; security</H>
          <P>We keep information only as long as needed for the purposes above or as the law requires, and we use reasonable technical and organizational measures to protect it. No method of transmission or storage is 100% secure.</P>

          <H>Your choices</H>
          <P>You can opt out of texts (reply STOP), and you can ask us to access, correct, or delete your information by emailing ryan@riscent.com.</P>

          <H>Children</H>
          <P>Our services are not directed to children under 13, and we do not knowingly collect their information.</P>

          <H>Changes</H>
          <P>We may update this policy; we&apos;ll change the date above when we do.</P>

          <H>Contact</H>
          <P>Riscent, LLC — <a href="mailto:ryan@riscent.com" style={{ color: 'var(--torea)' }}>ryan@riscent.com</a> · <a href="/terms" style={{ color: 'var(--torea)' }}>Terms of Service</a></P>
        </div>
      </div>
    </main>
  );
}
