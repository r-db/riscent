import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'How We Get Our Clients Into Every Major LLM | Riscent',
  description: '88% of users accept AI answers without checking. 74% choose the top pick. If your business is not in the AI answer, you do not exist. Here is how we fix that — with data.',
  keywords: ['LLM visibility', 'AI SEO', 'generative engine optimization', 'ChatGPT recommendations', 'AI search optimization', 'get into ChatGPT', 'Perplexity citations', 'AI discovery', 'GEO optimization'],
};

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

export default function LLMVisibilityPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'How We Get Our Clients Into Every Major LLM',
    description: metadata.description,
    datePublished: '2026-04-13',
    author: { '@type': 'Person', name: 'Ryan Bolden', url: 'https://riscent.com' },
    publisher: { '@type': 'Organization', name: 'Riscent', url: 'https://riscent.com' },
  };

  return (
    <>
      <style>{`
        @media (max-width: 768px) {
          .lv-main { padding: 48px 16px !important; }
          .lv-stats { grid-template-columns: 1fr !important; }
          .lv-cta-row { flex-direction: column !important; }
          .lv-cta-row a { width: 100% !important; text-align: center !important; }
        }
      `}</style>
      <div style={{ background: C.bg, color: C.text, minHeight: '100vh', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Inter, sans-serif' }}>
        {/* NAV */}
        <header style={{ borderBottom: `1px solid ${C.border}`, padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: 1100, margin: '0 auto' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', color: C.text }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: C.green }} />
            <span style={{ fontWeight: 700, fontSize: 16 }}>RISCENT</span>
          </Link>
          <div style={{ display: 'flex', gap: 24 }}>
            <Link href="/docs" style={{ color: C.text2, textDecoration: 'none', fontSize: 14, fontWeight: 500 }}>Articles</Link>
            <Link href="/case-study" style={{ color: C.text2, textDecoration: 'none', fontSize: 14, fontWeight: 500 }}>Case Studies</Link>
            <a href="mailto:ryan@riscent.com" style={{ color: C.text2, textDecoration: 'none', fontSize: 14, fontWeight: 500 }}>ryan@riscent.com</a>
          </div>
        </header>

        <main className="lv-main" style={{ maxWidth: 740, margin: '0 auto', padding: '80px 24px' }}>
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

          <Link href="/docs" style={{ color: C.muted, textDecoration: 'none', fontSize: 14, display: 'inline-block', marginBottom: 32 }}>
            ← All Articles
          </Link>

          <div style={{ fontSize: 12, fontWeight: 600, color: C.accent, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 12 }}>
            AI Visibility
          </div>
          <h1 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.15, marginBottom: 20 }}>
            How We Get Our Clients Into Every Major LLM
          </h1>
          <p style={{ fontSize: 19, lineHeight: 1.6, color: C.text2, marginBottom: 48, paddingBottom: 32, borderBottom: `1px solid ${C.border}` }}>
            88% of users accept AI answers without checking. 74% choose the top pick. If your business is not in the AI answer, you do not exist. Here is what we know, what we built, and why it matters.
          </p>

          {/* THE STATS THAT MATTER */}
          <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 24 }}>The numbers nobody is showing you</h2>
          <div className="lv-stats" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16, marginBottom: 40 }}>
            {[
              { num: '88%', label: 'of users accept AI answers without checking', source: 'Exploding Topics, 2025' },
              { num: '74%', label: 'choose the AI\'s top pick', source: 'Position Digital, 2026' },
              { num: '93%', label: 'of AI Mode searches end without a click', source: 'Semrush, September 2025' },
              { num: '6.5×', label: 'more likely to be cited via third-party mentions vs your own site', source: 'Position Digital, 2026' },
              { num: '2.8×', label: 'citation likelihood increase with 4+ platform presence', source: 'Digital Bloom AI Visibility Report, 2025' },
              { num: '15.9%', label: 'conversion rate from ChatGPT referrals (vs 1.76% Google)', source: 'Position Digital, 2026' },
            ].map((s) => (
              <div key={s.label} style={{ background: C.bgElev, border: `1px solid ${C.border}`, borderRadius: 10, padding: '22px' }}>
                <div style={{ fontSize: 32, fontWeight: 700, color: C.green, lineHeight: 1, marginBottom: 8 }}>{s.num}</div>
                <div style={{ fontSize: 15, color: C.text, fontWeight: 500, marginBottom: 6 }}>{s.label}</div>
                <div style={{ fontSize: 12, color: C.muted }}>{s.source}</div>
              </div>
            ))}
          </div>

          {/* ARTICLE BODY */}
          <section style={{ marginBottom: 40 }}>
            <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 14, color: C.text }}>The new internet has one answer. You are either that answer or you are invisible.</h2>
            <div style={{ fontSize: 17, lineHeight: 1.75, color: C.text2 }}>
              <p style={{ marginBottom: 18 }}>Google gave you rankings. Ten blue links. You could be result number seven and still get clicks. AI gives you presence or absence. One answer. Maybe two. There is no page two of AI results. There is no "let me scroll down and check alternatives." The patient asks, the AI answers, the patient acts.</p>
              <p style={{ marginBottom: 18 }}>92% of users do not verify the AI's response. They accept it. 74% choose the top pick without further research. When a patient asks ChatGPT "who is the best psychiatrist in Henderson that takes Blue Cross," the practice that appears in the answer gets the patient. Every other practice in Henderson does not exist for that interaction.</p>
              <p style={{ marginBottom: 18 }}>This is not a prediction about the future. 25% of all Google searches already include AI Overviews. 99.9% of informational queries trigger them. AI search referral traffic converts at 15.9% — nine times higher than Google organic. The shift already happened. Most businesses have not noticed because their analytics do not separate AI referral traffic from direct traffic.</p>
            </div>
          </section>

          <section style={{ marginBottom: 40 }}>
            <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 14, color: C.text }}>Why your website alone is not enough</h2>
            <div style={{ fontSize: 17, lineHeight: 1.75, color: C.text2 }}>
              <p style={{ marginBottom: 18 }}>Brands are 6.5 times more likely to be cited by LLMs through third-party sources than through their own websites. Your website is one signal. What Reddit says about you, what LinkedIn says about you, what industry publications say about you, what review platforms say about you — those are the signals LLMs trust.</p>
              <p style={{ marginBottom: 18 }}>LLMs cross-reference claims. They do not take your word for it. They check whether your claims are confirmed — not contradicted — across multiple sources. A company that says "we are the best" on their own website and nowhere else gets filtered out. A company mentioned positively across four or more platforms gets a 2.8x increase in citation likelihood.</p>
              <p style={{ marginBottom: 18 }}>The strongest single predictor of AI citations is brand search volume — people actually searching for your brand name. Not backlinks. Not domain authority. Not content volume. People searching for you. That means brand-building is not a nice-to-have for AI visibility. It is the primary driver.</p>
            </div>
          </section>

          <section style={{ marginBottom: 40 }}>
            <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 14, color: C.text }}>How the major LLMs actually find and cite content</h2>
            <div style={{ fontSize: 17, lineHeight: 1.75, color: C.text2 }}>
              <p style={{ marginBottom: 18 }}>ChatGPT uses Bing's search infrastructure exclusively for real-time queries. Not Google. Bing. If your business is not in Bing's index, ChatGPT Search cannot find you. 92% of ChatGPT's search agents use the Bing API. Being indexed by Bing is not optional — it is the foundation of ChatGPT visibility.</p>
              <p style={{ marginBottom: 18 }}>Perplexity uses semantic search — it matches meaning, not just keywords. It has the best source citation accuracy at 92% compared to ChatGPT's 74%. It heavily favors recent content. Perplexity is where being specific and being current matters most.</p>
              <p style={{ marginBottom: 18 }}>Google AI Overviews aggregate from 5-6 websites per response and now appear in 25% of all searches. 88% of buyer-research queries trigger them. Getting into AI Overviews requires structured data, topical authority, and content that directly answers the query in the first 40-60 words.</p>
              <p style={{ marginBottom: 18 }}>The Princeton GEO study tested 10,000 queries across 9 optimization strategies. The top performers: adding statistics (+37% visibility), citing external sources (up to +115% for lower-ranked sites), and adding direct quotations (+28-40%). Keyword stuffing produced negative returns — worse than doing nothing.</p>
            </div>
          </section>

          <section style={{ marginBottom: 40 }}>
            <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 14, color: C.text }}>Why people stopped thinking and started trusting</h2>
            <div style={{ fontSize: 17, lineHeight: 1.75, color: C.text2 }}>
              <p style={{ marginBottom: 18 }}>The research on this is uncomfortable. Klingbeil, Grutzner and Schreck published in Computers in Human Behavior (2024): the mere knowledge that advice comes from AI causes overreliance. Users follow AI advice even when it contradicts available contextual information and their own assessment. Not sometimes. Systematically.</p>
              <p style={{ marginBottom: 18 }}>A 2025 study on mitigating automation bias found that participants who received faulty AI support answered fewer than half as many items correctly as the control group. Offering different explanation formats did not help. Trust calibration feedback did not help. Once the AI has given an answer, people accept it.</p>
              <p style={{ marginBottom: 18 }}>This is not a flaw in users. It is a feature of how humans process authority signals. For decades, Google trained people to trust the first result. AI took that training and compressed it. Instead of trusting the first result from a list of ten, people trust the only result from a list of one. The cognitive load of verification was already low. AI reduced it to zero.</p>
              <p style={{ marginBottom: 18 }}>For businesses, this means the AI recommendation is not a suggestion. It is a decision. 93% of AI Mode searches end without a single click to any website. The AI answered. The user acted. Nobody else was considered.</p>
            </div>
          </section>

          <section style={{ marginBottom: 40 }}>
            <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 14, color: C.text }}>Where the platforms that matter actually look</h2>
            <div style={{ fontSize: 17, lineHeight: 1.75, color: C.text2 }}>
              <p style={{ marginBottom: 18 }}>Reddit is the number one most-cited domain across all AI models in aggregate. Not Wikipedia for every model — Reddit. 46.7% of Perplexity citations come from Reddit. 38.96% overlap between Reddit discussions and Perplexity recommendations. A case study of a code review tool showed that 3 months of authentic Reddit participation led to 40% of ChatGPT responses mentioning the brand.</p>
              <p style={{ marginBottom: 18 }}>LinkedIn owns B2B AI visibility — 13% of top-10 AI Overview citations for B2B queries come from LinkedIn, beating Gartner and McKinsey in some categories. LinkedIn posts with specific data points and named expertise get pulled into AI Overviews at a disproportionate rate.</p>
              <p style={{ marginBottom: 18 }}>Wikipedia accounts for 47.9% of ChatGPT citations. YouTube is the top factor correlating with AI brand visibility. Content distributed across multiple publications produces up to 325% more AI citations compared to publishing only on your own site.</p>
            </div>
          </section>

          <section style={{ marginBottom: 40 }}>
            <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 14, color: C.text }}>What we do that nobody else is doing</h2>
            <div style={{ fontSize: 17, lineHeight: 1.75, color: C.text2 }}>
              <p style={{ marginBottom: 18 }}>We do not do traditional SEO for our clients. We do AI visibility. The difference: SEO optimizes for Google's ranking algorithm. AI visibility optimizes for the systems that ChatGPT, Perplexity, Gemini, and Claude use to decide which businesses to recommend.</p>
              <p style={{ marginBottom: 18 }}>We build the technical infrastructure — structured data, machine-readable protocols, Bing indexing, sitemap optimization, server-rendered content that AI crawlers can actually read. Most websites render content with JavaScript. Most AI crawlers do not execute JavaScript. Your beautiful React app is invisible to GPTBot.</p>
              <p style={{ marginBottom: 18 }}>We build the entity presence — content on the platforms LLMs actually cite. Not content for content's sake. Specific, data-backed content on Reddit, LinkedIn, and industry publications that creates the cross-platform corroboration LLMs need before they will recommend a brand.</p>
              <p style={{ marginBottom: 18 }}>We build the content architecture — statistics, citations, structured headings, 40-60 word paragraphs, FAQ formats, comparison tables. The specific formats that the Princeton GEO study and subsequent research have shown to increase AI citation rates by 37% to 115%.</p>
              <p style={{ marginBottom: 18 }}>And we built the Agent Action Protocol — so when AI agents are ready to take action on behalf of a user (book an appointment, check availability, request information), our clients are the ones those agents can interact with. Everyone else is read-only. Findable but unusable.</p>
            </div>
          </section>

          {/* CTA */}
          <div style={{
            background: `${C.accent}08`,
            border: `1px solid ${C.accent}25`,
            borderRadius: 12,
            padding: '40px',
            marginBottom: 48,
          }}>
            <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 16, color: C.text }}>
              If 88% of users accept the AI's answer, being in that answer is the entire game.
            </h2>
            <p style={{ fontSize: 18, lineHeight: 1.7, color: C.text2, marginBottom: 16 }}>
              We are the only consulting practice that combines production AI systems, healthcare-grade infrastructure, and AI visibility strategy into one offering. We do not just build your AI — we make sure every other AI knows about it.
            </p>
            <p style={{ fontSize: 15, lineHeight: 1.6, color: C.text2, marginBottom: 28 }}>
              We specialize in healthcare because it is the hardest vertical. HIPAA. PHI. Zero tolerance for error. If we can do it in healthcare, we can do it anywhere. We work across industries.
            </p>
            <div className="lv-cta-row" style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <a href="mailto:ryan@riscent.com?subject=AI Visibility for my business" style={{
                display: 'inline-block', background: C.accent, color: C.bg,
                padding: '18px 36px', borderRadius: 8, fontSize: 17, fontWeight: 700, textDecoration: 'none',
              }}>
                Talk to Ryan →
              </a>
              <a href="tel:+18882523019" style={{
                display: 'inline-block', background: 'transparent', color: C.text,
                border: `1px solid ${C.border}`, padding: '18px 36px', borderRadius: 8, fontSize: 17, fontWeight: 600, textDecoration: 'none',
              }}>
                (888) 252-3019
              </a>
            </div>
            <p style={{ fontSize: 14, color: C.muted, marginTop: 16 }}>
              I reply within 24 hours. No pitch deck. No discovery phase. Just whether I can help and what it costs.
            </p>
          </div>

          {/* AUTHOR */}
          <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 24, fontSize: 14, color: C.muted }}>
            Written by <strong style={{ color: C.text2 }}>Ryan Bolden</strong> · Founder, Riscent · <a href="mailto:ryan@riscent.com" style={{ color: C.accent, textDecoration: 'none' }}>ryan@riscent.com</a>
          </div>
        </main>
      </div>
    </>
  );
}
