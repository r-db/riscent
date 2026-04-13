/**
 * GET /api/cms/analytics - Dashboard analytics (admin only)
 * Returns aggregated statistics for the CMS dashboard
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { query, queryOne } from '@/lib/db';

export const dynamic = 'force-dynamic';

interface AnalyticsData {
  // User stats
  totalUsers: number;
  activeUsersToday: number;
  activeUsersWeek: number;
  newUsersToday: number;
  newUsersWeek: number;

  // IP visitor stats
  totalIPVisitors: number;
  ipVisitorsAtGate: number;
  conversionRate: number;

  // Cost stats
  totalRevenueCents: number;
  averageCostPerUser: number;
  totalTokensUsed: {
    input: number;
    output: number;
  };

  // Content stats
  totalTopics: number;
  totalArticles: number;
  totalDocuments: number;
  publishedArticles: number;
  draftArticles: number;

  // Recent activity
  recentConversations: Array<{
    user_id: string;
    email: string | null;
    full_name: string | null;
    conversation_id: string;
    message_count: number;
    cost_cents: number;
    created_at: string;
  }>;

  // Top users by usage
  topUsersByUsage: Array<{
    user_id: string;
    email: string | null;
    full_name: string | null;
    total_cost_cents: number;
    conversation_count: number;
  }>;
}

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify admin role
    const adminUser = await queryOne<{ role: string }>(
      `SELECT role FROM users WHERE clerk_user_id = $1`,
      [userId]
    );

    if (adminUser?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Fetch all stats in parallel
    const [
      userStats,
      ipStats,
      costStats,
      contentStats,
      recentConversations,
      topUsers,
    ] = await Promise.all([
      // User statistics
      queryOne<{
        total_users: string;
        active_today: string;
        active_week: string;
        new_today: string;
        new_week: string;
      }>(`
        SELECT
          COUNT(*) as total_users,
          COUNT(*) FILTER (WHERE last_active_at >= NOW() - INTERVAL '1 day') as active_today,
          COUNT(*) FILTER (WHERE last_active_at >= NOW() - INTERVAL '7 days') as active_week,
          COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '1 day') as new_today,
          COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '7 days') as new_week
        FROM users
        WHERE status = 'active'
      `),

      // IP visitor statistics
      queryOne<{
        total_visitors: string;
        at_gate: string;
      }>(`
        SELECT
          COUNT(*) as total_visitors,
          COUNT(*) FILTER (WHERE cost_gate_reached = true) as at_gate
        FROM ip_visitors
      `),

      // Cost statistics
      queryOne<{
        total_revenue: string;
        avg_cost: string;
        total_input: string;
        total_output: string;
      }>(`
        SELECT
          COALESCE(SUM(total_cost_cents), 0) as total_revenue,
          COALESCE(AVG(total_cost_cents), 0) as avg_cost,
          COALESCE(SUM(uc.total_input), 0) as total_input,
          COALESCE(SUM(uc.total_output), 0) as total_output
        FROM users u
        LEFT JOIN (
          SELECT user_id, SUM(input_tokens) as total_input, SUM(output_tokens) as total_output
          FROM user_conversations
          GROUP BY user_id
        ) uc ON u.user_id = uc.user_id
        WHERE u.status = 'active'
      `),

      // Content statistics
      queryOne<{
        total_topics: string;
        total_articles: string;
        total_documents: string;
        published_articles: string;
        draft_articles: string;
      }>(`
        SELECT
          (SELECT COUNT(*) FROM research_topics WHERE status = 'published') as total_topics,
          (SELECT COUNT(*) FROM research_articles) as total_articles,
          (SELECT COUNT(*) FROM research_documents) as total_documents,
          (SELECT COUNT(*) FROM research_articles WHERE status = 'published') as published_articles,
          (SELECT COUNT(*) FROM research_articles WHERE status = 'draft') as draft_articles
      `),

      // Recent conversations
      query<{
        user_id: string;
        email: string | null;
        full_name: string | null;
        conversation_id: string;
        message_count: number;
        cost_cents: number;
        created_at: string;
      }>(`
        SELECT
          u.user_id,
          u.email,
          u.full_name,
          uc.conversation_id,
          uc.message_count,
          uc.cost_cents,
          uc.created_at
        FROM user_conversations uc
        JOIN users u ON uc.user_id = u.user_id
        ORDER BY uc.created_at DESC
        LIMIT 10
      `),

      // Top users by usage
      query<{
        user_id: string;
        email: string | null;
        full_name: string | null;
        total_cost_cents: number;
        conversation_count: number;
      }>(`
        SELECT
          u.user_id,
          u.email,
          u.full_name,
          u.total_cost_cents,
          COUNT(uc.conversation_id) as conversation_count
        FROM users u
        LEFT JOIN user_conversations uc ON u.user_id = uc.user_id
        WHERE u.status = 'active'
        GROUP BY u.user_id
        ORDER BY u.total_cost_cents DESC
        LIMIT 10
      `),
    ]);

    // Calculate conversion rate
    const totalVisitors = parseInt(ipStats?.total_visitors || '0', 10);
    const totalUsers = parseInt(userStats?.total_users || '0', 10);
    const conversionRate = totalVisitors > 0 ? (totalUsers / totalVisitors) * 100 : 0;

    const analytics: AnalyticsData = {
      // User stats
      totalUsers,
      activeUsersToday: parseInt(userStats?.active_today || '0', 10),
      activeUsersWeek: parseInt(userStats?.active_week || '0', 10),
      newUsersToday: parseInt(userStats?.new_today || '0', 10),
      newUsersWeek: parseInt(userStats?.new_week || '0', 10),

      // IP visitor stats
      totalIPVisitors: totalVisitors,
      ipVisitorsAtGate: parseInt(ipStats?.at_gate || '0', 10),
      conversionRate: Math.round(conversionRate * 100) / 100,

      // Cost stats
      totalRevenueCents: parseInt(costStats?.total_revenue || '0', 10),
      averageCostPerUser: Math.round(parseFloat(costStats?.avg_cost || '0')),
      totalTokensUsed: {
        input: parseInt(costStats?.total_input || '0', 10),
        output: parseInt(costStats?.total_output || '0', 10),
      },

      // Content stats
      totalTopics: parseInt(contentStats?.total_topics || '0', 10),
      totalArticles: parseInt(contentStats?.total_articles || '0', 10),
      totalDocuments: parseInt(contentStats?.total_documents || '0', 10),
      publishedArticles: parseInt(contentStats?.published_articles || '0', 10),
      draftArticles: parseInt(contentStats?.draft_articles || '0', 10),

      // Recent activity
      recentConversations: recentConversations || [],
      topUsersByUsage: topUsers || [],
    };

    return NextResponse.json({ analytics });
  } catch (error) {
    console.error('[CMS] Error fetching analytics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}
