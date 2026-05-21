import { and, desc, eq, sql } from 'drizzle-orm';
import { db } from '../../db/index.js';
import { users, walletTransactions, type WalletTransaction } from '../../db/schema.js';
import type { UserTier, WalletSummaryDto, WalletTxnDto } from '@freestyle/shared';

const TIER_THRESHOLDS: Record<UserTier, number> = {
  bronze: 0,
  silver: 1_000,
  gold: 5_000,
  platinum: 20_000,
};

const TIER_ORDER: UserTier[] = ['bronze', 'silver', 'gold', 'platinum'];

function nextTierInfo(currentTier: UserTier, milesBalance: number) {
  const idx = TIER_ORDER.indexOf(currentTier);
  const next = TIER_ORDER[idx + 1] ?? null;
  if (!next) return { nextTier: null, milesToNextTier: null };
  return {
    nextTier: next,
    milesToNextTier: Math.max(0, TIER_THRESHOLDS[next] - milesBalance),
  };
}

function txnToDto(t: WalletTransaction): WalletTxnDto {
  return {
    id: t.id,
    kind: t.kind,
    type: t.type,
    amount: t.amount,
    currency: t.currency,
    description: t.description,
    bookingId: t.bookingId,
    createdAt: t.createdAt.toISOString(),
  };
}

export const walletService = {
  async getSummary(userId: string): Promise<WalletSummaryDto> {
    const user = await db.query.users.findFirst({ where: eq(users.id, userId) });
    if (!user) throw new Error('User not found');

    const txns = await db.query.walletTransactions.findMany({
      where: eq(walletTransactions.userId, userId),
      orderBy: [desc(walletTransactions.createdAt)],
      limit: 5,
    });

    return {
      tier: user.tier,
      milesBalance: user.milesBalance,
      cashbackBalance: user.cashbackBalance,
      ...nextTierInfo(user.tier, user.milesBalance),
      recentTransactions: txns.map(txnToDto),
    };
  },

  async listTransactions(userId: string, opts: { limit?: number; kind?: 'miles' | 'cashback' } = {}): Promise<WalletTxnDto[]> {
    const conditions = [eq(walletTransactions.userId, userId)];
    if (opts.kind) conditions.push(eq(walletTransactions.kind, opts.kind));
    const txns = await db.query.walletTransactions.findMany({
      where: and(...conditions),
      orderBy: [desc(walletTransactions.createdAt)],
      limit: opts.limit ?? 100,
    });
    return txns.map(txnToDto);
  },

  /** Используется при оплате брони (Phase 4+): начислить миль/кэшбэк. */
  async accrueFromBooking(opts: {
    userId: string;
    bookingId: string;
    miles?: number;
    cashbackAmount?: string;
    currency?: 'rub' | 'usd' | 'eur' | 'cny' | 'aed';
    description: string;
  }): Promise<void> {
    await db.transaction(async (tx) => {
      if (opts.miles && opts.miles > 0) {
        await tx.insert(walletTransactions).values({
          userId: opts.userId,
          kind: 'miles',
          type: 'accrual',
          amount: String(opts.miles),
          currency: null,
          description: opts.description,
          bookingId: opts.bookingId,
        });
        await tx
          .update(users)
          .set({ milesBalance: sql`${users.milesBalance} + ${opts.miles}` })
          .where(eq(users.id, opts.userId));
      }
      if (opts.cashbackAmount && opts.currency) {
        await tx.insert(walletTransactions).values({
          userId: opts.userId,
          kind: 'cashback',
          type: 'accrual',
          amount: opts.cashbackAmount,
          currency: opts.currency,
          description: opts.description,
          bookingId: opts.bookingId,
        });
        await tx
          .update(users)
          .set({ cashbackBalance: sql`${users.cashbackBalance} + ${opts.cashbackAmount}::numeric` })
          .where(eq(users.id, opts.userId));
      }
    });
  },
};
