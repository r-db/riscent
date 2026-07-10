import type { Metadata } from 'next';
import GeoPitch from '@/components/GeoPitch';

export const metadata: Metadata = {
  title: 'GEO — Generative Engine Optimization | Get Cited by ChatGPT, Gemini & Claude — Riscent',
  description: 'GEO is getting your business recommended and cited by AI assistants — ChatGPT, Gemini, Claude, Perplexity, Grok — when your buyers ask instead of search. When the AI answers, its citations are the traffic. If you are not in the answer, you do not exist for that customer. Riscent gets you named. Start with a scan.',
  keywords: ['GEO', 'generative engine optimization', 'get cited by AI', 'get found in ChatGPT', 'AI search visibility', 'answer engine optimization', 'AEO', 'get recommended by AI', 'LLM visibility', 'AI citations', 'appear in Gemini', 'get named by Claude', 'Perplexity visibility'],
  alternates: { canonical: 'https://riscent.com/geo' },
  openGraph: {
    title: 'GEO — when the AI answers, its citations are the traffic',
    description: 'Your buyers ask AI and act on the one answer it gives. If you are not named, you do not exist for that customer. GEO gets you into the answer. Start with a scan.',
    url: 'https://riscent.com/geo',
    siteName: 'Riscent',
    type: 'website',
  },
};

export default function GeoPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Service',
            name: 'GEO — Generative Engine Optimization',
            serviceType: 'Generative Engine Optimization',
            provider: { '@type': 'Organization', name: 'Riscent', url: 'https://riscent.com' },
            areaServed: 'US',
            description:
              'Generative Engine Optimization (GEO) is the practice of getting a business recommended and cited by AI assistants — ChatGPT, Gemini, Claude, Perplexity, and Grok — when buyers ask a question instead of running a traditional search. When the AI synthesizes one answer naming a few businesses, being cited is the traffic; being absent means being invisible to that buyer. Riscent measures how often the assistants name a business versus competitors (citation share), then gets it named. Engagements begin with a scan.',
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: [
              {
                '@type': 'Question',
                name: 'What is GEO (Generative Engine Optimization)?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'GEO is the practice of getting your website recommended and cited by AI assistants such as ChatGPT, Gemini, Claude, Perplexity, and Grok — instead of, or in addition to, ranking in traditional Google search. When a buyer asks an AI a question, it returns one synthesized answer naming a few companies. If your business is named, that citation is your traffic. If it is not, you are invisible to that customer.',
                },
              },
              {
                '@type': 'Question',
                name: 'Why does GEO matter now?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'A growing share of buyers no longer search — they ask. The AI returns a single answer with no page two, so everyone it did not mention is left out of the only result the buyer sees. Brands cited in AI answers see meaningfully higher click-through than uncited competitors, and the advantage compounds: the sources the models learn to trust now become their default citations later.',
                },
              },
              {
                '@type': 'Question',
                name: 'How is GEO measured?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'By citation share: scripting real buyer questions, running them against each AI engine on a regular cadence, and counting how often your business is named versus competitors. That number is the KPI Riscent tracks and reports.',
                },
              },
            ],
          }),
        }}
      />
      <GeoPitch />
    </>
  );
}
