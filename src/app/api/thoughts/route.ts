import { NextRequest, NextResponse } from 'next/server';
import { query, queryOne } from '@/lib/db';

// Prevent prerendering during build
export const dynamic = 'force-dynamic';

interface Thought {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  author: string;
  published: boolean;
  published_at: Date | null;
  created_at: Date;
  updated_at: Date;
}

// GET /api/thoughts - List all published thoughts
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const tag = searchParams.get('tag');

    let queryText = `
      SELECT id, slug, title, excerpt, category, tags, author, published_at, created_at
      FROM thoughts
      WHERE published = true
    `;
    const params: unknown[] = [];
    let paramIndex = 1;

    if (category) {
      queryText += ` AND category = $${paramIndex}`;
      params.push(category);
      paramIndex++;
    }

    if (tag) {
      queryText += ` AND $${paramIndex} = ANY(tags)`;
      params.push(tag);
      paramIndex++;
    }

    queryText += ` ORDER BY published_at DESC NULLS LAST, created_at DESC`;

    const thoughts = await query<Omit<Thought, 'content'>>(queryText, params);

    return NextResponse.json({ thoughts });
  } catch (error) {
    console.error('Error fetching thoughts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch thoughts' },
      { status: 500 }
    );
  }
}

// POST /api/thoughts - Create a new thought (admin only, for future use)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, excerpt, content, category, tags, author, published } = body;

    if (!title || !content || !category) {
      return NextResponse.json(
        { error: 'Missing required fields: title, content, category' },
        { status: 400 }
      );
    }

    // Generate slug from title
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    const thought = await queryOne<Thought>(
      `INSERT INTO thoughts (slug, title, excerpt, content, category, tags, author, published, published_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [
        slug,
        title,
        excerpt || null,
        content,
        category,
        tags || [],
        author || 'Riscent',
        published ?? false,
        published ? new Date() : null,
      ]
    );

    return NextResponse.json({ thought }, { status: 201 });
  } catch (error) {
    console.error('Error creating thought:', error);
    return NextResponse.json(
      { error: 'Failed to create thought' },
      { status: 500 }
    );
  }
}

// GET categories list
export async function OPTIONS() {
  try {
    const categories = await query<{ category: string }>(
      `SELECT DISTINCT category FROM thoughts WHERE published = true ORDER BY category`
    );

    const tags = await query<{ tag: string }>(
      `SELECT DISTINCT unnest(tags) as tag FROM thoughts WHERE published = true ORDER BY tag`
    );

    return NextResponse.json({
      categories: categories.map((c) => c.category),
      tags: tags.map((t) => t.tag),
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}
