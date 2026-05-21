import { desc, eq, isNull, and } from 'drizzle-orm';
import { db } from '../../db/index.js';
import { users, refreshTokens } from '../../db/schema.js';
import { passwordService } from '../auth/password.service.js';
import { tokenService } from '../auth/token.service.js';
import { authService, AuthError } from '../auth/auth.service.js';
import type {
  UserDto,
  UpdateProfileRequest,
  UpdateSettingsRequest,
  ChangePasswordRequest,
  SessionDto,
} from '@freestyle/shared';

export const settingsService = {
  async updateProfile(userId: string, dto: UpdateProfileRequest): Promise<UserDto> {
    const patch: Record<string, unknown> = { updatedAt: new Date() };
    if (dto.name !== undefined) patch.name = dto.name.trim();
    if (dto.phone !== undefined) patch.phone = dto.phone?.trim() || null;
    if (dto.avatarUrl !== undefined) patch.avatarUrl = dto.avatarUrl || null;
    const [u] = await db.update(users).set(patch).where(eq(users.id, userId)).returning();
    return authService.toDto(u);
  },

  async updateSettings(userId: string, dto: UpdateSettingsRequest): Promise<UserDto> {
    const patch: Record<string, unknown> = { updatedAt: new Date() };
    if (dto.locale) patch.locale = dto.locale;
    if (dto.currency) patch.currency = dto.currency;
    if (dto.marketingOptIn !== undefined) patch.marketingOptIn = dto.marketingOptIn;
    const [u] = await db.update(users).set(patch).where(eq(users.id, userId)).returning();
    return authService.toDto(u);
  },

  async changePassword(userId: string, dto: ChangePasswordRequest): Promise<void> {
    const user = await db.query.users.findFirst({ where: eq(users.id, userId) });
    if (!user || !user.passwordHash) throw new AuthError('USER_NOT_FOUND', 'Пользователь не найден');
    const ok = await passwordService.verify(dto.currentPassword, user.passwordHash);
    if (!ok) throw new AuthError('INVALID_CREDENTIALS', 'Текущий пароль неверный');
    const passwordHash = await passwordService.hash(dto.newPassword);
    await db
      .update(users)
      .set({ passwordHash, updatedAt: new Date() })
      .where(eq(users.id, userId));
    /** При смене пароля — отзываем все остальные сессии (но текущую можно оставить). */
    await tokenService.revokeAllForUser(userId);
  },

  async listSessions(userId: string, currentRefreshRowId: string | null): Promise<SessionDto[]> {
    const rows = await db.query.refreshTokens.findMany({
      where: and(eq(refreshTokens.userId, userId), isNull(refreshTokens.revokedAt)),
      orderBy: [desc(refreshTokens.createdAt)],
    });
    return rows.map((r) => ({
      id: r.id,
      userAgent: r.userAgent,
      ip: r.ip,
      createdAt: r.createdAt.toISOString(),
      expiresAt: r.expiresAt.toISOString(),
      isCurrent: r.id === currentRefreshRowId,
    }));
  },

  async revokeSession(userId: string, sessionId: string): Promise<boolean> {
    const result = await db
      .update(refreshTokens)
      .set({ revokedAt: new Date() })
      .where(and(eq(refreshTokens.id, sessionId), eq(refreshTokens.userId, userId)))
      .returning({ id: refreshTokens.id });
    return result.length > 0;
  },

  async revokeAllSessionsExceptCurrent(userId: string, currentRowId: string | null): Promise<void> {
    await tokenService.revokeAllForUser(userId);
    /** Если есть текущая сессия — её всё-таки оставляем активной (опционально). */
    if (currentRowId) {
      await db
        .update(refreshTokens)
        .set({ revokedAt: null })
        .where(eq(refreshTokens.id, currentRowId));
    }
  },
};
