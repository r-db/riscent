/**
 * GET /api/research/articles - List all articles
 * POST /api/research/articles - Create new article (admin only)
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { query, queryOne } from '@/lib/db';

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
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'published';
    const interesting = searchParams.get('interesting') === 'true';

    let whereClause = `a.status = $1`;
    const params: (string | boolean)[] = [status];

    if (interesting) {
      whereClause += ` AND a.is_interesting_find = true`;
    }

    const articles = await query<ResearchArticle>(
      `SELECT
        a.article_id,
        a.topic_id,
        t.slug as topic_slug,
        t.title as topic_title,
        a.slug,
        a.title,
        a.subtitle,
        a.introduction,
        a.author_name,
        a.published_date,
        a.read_time,
        a.category,
        a.color_hex,
        a.status,
        a.featured,
        a.is_interesting_find
      FROM research_articles a
      LEFT JOIN research_topics t ON a.topic_id = t.topic_id
      WHERE ${whereClause}
      ORDER BY a.featured DESC, a.published_at DESC NULLS LAST, a.created_at DESC`,
      params
    );

    return NextResponse.json({ articles });
  } catch (error) {
    console.error('[API] Error fetching articles:', error);
    return NextResponse.json(
      { error: 'Failed to fetch articles' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
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

    const body = await request.json();
    const {
      topic_id,
      slug,
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
    } = body;

    if (!slug || !title) {
      return NextResponse.json(
        { error: 'Missing required fields: slug, title' },
        { status: 400 }
      );
    }

    const article = await queryOne<ResearchArticle>(
      `INSERT INTO research_articles (
        topic_id, slug, title, subtitle, introduction, conclusion,
        key_takeaways, content_sections, author_name, published_date,
        read_time, category, color_hex, status, featured, is_interesting_find,
        published_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16,
        CASE WHEN $14 = 'published' THEN NOW() ELSE NULL END
      )
      RETURNING *`,
      [
        topic_id || null,
        slug,
        title,
        subtitle || null,
        introduction || null,
        conclusion || null,
        JSON.stringify(key_takeaways || []),
        JSON.stringify(content_sections || []),
        author_name || 'Riscent Research Team',
        published_date || null,
        read_time || null,
        category || null,
        color_hex || '#4A7C59',
        status || 'draft',
        featured || false,
        is_interesting_find || false,
      ]
    );

    return NextResponse.json({ article }, { status: 201 });
  } catch (error) {
    console.error('[API] Error creating article:', error);
    return NextResponse.json(
      { error: 'Failed to create article' },
      { status: 500 }
    );
  }
}
