'use client';

/**
 * CMS - Create New Topic
 */

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { TopicForm } from '@/components/cms/TopicForm';

export default function NewTopicPage() {
  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-[#666] mb-2">
          <Link href="/cms/research" className="hover:text-[#888]">Research</Link>
          <ChevronRight size={14} />
          <Link href="/cms/research/topics" className="hover:text-[#888]">Topics</Link>
          <ChevronRight size={14} />
          <span className="text-[#e8e4df]">New</span>
        </div>
        <h1 className="text-2xl font-light text-[#e8e4df]">Create New Topic</h1>
      </div>

      {/* Form */}
      <div className="bg-[#1a1a24] rounded-xl border border-[#2a2a3a] p-6">
        <TopicForm />
      </div>
    </div>
  );
}
