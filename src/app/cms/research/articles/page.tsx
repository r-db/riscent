'use client';

/**
 * CMS Articles List
 * Manage research articles
 */

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  FileText,
  Plus,
  Loader2,
  Edit,
  Trash2,
  Eye,
  MoreVertical,
  ChevronRight,
  Star,
  Sparkles,
} from 'lucide-react';

interface Article {
  article_id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  topic_id: string | null;
  topic_title: string | null;
  topic_slug: string | null;
  status: string;
  featured: boolean;
  is_interesting_find: boolean;
  author_name: string;
  read_time: string;
  published_date: string | null;
  created_at: string;
}

export default function CMSArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'published' | 'draft'>('all');

  useEffect(() => {
    fetchArticles();
  }, []);

  async function fetchArticles() {
    try {
      const res = await fetch('/api/research/articles?status=all');
      if (!res.ok) throw new Error('Failed to fetch articles');
      const data = await res.json();
      setArticles(data.articles || []);
    } catch (err) {
      console.error('Error fetching articles:', err);
    } finally {
      setLoading(false);
    }
  }

  async function deleteArticle(articleId: string) {
    if (!confirm('Are you sure you want to archive this article?')) return;

    try {
      const res = await fetch(`/api/research/articles/${articleId}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete article');
      fetchArticles();
    } catch (err) {
      console.error('Error deleting article:', err);
      alert('Failed to delete article');
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'text-[#4A7C59] bg-[#4A7C59]/10';
      case 'draft':
        return 'text-[#D4A84B] bg-[#D4A84B]/10';
      case 'archived':
        return 'text-[#666] bg-[#666]/10';
      default:
        return 'text-[#666] bg-[#666]/10';
    }
  };

  const filteredArticles = articles.filter((article) => {
    if (filter === 'all') return true;
    return article.status === filter;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#4A7C59]" />
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm text-[#666] mb-2">
            <Link href="/cms/research" className="hover:text-[#888]">Research</Link>
            <ChevronRight size={14} />
            <span className="text-[#e8e4df]">Articles</span>
          </div>
          <h1 className="text-2xl font-light text-[#e8e4df]">Research Articles</h1>
        </div>
        <Link
          href="/cms/research/articles/new"
          className="flex items-center gap-2 px-4 py-2.5 bg-[#4A7C59] text-white rounded-lg text-sm font-medium hover:bg-[#3d6a4a] transition-colors"
        >
          <Plus size={18} />
          New Article
        </Link>
      </div>

      {/* Filters */}
      <div className="mb-6 flex gap-2">
        {(['all', 'published', 'draft'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === f
                ? 'bg-[#4A7C59] text-white'
                : 'bg-[#2a2a3a] text-[#888] hover:text-[#e8e4df]'
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Articles List */}
      <div className="bg-[#1a1a24] rounded-xl border border-[#2a2a3a] overflow-hidden">
        {filteredArticles.length === 0 ? (
          <div className="p-12 text-center text-[#666]">
            <FileText size={48} className="mx-auto mb-4 opacity-50" />
            <p className="mb-4">No articles yet</p>
            <Link
              href="/cms/research/articles/new"
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#4A7C59] text-white rounded-lg text-sm"
            >
              <Plus size={16} />
              Create your first article
            </Link>
          </div>
        ) : (
          <>
            {/* Table Header */}
            <div className="grid grid-cols-12 gap-4 px-6 py-3 border-b border-[#2a2a3a] text-xs text-[#666] uppercase tracking-wide">
              <div className="col-span-5">Article</div>
              <div className="col-span-2">Topic</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-2">Author</div>
              <div className="col-span-1"></div>
            </div>

            {/* Table Body */}
            <div className="divide-y divide-[#2a2a3a]">
              {filteredArticles.map((article) => (
                <div
                  key={article.article_id}
                  className="grid grid-cols-12 gap-4 px-6 py-4 hover:bg-[#2a2a3a]/30 transition-colors"
                >
                  {/* Article Info */}
                  <div className="col-span-5 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-[#2a2a3a] flex items-center justify-center">
                      <FileText size={18} className="text-[#888]" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-[#e8e4df] truncate">{article.title}</p>
                        {article.featured && (
                          <Star size={14} className="text-[#D4A84B] flex-shrink-0" fill="#D4A84B" />
                        )}
                        {article.is_interesting_find && (
                          <Sparkles size={14} className="text-[#6B5B95] flex-shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-[#666] truncate">/{article.slug}</p>
                    </div>
                  </div>

                  {/* Topic */}
                  <div className="col-span-2 flex items-center">
                    {article.topic_title ? (
                      <span className="text-sm text-[#888] truncate">{article.topic_title}</span>
                    ) : (
                      <span className="text-sm text-[#555] italic">No topic</span>
                    )}
                  </div>

                  {/* Status */}
                  <div className="col-span-2 flex items-center">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(article.status)}`}>
                      {article.status}
                    </span>
                  </div>

                  {/* Author */}
                  <div className="col-span-2 flex items-center text-sm text-[#888]">
                    {article.author_name}
                  </div>

                  {/* Actions */}
                  <div className="col-span-1 flex items-center justify-end relative">
                    <button
                      onClick={() => setActiveMenu(activeMenu === article.article_id ? null : article.article_id)}
                      className="p-2 rounded-lg hover:bg-[#2a2a3a] text-[#666] hover:text-[#e8e4df] transition-colors"
                    >
                      <MoreVertical size={16} />
                    </button>

                    {activeMenu === article.article_id && (
                      <div className="absolute right-0 top-10 z-10 w-40 bg-[#1a1a24] border border-[#2a2a3a] rounded-lg shadow-xl overflow-hidden">
                        <Link
                          href={article.topic_slug
                            ? `/research/${article.topic_slug}/${article.slug}`
                            : `/research/finds/${article.slug}`
                          }
                          target="_blank"
                          className="flex items-center gap-2 px-4 py-2.5 text-sm text-[#888] hover:text-[#e8e4df] hover:bg-[#2a2a3a] transition-colors"
                        >
                          <Eye size={14} />
                          View
                        </Link>
                        <Link
                          href={`/cms/research/articles/${article.article_id}`}
                          className="flex items-center gap-2 px-4 py-2.5 text-sm text-[#888] hover:text-[#e8e4df] hover:bg-[#2a2a3a] transition-colors"
                        >
                          <Edit size={14} />
                          Edit
                        </Link>
                        <button
                          onClick={() => {
                            setActiveMenu(null);
                            deleteArticle(article.article_id);
                          }}
                          className="flex items-center gap-2 px-4 py-2.5 text-sm text-[#E07A5F] hover:bg-[#E07A5F]/10 transition-colors w-full"
                        >
                          <Trash2 size={14} />
                          Archive
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
