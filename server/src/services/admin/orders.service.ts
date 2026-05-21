import { and, desc, eq, sql, type SQL } from 'drizzle-orm';
import { db } from '../../db/index.js';
import { bookings, users, auditLog } from '../../db/schema.js';
import type {
  AdminOrdersListResponse,
  AdminOrdersQuery,
  AdminOrderItem,
  AdminUpdateOrderRequest,
} from '@freestyle/shared';

function titleFor(b: typeof bookings.$inferSelect): string {
  const payload = b.payload as { title?: string; route?: { from?: string; to?: string } };
  if (payload.title) return payload.title;
  if (payload.route?.from && payload.route?.to) return `${payload.route.from} → ${payload.route.to}`;
  return `Заказ ${b.publicId}`;
}

export const adminOrdersService = {
  async list(q: AdminOrdersQuery): Promise<AdminOrdersListResponse> {
    const page = Math.max(1, q.page ?? 1);
    const pageSize = Math.min(100, Math.max(1, q.pageSize ?? 20));
    const offset = (page - 1) * pageSize;

    const conditions: SQL[] = [];
    if (q.q?.trim()) conditions.push(sql`${bookings.publicId} ILIKE ${`%${q.q.trim()}%`}`);
    if (q.status) conditions.push(eq(bookings.status, q.status));
    if (q.type) conditions.push(eq(bookings.type, q.type));
    const where = conditions.length ? and(...conditions) : undefined;

    const [rows, totalRows] = await Promise.all([
      db
        .select({
          booking: bookings,
          userName: users.name,
          userEmail: users.email,
        })
        .from(bookings)
        .leftJoin(users, eq(users.id, bookings.userId))
        .where(where)
        .orderBy(desc(bookings.createdAt))
        .limit(pageSize)
        .offset(offset),
      db.select({ count: sql<number>`count(*)::int` }).from(bookings).where(where),
    ]);

    const items: AdminOrderItem[] = rows.map((r) => {
      const payload = r.booking.payload as { startsAt?: string };
      return {
        id: r.booking.id,
        publicId: r.booking.publicId,
        type: r.booking.type,
        status: r.booking.status,
        amount: r.booking.amount,
        currency: r.booking.currency,
        title: titleFor(r.booking),
        startsAt: payload.startsAt ?? null,
        createdAt: r.booking.createdAt.toISOString(),
        userId: r.booking.userId,
        userName: r.userName ?? '—',
        userEmail: r.userEmail ?? '—',
      };
    });

    return { items, meta: { total: totalRows[0]?.count ?? 0, page, pageSize } };
  },

  async updateStatus(actorId: string, id: string, patch: AdminUpdateOrderRequest): Promise<void> {
    const before = await db.query.bookings.findFirst({ where: eq(bookings.id, id) });
    if (!before) throw new Error('Booking not found');

    const set: Partial<typeof bookings.$inferInsert> = { status: patch.status, updatedAt: new Date() };
    if (patch.adminNotes !== undefined) set.adminNotes = patch.adminNotes;
    if (patch.status === 'paid' && !before.paidAt) set.paidAt = new Date();
    if (patch.status === 'cancelled' && !before.cancelledAt) set.cancelledAt = new Date();
    if (patch.status === 'completed' && !before.completedAt) set.completedAt = new Date();

    await db.transaction(async (tx) => {
      await tx.update(bookings).set(set).where(eq(bookings.id, id));
      await tx.insert(auditLog).values({
        actorId,
        action: 'booking.update',
        entityType: 'booking',
        entityId: id,
        meta: { diff: { status: { from: before.status, to: patch.status } } },
      });
    });
  },
};
