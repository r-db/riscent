'use client';

/**
 * Research Article Page
 * Full article view with content sections, key takeaways, and related articles
 */

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, Clock, User, ChevronRight, Loader2 } from 'lucide-react';

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

// Types
interface ContentSection {
  heading: string;
  content: string;
}

interface ResearchArticle {
  article_id: string;
  topic_id: string | null;
  topic_slug: string | null;
  topic_title: string | null;
  slug: string;
  title: string;
  subtitle: string | null;
  introduction: string | null;
  conclusion: string | null;
  key_takeaways: string[];
  content_sections: ContentSection[];
  author_name: string;
  published_date: string | null;
  read_time: string | null;
  category: string | null;
  color_hex: string;
  status: string;
  meta_title: string | null;
  meta_description: string | null;
}

interface RelatedArticle {
  slug: string;
  title: string;
  subtitle: string | null;
  color_hex: string;
}

interface ArticleData {
  article: ResearchArticle;
  related: RelatedArticle[];
}

export default function ArticlePage() {
  const params = useParams();
  const slug = params.slug as string;

  const [data, setData] = useState<ArticleData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  useEffect(() => {
    async function fetchArticle() {
      try {
        const res = await fetch(`/api/research/articles/${slug}`);

        if (!res.ok) {
          if (res.status === 404) {
            setError('Article not found');
          } else {
            throw new Error('Failed to fetch article');
          }
          return;
        }

        const responseData = await res.json();
        setData(responseData);
      } catch (err) {
        console.error('Error fetching article:', err);
        setError(err instanceof Error ? err.message : 'Failed to load article');
      } finally {
        setLoading(false);
      }
    }

    if (slug) {
      fetchArticle();
    }
  }, [slug]);

  // Scroll progress tracking
  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      const currentScroll = window.scrollY;
      setScrollProgress(totalScroll > 0 ? (currentScroll / totalScroll) * 100 : 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Render markdown-style content
  const renderContent = (content: string, articleColor: string): string => {
    return content
      .replace(/\*\*(.*?)\*\*/g, `<strong style="color: ${colors.textPrimary}; font-weight: 600;">$1</strong>`)
      .replace(/\n\n/g, '</p><p class="mb-4">')
      .replace(/^- (.+)$/gm, '<li class="ml-4 mb-2">$1</li>');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: colors.bgPrimary }}>
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin" style={{ color: colors.sageDeep }} />
          <p className="text-sm" style={{ color: colors.textMuted }}>Loading article...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: colors.bgPrimary }}>
        <div className="text-center max-w-md px-6">
          <p className="text-lg mb-4" style={{ color: colors.warmCoral }}>{error || 'Article not found'}</p>
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

  const { article, related } = data;
  const articleColor = article.color_hex || colors.sageDeep;

  // Determine back link - to topic if available, otherwise to research hub
  const backLink = article.topic_slug
    ? `/research/${article.topic_slug}`
    : '/research';
  const backLabel = article.topic_title
    ? `Back to ${article.topic_title}`
    : 'Back to Research';

  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.bgPrimary }}>
      {/* Reading progress bar */}
      <div
        className="fixed top-0 left-0 h-1 z-50 transition-all duration-100"
        style={{
          width: `${scrollProgress}%`,
          backgroundColor: articleColor,
        }}
      />

      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur-sm" style={{
        backgroundColor: `${colors.bgPrimary}F5`,
        borderBottom: `1px solid ${colors.borderLight}`
      }}>
        <div className="max-w-4xl mx-auto px-6 py-4">
          <Link
            href={backLink}
            className="flex items-center gap-2 transition-colors duration-300"
            style={{ color: colors.sageDeep }}
          >
            <ArrowLeft size={18} />
            <span className="text-sm font-medium">{backLabel}</span>
          </Link>
        </div>
      </header>

      {/* Article Content */}
      <article className="max-w-4xl mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Category badge */}
          {article.category && (
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-8" style={{
              backgroundColor: `${articleColor}15`,
            }}>
              <span className="text-xs font-semibold tracking-wide uppercase" style={{
                color: articleColor
              }}>
                {article.category}
              </span>
            </div>
          )}

          {/* Title */}
          <h1 className="text-5xl md:text-6xl font-light mb-6 tracking-tight leading-[1.1]" style={{
            color: colors.textPrimary
          }}>
            {article.title}
          </h1>

          {/* Subtitle */}
          {article.subtitle && (
            <p className="text-2xl font-light mb-8 leading-relaxed" style={{
              color: articleColor
            }}>
              {article.subtitle}
            </p>
          )}

          {/* Meta info */}
          <div className="flex flex-wrap items-center gap-6 pb-8 mb-8" style={{
            borderBottom: `1px solid ${colors.borderLight}`
          }}>
            <div className="flex items-center gap-2">
              <User size={16} style={{ color: colors.textMuted }} />
              <span className="text-sm" style={{ color: colors.textSecondary }}>
                {article.author_name}
              </span>
            </div>
            {article.read_time && (
              <div className="flex items-center gap-2">
                <Clock size={16} style={{ color: colors.textMuted }} />
                <span className="text-sm" style={{ color: colors.textSecondary }}>
                  {article.read_time}
                </span>
              </div>
            )}
            {article.published_date && (
              <span className="text-sm" style={{ color: colors.textMuted }}>
                {article.published_date}
              </span>
            )}
          </div>
        </motion.div>

        {/* Introduction */}
        {article.introduction && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-12"
          >
            <p className="text-xl leading-relaxed" style={{ color: colors.textSecondary }}>
              {article.introduction}
            </p>
          </motion.div>
        )}

        {/* Main content sections */}
        {article.content_sections && article.content_sections.length > 0 && (
          article.content_sections.map((section, index) => (
            <motion.section
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
              className="mb-12"
            >
              <h2 className="text-3xl font-light mb-6 tracking-tight" style={{ color: colors.textPrimary }}>
                {section.heading}
              </h2>
              <div
                className="prose prose-lg max-w-none leading-relaxed"
                style={{ color: colors.textSecondary }}
                dangerouslySetInnerHTML={{
                  __html: renderContent(section.content, articleColor)
                }}
              />
            </motion.section>
          ))
        )}

        {/* Conclusion */}
        {article.conclusion && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mb-12 p-8 rounded-2xl"
            style={{
              backgroundColor: colors.bgSecondary,
              border: `1px solid ${colors.borderLight}`
            }}
          >
            <h2 className="text-2xl font-light mb-4" style={{ color: colors.textPrimary }}>
              Conclusion
            </h2>
            <div
              className="text-lg leading-relaxed"
              style={{ color: colors.textSecondary }}
              dangerouslySetInnerHTML={{
                __html: renderContent(article.conclusion, articleColor)
              }}
            />
          </motion.section>
        )}

        {/* Key Takeaways */}
        {article.key_takeaways && article.key_takeaways.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9 }}
            className="mb-16 p-8 rounded-2xl"
            style={{
              backgroundColor: `${articleColor}08`,
              border: `2px solid ${articleColor}20`
            }}
          >
            <h3 className="text-xl font-semibold mb-6" style={{ color: articleColor }}>
              Key Takeaways
            </h3>
            <ul className="space-y-3">
              {article.key_takeaways.map((takeaway, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div
                    className="w-2 h-2 rounded-full mt-2 flex-shrink-0"
                    style={{ backgroundColor: articleColor }}
                  />
                  <span className="text-base" style={{ color: colors.textSecondary }}>
                    {takeaway}
                  </span>
                </li>
              ))}
            </ul>
          </motion.section>
        )}

        {/* Related Articles */}
        {related && related.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.0 }}
            className="mb-16"
          >
            <h3 className="text-sm font-semibold tracking-wide uppercase mb-6" style={{ color: colors.textMuted }}>
              Related Research
            </h3>
            <div className="grid md:grid-cols-3 gap-4">
              {related.map((relatedArticle) => {
                const relatedColor = relatedArticle.color_hex || colors.sageDeep;
                return (
                  <Link
                    key={relatedArticle.slug}
                    href={`/research/articles/${relatedArticle.slug}`}
                    className="rounded-xl p-5 transition-all duration-300"
                    style={{
                      backgroundColor: colors.bgSecondary,
                      border: `1px solid ${colors.borderLight}`,
                      boxShadow: hoveredCard === relatedArticle.slug ? `0 8px 20px ${relatedColor}15` : 'none',
                      transform: hoveredCard === relatedArticle.slug ? 'translateY(-2px)' : 'translateY(0)',
                    }}
                    onMouseEnter={() => setHoveredCard(relatedArticle.slug)}
                    onMouseLeave={() => setHoveredCard(null)}
                  >
                    <h4 className="text-base font-medium mb-2 line-clamp-2" style={{ color: colors.textPrimary }}>
                      {relatedArticle.title}
                    </h4>
                    {relatedArticle.subtitle && (
                      <p className="text-xs line-clamp-2 mb-3" style={{ color: colors.textMuted }}>
                        {relatedArticle.subtitle}
                      </p>
                    )}
                    <div className="flex items-center gap-1 text-xs font-medium" style={{ color: relatedColor }}>
                      <span>Read</span>
                      <ChevronRight size={12} />
                    </div>
                  </Link>
                );
              })}
            </div>
          </motion.section>
        )}

        {/* Back to research */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.1 }}
          className="text-center pt-12"
          style={{ borderTop: `1px solid ${colors.borderLight}` }}
        >
          <Link
            href="/research"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl transition-all duration-300"
            style={{
              backgroundColor: colors.bgSecondary,
              color: colors.sageDeep,
              border: `1px solid ${colors.borderLight}`
            }}
          >
            <ArrowLeft size={18} />
            <span>Explore More Research</span>
          </Link>
        </motion.div>
      </article>

      {/* Footer */}
      <footer className="py-12 px-6 mt-20" style={{
        borderTop: `1px solid ${colors.borderLight}`,
        backgroundColor: colors.bgSecondary,
      }}>
        <div className="max-w-4xl mx-auto flex justify-between items-center flex-wrap gap-6">
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
