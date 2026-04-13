/**
 * GET /api/research/articles/[slug] - Get single article with full content
 * PUT /api/research/articles/[slug] - Update article (admin only)
 * DELETE /api/research/articles/[slug] - Delete article (admin only)
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { query, queryOne, sql } from '@/lib/db';

export const dynamic = 'force-dynamic';

interface ResearchArticle {
  article_id: string;
  topic_id: string | null;
  topic_slug?: string | null;
  topic_title?: string | null;
  slug: string;
  title: string;
  subtitle: string | null;
  introduction: string | null;
  conclusion: string | null;
  key_takeaways: string[];
  content_sections: Array<{ heading: string; content: string }>;
  author_name: string;
  published_date: string | null;
  read_time: string | null;
  category: string | null;
  color_hex: string;
  status: string;
  featured: boolean;
  is_interesting_find: boolean;
  meta_title: string | null;
  meta_description: string | null;
}

interface RelatedArticle {
  slug: string;
  title: string;
  subtitle: string | null;
  color_hex: string;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    // Get article with topic info
    const article = await queryOne<ResearchArticle>(
      `SELECT
        a.*,
        t.slug as topic_slug,
        t.title as topic_title
      FROM research_articles a
      LEFT JOIN research_topics t ON a.topic_id = t.topic_id
      WHERE a.slug = $1 AND a.status = 'published'`,
      [slug]
    );

    if (!article) {
      return NextResponse.json(
        { error: 'Article not found' },
        { status: 404 }
      );
    }

    // Get related articles (same topic or interesting finds)
    const related = await query<RelatedArticle>(
      `SELECT slug, title, subtitle, color_hex
       FROM research_articles
       WHERE status = 'published'
         AND slug != $1
         AND (topic_id = $2 OR is_interesting_find = true)
       ORDER BY RANDOM()
       LIMIT 3`,
      [slug, article.topic_id]
    );

    return NextResponse.json({
      article,
      related,
    });
  } catch (error) {
    console.error('[API] Error fetching article:', error);
    return NextResponse.json(
      { error: 'Failed to fetch article' },
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
    const {
      topic_id,
      title,
      subtitle,
      introduction,
      conclusion,
      key_takeaways,
      content_sections,
      author_name,
      published_date,
      read_time,
      category,
      color_hex,
      status,
      featured,
      is_interesting_find,
      meta_title,
      meta_description,
    } = body;

    // Check if publishing for first time
    const existing = await queryOne<{ status: string }>(
      `SELECT status FROM research_articles WHERE slug = $1`,
      [slug]
    );

    const setPublishedAt = existing?.status !== 'published' && status === 'published'
      ? ', published_at = NOW()'
      : '';

    const article = await queryOne<ResearchArticle>(
      `UPDATE research_articles SET
        topic_id = COALESCE($2, topic_id),
        title = COALESCE($3, title),
        subtitle = COALESCE($4, subtitle),
        introduction = COALESCE($5, introduction),
        conclusion = COALESCE($6, conclusion),
        key_takeaways = COALESCE($7, key_takeaways),
        content_sections = COALESCE($8, content_sections),
        author_name = COALESCE($9, author_name),
        published_date = COALESCE($10, published_date),
        read_time = COALESCE($11, read_time),
        category = COALESCE($12, category),
        color_hex = COALESCE($13, color_hex),
        status = COALESCE($14, status),
        featured = COALESCE($15, featured),
        is_interesting_find = COALESCE($16, is_interesting_find),
        meta_title = COALESCE($17, meta_title),
        meta_description = COALESCE($18, meta_description)
        ${setPublishedAt}
      WHERE slug = $1
      RETURNING *`,
      [
        slug,
        topic_id,
        title,
        subtitle,
        introduction,
        conclusion,
        key_takeaways ? JSON.stringify(key_takeaways) : null,
        content_sections ? JSON.stringify(content_sections) : null,
        author_name,
        published_date,
        read_time,
        category,
        color_hex,
        status,
        featured,
        is_interesting_find,
        meta_title,
        meta_description,
      ]
    );

    if (!article) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }

    return NextResponse.json({ article });
  } catch (error) {
    console.error('[API] Error updating article:', error);
    return NextResponse.json(
      { error: 'Failed to update article' },
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

    // Soft delete - set status to archived
    await sql`
      UPDATE research_articles SET status = 'archived'
      WHERE slug = ${slug}
    `;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[API] Error deleting article:', error);
    return NextResponse.json(
      { error: 'Failed to delete article' },
      { status: 500 }
    );
  }
}
