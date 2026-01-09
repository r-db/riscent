'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, Download, Calendar, FileText } from 'lucide-react';

interface Document {
  id: string;
  slug: string;
  title: string;
  description: string;
  type: string;
  content: string;
  pdf_url: string | null;
  created_at: string;
  updated_at: string;
}

export default function DocumentPage() {
  const params = useParams();
  const [document, setDocument] = useState<Document | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDocument() {
      try {
        const res = await fetch(`/api/documents/${params.slug}`);
        if (!res.ok) {
          if (res.status === 404) {
            setError('Document not found');
          } else {
            setError('Failed to load document');
          }
          return;
        }
        const data = await res.json();
        setDocument(data.document);
      } catch (err) {
        setError('Failed to load document');
      } finally {
        setLoading(false);
      }
    }

    if (params.slug) {
      fetchDocument();
    }
  }, [params.slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFFAF5] flex items-center justify-center">
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="w-12 h-12 rounded-full bg-gradient-to-br from-[#E07A5F] to-[#d06a4f]"
        />
      </div>
    );
  }

  if (error || !document) {
    return (
      <div className="min-h-screen bg-[#FFFAF5] flex items-center justify-center">
        <div className="text-center">
          <FileText size={48} className="mx-auto text-[#C4B8AC] mb-4" />
          <h1 className="text-2xl text-[#2D3A2D] mb-2">{error || 'Document not found'}</h1>
          <Link
            href="/documents"
            className="text-[#4A7C59] hover:underline"
          >
            Back to Documents
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFFAF5]">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#FFFAF5]/90 backdrop-blur-sm border-b border-[#E8E0D8]">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/documents"
              className="flex items-center gap-2 text-[#4A7C59] hover:text-[#3d6a4a] transition-colors"
            >
              <ArrowLeft size={20} />
              <span className="text-sm font-medium">All Documents</span>
            </Link>

            {document.pdf_url && (
              <a
                href={document.pdf_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-[#4A7C59] text-white rounded-full text-sm hover:bg-[#3d6a4a] transition-colors"
              >
                <Download size={16} />
                Download PDF
              </a>
            )}
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Type badge */}
          <span className="inline-block px-3 py-1 bg-[#4A7C59]/10 text-[#4A7C59] text-xs rounded-full mb-6 capitalize">
            {document.type.replace('-', ' ')}
          </span>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-light text-[#2D3A2D] mb-6 tracking-tight">
            {document.title}
          </h1>

          {/* Meta */}
          <div className="flex items-center gap-6 text-sm text-[#888] mb-8 pb-8 border-b border-[#E8E0D8]">
            <div className="flex items-center gap-2">
              <Calendar size={14} />
              <span>
                {new Date(document.created_at).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </span>
            </div>
          </div>

          {/* Description */}
          {document.description && (
            <div className="mb-8 p-6 bg-[#F8F4F0] rounded-xl border border-[#E8E0D8]">
              <p className="text-lg text-[#5A6B5A] leading-relaxed">
                {document.description}
              </p>
            </div>
          )}

          {/* Content */}
          <div
            className="prose prose-lg max-w-none
              prose-headings:text-[#2D3A2D] prose-headings:font-light
              prose-p:text-[#4A5A4A] prose-p:leading-relaxed
              prose-a:text-[#4A7C59] prose-a:no-underline hover:prose-a:underline
              prose-strong:text-[#2D3A2D]
              prose-blockquote:border-l-[#4A7C59] prose-blockquote:text-[#5A6B5A]
              prose-code:text-[#E07A5F] prose-code:bg-[#F0E8E0] prose-code:px-1 prose-code:rounded
              prose-pre:bg-[#2D3A2D] prose-pre:text-[#E8E4DF]
            "
            dangerouslySetInnerHTML={{ __html: document.content }}
          />
        </motion.article>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#E8E0D8] mt-16">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-[#888]">
              &copy; {new Date().getFullYear()} Riscent. Synthetic Intelligence Integration.
            </p>
            <div className="flex items-center gap-6">
              <Link href="/documents" className="text-sm text-[#5A6B5A] hover:text-[#4A7C59]">
                Documents
              </Link>
              <Link href="/thoughts" className="text-sm text-[#5A6B5A] hover:text-[#4A7C59]">
                Thoughts
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
