import { NextRequest, NextResponse } from 'next/server';
import { queryOne } from '@/lib/db';

// Prevent prerendering during build
export const dynamic = 'force-dynamic';

interface Document {
  id: string;
  slug: string;
  title: string;
  description: string;
  type: string;
  content: string;
  pdf_url: string | null;
  published: boolean;
  created_at: Date;
  updated_at: Date;
}

// GET /api/documents/[slug] - Get a single document by slug
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const document = await queryOne<Document>(
      `SELECT * FROM documents WHERE slug = $1 AND published = true`,
      [slug]
    );

    if (!document) {
      return NextResponse.json(
        { error: 'Document not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ document });
  } catch (error) {
    console.error('Error fetching document:', error);
    return NextResponse.json(
      { error: 'Failed to fetch document' },
      { status: 500 }
    );
  }
}
