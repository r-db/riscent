import { NextRequest, NextResponse } from 'next/server';
import { queryOne } from '@/lib/db';

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

// GET /api/thoughts/[slug] - Get a single thought by slug
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const thought = await queryOne<Thought>(
      `SELECT * FROM thoughts WHERE slug = $1 AND published = true`,
      [slug]
    );

    if (!thought) {
      return NextResponse.json(
        { error: 'Thought not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ thought });
  } catch (error) {
    console.error('Error fetching thought:', error);
    return NextResponse.json(
      { error: 'Failed to fetch thought' },
      { status: 500 }
    );
  }
}
