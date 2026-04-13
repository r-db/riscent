'use client';

/**
 * CMS Dashboard
 * Overview with key metrics and recent activity
 */

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Users,
  FileText,
  DollarSign,
  TrendingUp,
  BookOpen,
  MessageSquare,
  Loader2,
  ArrowUpRight,
  ChevronRight,
} from 'lucide-react';

interface Analytics {
  totalUsers: number;
  activeUsersToday: number;
  activeUsersWeek: number;
  newUsersToday: number;
  newUsersWeek: number;
  totalIPVisitors: number;
  ipVisitorsAtGate: number;
  conversionRate: number;
  totalRevenueCents: number;
  averageCostPerUser: number;
  totalTokensUsed: {
    input: number;
    output: number;
  };
  totalTopics: number;
  totalArticles: number;
  totalDocuments: number;
  publishedArticles: number;
  draftArticles: number;
  recentConversations: Array<{
    user_id: string;
    email: string | null;
    full_name: string | null;
    conversation_id: string;
    message_count: number;
    cost_cents: number;
    created_at: string;
  }>;
  topUsersByUsage: Array<{
    user_id: string;
    email: string | null;
    full_name: string | null;
    total_cost_cents: number;
    conversation_count: number;
  }>;
}

export default function CMSDashboard() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const res = await fetch('/api/cms/analytics');
        if (!res.ok) throw new Error('Failed to fetch analytics');
        const data = await res.json();
        setAnalytics(data.analytics);
      } catch (err) {
        console.error('Error fetching analytics:', err);
        setError(err instanceof Error ? err.message : 'Failed to load analytics');
      } finally {
        setLoading(false);
      }
    }

    fetchAnalytics();
  }, []);

  const formatCurrency = (cents: number) => {
    return `$${(cents / 100).toFixed(2)}`;
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#4A7C59]" />
      </div>
    );
  }

  if (error || !analytics) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#E07A5F] mb-4">{error || 'Failed to load analytics'}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-[#4A7C59] text-white rounded-lg text-sm"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-light text-[#e8e4df] mb-2">Dashboard</h1>
        <p className="text-sm text-[#666]">Overview of your platform metrics</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Total Users */}
        <div className="bg-[#1a1a24] rounded-xl p-5 border border-[#2a2a3a]">
          <div className="flex items-start justify-between mb-3">
            <div className="w-10 h-10 rounded-lg bg-[#4A7C59]/20 flex items-center justify-center">
              <Users size={20} className="text-[#4A7C59]" />
            </div>
            <span className="text-xs text-[#4A7C59] bg-[#4A7C59]/10 px-2 py-1 rounded-full">
              +{analytics.newUsersWeek} this week
            </span>
          </div>
          <p className="text-2xl font-semibold text-[#e8e4df] mb-1">
            {formatNumber(analytics.totalUsers)}
          </p>
          <p className="text-xs text-[#666]">Total users</p>
        </div>

        {/* Revenue */}
        <div className="bg-[#1a1a24] rounded-xl p-5 border border-[#2a2a3a]">
          <div className="flex items-start justify-between mb-3">
            <div className="w-10 h-10 rounded-lg bg-[#D4A84B]/20 flex items-center justify-center">
              <DollarSign size={20} className="text-[#D4A84B]" />
            </div>
          </div>
          <p className="text-2xl font-semibold text-[#e8e4df] mb-1">
            {formatCurrency(analytics.totalRevenueCents)}
          </p>
          <p className="text-xs text-[#666]">Total usage revenue</p>
        </div>

        {/* Active Users */}
        <div className="bg-[#1a1a24] rounded-xl p-5 border border-[#2a2a3a]">
          <div className="flex items-start justify-between mb-3">
            <div className="w-10 h-10 rounded-lg bg-[#2C5282]/20 flex items-center justify-center">
              <TrendingUp size={20} className="text-[#2C5282]" />
            </div>
            <span className="text-xs text-[#2C5282] bg-[#2C5282]/10 px-2 py-1 rounded-full">
              {analytics.activeUsersToday} today
            </span>
          </div>
          <p className="text-2xl font-semibold text-[#e8e4df] mb-1">
            {formatNumber(analytics.activeUsersWeek)}
          </p>
          <p className="text-xs text-[#666]">Active users (7 days)</p>
        </div>

        {/* Conversion Rate */}
        <div className="bg-[#1a1a24] rounded-xl p-5 border border-[#2a2a3a]">
          <div className="flex items-start justify-between mb-3">
            <div className="w-10 h-10 rounded-lg bg-[#E07A5F]/20 flex items-center justify-center">
              <ArrowUpRight size={20} className="text-[#E07A5F]" />
            </div>
          </div>
          <p className="text-2xl font-semibold text-[#e8e4df] mb-1">
            {analytics.conversionRate}%
          </p>
          <p className="text-xs text-[#666]">
            Conversion rate ({analytics.ipVisitorsAtGate} at gate)
          </p>
        </div>
      </div>

      {/* Content Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Link
          href="/cms/research/topics"
          className="bg-[#1a1a24] rounded-xl p-5 border border-[#2a2a3a] hover:border-[#3a3a4a] transition-colors group"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-semibold text-[#e8e4df] mb-1">
                {analytics.totalTopics}
              </p>
              <p className="text-sm text-[#666]">Research topics</p>
            </div>
            <ChevronRight size={20} className="text-[#444] group-hover:text-[#666] transition-colors" />
          </div>
        </Link>

        <Link
          href="/cms/research/articles"
          className="bg-[#1a1a24] rounded-xl p-5 border border-[#2a2a3a] hover:border-[#3a3a4a] transition-colors group"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-semibold text-[#e8e4df] mb-1">
                {analytics.totalArticles}
              </p>
              <p className="text-sm text-[#666]">
                Articles ({analytics.publishedArticles} published, {analytics.draftArticles} drafts)
              </p>
            </div>
            <ChevronRight size={20} className="text-[#444] group-hover:text-[#666] transition-colors" />
          </div>
        </Link>

        <Link
          href="/cms/research/documents"
          className="bg-[#1a1a24] rounded-xl p-5 border border-[#2a2a3a] hover:border-[#3a3a4a] transition-colors group"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-semibold text-[#e8e4df] mb-1">
                {analytics.totalDocuments}
              </p>
              <p className="text-sm text-[#666]">Documents</p>
            </div>
            <ChevronRight size={20} className="text-[#444] group-hover:text-[#666] transition-colors" />
          </div>
        </Link>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Conversations */}
        <div className="bg-[#1a1a24] rounded-xl border border-[#2a2a3a]">
          <div className="p-5 border-b border-[#2a2a3a]">
            <div className="flex items-center gap-2">
              <MessageSquare size={18} className="text-[#4A7C59]" />
              <h2 className="text-lg font-medium text-[#e8e4df]">Recent Conversations</h2>
            </div>
          </div>
          <div className="divide-y divide-[#2a2a3a]">
            {analytics.recentConversations.length === 0 ? (
              <div className="p-5 text-center text-[#666] text-sm">
                No conversations yet
              </div>
            ) : (
              analytics.recentConversations.slice(0, 5).map((conv) => (
                <div key={conv.conversation_id} className="p-4 hover:bg-[#2a2a3a]/50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-[#e8e4df] font-medium">
                        {conv.full_name || conv.email || 'Anonymous'}
                      </p>
                      <p className="text-xs text-[#666] mt-1">
                        {conv.message_count} messages • {formatCurrency(conv.cost_cents)}
                      </p>
                    </div>
                    <span className="text-xs text-[#555]">
                      {new Date(conv.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Top Users */}
        <div className="bg-[#1a1a24] rounded-xl border border-[#2a2a3a]">
          <div className="p-5 border-b border-[#2a2a3a]">
            <div className="flex items-center gap-2">
              <Users size={18} className="text-[#D4A84B]" />
              <h2 className="text-lg font-medium text-[#e8e4df]">Top Users by Usage</h2>
            </div>
          </div>
          <div className="divide-y divide-[#2a2a3a]">
            {analytics.topUsersByUsage.length === 0 ? (
              <div className="p-5 text-center text-[#666] text-sm">
                No users yet
              </div>
            ) : (
              analytics.topUsersByUsage.slice(0, 5).map((user, index) => (
                <Link
                  key={user.user_id}
                  href={`/cms/users/${user.user_id}`}
                  className="p-4 hover:bg-[#2a2a3a]/50 transition-colors flex items-center gap-4"
                >
                  <span className="text-lg font-semibold text-[#444] w-6">
                    {index + 1}
                  </span>
                  <div className="flex-1">
                    <p className="text-sm text-[#e8e4df] font-medium">
                      {user.full_name || user.email || 'Unknown'}
                    </p>
                    <p className="text-xs text-[#666] mt-1">
                      {user.conversation_count} conversations
                    </p>
                  </div>
                  <span className="text-sm font-medium text-[#D4A84B]">
                    {formatCurrency(user.total_cost_cents)}
                  </span>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Token Usage */}
      <div className="mt-6 bg-[#1a1a24] rounded-xl p-5 border border-[#2a2a3a]">
        <h2 className="text-lg font-medium text-[#e8e4df] mb-4">Token Usage</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-2xl font-semibold text-[#e8e4df]">
              {formatNumber(analytics.totalTokensUsed.input)}
            </p>
            <p className="text-xs text-[#666]">Input tokens</p>
          </div>
          <div>
            <p className="text-2xl font-semibold text-[#e8e4df]">
              {formatNumber(analytics.totalTokensUsed.output)}
            </p>
            <p className="text-xs text-[#666]">Output tokens</p>
          </div>
        </div>
      </div>
    </div>
  );
}
