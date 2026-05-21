import { desc, eq, gte, inArray } from 'drizzle-orm';
import { db } from '../../db/index.js';
import { bookings, type Booking } from '../../db/schema.js';
import type { BookingSummaryDto } from '@freestyle/shared';

function titleFor(b: Booking): string {
  const payload = b.payload as { title?: string; route?: { from?: string; to?: string }; startsAt?: string };
  if (payload.title) return payload.title;
  if (payload.route?.from && payload.route?.to) {
    return `${payload.route.from} → ${payload.route.to}`;
  }
  return `Заказ ${b.publicId}`;
}

function toDto(b: Booking): BookingSummaryDto {
  const payload = b.payload as { startsAt?: string };
  return {
    id: b.id,
    publicId: b.publicId,
    type: b.type,
    status: b.status,
    amount: b.amount,
    currency: b.currency,
    title: titleFor(b),
    startsAt: payload.startsAt ?? null,
    createdAt: b.createdAt.toISOString(),
  };
}

export const bookingsService = {
  async listForUser(userId: string): Promise<BookingSummaryDto[]> {
    const rows = await db.query.bookings.findMany({
      where: eq(bookings.userId, userId),
      orderBy: [desc(bookings.createdAt)],
    });
    return rows.map(toDto);
  },

  async listUpcoming(userId: string): Promise<BookingSummaryDto[]> {
    /** Активные брони, по которым ждём поездку: оплаченные/подтверждённые */
    const rows = await db.query.bookings.findMany({
      where: eq(bookings.userId, userId),
      orderBy: [desc(bookings.createdAt)],
    });
    return rows
      .filter((b) => b.status === 'paid' || b.status === 'confirmed')
      .map(toDto);
  },
};
