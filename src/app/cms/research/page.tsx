'use client';

/**
 * CMS Research Overview
 * Quick access to manage research content
 */

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { BookOpen, FileText, FolderOpen, Plus, Loader2, ChevronRight } from 'lucide-react';

interface Stats {
  topics: number;
  articles: number;
  documents: number;
}

export default function CMSResearchPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const [topicsRes, articlesRes, docsRes] = await Promise.all([
          fetch('/api/research/topics'),
          fetch('/api/research/articles?status=all'),
          fetch('/api/research/documents?status=all'),
        ]);

        const topics = await topicsRes.json();
        const articles = await articlesRes.json();
        const docs = await docsRes.json();

        setStats({
          topics: topics.topics?.length || 0,
          articles: articles.articles?.length || 0,
          documents: docs.documents?.length || 0,
        });
      } catch (err) {
        console.error('Error fetching stats:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  const sections = [
    {
      title: 'Topics',
      description: 'Core research areas that organize your content',
      href: '/cms/research/topics',
      icon: BookOpen,
      color: '#4A7C59',
      count: stats?.topics || 0,
      actions: [
        { label: 'View All', href: '/cms/research/topics' },
        { label: 'Add New', href: '/cms/research/topics/new' },
      ],
    },
    {
      title: 'Articles',
      description: 'In-depth research articles and findings',
      href: '/cms/research/articles',
      icon: FileText,
      color: '#2C5282',
      count: stats?.articles || 0,
      actions: [
        { label: 'View All', href: '/cms/research/articles' },
        { label: 'Add New', href: '/cms/research/articles/new' },
      ],
    },
    {
      title: 'Documents',
      description: 'PDFs and downloadable research materials',
      href: '/cms/research/documents',
      icon: FolderOpen,
      color: '#D4A84B',
      count: stats?.documents || 0,
      actions: [
        { label: 'View All', href: '/cms/research/documents' },
        { label: 'Upload New', href: '/cms/research/documents/new' },
      ],
    },
  ];

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
      <div className="mb-8">
        <h1 className="text-2xl font-light text-[#e8e4df] mb-2">Research Content</h1>
        <p className="text-sm text-[#666]">Manage your research topics, articles, and documents</p>
      </div>

      {/* Sections Grid */}
      <div className="grid gap-6">
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <div
              key={section.title}
              className="bg-[#1a1a24] rounded-xl border border-[#2a2a3a] overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-start gap-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${section.color}20` }}
                  >
                    <Icon size={24} style={{ color: section.color }} />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h2 className="text-xl font-medium text-[#e8e4df]">{section.title}</h2>
                      <span
                        className="px-2 py-0.5 rounded-full text-xs font-medium"
                        style={{ backgroundColor: `${section.color}20`, color: section.color }}
                      >
                        {section.count}
                      </span>
                    </div>
                    <p className="text-sm text-[#666]">{section.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 mt-5">
                  {section.actions.map((action) => (
                    <Link
                      key={action.label}
                      href={action.href}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        action.label.includes('New') || action.label.includes('Upload')
                          ? 'bg-[#4A7C59] text-white hover:bg-[#3d6a4a]'
                          : 'bg-[#2a2a3a] text-[#e8e4df] hover:bg-[#3a3a4a]'
                      }`}
                    >
                      {action.label.includes('New') || action.label.includes('Upload') ? (
                        <span className="flex items-center gap-2">
                          <Plus size={16} />
                          {action.label}
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          {action.label}
                          <ChevronRight size={16} />
                        </span>
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
