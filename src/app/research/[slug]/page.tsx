'use client';

/**
 * Research Topic Page
 * Shows articles and documents for a specific research topic
 */

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, FileText, Download, ExternalLink, Loader2, Brain, Target, Sparkles, ChevronRight, Clock, User, LucideIcon } from 'lucide-react';

// Color palette
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

// Icon mapping
const iconMap: Record<string, LucideIcon> = {
  Brain,
  Sparkles,
  Target,
  FileText,
};

// Types
interface ResearchTopic {
  topic_id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  icon_name: string;
  color_hex: string;
}

interface ResearchArticle {
  article_id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  introduction: string | null;
  author_name: string;
  published_date: string | null;
  read_time: string | null;
  color_hex: string;
}

interface ResearchDocument {
  document_id: string;
  title: string;
  description: string | null;
  file_url: string;
  file_name: string | null;
  file_type: string;
  file_size_bytes: number | null;
}

interface TopicData {
  topic: ResearchTopic;
  articles: ResearchArticle[];
  documents: ResearchDocument[];
}

export default function TopicPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [data, setData] = useState<TopicData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTopic() {
      try {
        const res = await fetch(`/api/research/topics/${slug}`);

        if (!res.ok) {
          if (res.status === 404) {
            setError('Topic not found');
          } else {
            throw new Error('Failed to fetch topic');
          }
          return;
        }

        const responseData = await res.json();
        setData(responseData);
      } catch (err) {
        console.error('Error fetching topic:', err);
        setError(err instanceof Error ? err.message : 'Failed to load topic');
      } finally {
        setLoading(false);
      }
    }

    if (slug) {
      fetchTopic();
    }
  }, [slug]);

  // Format file size
  const formatFileSize = (bytes: number | null): string => {
    if (!bytes) return '';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: colors.bgPrimary }}>
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin" style={{ color: colors.sageDeep }} />
          <p className="text-sm" style={{ color: colors.textMuted }}>Loading topic...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: colors.bgPrimary }}>
        <div className="text-center max-w-md px-6">
          <p className="text-lg mb-4" style={{ color: colors.warmCoral }}>{error || 'Topic not found'}</p>
          <Link
            href="/research"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium"
            style={{ backgroundColor: colors.sageDeep, color: '#fff' }}
          >
            <ArrowLeft size={16} />
            Back to Research
          </Link>
        </div>
      </div>
    );
  }

  const { topic, articles, documents } = data;
  const IconComponent = iconMap[topic.icon_name] || FileText;
  const topicColor = topic.color_hex || colors.sageDeep;

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
              href="/research"
              className="flex items-center gap-2 transition-colors duration-300"
              style={{ color: colors.sageDeep }}
            >
              <ArrowLeft size={20} />
              <span className="text-sm font-medium">Back to Research</span>
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

      {/* Topic Hero */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl"
          >
            <div className="flex items-start gap-6 mb-8">
              <div
                className="w-20 h-20 rounded-2xl flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: `${topicColor}15` }}
              >
                <IconComponent size={40} style={{ color: topicColor }} strokeWidth={1.5} />
              </div>

              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-4" style={{
                  backgroundColor: `${topicColor}10`,
                }}>
                  <span className="text-xs font-semibold tracking-wide uppercase" style={{
                    color: topicColor
                  }}>
                    Core Research Topic
                  </span>
                </div>

                <h1 className="text-4xl md:text-5xl font-light mb-4 tracking-tight leading-[1.1]" style={{
                  color: colors.textPrimary
                }}>
                  {topic.title}
                </h1>

                {topic.subtitle && (
                  <p className="text-xl font-medium" style={{ color: topicColor }}>
                    {topic.subtitle}
                  </p>
                )}
              </div>
            </div>

            {topic.description && (
              <p className="text-lg leading-relaxed" style={{ color: colors.textSecondary }}>
                {topic.description}
              </p>
            )}
          </motion.div>
        </div>
      </section>

      {/* Articles Section */}
      {articles.length > 0 && (
        <section className="py-12 px-6">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-sm font-semibold tracking-wide uppercase mb-8" style={{
              color: colors.textMuted
            }}>
              Articles ({articles.length})
            </h2>

            <div className="grid gap-6">
              {articles.map((article) => {
                const articleColor = article.color_hex || topicColor;

                return (
                  <Link key={article.article_id} href={`/research/articles/${article.slug}`}>
                    <motion.article
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="rounded-2xl p-8 transition-all duration-300 cursor-pointer"
                      style={{
                        backgroundColor: colors.bgSecondary,
                        border: `1px solid ${colors.borderLight}`,
                        boxShadow: hoveredCard === article.article_id ? `0 12px 30px ${articleColor}15` : '0 2px 10px rgba(0,0,0,0.02)',
                        transform: hoveredCard === article.article_id ? 'translateY(-4px)' : 'translateY(0)',
                      }}
                      onMouseEnter={() => setHoveredCard(article.article_id)}
                      onMouseLeave={() => setHoveredCard(null)}
                    >
                      <div className="flex items-start gap-6">
                        <div
                          className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: `${articleColor}15` }}
                        >
                          <FileText size={24} style={{ color: articleColor }} />
                        </div>

                        <div className="flex-1">
                          <h3 className="text-2xl font-light mb-2 tracking-tight" style={{
                            color: colors.textPrimary
                          }}>
                            {article.title}
                          </h3>

                          {article.subtitle && (
                            <p className="text-base mb-3 font-medium" style={{
                              color: articleColor
                            }}>
                              {article.subtitle}
                            </p>
                          )}

                          {article.introduction && (
                            <p className="text-sm leading-relaxed mb-4 line-clamp-2" style={{
                              color: colors.textSecondary
                            }}>
                              {article.introduction}
                            </p>
                          )}

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4 text-xs" style={{ color: colors.textMuted }}>
                              {article.author_name && (
                                <span className="flex items-center gap-1">
                                  <User size={12} />
                                  {article.author_name}
                                </span>
                              )}
                              {article.read_time && (
                                <span className="flex items-center gap-1">
                                  <Clock size={12} />
                                  {article.read_time}
                                </span>
                              )}
                              {article.published_date && (
                                <span>{article.published_date}</span>
                              )}
                            </div>

                            <div className="flex items-center gap-1 text-sm font-medium" style={{ color: articleColor }}>
                              <span>Read article</span>
                              <ChevronRight size={16} />
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.article>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Documents Section */}
      {documents.length > 0 && (
        <section className="py-12 px-6">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-sm font-semibold tracking-wide uppercase mb-8" style={{
              color: colors.textMuted
            }}>
              Research Documents ({documents.length})
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {documents.map((doc) => (
                <a
                  key={doc.document_id}
                  href={doc.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-xl p-5 transition-all duration-300 group"
                  style={{
                    backgroundColor: colors.bgSecondary,
                    border: `1px solid ${colors.borderLight}`,
                  }}
                  onMouseEnter={() => setHoveredCard(doc.document_id)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors duration-300"
                      style={{
                        backgroundColor: hoveredCard === doc.document_id ? `${topicColor}20` : `${topicColor}10`
                      }}
                    >
                      {doc.file_type === 'pdf' ? (
                        <FileText size={18} style={{ color: topicColor }} />
                      ) : (
                        <Download size={18} style={{ color: topicColor }} />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="text-base font-medium mb-1 truncate group-hover:text-clip" style={{
                        color: colors.textPrimary
                      }}>
                        {doc.title}
                      </h4>

                      {doc.description && (
                        <p className="text-xs mb-2 line-clamp-2" style={{ color: colors.textSecondary }}>
                          {doc.description}
                        </p>
                      )}

                      <div className="flex items-center gap-3 text-xs" style={{ color: colors.textMuted }}>
                        <span className="uppercase">{doc.file_type}</span>
                        {doc.file_size_bytes && (
                          <span>{formatFileSize(doc.file_size_bytes)}</span>
                        )}
                        <ExternalLink size={12} className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Empty state */}
      {articles.length === 0 && documents.length === 0 && (
        <section className="py-16 px-6">
          <div className="max-w-7xl mx-auto text-center">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
              style={{ backgroundColor: `${topicColor}15` }}
            >
              <FileText size={28} style={{ color: topicColor }} />
            </div>
            <h3 className="text-xl font-light mb-2" style={{ color: colors.textPrimary }}>
              Research in Progress
            </h3>
            <p className="text-base" style={{ color: colors.textMuted }}>
              We're actively working on research for this topic. Check back soon for articles and documents.
            </p>
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
