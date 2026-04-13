/**
 * GET /api/research/documents - List all documents
 * POST /api/research/documents - Create new document (admin only)
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { query, queryOne } from '@/lib/db';

export const dynamic = 'force-dynamic';

interface ResearchDocument {
  document_id: string;
  topic_id: string | null;
  topic_slug?: string | null;
  topic_title?: string | null;
  article_id: string | null;
  title: string;
  description: string | null;
  file_url: string;
  file_name: string | null;
  file_type: string;
  file_size_bytes: number | null;
  display_order: number;
  status: string;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'published';
    const topicId = searchParams.get('topic_id');

    let whereClause = `d.status = $1`;
    const params: string[] = [status];

    if (topicId) {
      whereClause += ` AND d.topic_id = $2`;
      params.push(topicId);
    }

    const documents = await query<ResearchDocument>(
      `SELECT
        d.document_id,
        d.topic_id,
        t.slug as topic_slug,
        t.title as topic_title,
        d.article_id,
        d.title,
        d.description,
        d.file_url,
        d.file_name,
        d.file_type,
        d.file_size_bytes,
        d.display_order,
        d.status
      FROM research_documents d
      LEFT JOIN research_topics t ON d.topic_id = t.topic_id
      WHERE ${whereClause}
      ORDER BY d.display_order ASC, d.created_at DESC`,
      params
    );

    return NextResponse.json({ documents });
  } catch (error) {
    console.error('[API] Error fetching documents:', error);
    return NextResponse.json(
      { error: 'Failed to fetch documents' },
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
      article_id,
      title,
      description,
      file_url,
      file_name,
      file_type,
      file_size_bytes,
      display_order,
      status,
    } = body;

    if (!title || !file_url) {
      return NextResponse.json(
        { error: 'Missing required fields: title, file_url' },
        { status: 400 }
      );
    }

    const document = await queryOne<ResearchDocument>(
      `INSERT INTO research_documents (
        topic_id, article_id, title, description, file_url,
        file_name, file_type, file_size_bytes, display_order, status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *`,
      [
        topic_id || null,
        article_id || null,
        title,
        description || null,
        file_url,
        file_name || null,
        file_type || 'pdf',
        file_size_bytes || null,
        display_order || 0,
        status || 'draft',
      ]
    );

    return NextResponse.json({ document }, { status: 201 });
  } catch (error) {
    console.error('[API] Error creating document:', error);
    return NextResponse.json(
      { error: 'Failed to create document' },
      { status: 500 }
    );
  }
}
