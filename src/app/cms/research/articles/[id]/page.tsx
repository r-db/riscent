'use client';

/**
 * CMS - Edit Article
 */

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight, Loader2 } from 'lucide-react';
import { ArticleForm } from '@/components/cms/ArticleForm';

interface Article {
  article_id: string;
  topic_id: string | null;
  slug: string;
  title: string;
  subtitle: string | null;
  introduction: string | null;
  conclusion: string | null;
  key_takeaways: string[] | null;
  content_sections: { heading: string; content: string }[] | null;
  author_name: string;
  published_date: string | null;
  read_time: string;
  category: string | null;
  color_hex: string;
  status: string;
  featured: boolean;
  is_interesting_find: boolean;
  meta_title: string | null;
  meta_description: string | null;
}

export default function EditArticlePage() {
  const params = useParams();
  const articleId = params.id as string;

  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchArticle() {
      try {
        // Fetch article by ID - we get from articles list since API uses slug
        const res = await fetch('/api/research/articles?status=all');
        if (!res.ok) throw new Error('Failed to fetch articles');
        const data = await res.json();
        const found = data.articles?.find((a: Article) => a.article_id === articleId);
        if (!found) {
          setError('Article not found');
          return;
        }
        setArticle(found);
      } catch (err) {
        console.error('Error fetching article:', err);
        setError(err instanceof Error ? err.message : 'Failed to load article');
      } finally {
        setLoading(false);
      }
    }

    if (articleId) {
      fetchArticle();
    }
  }, [articleId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#4A7C59]" />
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#E07A5F] mb-4">{error || 'Article not found'}</p>
          <Link
            href="/cms/research/articles"
            className="px-4 py-2 bg-[#4A7C59] text-white rounded-lg text-sm"
          >
            Back to Articles
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-[#666] mb-2">
          <Link href="/cms/research" className="hover:text-[#888]">Research</Link>
          <ChevronRight size={14} />
          <Link href="/cms/research/articles" className="hover:text-[#888]">Articles</Link>
          <ChevronRight size={14} />
          <span className="text-[#e8e4df]">Edit</span>
        </div>
        <h1 className="text-2xl font-light text-[#e8e4df]">Edit Article</h1>
      </div>

      {/* Form */}
      <ArticleForm
        initialData={{
          topic_id: article.topic_id || '',
          slug: article.slug,
          title: article.title,
          subtitle: article.subtitle || '',
          introduction: article.introduction || '',
          conclusion: article.conclusion || '',
          key_takeaways: article.key_takeaways || [],
          content_sections: article.content_sections || [],
          author_name: article.author_name,
          published_date: article.published_date || '',
          read_time: article.read_time,
          category: article.category || '',
          color_hex: article.color_hex,
          status: article.status,
          featured: article.featured,
          is_interesting_find: article.is_interesting_find,
          meta_title: article.meta_title || '',
          meta_description: article.meta_description || '',
        }}
        articleSlug={article.slug}
        isEdit
      />
    </div>
  );
}
