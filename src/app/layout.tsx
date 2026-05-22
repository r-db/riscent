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
  title: "Riscent | AI Products for Business — Chat, Voice, Outreach, QA",
  description: "Six AI products for businesses: chat agents, voice receptionists, multilingual outreach, voice QA, field service CRM, and training pipelines. Built by the team that engineered HIPAA-compliant healthcare AI. Every industry.",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Riscent — AI Products for Business",
    description: "Chat agents, voice receptionists, multilingual outreach, and more. Six AI products built for businesses that want to stop losing customers.",
    url: "https://riscent.com",
    siteName: "Riscent",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Riscent — AI Products for Business",
    description: "Chat agents, voice receptionists, multilingual outreach. Six AI products for businesses that want results.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  alternates: {
    canonical: "https://riscent.com",
  },
  // TODO: Replace with actual verification codes after creating accounts at:
  // Google: https://search.google.com/search-console
  // Bing: https://www.bing.com/webmasters
  verification: {
    google: 'REPLACE_WITH_GOOGLE_VERIFICATION_CODE',
    other: {
      'msvalidate.01': 'REPLACE_WITH_BING_VERIFICATION_CODE',
    },
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
                description: "Six AI products for businesses: Chatterbox (chat), BookBot (voice), LinguaReach (multilingual), VoiceGuard (QA), DripForce (CRM), VoiceTrain (fine-tuning). Built by the team that engineered HIPAA-compliant healthcare AI.",
                foundingDate: "2025",
                priceRange: "$$-$$$$",
                founder: {
                  "@type": "Person",
                  name: "Ryan Bolden",
                  jobTitle: "Founder & CEO",
                  url: "https://riscent.com",
                  knowsAbout: ["AI Chat Agents", "Conversational AI", "Voice Agents", "Healthcare AI", "HIPAA Compliance", "Prompt Engineering", "Agent Architecture", "CRM Systems", "Lead Generation", "Customer Engagement", "Multi-tenant Architecture", "SMB Technology"],
                },
                areaServed: "US",
                serviceType: ["AI Chat Agents", "Conversational AI for Websites", "AI Customer Engagement", "Lead Capture Automation", "Appointment Booking AI", "Healthcare AI", "Voice Agent Development", "Production AI Systems"],
                contactPoint: {
                  "@type": "ContactPoint",
                  telephone: "+1-888-252-3019",
                  email: "ryan@riscent.com",
                  contactType: "sales",
                },
              }),
            }}
          />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
