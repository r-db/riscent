import type { Metadata } from 'next';
import SlmPitch from '@/components/SlmPitch';

export const metadata: Metadata = {
  title: 'Custom Small Language Models — Own a Model That Does Your Job | Riscent',
  description: 'Stop renting intelligence by the token. Riscent builds and ships fine-tuned small language models you own — local, offline, private, and cheap. Train big once, deploy small forever. A 4B we tuned went 75%→95% and matches models 30× its size. Custom builds and consultations.',
  keywords: ['custom small language model', 'SLM fine-tuning', 'own your AI model', 'local AI deployment', 'offline AI model', 'private LLM', 'fine-tune small model', 'lower AI cost', 'on-device AI', 'AI consulting'],
  alternates: { canonical: 'https://riscent.com/slm' },
  openGraph: {
    title: 'Custom Small Language Models — Own a Model That Does Your Job',
    description: 'Train big once, deploy small forever. Fine-tuned models you own — cheaper, faster, private. Lower OpEx, higher close rate.',
    url: 'https://riscent.com/slm',
    siteName: 'Riscent',
    type: 'website',
  },
};

export default function SlmPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Service',
            name: 'Custom Small Language Model (SLM) Fine-Tuning and Deployment',
            provider: { '@type': 'Organization', name: 'Riscent', url: 'https://riscent.com' },
            areaServed: 'US',
            description: 'Riscent fine-tunes and ships small language models that businesses own and run locally — lower operating cost, higher reliability, full privacy. Model chosen by measurement, verified on held-out data before shipping. Engagements: custom builds and consultations.',
            serviceType: 'AI / Small Language Model Development',
            url: 'https://riscent.com/slm',
          }),
        }}
      />
      <SlmPitch />
    </>
  );
}
