/**
 * GET /api/research/topics/[slug] - Get topic with articles and documents
 * PUT /api/research/topics/[slug] - Update topic (admin only)
 * DELETE /api/research/topics/[slug] - Delete topic (admin only)
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
}

interface ResearchArticle {
  article_id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  author_name: string;
  published_date: string | null;
  read_time: string | null;
  category: string | null;
  color_hex: string;
  status: string;
  is_interesting_find: boolean;
}

interface ResearchDocument {
  document_id: string;
  title: string;
  description: string | null;
  file_url: string;
  file_name: string | null;
  file_type: string;
  file_size_bytes: number | null;
}

interface TopicResponse {
  topic: ResearchTopic;
  articles: ResearchArticle[];
  documents: ResearchDocument[];
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    // Get topic
    const topic = await queryOne<ResearchTopic>(
      `SELECT * FROM research_topics WHERE slug = $1 AND status = 'active'`,
      [slug]
    );

    if (!topic) {
      return NextResponse.json(
        { error: 'Topic not found' },
        { status: 404 }
      );
    }

    // Get published articles for this topic
    const articles = await query<ResearchArticle>(
      `SELECT
        article_id,
        slug,
        title,
        subtitle,
        author_name,
        published_date,
        read_time,
        category,
        color_hex,
        status,
        is_interesting_find
      FROM research_articles
      WHERE topic_id = $1 AND status = 'published'
      ORDER BY published_at DESC NULLS LAST, created_at DESC`,
      [topic.topic_id]
    );

    // Get published documents for this topic
    const documents = await query<ResearchDocument>(
      `SELECT
        document_id,
        title,
        description,
        file_url,
        file_name,
        file_type,
        file_size_bytes
      FROM research_documents
      WHERE topic_id = $1 AND status = 'published'
      ORDER BY display_order ASC, created_at DESC`,
      [topic.topic_id]
    );

    const response: TopicResponse = {
      topic,
      articles,
      documents,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('[API] Error fetching topic:', error);
    return NextResponse.json(
      { error: 'Failed to fetch topic' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await queryOne<{ role: string }>(
      `SELECT role FROM users WHERE clerk_user_id = $1`,
      [userId]
    );

    if (user?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { slug } = await params;
    const body = await request.json();
    const { title, subtitle, description, icon_name, color_hex, display_order, status } = body;

    const topic = await queryOne<ResearchTopic>(
      `UPDATE research_topics SET
        title = COALESCE($2, title),
        subtitle = COALESCE($3, subtitle),
        description = COALESCE($4, description),
        icon_name = COALESCE($5, icon_name),
        color_hex = COALESCE($6, color_hex),
        display_order = COALESCE($7, display_order),
        status = COALESCE($8, status)
      WHERE slug = $1
      RETURNING *`,
      [slug, title, subtitle, description, icon_name, color_hex, display_order, status]
    );

    if (!topic) {
      return NextResponse.json({ error: 'Topic not found' }, { status: 404 });
    }

    return NextResponse.json({ topic });
  } catch (error) {
    console.error('[API] Error updating topic:', error);
    return NextResponse.json(
      { error: 'Failed to update topic' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await queryOne<{ role: string }>(
      `SELECT role FROM users WHERE clerk_user_id = $1`,
      [userId]
    );

    if (user?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { slug } = await params;

    // Soft delete - set status to hidden
    const result = await sql`
      UPDATE research_topics SET status = 'hidden'
      WHERE slug = ${slug}
    `;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[API] Error deleting topic:', error);
    return NextResponse.json(
      { error: 'Failed to delete topic' },
      { status: 500 }
    );
  }
}
