'use client';

/**
 * CMS - Create New Article
 */

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { ArticleForm } from '@/components/cms/ArticleForm';

export default function NewArticlePage() {
  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-[#666] mb-2">
          <Link href="/cms/research" className="hover:text-[#888]">Research</Link>
          <ChevronRight size={14} />
          <Link href="/cms/research/articles" className="hover:text-[#888]">Articles</Link>
          <ChevronRight size={14} />
          <span className="text-[#e8e4df]">New</span>
        </div>
        <h1 className="text-2xl font-light text-[#e8e4df]">Create New Article</h1>
      </div>

      {/* Form */}
      <ArticleForm />
    </div>
  );
}
