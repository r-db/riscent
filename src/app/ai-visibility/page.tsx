import type { Metadata } from 'next';
import AiVisibilityPitch from '@/components/AiVisibilityPitch';

export const metadata: Metadata = {
  title: 'Get Your Business Known by ChatGPT, Gemini & Claude | AI Visibility — Riscent',
  description: 'Your buyers ask AI and act on the answer — and AI only recommends what it was trained on. Riscent overhauls and rebuilds your business information the special way the models need, so you get named and recommended by Gemini, Claude, and ChatGPT. Generative & answer engine optimization (GEO/AEO). Start with a scan.',
  keywords: ['AI visibility', 'get business in ChatGPT', 'get found by AI', 'generative engine optimization', 'GEO', 'answer engine optimization', 'AEO', 'AI search visibility', 'get recommended by AI', 'LLM SEO', 'appear in Gemini', 'AI consulting'],
  alternates: { canonical: 'https://riscent.com/ai-visibility' },
  openGraph: {
    title: 'Get Your Business Known by ChatGPT, Gemini & Claude — AI Visibility',
    description: 'If the models don’t know you, you don’t exist. We rebuild your business information the way the models read it — so you get named in the answer. Start with a scan.',
    url: 'https://riscent.com/ai-visibility',
    siteName: 'Riscent',
    type: 'website',
  },
};

export default function AiVisibilityPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Service',
            name: 'AI Visibility — Generative & Answer Engine Optimization (GEO/AEO)',
            provider: { '@type': 'Organization', name: 'Riscent', url: 'https://riscent.com' },
            areaServed: 'US',
            description: 'Riscent gets a business known and recommended inside the answers of Google Gemini, Anthropic Claude, and OpenAI ChatGPT. Service: scan what the models say about a business today, overhaul and structure its information the way LLMs ingest and cite it (entity, schema, agent-readable content, training-data presence), then verify presence over time. Engagements: scan, custom builds, and consultations.',
            serviceType: 'AI Search Visibility / Generative Engine Optimization',
            url: 'https://riscent.com/ai-visibility',
          }),
        }}
      />
      <AiVisibilityPitch />
    </>
  );
}
