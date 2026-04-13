/**
 * GET /api/cms/users - List all users (admin only)
 * Admin endpoint for user management
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { query, queryOne } from '@/lib/db';

export const dynamic = 'force-dynamic';

interface User {
  user_id: string;
  clerk_user_id: string;
  email: string | null;
  full_name: string | null;
  avatar_url: string | null;
  role: string;
  status: string;
  total_cost_cents: number;
  limit_cents: number;
  conversation_count: number;
  total_input_tokens: number;
  total_output_tokens: number;
  created_at: string;
  last_active_at: string | null;
}

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify admin role
    const adminUser = await queryOne<{ role: string }>(
      `SELECT role FROM users WHERE clerk_user_id = $1`,
      [userId]
    );

    if (adminUser?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const role = searchParams.get('role');
    const search = searchParams.get('search');
    const sortBy = searchParams.get('sort') || 'created_at';
    const order = searchParams.get('order') || 'desc';
    const limit = parseInt(searchParams.get('limit') || '50', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);

    // Build query conditions
    const conditions: string[] = [];
    const params: (string | number)[] = [];
    let paramIndex = 1;

    if (status) {
      conditions.push(`u.status = $${paramIndex}`);
      params.push(status);
      paramIndex++;
    }

    if (role) {
      conditions.push(`u.role = $${paramIndex}`);
      params.push(role);
      paramIndex++;
    }

    if (search) {
      conditions.push(`(u.email ILIKE $${paramIndex} OR u.full_name ILIKE $${paramIndex})`);
      params.push(`%${search}%`);
      paramIndex++;
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    // Validate sort column
    const validSortColumns = ['created_at', 'last_active_at', 'total_cost_cents', 'email', 'full_name'];
    const sortColumn = validSortColumns.includes(sortBy) ? sortBy : 'created_at';
    const sortOrder = order === 'asc' ? 'ASC' : 'DESC';

    // Fetch users with stats
    const users = await query<User>(
      `SELECT
        u.user_id,
        u.clerk_user_id,
        u.email,
        u.full_name,
        u.avatar_url,
        u.role,
        u.status,
        u.total_cost_cents,
        u.limit_cents,
        u.created_at,
        u.last_active_at,
        COUNT(DISTINCT uc.conversation_id) as conversation_count,
        COALESCE(SUM(uc.input_tokens), 0) as total_input_tokens,
        COALESCE(SUM(uc.output_tokens), 0) as total_output_tokens
      FROM users u
      LEFT JOIN user_conversations uc ON u.user_id = uc.user_id
      ${whereClause}
      GROUP BY u.user_id
      ORDER BY u.${sortColumn} ${sortOrder} NULLS LAST
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
      [...params, limit, offset]
    );

    // Get total count
    const countResult = await queryOne<{ count: string }>(
      `SELECT COUNT(*) as count FROM users u ${whereClause}`,
      params
    );

    const total = parseInt(countResult?.count || '0', 10);

    return NextResponse.json({
      users,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + users.length < total,
      },
    });
  } catch (error) {
    console.error('[CMS] Error fetching users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}
