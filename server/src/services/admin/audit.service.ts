import { desc, eq } from 'drizzle-orm';
import { db } from '../../db/index.js';
import { auditLog, users } from '../../db/schema.js';
import type { AdminAuditEntry } from '@freestyle/shared';

export const adminAuditService = {
  async list(limit = 100): Promise<AdminAuditEntry[]> {
    const rows = await db
      .select({
        id: auditLog.id,
        actorId: auditLog.actorId,
        action: auditLog.action,
        entityType: auditLog.entityType,
        entityId: auditLog.entityId,
        meta: auditLog.meta,
        createdAt: auditLog.createdAt,
        actorName: users.name,
      })
      .from(auditLog)
      .leftJoin(users, eq(users.id, auditLog.actorId))
      .orderBy(desc(auditLog.createdAt))
      .limit(limit);

    return rows.map((r) => ({
      id: r.id,
      actorId: r.actorId,
      actorName: r.actorName,
      action: r.action,
      entityType: r.entityType,
      entityId: r.entityId,
      meta: r.meta,
      createdAt: r.createdAt.toISOString(),
    }));
  },
};
