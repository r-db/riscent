'use client';

/**
 * CMS Topics List
 * Manage research topics
 */

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  BookOpen,
  Plus,
  Loader2,
  Edit,
  Trash2,
  Eye,
  MoreVertical,
  ChevronRight,
} from 'lucide-react';

interface Topic {
  topic_id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  icon_name: string;
  color_hex: string;
  display_order: number;
  status: string;
  article_count: number;
  document_count: number;
}

export default function CMSTopicsPage() {
  const router = useRouter();
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  useEffect(() => {
    fetchTopics();
  }, []);

  async function fetchTopics() {
    try {
      const res = await fetch('/api/research/topics?status=all');
      if (!res.ok) throw new Error('Failed to fetch topics');
      const data = await res.json();
      setTopics(data.topics || []);
    } catch (err) {
      console.error('Error fetching topics:', err);
    } finally {
      setLoading(false);
    }
  }

  async function deleteTopic(topicId: string) {
    if (!confirm('Are you sure you want to archive this topic?')) return;

    try {
      const res = await fetch(`/api/research/topics/${topicId}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete topic');
      fetchTopics();
    } catch (err) {
      console.error('Error deleting topic:', err);
      alert('Failed to delete topic');
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-[#4A7C59] bg-[#4A7C59]/10';
      case 'hidden':
        return 'text-[#D4A84B] bg-[#D4A84B]/10';
      default:
        return 'text-[#666] bg-[#666]/10';
    }
  };

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
            <span className="text-[#e8e4df]">Topics</span>
          </div>
          <h1 className="text-2xl font-light text-[#e8e4df]">Research Topics</h1>
        </div>
        <Link
          href="/cms/research/topics/new"
          className="flex items-center gap-2 px-4 py-2.5 bg-[#4A7C59] text-white rounded-lg text-sm font-medium hover:bg-[#3d6a4a] transition-colors"
        >
          <Plus size={18} />
          New Topic
        </Link>
      </div>

      {/* Topics List */}
      <div className="bg-[#1a1a24] rounded-xl border border-[#2a2a3a] overflow-hidden">
        {topics.length === 0 ? (
          <div className="p-12 text-center text-[#666]">
            <BookOpen size={48} className="mx-auto mb-4 opacity-50" />
            <p className="mb-4">No topics yet</p>
            <Link
              href="/cms/research/topics/new"
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#4A7C59] text-white rounded-lg text-sm"
            >
              <Plus size={16} />
              Create your first topic
            </Link>
          </div>
        ) : (
          <>
            {/* Table Header */}
            <div className="grid grid-cols-12 gap-4 px-6 py-3 border-b border-[#2a2a3a] text-xs text-[#666] uppercase tracking-wide">
              <div className="col-span-5">Topic</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-2">Content</div>
              <div className="col-span-2">Order</div>
              <div className="col-span-1"></div>
            </div>

            {/* Table Body */}
            <div className="divide-y divide-[#2a2a3a]">
              {topics.map((topic) => (
                <div
                  key={topic.topic_id}
                  className="grid grid-cols-12 gap-4 px-6 py-4 hover:bg-[#2a2a3a]/30 transition-colors"
                >
                  {/* Topic Info */}
                  <div className="col-span-5 flex items-center gap-4">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${topic.color_hex}20` }}
                    >
                      <BookOpen size={18} style={{ color: topic.color_hex }} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[#e8e4df]">{topic.title}</p>
                      <p className="text-xs text-[#666]">/{topic.slug}</p>
                    </div>
                  </div>

                  {/* Status */}
                  <div className="col-span-2 flex items-center">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(topic.status)}`}>
                      {topic.status}
                    </span>
                  </div>

                  {/* Content Count */}
                  <div className="col-span-2 flex items-center text-sm text-[#888]">
                    {topic.article_count} articles, {topic.document_count} docs
                  </div>

                  {/* Order */}
                  <div className="col-span-2 flex items-center text-sm text-[#888]">
                    {topic.display_order}
                  </div>

                  {/* Actions */}
                  <div className="col-span-1 flex items-center justify-end relative">
                    <button
                      onClick={() => setActiveMenu(activeMenu === topic.topic_id ? null : topic.topic_id)}
                      className="p-2 rounded-lg hover:bg-[#2a2a3a] text-[#666] hover:text-[#e8e4df] transition-colors"
                    >
                      <MoreVertical size={16} />
                    </button>

                    {activeMenu === topic.topic_id && (
                      <div className="absolute right-0 top-10 z-10 w-40 bg-[#1a1a24] border border-[#2a2a3a] rounded-lg shadow-xl overflow-hidden">
                        <Link
                          href={`/research/${topic.slug}`}
                          target="_blank"
                          className="flex items-center gap-2 px-4 py-2.5 text-sm text-[#888] hover:text-[#e8e4df] hover:bg-[#2a2a3a] transition-colors"
                        >
                          <Eye size={14} />
                          View
                        </Link>
                        <Link
                          href={`/cms/research/topics/${topic.topic_id}`}
                          className="flex items-center gap-2 px-4 py-2.5 text-sm text-[#888] hover:text-[#e8e4df] hover:bg-[#2a2a3a] transition-colors"
                        >
                          <Edit size={14} />
                          Edit
                        </Link>
                        <button
                          onClick={() => {
                            setActiveMenu(null);
                            deleteTopic(topic.topic_id);
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
