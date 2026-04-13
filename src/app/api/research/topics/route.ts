/**
 * GET /api/research/topics - List all research topics
 * POST /api/research/topics - Create new topic (admin only)
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { query, queryOne, sql } from '@/lib/db';

export const dynamic = 'force-dynamic';

interface ResearchTopic {
  topic_id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  description: string;
  icon_name: string;
  color_hex: string;
  display_order: number;
  status: string;
  article_count?: number;
  document_count?: number;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    // Build WHERE clause based on status parameter
    let statusFilter = "t.status = 'active'";
    if (status === 'all') {
      statusFilter = '1=1'; // No filter - return all topics
    } else if (status) {
      statusFilter = `t.status = '${status}'`;
    }

    // Get topics with article and document counts
    const topics = await query<ResearchTopic>(
      `SELECT
        t.topic_id,
        t.slug,
        t.title,
        t.subtitle,
        t.description,
        t.icon_name,
        t.color_hex,
        t.display_order,
        t.status,
        COUNT(DISTINCT a.article_id) FILTER (WHERE a.status = 'published') as article_count,
        COUNT(DISTINCT d.document_id) FILTER (WHERE d.status = 'published') as document_count
      FROM research_topics t
      LEFT JOIN research_articles a ON t.topic_id = a.topic_id
      LEFT JOIN research_documents d ON t.topic_id = d.topic_id
      WHERE ${statusFilter}
      GROUP BY t.topic_id
      ORDER BY t.display_order ASC`
    );

    return NextResponse.json({ topics });
  } catch (error) {
    console.error('[API] Error fetching topics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch topics' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check admin auth
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // TODO: Check admin role in users table
    const user = await queryOne<{ role: string }>(
      `SELECT role FROM users WHERE clerk_user_id = $1`,
      [userId]
    );

    if (user?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { slug, title, subtitle, description, icon_name, color_hex, display_order } = body;

    if (!slug || !title || !description || !icon_name || !color_hex) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const topic = await queryOne<ResearchTopic>(
      `INSERT INTO research_topics (slug, title, subtitle, description, icon_name, color_hex, display_order)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [slug, title, subtitle || null, description, icon_name, color_hex, display_order || 0]
    );

    return NextResponse.json({ topic }, { status: 201 });
  } catch (error) {
    console.error('[API] Error creating topic:', error);
    return NextResponse.json(
      { error: 'Failed to create topic' },
      { status: 500 }
    );
  }
}
