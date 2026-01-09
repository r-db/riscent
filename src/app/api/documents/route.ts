import { NextRequest, NextResponse } from 'next/server';
import { query, queryOne } from '@/lib/db';

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

// GET /api/documents - List all published documents
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

    let queryText = `
      SELECT id, slug, title, description, type, pdf_url, created_at, updated_at
      FROM documents
      WHERE published = true
    `;
    const params: unknown[] = [];

    if (type) {
      queryText += ` AND type = $1`;
      params.push(type);
    }

    queryText += ` ORDER BY created_at DESC`;

    const documents = await query<Omit<Document, 'content'>>(queryText, params);

    return NextResponse.json({ documents });
  } catch (error) {
    console.error('Error fetching documents:', error);
    return NextResponse.json(
      { error: 'Failed to fetch documents' },
      { status: 500 }
    );
  }
}

// POST /api/documents - Create a new document (admin only, for future use)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, type, content, pdf_url, published } = body;

    if (!title || !type || !content) {
      return NextResponse.json(
        { error: 'Missing required fields: title, type, content' },
        { status: 400 }
      );
    }

    // Generate slug from title
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    const document = await queryOne<Document>(
      `INSERT INTO documents (slug, title, description, type, content, pdf_url, published)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [slug, title, description || null, type, content, pdf_url || null, published ?? false]
    );

    return NextResponse.json({ document }, { status: 201 });
  } catch (error) {
    console.error('Error creating document:', error);
    return NextResponse.json(
      { error: 'Failed to create document' },
      { status: 500 }
    );
  }
}
