'use client';

/**
 * CMS Analytics Page
 * Detailed platform analytics and metrics
 */

import { useState, useEffect } from 'react';
import {
  Users,
  TrendingUp,
  DollarSign,
  MessageSquare,
  Loader2,
  ArrowUpRight,
  ArrowDownRight,
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

export default function CMSAnalyticsPage() {
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

  const formatCurrency = (cents: number) => `$${(cents / 100).toFixed(2)}`;
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
        <h1 className="text-2xl font-light text-[#e8e4df] mb-2">Analytics</h1>
        <p className="text-sm text-[#666]">Detailed platform metrics and insights</p>
      </div>

      {/* User Metrics */}
      <section className="mb-8">
        <h2 className="text-lg font-medium text-[#e8e4df] mb-4">User Metrics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[#1a1a24] rounded-xl p-5 border border-[#2a2a3a]">
            <div className="flex items-center gap-2 mb-3">
              <Users size={18} className="text-[#4A7C59]" />
              <span className="text-xs text-[#666] uppercase tracking-wide">Total Users</span>
            </div>
            <p className="text-3xl font-semibold text-[#e8e4df]">{formatNumber(analytics.totalUsers)}</p>
          </div>

          <div className="bg-[#1a1a24] rounded-xl p-5 border border-[#2a2a3a]">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp size={18} className="text-[#2C5282]" />
              <span className="text-xs text-[#666] uppercase tracking-wide">Active This Week</span>
            </div>
            <p className="text-3xl font-semibold text-[#e8e4df]">{formatNumber(analytics.activeUsersWeek)}</p>
            <p className="text-xs text-[#666] mt-1">{analytics.activeUsersToday} active today</p>
          </div>

          <div className="bg-[#1a1a24] rounded-xl p-5 border border-[#2a2a3a]">
            <div className="flex items-center gap-2 mb-3">
              <ArrowUpRight size={18} className="text-[#4A7C59]" />
              <span className="text-xs text-[#666] uppercase tracking-wide">New This Week</span>
            </div>
            <p className="text-3xl font-semibold text-[#e8e4df]">{formatNumber(analytics.newUsersWeek)}</p>
            <p className="text-xs text-[#666] mt-1">{analytics.newUsersToday} new today</p>
          </div>

          <div className="bg-[#1a1a24] rounded-xl p-5 border border-[#2a2a3a]">
            <div className="flex items-center gap-2 mb-3">
              <ArrowUpRight size={18} className="text-[#D4A84B]" />
              <span className="text-xs text-[#666] uppercase tracking-wide">Conversion Rate</span>
            </div>
            <p className="text-3xl font-semibold text-[#e8e4df]">{analytics.conversionRate}%</p>
            <p className="text-xs text-[#666] mt-1">{analytics.ipVisitorsAtGate} visitors at gate</p>
          </div>
        </div>
      </section>

      {/* Revenue Metrics */}
      <section className="mb-8">
        <h2 className="text-lg font-medium text-[#e8e4df] mb-4">Revenue & Usage</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-[#1a1a24] rounded-xl p-5 border border-[#2a2a3a]">
            <div className="flex items-center gap-2 mb-3">
              <DollarSign size={18} className="text-[#D4A84B]" />
              <span className="text-xs text-[#666] uppercase tracking-wide">Total Revenue</span>
            </div>
            <p className="text-3xl font-semibold text-[#e8e4df]">{formatCurrency(analytics.totalRevenueCents)}</p>
          </div>

          <div className="bg-[#1a1a24] rounded-xl p-5 border border-[#2a2a3a]">
            <div className="flex items-center gap-2 mb-3">
              <DollarSign size={18} className="text-[#888]" />
              <span className="text-xs text-[#666] uppercase tracking-wide">Avg Per User</span>
            </div>
            <p className="text-3xl font-semibold text-[#e8e4df]">{formatCurrency(analytics.averageCostPerUser)}</p>
          </div>

          <div className="bg-[#1a1a24] rounded-xl p-5 border border-[#2a2a3a]">
            <div className="flex items-center gap-2 mb-3">
              <Users size={18} className="text-[#E07A5F]" />
              <span className="text-xs text-[#666] uppercase tracking-wide">IP Visitors</span>
            </div>
            <p className="text-3xl font-semibold text-[#e8e4df]">{formatNumber(analytics.totalIPVisitors)}</p>
          </div>
        </div>
      </section>

      {/* Token Usage */}
      <section className="mb-8">
        <h2 className="text-lg font-medium text-[#e8e4df] mb-4">Token Usage</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-[#1a1a24] rounded-xl p-5 border border-[#2a2a3a]">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-[#666]">Input Tokens</span>
              <span className="text-2xl font-semibold text-[#e8e4df]">{formatNumber(analytics.totalTokensUsed.input)}</span>
            </div>
            <div className="h-2 bg-[#2a2a3a] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#4A7C59] rounded-full"
                style={{
                  width: `${Math.min(100, (analytics.totalTokensUsed.input / (analytics.totalTokensUsed.input + analytics.totalTokensUsed.output)) * 100)}%`,
                }}
              />
            </div>
          </div>

          <div className="bg-[#1a1a24] rounded-xl p-5 border border-[#2a2a3a]">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-[#666]">Output Tokens</span>
              <span className="text-2xl font-semibold text-[#e8e4df]">{formatNumber(analytics.totalTokensUsed.output)}</span>
            </div>
            <div className="h-2 bg-[#2a2a3a] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#2C5282] rounded-full"
                style={{
                  width: `${Math.min(100, (analytics.totalTokensUsed.output / (analytics.totalTokensUsed.input + analytics.totalTokensUsed.output)) * 100)}%`,
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Content Stats */}
      <section>
        <h2 className="text-lg font-medium text-[#e8e4df] mb-4">Content Statistics</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-[#1a1a24] rounded-xl p-5 border border-[#2a2a3a]">
            <p className="text-xs text-[#666] uppercase tracking-wide mb-2">Topics</p>
            <p className="text-3xl font-semibold text-[#e8e4df]">{analytics.totalTopics}</p>
          </div>

          <div className="bg-[#1a1a24] rounded-xl p-5 border border-[#2a2a3a]">
            <p className="text-xs text-[#666] uppercase tracking-wide mb-2">Articles</p>
            <p className="text-3xl font-semibold text-[#e8e4df]">{analytics.totalArticles}</p>
            <p className="text-xs text-[#666] mt-1">
              {analytics.publishedArticles} published, {analytics.draftArticles} drafts
            </p>
          </div>

          <div className="bg-[#1a1a24] rounded-xl p-5 border border-[#2a2a3a]">
            <p className="text-xs text-[#666] uppercase tracking-wide mb-2">Documents</p>
            <p className="text-3xl font-semibold text-[#e8e4df]">{analytics.totalDocuments}</p>
          </div>
        </div>
      </section>
    </div>
  );
}
