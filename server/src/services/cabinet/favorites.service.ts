import { and, desc, eq } from 'drizzle-orm';
import { db } from '../../db/index.js';
import { favorites, type Favorite } from '../../db/schema.js';
import type { FavoriteDto } from '@freestyle/shared';

function toDto(f: Favorite): FavoriteDto {
  return {
    type: f.type,
    refId: f.refId,
    payload: f.payload,
    createdAt: f.createdAt.toISOString(),
  };
}

export const favoritesService = {
  async list(userId: string): Promise<FavoriteDto[]> {
    const rows = await db.query.favorites.findMany({
      where: eq(favorites.userId, userId),
      orderBy: [desc(favorites.createdAt)],
    });
    return rows.map(toDto);
  },

  async add(userId: string, payload: Omit<FavoriteDto, 'createdAt'>): Promise<void> {
    /** ON CONFLICT DO NOTHING — таблица композитным PK защищает от дублей */
    await db
      .insert(favorites)
      .values({
        userId,
        type: payload.type,
        refId: payload.refId,
        payload: payload.payload,
      })
      .onConflictDoNothing();
  },

  async remove(userId: string, type: FavoriteDto['type'], refId: string): Promise<void> {
    await db
      .delete(favorites)
      .where(and(
        eq(favorites.userId, userId),
        eq(favorites.type, type),
        eq(favorites.refId, refId),
      ));
  },

  async count(userId: string): Promise<number> {
    const rows = await db.query.favorites.findMany({
      where: eq(favorites.userId, userId),
    });
    return rows.length;
  },
};
