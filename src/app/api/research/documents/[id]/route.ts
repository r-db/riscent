/**
 * GET /api/research/documents/[id] - Get single document
 * PUT /api/research/documents/[id] - Update document (admin only)
 * DELETE /api/research/documents/[id] - Delete document (admin only)
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { queryOne, sql } from '@/lib/db';

export const dynamic = 'force-dynamic';

interface ResearchDocument {
  document_id: string;
  topic_id: string | null;
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

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const document = await queryOne<ResearchDocument>(
      `SELECT * FROM research_documents WHERE document_id = $1::uuid`,
      [id]
    );

    if (!document) {
      return NextResponse.json(
        { error: 'Document not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ document });
  } catch (error) {
    console.error('[API] Error fetching document:', error);
    return NextResponse.json(
      { error: 'Failed to fetch document' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
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

    const { id } = await params;
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

    const document = await queryOne<ResearchDocument>(
      `UPDATE research_documents SET
        topic_id = COALESCE($2, topic_id),
        article_id = COALESCE($3, article_id),
        title = COALESCE($4, title),
        description = COALESCE($5, description),
        file_url = COALESCE($6, file_url),
        file_name = COALESCE($7, file_name),
        file_type = COALESCE($8, file_type),
        file_size_bytes = COALESCE($9, file_size_bytes),
        display_order = COALESCE($10, display_order),
        status = COALESCE($11, status)
      WHERE document_id = $1::uuid
      RETURNING *`,
      [
        id,
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
      ]
    );

    if (!document) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }

    return NextResponse.json({ document });
  } catch (error) {
    console.error('[API] Error updating document:', error);
    return NextResponse.json(
      { error: 'Failed to update document' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
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

    const { id } = await params;

    // Soft delete - set status to archived
    await sql`
      UPDATE research_documents SET status = 'archived'
      WHERE document_id = ${id}::uuid
    `;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[API] Error deleting document:', error);
    return NextResponse.json(
      { error: 'Failed to delete document' },
      { status: 500 }
    );
  }
}
