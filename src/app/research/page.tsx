'use client';

/**
 * Riscent Research Hub
 * Modern, navigable research page showcasing core research topics
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, Brain, Sparkles, Target, FileText, ExternalLink, ChevronRight } from 'lucide-react';

// Color palette from landing page
const colors = {
  bgPrimary: '#FFFAF5',
  bgSecondary: '#FFF8F0',
  bgTertiary: '#F5F0E8',
  sageDeep: '#4A7C59',
  sageMid: '#6B9B7A',
  sageLight: '#A8D5BA',
  sagePale: '#E8F0E8',
  trustBlue: '#2C5282',
  warmCoral: '#E07A5F',
  warmGold: '#D4A84B',
  textPrimary: '#1A1A1A',
  textSecondary: '#3D3D3D',
  textMuted: '#6B6B6B',
  borderLight: 'rgba(74, 124, 89, 0.15)',
};

// Main Research Topics
const mainResearchTopics = [
  {
    slug: 'mechanistic-interpretability',
    title: 'Mechanistic Interpretability',
    subtitle: 'Understanding How Neural Networks Actually Think',
    description: 'Opening the black box of AI systems through reverse-engineering neural network internals. We believe transparency is the foundation of trust.',
    icon: Brain,
    color: colors.trustBlue,
    status: 'Core Research Topic',
  },
  {
    slug: 'usefulness-purpose-understanding-intent',
    title: 'Usefulness & Purpose of Understanding Intent',
    subtitle: 'Why Intent Matters in AI Systems',
    description: 'Exploring how understanding and encoding intent in AI systems creates more useful, trustworthy, and aligned artificial intelligence.',
    icon: Target,
    color: colors.warmCoral,
    status: 'Core Research Topic',
  },
  {
    slug: 'consciousness-abstraction',
    title: 'Consciousness Abstraction',
    subtitle: 'Layers of Awareness in Synthetic Intelligence',
    description: 'Investigating the abstraction layers of consciousness—from reactive patterns to meta-awareness—and how they manifest in AI systems.',
    icon: Sparkles,
    color: colors.sageDeep,
    status: 'Core Research Topic',
  },
];

// Interesting Finds - Articles that don't fit main topics
const interestingFinds = [
  {
    slug: 'ai-design-award-winners',
    title: 'How AI Can Design Like Award-Winners, Not Templates',
    subtitle: 'The gap isn\'t about technical capability—it\'s about understanding intent.',
    description: 'Research across 2024-2025 award winners reveals how exceptional design emerges from deep content-form connection, not pattern-matching.',
    publishedDate: 'January 2026',
    readTime: '12 min read',
    color: colors.warmGold,
  },
];

export default function ResearchPage() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.bgPrimary }}>
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-sm" style={{
        backgroundColor: `${colors.bgPrimary}E6`,
        borderBottom: `1px solid ${colors.borderLight}`
      }}>
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="flex items-center gap-2 transition-colors duration-300"
              style={{ color: colors.sageDeep }}
            >
              <ArrowLeft size={20} />
              <span className="text-sm font-medium">Back to Home</span>
            </Link>

            {/* Breathing logo */}
            <Link href="/">
              <motion.div
                animate={{
                  scale: [1, 1.08, 1],
                  opacity: [0.7, 1, 0.7],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{
                  background: `radial-gradient(circle, ${colors.sageDeep}20, transparent 70%)`
                }}
              >
                <div
                  className="w-5 h-5 rounded-full"
                  style={{
                    background: `radial-gradient(circle, ${colors.sageDeep}, ${colors.sageDeep}00)`
                  }}
                />
              </motion.div>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.05 }}
            className="max-w-3xl"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6" style={{
              backgroundColor: colors.sagePale
            }}>
              <FileText size={16} style={{ color: colors.sageDeep }} />
              <span className="text-sm font-medium" style={{ color: colors.sageDeep }}>
                RESEARCH HUB
              </span>
            </div>

            <h1 className="text-5xl md:text-6xl font-light mb-6 tracking-tight leading-[1.1]" style={{
              color: colors.textPrimary
            }}>
              Research
              <br />
              <span className="font-semibold" style={{ color: colors.sageDeep }}>
                That Matters
              </span>
            </h1>

            <p className="text-xl leading-relaxed" style={{ color: colors.textSecondary }}>
              We publish research at the intersection of consciousness, design, and artificial intelligence.
              Our work focuses on making AI systems transparent, intentional, and genuinely trustworthy.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Research Topics - 3 Core Areas */}
      <section className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.05, delay: 0.05 }}
          >
            <h3 className="text-sm font-semibold tracking-wide uppercase mb-8" style={{
              color: colors.textMuted
            }}>
              Core Research Topics
            </h3>

            <div className="grid md:grid-cols-1 gap-6">
              {mainResearchTopics.map((topic, index) => (
                <Link key={topic.slug} href={`/research/${topic.slug}`}>
                  <motion.article
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.05, delay: 0.05 + index * 0.01 }}
                    className="rounded-3xl p-10 transition-all duration-400 cursor-pointer"
                    style={{
                      backgroundColor: colors.bgSecondary,
                      border: `2px solid ${topic.color}30`,
                      boxShadow: hoveredCard === topic.slug ? `0 20px 50px ${topic.color}15` : '0 4px 20px rgba(0,0,0,0.03)',
                      transform: hoveredCard === topic.slug ? 'translateY(-4px)' : 'translateY(0)',
                    }}
                    onMouseEnter={() => setHoveredCard(topic.slug)}
                    onMouseLeave={() => setHoveredCard(null)}
                  >
                    <div className="flex items-start gap-6">
                      <div
                        className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: `${topic.color}15` }}
                      >
                        <topic.icon size={28} style={{ color: topic.color }} strokeWidth={1.5} />
                      </div>

                      <div className="flex-1">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-3" style={{
                          backgroundColor: `${topic.color}10`,
                        }}>
                          <span className="text-xs font-semibold tracking-wide uppercase" style={{
                            color: topic.color
                          }}>
                            {topic.status}
                          </span>
                        </div>

                        <h2 className="text-3xl font-light mb-3 tracking-tight" style={{
                          color: colors.textPrimary
                        }}>
                          {topic.title}
                        </h2>

                        <p className="text-lg mb-4 font-medium" style={{
                          color: topic.color
                        }}>
                          {topic.subtitle}
                        </p>

                        <p className="text-base leading-relaxed" style={{
                          color: colors.textSecondary
                        }}>
                          {topic.description}
                        </p>

                        <div className="mt-6 inline-flex items-center gap-2 text-sm font-medium" style={{
                          color: topic.color
                        }}>
                          <span>Explore Research</span>
                          <ChevronRight size={16} />
                        </div>
                      </div>
                    </div>
                  </motion.article>
                </Link>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Interesting Finds - Articles not in main topics */}
      <section className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.05, delay: 0.08 }}
          >
            <div className="mb-8">
              <h3 className="text-sm font-semibold tracking-wide uppercase mb-2" style={{
                color: colors.textMuted
              }}>
                Interesting Finds
              </h3>
              <p className="text-base" style={{ color: colors.textSecondary }}>
                Research articles and findings that don't fit neatly into our core topics
              </p>
            </div>

            <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-6">
              {interestingFinds.map((article, index) => (
                <Link key={article.slug} href={`/research/${article.slug}`}>
                  <motion.article
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.05, delay: 0.08 + index * 0.01 }}
                    className="rounded-2xl p-8 transition-all duration-300 cursor-pointer h-full"
                    style={{
                      backgroundColor: colors.bgSecondary,
                      border: `1px solid ${colors.borderLight}`,
                      boxShadow: hoveredCard === article.slug ? `0 12px 30px ${article.color}15` : '0 2px 10px rgba(0,0,0,0.02)',
                      transform: hoveredCard === article.slug ? 'translateY(-4px)' : 'translateY(0)',
                    }}
                    onMouseEnter={() => setHoveredCard(article.slug)}
                    onMouseLeave={() => setHoveredCard(null)}
                  >
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                      style={{ backgroundColor: `${article.color}15` }}
                    >
                      <FileText size={20} style={{ color: article.color }} />
                    </div>

                    <h3 className="text-2xl font-light mb-3 leading-tight" style={{ color: colors.textPrimary }}>
                      {article.title}
                    </h3>

                    <p className="text-sm mb-4 font-medium" style={{ color: article.color }}>
                      {article.subtitle}
                    </p>

                    <p className="text-sm leading-relaxed mb-4" style={{ color: colors.textSecondary }}>
                      {article.description}
                    </p>

                    <div className="flex items-center gap-3 text-xs" style={{ color: colors.textMuted }}>
                      <span>{article.publishedDate}</span>
                      <span>•</span>
                      <span>{article.readTime}</span>
                    </div>
                  </motion.article>
                </Link>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 mt-20" style={{
        borderTop: `1px solid ${colors.borderLight}`,
        backgroundColor: colors.bgSecondary,
      }}>
        <div className="max-w-7xl mx-auto flex justify-between items-center flex-wrap gap-6">
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center"
              style={{ background: `radial-gradient(circle, ${colors.sageDeep}30, transparent 70%)` }}
            >
              <div
                className="w-[18px] h-[18px] rounded-full"
                style={{ background: `radial-gradient(circle, ${colors.sageDeep}, ${colors.sageDeep}00)` }}
              />
            </div>
            <span className="text-base font-semibold tracking-tight">
              RISCENT
            </span>
          </div>

          <div className="flex gap-8">
            <Link href="/research" className="text-sm transition-colors duration-300" style={{ color: colors.textMuted }}>
              Research
            </Link>
            <Link href="/thoughts" className="text-sm transition-colors duration-300" style={{ color: colors.textMuted }}>
              Thoughts
            </Link>
            <Link href="/behind-the-curtain" className="text-sm transition-colors duration-300" style={{ color: colors.textMuted }}>
              About
            </Link>
          </div>

          <p className="text-sm" style={{ color: colors.textMuted }}>
            &copy; 2026 Riscent
          </p>
        </div>
      </footer>
    </div>
  );
}
