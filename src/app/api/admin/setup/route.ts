/**
 * POST /api/admin/setup
 * One-time setup endpoint to:
 * 1. Create the "Seq" organization in Clerk (if not exists)
 * 2. Make the current user an admin
 *
 * Run this once after deploying by visiting the endpoint while logged in.
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth, clerkClient } from '@clerk/nextjs/server';
import { queryOne, sql } from '@/lib/db';

export const dynamic = 'force-dynamic';

const SEQ_ORG_SLUG = 'seq';
const SEQ_ORG_NAME = 'Seq';

export async function POST(request: NextRequest) {
  try {
    // Require authentication
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const client = await clerkClient();
    const results: string[] = [];

    // 1. Check if Seq organization exists
    let seqOrg = null;
    try {
      const orgs = await client.organizations.getOrganizationList({
        query: SEQ_ORG_SLUG,
      });
      seqOrg = orgs.data.find(org => org.slug === SEQ_ORG_SLUG);
    } catch (err) {
      console.log('[Setup] Error checking orgs:', err);
    }

    // 2. Create Seq organization if it doesn't exist
    if (!seqOrg) {
      try {
        seqOrg = await client.organizations.createOrganization({
          name: SEQ_ORG_NAME,
          slug: SEQ_ORG_SLUG,
          createdBy: clerkUserId,
          publicMetadata: {
            description: 'Seq community organization',
            tier: 'community',
          },
          privateMetadata: {
            defaultLimitCents: 100, // $1.00 for members
            premiumLimitCents: 500, // $5.00 for premium
          },
        });
        results.push(`Created "${SEQ_ORG_NAME}" organization (${seqOrg.id})`);
      } catch (err: any) {
        // Organization might already exist with different query
        if (err.errors?.[0]?.code === 'form_identifier_exists') {
          results.push(`Organization "${SEQ_ORG_NAME}" already exists`);
        } else {
          throw err;
        }
      }
    } else {
      results.push(`Organization "${SEQ_ORG_NAME}" already exists (${seqOrg.id})`);
    }

    // 3. Get or create user in database
    let dbUser = await queryOne<{ user_id: string; role: string }>(
      `SELECT user_id, role FROM users WHERE clerk_user_id = $1`,
      [clerkUserId]
    );

    if (!dbUser) {
      // Get user info from Clerk
      const clerkUser = await client.users.getUser(clerkUserId);
      const email = clerkUser.emailAddresses?.[0]?.emailAddress || null;
      const fullName = [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(' ') || null;
      const avatarUrl = clerkUser.imageUrl || null;

      dbUser = await queryOne<{ user_id: string; role: string }>(
        `INSERT INTO users (clerk_user_id, email, full_name, avatar_url, role)
         VALUES ($1, $2, $3, $4, 'admin')
         RETURNING user_id, role`,
        [clerkUserId, email, fullName, avatarUrl]
      );
      results.push(`Created user in database with admin role`);
    } else if (dbUser.role !== 'admin') {
      // Make existing user an admin
      await sql`
        UPDATE users SET role = 'admin', updated_at = NOW()
        WHERE clerk_user_id = ${clerkUserId}
      `;
      results.push(`Upgraded user to admin role`);
    } else {
      results.push(`User already has admin role`);
    }

    // 4. Add user to Seq organization as admin (if org exists)
    if (seqOrg) {
      try {
        // Check if already a member
        const memberships = await client.organizations.getOrganizationMembershipList({
          organizationId: seqOrg.id,
        });
        const isMember = memberships.data.some(m => m.publicUserData?.userId === clerkUserId);

        if (!isMember) {
          await client.organizations.createOrganizationMembership({
            organizationId: seqOrg.id,
            userId: clerkUserId,
            role: 'org:admin',
          });
          results.push(`Added user to "${SEQ_ORG_NAME}" organization as admin`);
        } else {
          results.push(`User already member of "${SEQ_ORG_NAME}" organization`);
        }
      } catch (err: any) {
        results.push(`Note: Could not add to org - ${err.message}`);
      }
    }

    return NextResponse.json({
      success: true,
      results,
      organizationId: seqOrg?.id,
    });
  } catch (error) {
    console.error('[Setup] Error:', error);
    return NextResponse.json(
      { error: 'Setup failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// GET method to show instructions
export async function GET() {
  return NextResponse.json({
    message: 'Admin Setup Endpoint',
    instructions: [
      '1. Sign in to your app first',
      '2. Send a POST request to this endpoint',
      '3. This will create the Seq organization and make you an admin',
    ],
    example: 'curl -X POST https://riscent.com/api/admin/setup -H "Cookie: your-auth-cookie"',
  });
}
