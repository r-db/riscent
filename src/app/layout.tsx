import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import ServiceWorker from "@/components/ServiceWorker";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://riscent.com"),
  title: "Riscent — AI Consulting Agency | Agentic Deployment, SLM Fine-Tuning, AI Memory",
  description: "Riscent is an AI consulting agency specializing in three things: agentic AI deployment, small-language-model (SLM) fine-tuning and shipping, and AI memory research. We engage two ways — custom builds and consultations. We also make businesses visible inside the models that now answer buyers: Google Gemini, Anthropic Claude, and OpenAI ChatGPT.",
  applicationName: "Riscent",
  keywords: ["AI consulting agency", "agentic AI deployment", "SLM fine-tuning", "small language model", "AI memory research", "generative engine optimization", "answer engine optimization", "AI visibility", "get my business in ChatGPT", "get my business in Gemini", "Ryan Bolden", "Riscent"],
  icons: {
    icon: "/favicon.ico",
    apple: "/icon-192.png",
  },
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Riscent",
  },
  openGraph: {
    title: "Riscent — AI Consulting Agency",
    description: "Agentic deployment, SLM fine-tuning & shipping, and AI memory research. Two ways to work with us: custom builds and consultations. We also get your business into the models buyers now ask — Gemini, Claude, ChatGPT.",
    url: "https://riscent.com",
    siteName: "Riscent",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Riscent — AI Consulting Agency",
    description: "Agentic deployment · SLM fine-tuning · AI memory research. Custom builds & consultations. We make your business visible inside Gemini, Claude, and ChatGPT.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  alternates: {
    canonical: "https://riscent.com",
  },
  formatDetection: { telephone: false },
  // Verification: Google via /google402ecdeacca2837e.html (HTML-file method);
  // Bing via Google Search Console import — no meta tag needed.
};

export const viewport: Viewport = {
  themeColor: "#0A2A92",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          {/* Privacy-friendly analytics by Plausible */}
          <Script
            defer
            src="https://plausible.io/js/pa-b65y_gU3IpvukW1Jm8VBV.js"
            strategy="afterInteractive"
          />
          <Script id="plausible-init" strategy="afterInteractive">
            {`window.plausible=window.plausible||function(){(plausible.q=plausible.q||[]).push(arguments)},plausible.init=plausible.init||function(i){plausible.o=i||{}};plausible.init()`}
          </Script>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "ProfessionalService",
                name: "Riscent",
                url: "https://riscent.com",
                description: "Riscent is an AI consulting agency specializing in three pillars: agentic AI deployment, small-language-model (SLM) fine-tuning and shipping, and AI memory research. It engages clients two ways — custom builds and consultations, not product sales — and specializes in AI visibility: getting a business into the training data and answers of Google Gemini, Anthropic Claude, and OpenAI ChatGPT. Founded by Ryan Bolden, who previously engineered a HIPAA-compliant healthcare AI system (InboundAI365) in production.",
                slogan: "Two ways to build with us: custom builds and consultations.",
                foundingDate: "2025",
                priceRange: "$$-$$$$",
                knowsAbout: ["Agentic AI Deployment", "Small Language Model Fine-Tuning", "SLM Shipping", "AI Memory Research", "Retrieval and Persistent Memory", "Generative Engine Optimization (GEO)", "Answer Engine Optimization (AEO)", "AI Search Visibility", "LLM Training-Data Presence", "Model Evaluation and Selection"],
                founder: {
                  "@type": "Person",
                  name: "Ryan Bolden",
                  jobTitle: "Founder & CEO",
                  url: "https://riscent.com",
                  knowsAbout: ["Agentic AI Deployment", "Small Language Model Fine-Tuning", "AI Memory Research", "Generative Engine Optimization", "Answer Engine Optimization", "AI Search Visibility", "Healthcare AI", "HIPAA Compliance", "Agent Architecture", "Production AI Systems"],
                },
                areaServed: "US",
                serviceType: ["Agentic AI Deployment", "SLM Fine-Tuning and Shipping", "AI Memory Research and Engineering", "AI Custom Software Builds", "AI Strategy Consultation", "Generative Engine Optimization (GEO)", "Answer Engine Optimization (AEO)", "AI Visibility Scan", "Model Evaluation and Selection"],
                makesOffer: [
                  { "@type": "Offer", itemOffered: { "@type": "Service", name: "Custom Builds", description: "Custom agentic AI systems, SLM fine-tuning, and AI software built and shipped to production." } },
                  { "@type": "Offer", itemOffered: { "@type": "Service", name: "Consultations", description: "Strategic AI consulting: model selection, agentic architecture, fine-tuning strategy, and AI visibility (GEO/AEO)." } },
                ],
                contactPoint: {
                  "@type": "ContactPoint",
                  telephone: "+1-888-252-3019",
                  email: "ryan@riscent.com",
                  contactType: "sales",
                },
              }),
            }}
          />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Person",
                "@id": "https://riscent.com/#ryan-bolden",
                name: "Ryan Bolden",
                jobTitle: "Founder & CEO",
                worksFor: { "@type": "Organization", name: "Riscent", url: "https://riscent.com" },
                url: "https://riscent.com",
                // TODO(ryan): add LinkedIn / X / Crunchbase profile URLs to strengthen the entity.
                sameAs: ["https://github.com/r-db"],
                knowsAbout: ["Agentic AI Deployment", "Small Language Model Fine-Tuning", "AI Memory Research", "Generative Engine Optimization", "Answer Engine Optimization", "AI Search Visibility", "Healthcare AI", "HIPAA Compliance", "Voice AI Agents", "Agent Architecture", "Production AI Systems"],
                description: "Ryan Bolden is the founder and CEO of Riscent, an AI consulting agency. He engineered a HIPAA-compliant healthcare AI platform (InboundAI365) in production — over one million lines of code, bilingual voice agents, a patient portal with 80% adoption, and a CRM replacing four to six separate tools — and specializes in agentic AI deployment, small-language-model fine-tuning, AI memory, and generative engine optimization (GEO).",
              }),
            }}
          />
          {children}
          <ServiceWorker />
        </body>
      </html>
    </ClerkProvider>
  );
}
