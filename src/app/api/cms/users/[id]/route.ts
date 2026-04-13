/**
 * GET /api/cms/users/[id] - Get single user details (admin only)
 * PUT /api/cms/users/[id] - Update user (admin only)
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { query, queryOne, sql } from '@/lib/db';

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
  created_at: string;
  updated_at: string;
  last_active_at: string | null;
}

interface UserConversation {
  conversation_id: string;
  message_count: number;
  input_tokens: number;
  output_tokens: number;
  cost_cents: number;
  created_at: string;
  updated_at: string;
}

// Check if user is admin
async function isAdmin(clerkUserId: string): Promise<boolean> {
  const user = await queryOne<{ role: string }>(
    `SELECT role FROM users WHERE clerk_user_id = $1`,
    [clerkUserId]
  );
  return user?.role === 'admin';
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!(await isAdmin(userId))) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { id } = await params;

    // Get user details
    const user = await queryOne<User>(
      `SELECT * FROM users WHERE user_id = $1::uuid`,
      [id]
    );

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get user's conversations
    const conversations = await query<UserConversation>(
      `SELECT * FROM user_conversations
       WHERE user_id = $1::uuid
       ORDER BY updated_at DESC
       LIMIT 50`,
      [id]
    );

    // Get usage summary
    const usageSummary = await queryOne<{
      total_conversations: string;
      total_messages: string;
      total_input_tokens: string;
      total_output_tokens: string;
      total_cost_cents: string;
    }>(
      `SELECT
        COUNT(*) as total_conversations,
        COALESCE(SUM(message_count), 0) as total_messages,
        COALESCE(SUM(input_tokens), 0) as total_input_tokens,
        COALESCE(SUM(output_tokens), 0) as total_output_tokens,
        COALESCE(SUM(cost_cents), 0) as total_cost_cents
      FROM user_conversations
      WHERE user_id = $1::uuid`,
      [id]
    );

    return NextResponse.json({
      user,
      conversations,
      usage: {
        totalConversations: parseInt(usageSummary?.total_conversations || '0', 10),
        totalMessages: parseInt(usageSummary?.total_messages || '0', 10),
        totalInputTokens: parseInt(usageSummary?.total_input_tokens || '0', 10),
        totalOutputTokens: parseInt(usageSummary?.total_output_tokens || '0', 10),
        totalCostCents: parseInt(usageSummary?.total_cost_cents || '0', 10),
      },
    });
  } catch (error) {
    console.error('[CMS] Error fetching user:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user' },
      { status: 500 }
    );
  }
}

async function updateUser(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!(await isAdmin(userId))) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();
    const { role, status, limit_cents } = body;

    // Validate role
    if (role && !['user', 'premium', 'admin'].includes(role)) {
      return NextResponse.json(
        { error: 'Invalid role. Must be user, premium, or admin' },
        { status: 400 }
      );
    }

    // Validate status
    if (status && !['active', 'suspended', 'deleted'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status. Must be active, suspended, or deleted' },
        { status: 400 }
      );
    }

    // Update user
    const user = await queryOne<User>(
      `UPDATE users SET
        role = COALESCE($2, role),
        status = COALESCE($3, status),
        limit_cents = COALESCE($4, limit_cents),
        updated_at = NOW()
      WHERE user_id = $1::uuid
      RETURNING *`,
      [id, role || null, status || null, limit_cents || null]
    );

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error('[CMS] Error updating user:', error);
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    );
  }
}

// Support both PUT and PATCH for updates
export const PUT = updateUser;
export const PATCH = updateUser;
