import type { Metadata } from 'next';
import SiteNav from '@/components/SiteNav';

export const metadata: Metadata = {
  title: 'Documentation | Riscent — AI Consulting by Ryan Bolden',
  description: 'Technical documentation, production lessons, and frameworks from building a $1.6M healthcare AI platform. Voice agents, HIPAA compliance, agent architecture, and persistence systems.',
};

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ background: '#0b0e14', color: '#e6e8ed', minHeight: '100vh', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Inter, sans-serif' }}>
      <SiteNav />
      <div style={{ paddingTop: 60 }}>
        {children}
      </div>
    </div>
  );
}
