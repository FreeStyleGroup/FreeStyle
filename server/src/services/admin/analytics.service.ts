import { and, gte, sql, inArray } from 'drizzle-orm';
import { db } from '../../db/index.js';
import { users, bookings } from '../../db/schema.js';
import type { AdminAnalyticsResponse, SeriesPoint } from '@freestyle/shared';

const DAY_MS = 86_400_000;

function startOfDay(d: Date): Date {
  const x = new Date(d);
  x.setUTCHours(0, 0, 0, 0);
  return x;
}

function dateRange(daysBack: number): { from: Date; days: string[] } {
  const today = startOfDay(new Date());
  const from = new Date(today.getTime() - daysBack * DAY_MS);
  const days: string[] = [];
  for (let i = 0; i <= daysBack; i++) {
    days.push(new Date(from.getTime() + i * DAY_MS).toISOString().slice(0, 10));
  }
  return { from, days };
}

export const adminAnalyticsService = {
  async overview(): Promise<AdminAnalyticsResponse> {
    const now = new Date();
    const day30 = new Date(now.getTime() - 30 * DAY_MS);
    const day7 = new Date(now.getTime() - 7 * DAY_MS);

    const [totalUsers, newUsers7d, newUsers30d, totalRevenue, byStatus, regRows, revRows] = await Promise.all([
      db.select({ c: sql<number>`count(*)::int` }).from(users),
      db.select({ c: sql<number>`count(*)::int` }).from(users).where(gte(users.createdAt, day7)),
      db.select({ c: sql<number>`count(*)::int` }).from(users).where(gte(users.createdAt, day30)),
      db
        .select({ sum: sql<string>`coalesce(sum(${bookings.amount}), 0)::text` })
        .from(bookings)
        .where(inArray(bookings.status, ['paid', 'completed'])),
      db
        .select({ status: bookings.status, count: sql<number>`count(*)::int` })
        .from(bookings)
        .groupBy(bookings.status),
      db
        .select({
          day: sql<string>`to_char(date_trunc('day', ${users.createdAt}), 'YYYY-MM-DD')`,
          c: sql<number>`count(*)::int`,
        })
        .from(users)
        .where(gte(users.createdAt, day30))
        .groupBy(sql`date_trunc('day', ${users.createdAt})`),
      db
        .select({
          day: sql<string>`to_char(date_trunc('day', ${bookings.createdAt}), 'YYYY-MM-DD')`,
          sum: sql<string>`coalesce(sum(${bookings.amount}), 0)::text`,
        })
        .from(bookings)
        .where(and(gte(bookings.createdAt, day30), inArray(bookings.status, ['paid', 'completed'])))
        .groupBy(sql`date_trunc('day', ${bookings.createdAt})`),
    ]);

    const { days } = dateRange(30);
    const regMap = new Map(regRows.map((r) => [r.day, r.c]));
    const revMap = new Map(revRows.map((r) => [r.day, Number(r.sum)]));
    const registrationsLast30d: SeriesPoint[] = days.map((d) => ({ date: d, value: regMap.get(d) ?? 0 }));
    const revenueLast30d: SeriesPoint[] = days.map((d) => ({ date: d, value: revMap.get(d) ?? 0 }));

    return {
      cards: [
        { label: 'Всего пользователей', value: totalUsers[0]?.c ?? 0, hint: 'за всё время' },
        { label: 'Регистрации (7 дней)', value: newUsers7d[0]?.c ?? 0 },
        { label: 'Регистрации (30 дней)', value: newUsers30d[0]?.c ?? 0 },
        {
          label: 'Выручка',
          value: Number(totalRevenue[0]?.sum ?? 0).toLocaleString('ru-RU'),
          hint: 'оплаченные + завершённые',
        },
      ],
      registrationsLast30d,
      revenueLast30d,
      bookingsByStatus: byStatus,
      /** Топ направлений — будет реализован, когда payload.route.to стандартизируется (Phase 5+) */
      topDestinations: [],
    };
  },
};
