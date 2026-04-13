'use client';

/**
 * CMS - Edit Topic
 */

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight, Loader2 } from 'lucide-react';
import { TopicForm } from '@/components/cms/TopicForm';

interface Topic {
  topic_id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  icon_name: string;
  color_hex: string;
  display_order: number;
  status: string;
}

export default function EditTopicPage() {
  const params = useParams();
  const topicId = params.id as string;

  const [topic, setTopic] = useState<Topic | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTopic() {
      try {
        // Fetch topic by ID - we need to get from topics list since API uses slug
        const res = await fetch('/api/research/topics?status=all');
        if (!res.ok) throw new Error('Failed to fetch topics');
        const data = await res.json();
        const found = data.topics?.find((t: Topic) => t.topic_id === topicId);
        if (!found) {
          setError('Topic not found');
          return;
        }
        setTopic(found);
      } catch (err) {
        console.error('Error fetching topic:', err);
        setError(err instanceof Error ? err.message : 'Failed to load topic');
      } finally {
        setLoading(false);
      }
    }

    if (topicId) {
      fetchTopic();
    }
  }, [topicId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#4A7C59]" />
      </div>
    );
  }

  if (error || !topic) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#E07A5F] mb-4">{error || 'Topic not found'}</p>
          <Link
            href="/cms/research/topics"
            className="px-4 py-2 bg-[#4A7C59] text-white rounded-lg text-sm"
          >
            Back to Topics
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
          <Link href="/cms/research/topics" className="hover:text-[#888]">Topics</Link>
          <ChevronRight size={14} />
          <span className="text-[#e8e4df]">Edit</span>
        </div>
        <h1 className="text-2xl font-light text-[#e8e4df]">Edit Topic</h1>
      </div>

      {/* Form */}
      <div className="bg-[#1a1a24] rounded-xl border border-[#2a2a3a] p-6">
        <TopicForm
          initialData={{
            slug: topic.slug,
            title: topic.title,
            subtitle: topic.subtitle || '',
            description: topic.description || '',
            icon_name: topic.icon_name,
            color_hex: topic.color_hex,
            display_order: topic.display_order,
            status: topic.status,
          }}
          topicId={topic.slug}
          isEdit
        />
      </div>
    </div>
  );
}
