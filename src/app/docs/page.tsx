import Link from 'next/link';
import { DOCS } from './content';

const C = {
  bg: '#0b0e14',
  bgElev: '#111521',
  border: '#1e2535',
  text: '#e6e8ed',
  text2: '#a6adbb',
  muted: '#6e7689',
  accent: '#4f8cff',
  green: '#5fd6a3',
  warn: '#f0b45b',
};

export default function DocsIndex() {
  return (
    <main style={{ maxWidth: 900, margin: '0 auto', padding: '80px 24px' }}>
      <Link href="/" style={{ color: C.muted, textDecoration: 'none', fontSize: 14, display: 'inline-block', marginBottom: 32 }}>
        ← Back to Riscent
      </Link>
      <p style={{ fontSize: 13, fontWeight: 600, color: C.accent, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 12 }}>
        Insights
      </p>
      <h1 style={{ fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 700, letterSpacing: '-0.025em', lineHeight: 1.1, marginBottom: 16 }}>
        Problems we have solved.
      </h1>
      <p style={{ fontSize: 18, lineHeight: 1.6, color: C.text2, marginBottom: 48, maxWidth: 640 }}>
        If you recognize any of these, we should talk. If you recognize more than two, we should talk today.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {DOCS.map((doc) => (
          <Link
            key={doc.slug}
            href={`/docs/${doc.slug}`}
            style={{
              display: 'block',
              background: C.bgElev,
              border: `1px solid ${C.border}`,
              borderRadius: 10,
              padding: '24px 28px',
              textDecoration: 'none',
              color: 'inherit',
              transition: 'border-color 0.2s',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: C.text, margin: 0 }}>{doc.publicTitle}</h2>
              <span style={{ fontSize: 13, color: C.muted, flexShrink: 0, marginLeft: 16 }}>{doc.readTime}</span>
            </div>
            <p style={{ fontSize: 15, lineHeight: 1.55, color: C.text2, margin: 0, marginBottom: 8 }}>
              {doc.article[0].body.slice(0, 200)}...
            </p>
            <span style={{ fontSize: 13, color: C.accent, fontWeight: 600 }}>Read more →</span>
          </Link>
        ))}
      </div>

      <div style={{ marginTop: 48, padding: '28px', background: `${C.accent}08`, border: `1px solid ${C.accent}25`, borderRadius: 12 }}>
        <p style={{ fontSize: 16, color: C.text2, lineHeight: 1.6, margin: 0, marginBottom: 16 }}>
          Each insight describes a real problem we encountered and solved in production. The public page shows you we understand the problem. The full playbook — with exact solutions — is available to clients and collaborators.
        </p>
        <a href="mailto:ryan@riscent.com?subject=Interested in working together" style={{
          display: 'inline-block',
          background: C.accent,
          color: C.bg,
          padding: '14px 24px',
          borderRadius: 8,
          fontSize: 15,
          fontWeight: 700,
          textDecoration: 'none',
        }}>
          Tell me what you are building →
        </a>
      </div>
    </main>
  );
}
