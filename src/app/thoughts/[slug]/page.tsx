'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, Calendar, User, Tag, Lightbulb } from 'lucide-react';

interface Thought {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  author: string;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export default function ThoughtPage() {
  const params = useParams();
  const [thought, setThought] = useState<Thought | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchThought() {
      try {
        const res = await fetch(`/api/thoughts/${params.slug}`);
        if (!res.ok) {
          if (res.status === 404) {
            setError('Thought not found');
          } else {
            setError('Failed to load thought');
          }
          return;
        }
        const data = await res.json();
        setThought(data.thought);
      } catch (err) {
        setError('Failed to load thought');
      } finally {
        setLoading(false);
      }
    }

    if (params.slug) {
      fetchThought();
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

  if (error || !thought) {
    return (
      <div className="min-h-screen bg-[#FFFAF5] flex items-center justify-center">
        <div className="text-center">
          <Lightbulb size={48} className="mx-auto text-[#C4B8AC] mb-4" />
          <h1 className="text-2xl text-[#2D3A2D] mb-2">{error || 'Thought not found'}</h1>
          <Link
            href="/thoughts"
            className="text-[#4A7C59] hover:underline"
          >
            Back to Thoughts
          </Link>
        </div>
      </div>
    );
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-[#FFFAF5]">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#FFFAF5]/90 backdrop-blur-sm border-b border-[#E8E0D8]">
        <div className="max-w-3xl mx-auto px-6 py-4">
          <Link
            href="/thoughts"
            className="flex items-center gap-2 text-[#4A7C59] hover:text-[#3d6a4a] transition-colors"
          >
            <ArrowLeft size={20} />
            <span className="text-sm font-medium">All Thoughts</span>
          </Link>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-3xl mx-auto px-6 py-12">
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Category badge */}
          <span className="inline-block px-3 py-1 bg-[#E07A5F]/10 text-[#E07A5F] text-xs rounded-full mb-6 capitalize">
            {thought.category}
          </span>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-light text-[#2D3A2D] mb-6 tracking-tight leading-tight">
            {thought.title}
          </h1>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-6 text-sm text-[#888] mb-8 pb-8 border-b border-[#E8E0D8]">
            <div className="flex items-center gap-2">
              <Calendar size={14} />
              <span>{formatDate(thought.published_at || thought.created_at)}</span>
            </div>
            <div className="flex items-center gap-2">
              <User size={14} />
              <span>{thought.author}</span>
            </div>
          </div>

          {/* Excerpt as intro */}
          {thought.excerpt && (
            <div className="mb-10">
              <p className="text-xl text-[#5A6B5A] leading-relaxed font-light italic">
                {thought.excerpt}
              </p>
            </div>
          )}

          {/* Content */}
          <div
            className="prose prose-lg max-w-none
              prose-headings:text-[#2D3A2D] prose-headings:font-light prose-headings:tracking-tight
              prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6
              prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-4
              prose-p:text-[#4A5A4A] prose-p:leading-relaxed prose-p:mb-6
              prose-a:text-[#4A7C59] prose-a:no-underline hover:prose-a:underline
              prose-strong:text-[#2D3A2D] prose-strong:font-medium
              prose-blockquote:border-l-4 prose-blockquote:border-[#E07A5F] prose-blockquote:bg-[#F8F4F0]
              prose-blockquote:text-[#5A6B5A] prose-blockquote:pl-6 prose-blockquote:py-4 prose-blockquote:pr-4
              prose-blockquote:rounded-r-xl prose-blockquote:not-italic
              prose-code:text-[#E07A5F] prose-code:bg-[#F0E8E0] prose-code:px-2 prose-code:py-0.5 prose-code:rounded prose-code:text-sm
              prose-pre:bg-[#2D3A2D] prose-pre:text-[#E8E4DF] prose-pre:rounded-xl
              prose-ul:text-[#4A5A4A] prose-ol:text-[#4A5A4A]
              prose-li:mb-2
              prose-img:rounded-xl prose-img:shadow-lg
            "
            dangerouslySetInnerHTML={{ __html: thought.content }}
          />

          {/* Tags */}
          {thought.tags && thought.tags.length > 0 && (
            <div className="mt-12 pt-8 border-t border-[#E8E0D8]">
              <div className="flex items-center gap-3 flex-wrap">
                <Tag size={16} className="text-[#888]" />
                {thought.tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/thoughts?tag=${tag}`}
                    className="px-3 py-1 bg-[#F0E8E0] text-[#5A6B5A] text-sm rounded-full hover:bg-[#E8DFD4] transition-colors"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </motion.article>

        {/* Back link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-16 pt-8 border-t border-[#E8E0D8]"
        >
          <Link
            href="/thoughts"
            className="inline-flex items-center gap-2 text-[#4A7C59] hover:text-[#3d6a4a] transition-colors"
          >
            <ArrowLeft size={16} />
            <span>More Thoughts & Ideas</span>
          </Link>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#E8E0D8] mt-16">
        <div className="max-w-3xl mx-auto px-6 py-8">
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
