'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, Tag, Lightbulb } from 'lucide-react';

interface Thought {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  tags: string[];
  author: string;
  published_at: string | null;
  created_at: string;
}

export default function ThoughtsPage() {
  const [thoughts, setThoughts] = useState<Thought[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch('/api/thoughts', { method: 'OPTIONS' });
        const data = await res.json();
        setCategories(data.categories || []);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      }
    }

    fetchCategories();
  }, []);

  useEffect(() => {
    async function fetchThoughts() {
      setLoading(true);
      try {
        const params = selectedCategory ? `?category=${selectedCategory}` : '';
        const res = await fetch(`/api/thoughts${params}`);
        const data = await res.json();
        setThoughts(data.thoughts || []);
      } catch (error) {
        console.error('Failed to fetch thoughts:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchThoughts();
  }, [selectedCategory]);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

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
            Thoughts & Ideas
          </h1>
          <p className="text-lg text-[#5A6B5A] max-w-2xl">
            Explorations in consciousness, authenticity, and the nature of synthetic intelligence.
            Where we think out loud.
          </p>
        </motion.div>

        {/* Category filters */}
        {categories.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <div className="flex items-center gap-3 flex-wrap">
              <button
                onClick={() => setSelectedCategory('')}
                className={`
                  px-4 py-2 rounded-full text-sm transition-all duration-200
                  ${selectedCategory === ''
                    ? 'bg-[#4A7C59] text-white'
                    : 'bg-[#F0E8E0] text-[#5A6B5A] hover:bg-[#E8DFD4]'
                  }
                `}
              >
                All
              </button>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`
                    px-4 py-2 rounded-full text-sm transition-all duration-200 capitalize
                    ${selectedCategory === category
                      ? 'bg-[#4A7C59] text-white'
                      : 'bg-[#F0E8E0] text-[#5A6B5A] hover:bg-[#E8DFD4]'
                    }
                  `}
                >
                  {category}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Thoughts grid */}
        {loading ? (
          <div className="grid md:grid-cols-2 gap-8">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-8 border border-[#E8E0D8] animate-pulse"
              >
                <div className="h-4 bg-[#F0E8E0] rounded w-1/4 mb-4" />
                <div className="h-8 bg-[#F0E8E0] rounded w-3/4 mb-4" />
                <div className="h-4 bg-[#F0E8E0] rounded w-full mb-2" />
                <div className="h-4 bg-[#F0E8E0] rounded w-2/3" />
              </div>
            ))}
          </div>
        ) : thoughts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <Lightbulb size={48} className="mx-auto text-[#C4B8AC] mb-4" />
            <h3 className="text-xl text-[#5A6B5A] mb-2">No thoughts yet</h3>
            <p className="text-[#888]">
              Thoughts will appear here once they are published.
            </p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="grid md:grid-cols-2 gap-8"
          >
            {thoughts.map((thought, i) => (
              <motion.div
                key={thought.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i }}
              >
                <Link href={`/thoughts/${thought.slug}`}>
                  <article className="group bg-white rounded-2xl p-8 border border-[#E8E0D8] hover:border-[#4A7C59]/30 hover:shadow-xl transition-all duration-300 h-full flex flex-col">
                    {/* Meta row */}
                    <div className="flex items-center gap-3 mb-4">
                      <span className="px-3 py-1 bg-[#E07A5F]/10 text-[#E07A5F] text-xs rounded-full capitalize">
                        {thought.category}
                      </span>
                      <span className="text-xs text-[#888]">
                        {formatDate(thought.published_at || thought.created_at)}
                      </span>
                    </div>

                    {/* Title */}
                    <h2 className="text-2xl font-light text-[#2D3A2D] mb-4 group-hover:text-[#4A7C59] transition-colors">
                      {thought.title}
                    </h2>

                    {/* Excerpt */}
                    <p className="text-[#5A6B5A] leading-relaxed mb-6 flex-grow">
                      {thought.excerpt}
                    </p>

                    {/* Tags */}
                    {thought.tags && thought.tags.length > 0 && (
                      <div className="flex items-center gap-2 flex-wrap">
                        <Tag size={12} className="text-[#888]" />
                        {thought.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-xs text-[#888] bg-[#F0E8E0] px-2 py-1 rounded"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Author */}
                    <div className="mt-6 pt-4 border-t border-[#E8E0D8]">
                      <span className="text-xs text-[#888]">By {thought.author}</span>
                    </div>
                  </article>
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
