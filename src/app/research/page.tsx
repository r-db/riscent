'use client';

/**
 * Riscent Research Hub
 * Database-driven research page showcasing core research topics
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, Brain, Sparkles, Target, FileText, ChevronRight, Loader2, LucideIcon } from 'lucide-react';

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

// Icon mapping from database icon names to Lucide components
const iconMap: Record<string, LucideIcon> = {
  Brain,
  Sparkles,
  Target,
  FileText,
};

// Types from API
interface ResearchTopic {
  topic_id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  icon_name: string;
  color_hex: string;
  display_order: number;
  status: string;
  article_count: number;
  document_count: number;
}

interface InterestingFind {
  article_id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  introduction: string | null;
  published_date: string | null;
  read_time: string | null;
  color_hex: string;
}

export default function ResearchPage() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [topics, setTopics] = useState<ResearchTopic[]>([]);
  const [interestingFinds, setInterestingFinds] = useState<InterestingFind[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch topics and interesting finds in parallel
        const [topicsRes, articlesRes] = await Promise.all([
          fetch('/api/research/topics'),
          fetch('/api/research/articles?interesting=true'),
        ]);

        if (!topicsRes.ok) throw new Error('Failed to fetch topics');
        if (!articlesRes.ok) throw new Error('Failed to fetch articles');

        const topicsData = await topicsRes.json();
        const articlesData = await articlesRes.json();

        setTopics(topicsData.topics || []);
        setInterestingFinds(articlesData.articles || []);
      } catch (err) {
        console.error('Error fetching research data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load research data');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  // Get icon component from name
  const getIcon = (iconName: string): LucideIcon => {
    return iconMap[iconName] || FileText;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: colors.bgPrimary }}>
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin" style={{ color: colors.sageDeep }} />
          <p className="text-sm" style={{ color: colors.textMuted }}>Loading research...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: colors.bgPrimary }}>
        <div className="text-center max-w-md px-6">
          <p className="text-lg mb-4" style={{ color: colors.warmCoral }}>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 rounded-lg text-sm font-medium"
            style={{ backgroundColor: colors.sageDeep, color: '#fff' }}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

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
          <div className="max-w-3xl">
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
          </div>
        </div>
      </section>

      {/* Main Research Topics - Core Areas */}
      <section className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div>
            <h3 className="text-sm font-semibold tracking-wide uppercase mb-8" style={{
              color: colors.textMuted
            }}>
              Core Research Topics
            </h3>

            <div className="grid md:grid-cols-1 gap-6">
              {topics.map((topic) => {
                const IconComponent = getIcon(topic.icon_name);
                const topicColor = topic.color_hex || colors.sageDeep;

                return (
                  <Link key={topic.slug} href={`/research/${topic.slug}`}>
                    <article
                      className="rounded-3xl p-10 transition-all duration-400 cursor-pointer"
                      style={{
                        backgroundColor: colors.bgSecondary,
                        border: `2px solid ${topicColor}30`,
                        boxShadow: hoveredCard === topic.slug ? `0 20px 50px ${topicColor}15` : '0 4px 20px rgba(0,0,0,0.03)',
                        transform: hoveredCard === topic.slug ? 'translateY(-4px)' : 'translateY(0)',
                      }}
                      onMouseEnter={() => setHoveredCard(topic.slug)}
                      onMouseLeave={() => setHoveredCard(null)}
                    >
                      <div className="flex items-start gap-6">
                        <div
                          className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: `${topicColor}15` }}
                        >
                          <IconComponent size={28} style={{ color: topicColor }} strokeWidth={1.5} />
                        </div>

                        <div className="flex-1">
                          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-3" style={{
                            backgroundColor: `${topicColor}10`,
                          }}>
                            <span className="text-xs font-semibold tracking-wide uppercase" style={{
                              color: topicColor
                            }}>
                              Core Research Topic
                            </span>
                          </div>

                          <h2 className="text-3xl font-light mb-3 tracking-tight" style={{
                            color: colors.textPrimary
                          }}>
                            {topic.title}
                          </h2>

                          {topic.subtitle && (
                            <p className="text-lg mb-4 font-medium" style={{
                              color: topicColor
                            }}>
                              {topic.subtitle}
                            </p>
                          )}

                          {topic.description && (
                            <p className="text-base leading-relaxed" style={{
                              color: colors.textSecondary
                            }}>
                              {topic.description}
                            </p>
                          )}

                          <div className="mt-6 flex items-center justify-between">
                            <div className="inline-flex items-center gap-2 text-sm font-medium" style={{
                              color: topicColor
                            }}>
                              <span>Explore Research</span>
                              <ChevronRight size={16} />
                            </div>

                            {(topic.article_count > 0 || topic.document_count > 0) && (
                              <div className="flex items-center gap-4 text-xs" style={{ color: colors.textMuted }}>
                                {topic.article_count > 0 && (
                                  <span>{topic.article_count} article{topic.article_count !== 1 ? 's' : ''}</span>
                                )}
                                {topic.document_count > 0 && (
                                  <span>{topic.document_count} document{topic.document_count !== 1 ? 's' : ''}</span>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </article>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Interesting Finds - Articles not in main topics */}
      {interestingFinds.length > 0 && (
        <section className="py-12 px-6">
          <div className="max-w-7xl mx-auto">
            <div>
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
                {interestingFinds.map((article) => {
                  const articleColor = article.color_hex || colors.warmGold;

                  return (
                    <Link key={article.slug} href={`/research/articles/${article.slug}`}>
                      <article
                        className="rounded-2xl p-8 transition-all duration-300 cursor-pointer h-full"
                        style={{
                          backgroundColor: colors.bgSecondary,
                          border: `1px solid ${colors.borderLight}`,
                          boxShadow: hoveredCard === article.slug ? `0 12px 30px ${articleColor}15` : '0 2px 10px rgba(0,0,0,0.02)',
                          transform: hoveredCard === article.slug ? 'translateY(-4px)' : 'translateY(0)',
                        }}
                        onMouseEnter={() => setHoveredCard(article.slug)}
                        onMouseLeave={() => setHoveredCard(null)}
                      >
                        <div
                          className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                          style={{ backgroundColor: `${articleColor}15` }}
                        >
                          <FileText size={20} style={{ color: articleColor }} />
                        </div>

                        <h3 className="text-2xl font-light mb-3 leading-tight" style={{ color: colors.textPrimary }}>
                          {article.title}
                        </h3>

                        {article.subtitle && (
                          <p className="text-sm mb-4 font-medium" style={{ color: articleColor }}>
                            {article.subtitle}
                          </p>
                        )}

                        {article.introduction && (
                          <p className="text-sm leading-relaxed mb-4 line-clamp-3" style={{ color: colors.textSecondary }}>
                            {article.introduction}
                          </p>
                        )}

                        <div className="flex items-center gap-3 text-xs" style={{ color: colors.textMuted }}>
                          {article.published_date && <span>{article.published_date}</span>}
                          {article.published_date && article.read_time && <span>•</span>}
                          {article.read_time && <span>{article.read_time}</span>}
                        </div>
                      </article>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      )}

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
