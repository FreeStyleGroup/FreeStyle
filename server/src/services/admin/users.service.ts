import { and, desc, eq, sql, type SQL } from 'drizzle-orm';
import { db } from '../../db/index.js';
import { users, walletTransactions, auditLog } from '../../db/schema.js';
import { authService } from '../auth/auth.service.js';
import { tokenService } from '../auth/token.service.js';
import type {
  AdminUsersListResponse,
  AdminUsersQuery,
  AdminUpdateUserRequest,
  UserDto,
} from '@freestyle/shared';

const DEFAULT_PAGE_SIZE = 20;

export const adminUsersService = {
  async list(q: AdminUsersQuery): Promise<AdminUsersListResponse> {
    const page = Math.max(1, q.page ?? 1);
    const pageSize = Math.min(100, Math.max(1, q.pageSize ?? DEFAULT_PAGE_SIZE));
    const offset = (page - 1) * pageSize;

    const conditions: SQL[] = [];
    if (q.q?.trim()) {
      const term = `%${q.q.trim()}%`;
      conditions.push(sql`(${users.name} ILIKE ${term} OR ${users.email} ILIKE ${term})`);
    }
    if (q.role) conditions.push(eq(users.role, q.role));
    if (q.status) conditions.push(eq(users.status, q.status));

    const where = conditions.length ? and(...conditions) : undefined;

    const [items, totalRows] = await Promise.all([
      db.query.users.findMany({
        where,
        orderBy: [desc(users.createdAt)],
        limit: pageSize,
        offset,
      }),
      db.select({ count: sql<number>`count(*)::int` }).from(users).where(where),
    ]);

    const total = totalRows[0]?.count ?? 0;

    return {
      items: items.map((u) => authService.toDto(u)),
      meta: { total, page, pageSize },
    };
  },

  async getById(userId: string): Promise<UserDto | null> {
    return authService.getById(userId);
  },

  async update(actorId: string, userId: string, patch: AdminUpdateUserRequest): Promise<UserDto> {
    const before = await db.query.users.findFirst({ where: eq(users.id, userId) });
    if (!before) throw new Error('User not found');

    await db.transaction(async (tx) => {
      const updates: Partial<typeof users.$inferInsert> = { updatedAt: new Date() };
      if (patch.role) updates.role = patch.role;
      if (patch.status) updates.status = patch.status;
      if (patch.name) updates.name = patch.name.trim();
      if (Object.keys(updates).length > 1) {
        await tx.update(users).set(updates).where(eq(users.id, userId));
      }
      if (patch.milesAdjustment) {
        await tx.insert(walletTransactions).values({
          userId,
          kind: 'miles',
          type: 'manual_adjustment',
          amount: String(patch.milesAdjustment.amount),
          currency: null,
          description: patch.milesAdjustment.description,
        });
        await tx
          .update(users)
          .set({ milesBalance: sql`${users.milesBalance} + ${patch.milesAdjustment.amount}` })
          .where(eq(users.id, userId));
      }

      const diff: Record<string, { from: unknown; to: unknown }> = {};
      if (patch.role && before.role !== patch.role) diff.role = { from: before.role, to: patch.role };
      if (patch.status && before.status !== patch.status) diff.status = { from: before.status, to: patch.status };
      if (patch.name && before.name !== patch.name.trim()) diff.name = { from: before.name, to: patch.name.trim() };
      if (patch.milesAdjustment) diff.milesAdjustment = { from: null, to: patch.milesAdjustment };

      if (Object.keys(diff).length > 0) {
        await tx.insert(auditLog).values({
          actorId,
          action: 'user.update',
          entityType: 'user',
          entityId: userId,
          meta: { diff },
        });
      }

      /** Бан → отзыв всех refresh-сессий */
      if (patch.status === 'banned' && before.status !== 'banned') {
        await tokenService.revokeAllForUser(userId);
      }
    });

    const updated = await authService.getById(userId);
    if (!updated) throw new Error('User vanished after update');
    return updated;
  },

};
