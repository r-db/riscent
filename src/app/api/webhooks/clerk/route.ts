/**
 * POST /api/webhooks/clerk
 * Clerk webhook handler for user and organization sync
 *
 * Events handled:
 * - user.created: Create user record in database
 * - user.updated: Update user profile
 * - user.deleted: Soft delete user
 * - organizationMembership.created: Set user limits based on org role
 * - organizationMembership.updated: Update limits on role change
 * - organizationMembership.deleted: Reset to default limits
 *
 * Setup in Clerk Dashboard:
 * 1. Go to Webhooks
 * 2. Add endpoint: https://riscent.com/api/webhooks/clerk
 * 3. Select events: user.created, user.updated, user.deleted,
 *    organizationMembership.created, organizationMembership.updated, organizationMembership.deleted
 * 4. Copy signing secret to CLERK_WEBHOOK_SECRET env var
 */

import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { Webhook } from 'svix';
import { sql, queryOne } from '@/lib/db';
import { audit } from '@/lib/audit';

export const dynamic = 'force-dynamic';

// Clerk webhook event types
type UserEventData = {
  id: string;
  email_addresses?: Array<{
    email_address: string;
    id: string;
  }>;
  first_name?: string | null;
  last_name?: string | null;
  image_url?: string | null;
  created_at?: number;
  updated_at?: number;
};

type OrgMembershipEventData = {
  id: string;
  organization: {
    id: string;
    slug: string;
    name: string;
  };
  public_user_data: {
    user_id: string;
  };
  role: string;
  created_at?: number;
  updated_at?: number;
};

type WebhookEvent = {
  type: string;
  data: UserEventData | OrgMembershipEventData;
};

// Role to limit mapping for Seq organization
const SEQ_ORG_SLUG = 'seq';
const ROLE_LIMITS: Record<string, number> = {
  'org:admin': 10000,    // $100.00 for admins
  'org:premium': 500,    // $5.00 for premium
  'org:member': 100,     // $1.00 for members
};
const DEFAULT_LIMIT = 100; // $1.00 default

export async function POST(request: NextRequest) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    console.error('[Webhook] Missing CLERK_WEBHOOK_SECRET');
    return NextResponse.json(
      { error: 'Webhook secret not configured' },
      { status: 500 }
    );
  }

  // Get headers for verification
  const headerPayload = await headers();
  const svix_id = headerPayload.get('svix-id');
  const svix_timestamp = headerPayload.get('svix-timestamp');
  const svix_signature = headerPayload.get('svix-signature');

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return NextResponse.json(
      { error: 'Missing svix headers' },
      { status: 400 }
    );
  }

  // Get body
  const body = await request.text();

  // Verify webhook signature
  const wh = new Webhook(WEBHOOK_SECRET);
  let evt: WebhookEvent;

  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error('[Webhook] Verification failed:', err);
    return NextResponse.json(
      { error: 'Webhook verification failed' },
      { status: 400 }
    );
  }

  // Handle events
  const { type, data } = evt;

  try {
    switch (type) {
      case 'user.created':
      case 'user.updated': {
        const userData = data as UserEventData;
        const clerkUserId = userData.id;
        const email = userData.email_addresses?.[0]?.email_address || null;
        const fullName = [userData.first_name, userData.last_name].filter(Boolean).join(' ') || null;
        const avatarUrl = userData.image_url || null;

        // Upsert user
        const user = await queryOne<{ user_id: string }>(
          `INSERT INTO users (clerk_user_id, email, full_name, avatar_url)
           VALUES ($1, $2, $3, $4)
           ON CONFLICT (clerk_user_id) DO UPDATE SET
             email = COALESCE(EXCLUDED.email, users.email),
             full_name = COALESCE(EXCLUDED.full_name, users.full_name),
             avatar_url = COALESCE(EXCLUDED.avatar_url, users.avatar_url),
             updated_at = NOW()
           RETURNING user_id`,
          [clerkUserId, email, fullName, avatarUrl]
        );

        // Audit
        await audit({
          action: type === 'user.created' ? 'user_created' : 'user_updated',
          entityType: 'user',
          entityId: user?.user_id,
          actorType: 'system',
          actorId: 'clerk-webhook',
          metadata: {
            clerkUserId,
            email,
            eventType: type,
          },
        });

        console.log(`[Webhook] ${type}: ${clerkUserId} -> ${user?.user_id}`);
        break;
      }

      case 'user.deleted': {
        const userData = data as UserEventData;
        const clerkUserId = userData.id;

        // Soft delete - set status to deleted
        await sql`
          UPDATE users
          SET status = 'deleted', updated_at = NOW()
          WHERE clerk_user_id = ${clerkUserId}
        `;

        await audit({
          action: 'user_deleted',
          entityType: 'user',
          actorType: 'system',
          actorId: 'clerk-webhook',
          metadata: { clerkUserId },
        });

        console.log(`[Webhook] user.deleted: ${clerkUserId}`);
        break;
      }

      case 'organizationMembership.created':
      case 'organizationMembership.updated': {
        const memberData = data as OrgMembershipEventData;
        const orgSlug = memberData.organization.slug;
        const clerkUserId = memberData.public_user_data.user_id;
        const role = memberData.role;

        // Only process Seq organization memberships
        if (orgSlug !== SEQ_ORG_SLUG) {
          console.log(`[Webhook] Ignoring membership for org: ${orgSlug}`);
          break;
        }

        // Determine limit based on role
        const limitCents = ROLE_LIMITS[role] || DEFAULT_LIMIT;

        // Update user's limit and role
        const dbRole = role === 'org:admin' ? 'admin' : role === 'org:premium' ? 'premium' : 'member';

        await sql`
          UPDATE users
          SET
            cost_limit_cents = ${limitCents},
            role = ${dbRole},
            updated_at = NOW()
          WHERE clerk_user_id = ${clerkUserId}
        `;

        await audit({
          action: 'user_org_membership_updated',
          entityType: 'user',
          actorType: 'system',
          actorId: 'clerk-webhook',
          metadata: {
            clerkUserId,
            organization: orgSlug,
            role,
            limitCents,
          },
        });

        console.log(`[Webhook] ${type}: ${clerkUserId} -> ${role} (${limitCents} cents)`);
        break;
      }

      case 'organizationMembership.deleted': {
        const memberData = data as OrgMembershipEventData;
        const orgSlug = memberData.organization.slug;
        const clerkUserId = memberData.public_user_data.user_id;

        // Only process Seq organization memberships
        if (orgSlug !== SEQ_ORG_SLUG) {
          console.log(`[Webhook] Ignoring membership deletion for org: ${orgSlug}`);
          break;
        }

        // Reset to default limits when removed from org
        await sql`
          UPDATE users
          SET
            cost_limit_cents = ${DEFAULT_LIMIT},
            role = 'member',
            updated_at = NOW()
          WHERE clerk_user_id = ${clerkUserId}
        `;

        await audit({
          action: 'user_org_membership_removed',
          entityType: 'user',
          actorType: 'system',
          actorId: 'clerk-webhook',
          metadata: {
            clerkUserId,
            organization: orgSlug,
          },
        });

        console.log(`[Webhook] ${type}: ${clerkUserId} removed from ${orgSlug}`);
        break;
      }

      default:
        console.log(`[Webhook] Unhandled event type: ${type}`);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`[Webhook] Error handling ${type}:`, error);
    return NextResponse.json(
      { error: 'Failed to process webhook' },
      { status: 500 }
    );
  }
}
