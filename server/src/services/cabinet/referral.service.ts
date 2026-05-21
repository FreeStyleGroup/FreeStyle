import { randomBytes } from 'node:crypto';
import { desc, eq } from 'drizzle-orm';
import { db } from '../../db/index.js';
import { referrals, referralRedemptions, type Referral } from '../../db/schema.js';
import { config } from '../../config/index.js';
import type { ReferralStatsDto } from '@freestyle/shared';

function generateCode(): string {
  /** 8 символов base36, читаемо. Достаточно для ~2.8 трлн комбинаций. */
  return randomBytes(6).toString('base64url').slice(0, 8).toUpperCase();
}

async function getOrCreateReferral(userId: string): Promise<Referral> {
  const existing = await db.query.referrals.findFirst({ where: eq(referrals.ownerId, userId) });
  if (existing) return existing;
  /** Retry-loop на случай маловероятной коллизии кода */
  for (let attempt = 0; attempt < 5; attempt++) {
    try {
      const [created] = await db
        .insert(referrals)
        .values({ ownerId: userId, code: generateCode() })
        .returning();
      return created;
    } catch {
      /** уникальный индекс — пробуем ещё */
    }
  }
  throw new Error('Не удалось сгенерировать уникальный реф-код');
}

export const referralService = {
  async getStats(userId: string): Promise<ReferralStatsDto> {
    const ref = await getOrCreateReferral(userId);

    const redemptions = await db.query.referralRedemptions.findMany({
      where: eq(referralRedemptions.referralId, ref.id),
      orderBy: [desc(referralRedemptions.createdAt)],
      limit: 10,
    });

    const invitedUserIds = redemptions.map((r) => r.invitedUserId);
    const invited = invitedUserIds.length
      ? await db.query.users.findMany({
          where: (u, { inArray }) => inArray(u.id, invitedUserIds),
          columns: { id: true, name: true },
        })
      : [];
    const nameById = new Map(invited.map((u) => [u.id, u.name]));

    return {
      code: ref.code,
      shareUrl: `${config.clientUrl}/?ref=${ref.code}`,
      signupsCount: ref.signupsCount,
      bookingsCount: ref.bookingsCount,
      totalMilesEarned: ref.totalMilesEarned,
      recentRedemptions: redemptions.map((r) => ({
        invitedName: nameById.get(r.invitedUserId) ?? '—',
        invitedAt: r.createdAt.toISOString(),
        awardedAt: r.awardedAt?.toISOString() ?? null,
        milesAwarded: r.milesAwarded,
      })),
    };
  },

  /** Используется при регистрации, если в payload пришёл ?ref=... */
  async recordSignup(invitedUserId: string, code: string): Promise<void> {
    const ref = await db.query.referrals.findFirst({ where: eq(referrals.code, code) });
    if (!ref || ref.ownerId === invitedUserId) return;
    await db.transaction(async (tx) => {
      await tx.insert(referralRedemptions).values({
        referralId: ref.id,
        invitedUserId,
      }).onConflictDoNothing();
      await tx
        .update(referrals)
        .set({ signupsCount: ref.signupsCount + 1 })
        .where(eq(referrals.id, ref.id));
    });
  },
};
