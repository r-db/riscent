import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { DOCS } from '../content';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return DOCS.map((doc) => ({ slug: doc.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const doc = DOCS.find((d) => d.slug === slug);
  if (!doc) return {};
  return {
    title: `${doc.publicTitle} | Riscent — AI Consulting`,
    description: doc.description,
    keywords: doc.keywords,
    openGraph: {
      title: doc.publicTitle,
      description: doc.description,
      type: 'article',
      publishedTime: doc.date,
      authors: ['Ryan Bolden'],
    },
  };
}

const C = {
  bg: '#0b0e14',
  bgElev: '#111521',
  border: '#1e2535',
  text: '#e6e8ed',
  text2: '#a6adbb',
  muted: '#6e7689',
  accent: '#4f8cff',
  green: '#5fd6a3',
};

export default async function DocPage({ params }: Props) {
  const { slug } = await params;
  const doc = DOCS.find((d) => d.slug === slug);
  if (!doc) notFound();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: doc.publicTitle,
    description: doc.description,
    keywords: doc.keywords.join(', '),
    datePublished: doc.date,
    author: { '@type': 'Person', name: 'Ryan Bolden', url: 'https://riscent.com' },
    publisher: { '@type': 'Organization', name: 'Riscent', url: 'https://riscent.com' },
  };

  const currentIdx = DOCS.findIndex((d) => d.slug === slug);
  const prev = currentIdx > 0 ? DOCS[currentIdx - 1] : null;
  const next = currentIdx < DOCS.length - 1 ? DOCS[currentIdx + 1] : null;

  return (
    <>
      <style>{`
        @media (max-width: 768px) {
          .rc-doc-main { padding: 48px 16px !important; }
          .rc-doc-cta-row { flex-direction: column !important; }
          .rc-doc-cta-row a, .rc-doc-cta-row button { width: 100% !important; text-align: center !important; }
          .rc-doc-nav-row { flex-direction: column !important; gap: 12px !important; }
        }
      `}</style>
      <main className="rc-doc-main" style={{ maxWidth: 740, margin: '0 auto', padding: '80px 24px' }}>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

        <Link href="/docs" style={{ color: C.muted, textDecoration: 'none', fontSize: 14, display: 'inline-block', marginBottom: 32 }}>
          ← All Insights
        </Link>

        <div style={{ marginBottom: 16, display: 'flex', gap: 12, fontSize: 13, color: C.muted }}>
          <span>{doc.date}</span>
          <span>·</span>
          <span>{doc.readTime} read</span>
          <span>·</span>
          <span>Ryan Bolden</span>
        </div>

        <h1 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.15, marginBottom: 20 }}>
          {doc.publicTitle}
        </h1>
        <p style={{ fontSize: 19, lineHeight: 1.6, color: C.text2, marginBottom: 48, paddingBottom: 32, borderBottom: `1px solid ${C.border}` }}>
          {doc.description}
        </p>

        {/* PUBLIC ARTICLE — always visible, SEO-rich, creates curiosity */}
        {doc.article.map((section, i) => {
          const sectionSlug = section.heading.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
          return (
            <section key={i} style={{ marginBottom: 48 }}>
              <h2 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.01em', marginBottom: 14, color: C.text, lineHeight: 1.3 }}>
                {section.heading}
              </h2>
              <div style={{ fontSize: 17, lineHeight: 1.75, color: C.text2 }}>
                {section.body.split('\n').map((p, j) => (
                  <p key={j} style={{ marginBottom: 18 }}>{p}</p>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginTop: 16, paddingTop: 16, borderTop: `1px solid ${C.border}` }}>
                <Link href={`/docs/${slug}/${sectionSlug}`} style={{ color: C.accent, textDecoration: 'none', fontSize: 15, fontWeight: 600 }}>
                  Read the full article →
                </Link>
                <Link href="/docs/playbook" style={{ color: C.green, textDecoration: 'none', fontSize: 15, fontWeight: 600 }}>
                  See how we help →
                </Link>
              </div>
            </section>
          );
        })}

        {/* THE CLOSE — the pitch that converts */}
        <div style={{
          background: `${C.accent}08`,
          border: `1px solid ${C.accent}25`,
          borderRadius: 12,
          padding: '36px',
          marginTop: 48,
          marginBottom: 48,
        }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: C.accent, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 16 }}>
            The bottom line
          </div>
          <p style={{ fontSize: 18, lineHeight: 1.7, color: C.text, fontWeight: 500, margin: 0, marginBottom: 16 }}>
            {doc.articleClose}
          </p>
          <p style={{ fontSize: 15, lineHeight: 1.6, color: C.text2, margin: 0, marginBottom: 28 }}>
            We specialize in healthcare — the hardest vertical for AI, with HIPAA regulation, PHI handling, and zero tolerance for error. If we can ship it in healthcare, we can ship it anywhere. We work across industries.
          </p>
          <div className="rc-doc-cta-row" style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <a href={`mailto:ryan@riscent.com?subject=${encodeURIComponent(doc.publicTitle)}`} style={{
              display: 'inline-block',
              background: C.accent,
              color: C.bg,
              padding: '16px 32px',
              borderRadius: 8,
              fontSize: 16,
              fontWeight: 700,
              textDecoration: 'none',
            }}>
              Talk to Ryan →
            </a>
            <a href="tel:+18882523019" style={{
              display: 'inline-block',
              background: 'transparent',
              color: C.text,
              border: `1px solid ${C.border}`,
              padding: '16px 32px',
              borderRadius: 8,
              fontSize: 16,
              fontWeight: 600,
              textDecoration: 'none',
            }}>
              (888) 252-3019
            </a>
          </div>
          <p style={{ fontSize: 14, color: C.muted, marginTop: 16 }}>
            Reply within 24 hours. No pitch deck. No discovery phase. Just whether I can help.
          </p>
        </div>

        {/* Navigation */}
        <div className="rc-doc-nav-row" style={{ borderTop: `1px solid ${C.border}`, paddingTop: 32, marginTop: 48, display: 'flex', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
          {prev ? (
            <Link href={`/docs/${prev.slug}`} style={{ color: C.accent, textDecoration: 'none', fontSize: 15 }}>
              ← {prev.publicTitle}
            </Link>
          ) : <span />}
          {next ? (
            <Link href={`/docs/${next.slug}`} style={{ color: C.accent, textDecoration: 'none', fontSize: 15, textAlign: 'right' }}>
              {next.publicTitle} →
            </Link>
          ) : <span />}
        </div>

        {/* Author */}
        <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 24, marginTop: 32, fontSize: 14, color: C.muted }}>
          Written by <strong style={{ color: C.text2 }}>Ryan Bolden</strong> · Founder, Riscent · 20 years in sales, engineering, and business development · <a href="mailto:ryan@riscent.com" style={{ color: C.accent, textDecoration: 'none' }}>ryan@riscent.com</a>
        </div>
      </main>
    </>
  );
}
