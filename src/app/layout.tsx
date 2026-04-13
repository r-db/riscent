import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
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
  title: "Riscent | AI Consulting by Ryan Bolden",
  description: "Ryan Bolden built a $1.6M HIPAA-compliant healthcare AI platform solo in 12 months. Over 1M lines of code. Voice agents, patient portals, CRM, automations. Now he builds production AI systems for businesses that need results, not slide decks.",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Riscent — AI Consulting by Ryan Bolden",
    description: "Production AI systems. Not demos. $1.6M healthcare platform built solo. 1,710 calls handled, zero missed. Fixed price. You own the code.",
    url: "https://riscent.com",
    siteName: "Riscent",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Riscent — AI Consulting by Ryan Bolden",
    description: "Production AI systems. Not demos. $1.6M healthcare platform built solo. Fixed price. You own the code.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  alternates: {
    canonical: "https://riscent.com",
  },
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
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "ProfessionalService",
                name: "Riscent",
                url: "https://riscent.com",
                description: "AI consulting practice specializing in production healthcare AI systems. Founded by Ryan Bolden.",
                founder: {
                  "@type": "Person",
                  name: "Ryan Bolden",
                  jobTitle: "Founder & CEO",
                  url: "https://riscent.com",
                },
                areaServed: "US",
                serviceType: ["AI Consulting", "Healthcare AI", "Voice Agent Development", "HIPAA Compliance", "Production AI Systems"],
                knowsAbout: ["Healthcare AI", "Voice Agents", "HIPAA Compliance", "Prompt Engineering", "Agent Architecture", "Patient Portals", "CRM Systems", "Mechanistic Interpretability", "AI Persistence"],
              }),
            }}
          />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
