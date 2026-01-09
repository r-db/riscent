/**
 * Audit logging module
 * Block Theory requirement: All mutations must be logged
 */

import { sql } from './db';

export type AuditAction =
  | 'create'
  | 'update'
  | 'delete'
  | 'login'
  | 'conversation_start'
  | 'conversation_message'
  | 'identity_capture'
  | 'curtain_enter'
  | 'verification_code_sent'
  | 'phone_verified';

export type ActorType = 'visitor' | 'admin' | 'seq' | 'system';

export interface AuditEntry {
  action: AuditAction;
  entityType: string;
  entityId?: string;
  actorType: ActorType;
  actorId?: string;
  oldValues?: Record<string, unknown>;
  newValues?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
}

/**
 * Log an audit entry
 * This is the "snitch" function required by Block Theory
 */
export async function audit(entry: AuditEntry): Promise<void> {
  try {
    await sql`
      INSERT INTO audit_log (
        action,
        entity_type,
        entity_id,
        actor_type,
        actor_id,
        old_values,
        new_values,
        metadata,
        ip_address,
        user_agent
      ) VALUES (
        ${entry.action},
        ${entry.entityType},
        ${entry.entityId || null},
        ${entry.actorType},
        ${entry.actorId || null},
        ${entry.oldValues ? JSON.stringify(entry.oldValues) : null},
        ${entry.newValues ? JSON.stringify(entry.newValues) : null},
        ${entry.metadata ? JSON.stringify(entry.metadata) : '{}'},
        ${entry.ipAddress || null},
        ${entry.userAgent || null}
      )
    `;
  } catch (error) {
    // Never let audit failures break the main flow
    // But always log them
    console.error('[Audit] Failed to log entry:', error, entry);
  }
}

/**
 * Convenience wrapper for mutation operations
 * Automatically logs before/after state
 */
export async function auditedMutation<T>(
  entry: Omit<AuditEntry, 'oldValues' | 'newValues'>,
  getOldState: () => Promise<Record<string, unknown> | null>,
  mutation: () => Promise<T>,
  getNewState: () => Promise<Record<string, unknown> | null>
): Promise<T> {
  const oldValues = await getOldState();
  const result = await mutation();
  const newValues = await getNewState();

  await audit({
    ...entry,
    oldValues: oldValues || undefined,
    newValues: newValues || undefined,
  });

  return result;
}

/**
 * Simple audit for create operations (no old state)
 */
export async function auditCreate(
  entityType: string,
  entityId: string,
  newValues: Record<string, unknown>,
  context: { actorType: ActorType; actorId?: string; ipAddress?: string; userAgent?: string }
): Promise<void> {
  await audit({
    action: 'create',
    entityType,
    entityId,
    newValues,
    ...context,
  });
}

/**
 * Simple audit for delete operations
 */
export async function auditDelete(
  entityType: string,
  entityId: string,
  oldValues: Record<string, unknown>,
  context: { actorType: ActorType; actorId?: string; ipAddress?: string; userAgent?: string }
): Promise<void> {
  await audit({
    action: 'delete',
    entityType,
    entityId,
    oldValues,
    ...context,
  });
}
