import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { DOCS } from '../../content';

interface Props {
  params: Promise<{ slug: string; section: string }>;
}

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function findSection(docSlug: string, sectionSlug: string) {
  const doc = DOCS.find((d) => d.slug === docSlug);
  if (!doc) return null;
  const section = doc.article.find((a) => slugify(a.heading) === sectionSlug);
  if (!section) return null;
  return { doc, section };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, section } = await params;
  const result = findSection(slug, section);
  if (!result) return {};
  return {
    title: `${result.section.heading} | ${result.doc.publicTitle} | Riscent`,
    description: (result.section.fullArticle || result.section.body).slice(0, 200),
    keywords: result.doc.keywords,
    openGraph: {
      title: result.section.heading,
      description: (result.section.fullArticle || result.section.body).slice(0, 200),
      type: 'article',
      publishedTime: result.doc.date,
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

export default async function SectionArticlePage({ params }: Props) {
  const { slug, section: sectionSlug } = await params;
  const result = findSection(slug, sectionSlug);
  if (!result) notFound();

  const { doc, section } = result;
  const sectionIdx = doc.article.findIndex((a) => slugify(a.heading) === sectionSlug);
  const prevSection = sectionIdx > 0 ? doc.article[sectionIdx - 1] : null;
  const nextSection = sectionIdx < doc.article.length - 1 ? doc.article[sectionIdx + 1] : null;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: section.heading,
    description: section.body.slice(0, 200),
    datePublished: doc.date,
    author: { '@type': 'Person', name: 'Ryan Bolden', url: 'https://riscent.com' },
    publisher: { '@type': 'Organization', name: 'Riscent', url: 'https://riscent.com' },
    isPartOf: { '@type': 'Article', name: doc.publicTitle, url: `https://riscent.com/docs/${slug}` },
  };

  return (
    <>
      <style>{`
        @media (max-width: 768px) {
          .sa-main { padding: 48px 16px !important; }
          .sa-cta-row { flex-direction: column !important; }
          .sa-cta-row a { width: 100% !important; text-align: center !important; }
          .sa-nav-row { flex-direction: column !important; gap: 12px !important; }
        }
      `}</style>
      <main className="sa-main" style={{ maxWidth: 740, margin: '0 auto', padding: '80px 24px' }}>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

        <Link href={`/docs/${slug}`} style={{ color: C.muted, textDecoration: 'none', fontSize: 14, display: 'inline-block', marginBottom: 32 }}>
          ← Back to {doc.publicTitle}
        </Link>

        <div style={{ marginBottom: 16, display: 'flex', gap: 12, fontSize: 13, color: C.muted }}>
          <span>{doc.date}</span>
          <span>·</span>
          <span>Ryan Bolden</span>
          <span>·</span>
          <span>Part of: {doc.publicTitle}</span>
        </div>

        <h1 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.15, marginBottom: 32 }}>
          {section.heading}
        </h1>

        <div style={{ fontSize: 18, lineHeight: 1.8, color: C.text2, marginBottom: 48 }}>
          {(section.fullArticle || section.body).split('\n\n').map((p, i) => (
            <p key={i} style={{ marginBottom: 22 }}>{p}</p>
          ))}
        </div>

        {/* CTA */}
        <div style={{
          background: `${C.accent}08`,
          border: `1px solid ${C.accent}25`,
          borderRadius: 12,
          padding: '32px',
          marginBottom: 48,
        }}>
          <p style={{ fontSize: 17, lineHeight: 1.65, color: C.text, fontWeight: 500, margin: 0, marginBottom: 12 }}>
            This is one piece of a larger framework we built and operate in production. The full picture — and how it applies to your business — is in the playbook.
          </p>
          <p style={{ fontSize: 15, lineHeight: 1.6, color: C.text2, margin: 0, marginBottom: 20 }}>
            We specialize in healthcare because it is the hardest vertical — strict HIPAA regulation, PHI handling, BAA chains, and zero tolerance for failure. If we can build it for healthcare, we can build it for any industry. We work across verticals.
          </p>
          <div className="sa-cta-row" style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Link href="/docs/playbook" style={{
              display: 'inline-block', background: C.green, color: C.bg,
              padding: '14px 28px', borderRadius: 8, fontSize: 16, fontWeight: 700, textDecoration: 'none',
            }}>
              See the Playbook →
            </Link>
            <a href={`mailto:ryan@riscent.com?subject=${encodeURIComponent(section.heading)}`} style={{
              display: 'inline-block', background: 'transparent', color: C.text,
              border: `1px solid ${C.border}`, padding: '14px 28px', borderRadius: 8, fontSize: 16, fontWeight: 600, textDecoration: 'none',
            }}>
              Talk to Ryan
            </a>
          </div>
        </div>

        {/* Section navigation */}
        <div className="sa-nav-row" style={{ borderTop: `1px solid ${C.border}`, paddingTop: 24, display: 'flex', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
          {prevSection ? (
            <Link href={`/docs/${slug}/${slugify(prevSection.heading)}`} style={{ color: C.accent, textDecoration: 'none', fontSize: 15 }}>
              ← {prevSection.heading}
            </Link>
          ) : <span />}
          {nextSection ? (
            <Link href={`/docs/${slug}/${slugify(nextSection.heading)}`} style={{ color: C.accent, textDecoration: 'none', fontSize: 15, textAlign: 'right' }}>
              {nextSection.heading} →
            </Link>
          ) : <span />}
        </div>

        {/* Author */}
        <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 24, marginTop: 24, fontSize: 14, color: C.muted }}>
          Written by <strong style={{ color: C.text2 }}>Ryan Bolden</strong> · Founder, Riscent · <a href="mailto:ryan@riscent.com" style={{ color: C.accent, textDecoration: 'none' }}>ryan@riscent.com</a>
        </div>
      </main>
    </>
  );
}
