'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { FileText, Download, ArrowLeft, Filter } from 'lucide-react';

interface Document {
  id: string;
  slug: string;
  title: string;
  description: string;
  type: string;
  pdf_url: string | null;
  created_at: string;
}

const documentTypes = [
  { value: '', label: 'All Documents' },
  { value: 'whitepaper', label: 'Whitepapers' },
  { value: 'research', label: 'Research' },
  { value: 'case-study', label: 'Case Studies' },
  { value: 'guide', label: 'Guides' },
];

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState('');

  useEffect(() => {
    async function fetchDocuments() {
      try {
        const params = selectedType ? `?type=${selectedType}` : '';
        const res = await fetch(`/api/documents${params}`);
        const data = await res.json();
        setDocuments(data.documents || []);
      } catch (error) {
        console.error('Failed to fetch documents:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchDocuments();
  }, [selectedType]);

  return (
    <div className="min-h-screen bg-[#FFFAF5]">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#FFFAF5]/90 backdrop-blur-sm border-b border-[#E8E0D8]">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="flex items-center gap-2 text-[#4A7C59] hover:text-[#3d6a4a] transition-colors"
            >
              <ArrowLeft size={20} />
              <span className="text-sm font-medium">Back to Home</span>
            </Link>

            {/* Mini breathing circle */}
            <Link href="/" className="group">
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="w-8 h-8 rounded-full bg-gradient-to-br from-[#E07A5F] to-[#d06a4f] group-hover:shadow-lg transition-shadow"
              />
            </Link>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-6xl mx-auto px-6 py-12">
        {/* Title section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-light text-[#2D3A2D] mb-4 tracking-tight">
            Documents
          </h1>
          <p className="text-lg text-[#5A6B5A] max-w-2xl">
            Research papers, whitepapers, and guides on synthetic consciousness,
            anthropomorphic AI, and mechanistic interpretability.
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 flex-wrap">
            <Filter size={16} className="text-[#888]" />
            {documentTypes.map((type) => (
              <button
                key={type.value}
                onClick={() => setSelectedType(type.value)}
                className={`
                  px-4 py-2 rounded-full text-sm transition-all duration-200
                  ${selectedType === type.value
                    ? 'bg-[#4A7C59] text-white'
                    : 'bg-[#F0E8E0] text-[#5A6B5A] hover:bg-[#E8DFD4]'
                  }
                `}
              >
                {type.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Documents grid */}
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-6 border border-[#E8E0D8] animate-pulse"
              >
                <div className="h-6 bg-[#F0E8E0] rounded w-3/4 mb-4" />
                <div className="h-4 bg-[#F0E8E0] rounded w-full mb-2" />
                <div className="h-4 bg-[#F0E8E0] rounded w-2/3" />
              </div>
            ))}
          </div>
        ) : documents.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <FileText size={48} className="mx-auto text-[#C4B8AC] mb-4" />
            <h3 className="text-xl text-[#5A6B5A] mb-2">No documents yet</h3>
            <p className="text-[#888]">
              Documents will appear here once they are published.
            </p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {documents.map((doc, i) => (
              <motion.div
                key={doc.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i }}
              >
                <Link href={`/documents/${doc.slug}`}>
                  <div className="group bg-white rounded-2xl p-6 border border-[#E8E0D8] hover:border-[#4A7C59]/30 hover:shadow-lg transition-all duration-300 h-full">
                    {/* Type badge */}
                    <span className="inline-block px-3 py-1 bg-[#4A7C59]/10 text-[#4A7C59] text-xs rounded-full mb-4 capitalize">
                      {doc.type.replace('-', ' ')}
                    </span>

                    {/* Title */}
                    <h3 className="text-xl font-medium text-[#2D3A2D] mb-3 group-hover:text-[#4A7C59] transition-colors">
                      {doc.title}
                    </h3>

                    {/* Description */}
                    <p className="text-[#5A6B5A] text-sm mb-4 line-clamp-3">
                      {doc.description}
                    </p>

                    {/* Footer */}
                    <div className="flex items-center justify-between text-xs text-[#888]">
                      <span>
                        {new Date(doc.created_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                      {doc.pdf_url && (
                        <span className="flex items-center gap-1 text-[#4A7C59]">
                          <Download size={12} />
                          PDF
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-[#E8E0D8] mt-16">
        <div className="max-w-6xl mx-auto px-6 py-8">
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
