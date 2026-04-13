/**
 * POST /api/cms/users/[id]/reset - Reset user usage (admin only)
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { queryOne } from '@/lib/db';

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
  updated_at: string;
  last_active_at: string | null;
}

// Check if user is admin
async function isAdmin(clerkUserId: string): Promise<boolean> {
  const user = await queryOne<{ role: string }>(
    `SELECT role FROM users WHERE clerk_user_id = $1`,
    [clerkUserId]
  );
  return user?.role === 'admin';
}

export async function POST(
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

    // Reset user usage statistics
    const user = await queryOne<User>(
      `UPDATE users SET
        total_cost_cents = 0,
        total_input_tokens = 0,
        total_output_tokens = 0,
        updated_at = NOW()
      WHERE user_id = $1::uuid
      RETURNING *`,
      [id]
    );

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      user,
      message: 'User usage has been reset'
    });
  } catch (error) {
    console.error('[CMS] Error resetting user usage:', error);
    return NextResponse.json(
      { error: 'Failed to reset user usage' },
      { status: 500 }
    );
  }
}
