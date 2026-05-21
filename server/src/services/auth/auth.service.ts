import { and, eq, isNull } from 'drizzle-orm';
import { db } from '../../db/index.js';
import {
  users,
  emailVerifications,
  passwordResets,
  type User,
} from '../../db/schema.js';
import { passwordService } from './password.service.js';
import { tokenService, type TokenPair } from './token.service.js';
import { authEmailService } from './email.service.js';
import type { UserDto } from '@freestyle/shared';

/**
 * Кастомные классы ошибок — контроллер маппит их в HTTP-коды (см. middleware/errorHandler).
 */
export class AuthError extends Error {
  constructor(
    public readonly code:
      | 'EMAIL_TAKEN'
      | 'INVALID_CREDENTIALS'
      | 'USER_NOT_FOUND'
      | 'INVALID_TOKEN'
      | 'TOKEN_EXPIRED'
      | 'EMAIL_NOT_VERIFIED'
      | 'BANNED',
    message: string,
  ) {
    super(message);
    this.name = 'AuthError';
  }
}

const VERIFY_TTL_HOURS = 24;
const RESET_TTL_MINUTES = 60;

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function toDto(u: User): UserDto {
  return {
    id: u.id,
    email: u.email,
    emailVerifiedAt: u.emailVerifiedAt?.toISOString() ?? null,
    name: u.name,
    phone: u.phone,
    avatarUrl: u.avatarUrl,
    role: u.role,
    status: u.status,
    locale: u.locale,
    currency: u.currency,
    tier: u.tier,
    milesBalance: u.milesBalance,
    cashbackBalance: u.cashbackBalance,
    marketingOptIn: u.marketingOptIn,
    preferences: u.preferences,
    createdAt: u.createdAt.toISOString(),
    lastLoginAt: u.lastLoginAt?.toISOString() ?? null,
  };
}

interface RegisterParams {
  email: string;
  password: string;
  name: string;
  marketingOptIn?: boolean;
  locale?: 'ru' | 'en' | 'zh';
  currency?: 'rub' | 'usd' | 'eur' | 'cny' | 'aed';
  userAgent?: string | null;
  ip?: string | null;
}

interface LoginParams {
  email: string;
  password: string;
  userAgent?: string | null;
  ip?: string | null;
}

export const authService = {
  /** Регистрация: создаём user, выдаём пару токенов, отправляем verify-email */
  async register(p: RegisterParams): Promise<{ user: UserDto; tokens: TokenPair }> {
    const emailNormalized = normalizeEmail(p.email);

    const existing = await db.query.users.findFirst({
      where: eq(users.emailNormalized, emailNormalized),
    });
    if (existing) {
      throw new AuthError('EMAIL_TAKEN', 'Пользователь с таким email уже зарегистрирован');
    }

    const passwordHash = await passwordService.hash(p.password);

    const [user] = await db
      .insert(users)
      .values({
        email: p.email.trim(),
        emailNormalized,
        passwordHash,
        name: p.name.trim(),
        marketingOptIn: p.marketingOptIn ?? false,
        locale: p.locale ?? 'ru',
        currency: p.currency ?? 'rub',
      })
      .returning();

    /** Отправляем verification (если SMTP не задан — отлогируется в консоль) */
    await this.sendVerificationEmail(user);

    const tokens = await tokenService.issuePair({
      userId: user.id,
      role: user.role,
      userAgent: p.userAgent,
      ip: p.ip,
    });
    await this.touchLastLogin(user.id, p.ip);

    return { user: toDto(user), tokens };
  },

  async login(p: LoginParams): Promise<{ user: UserDto; tokens: TokenPair }> {
    const emailNormalized = normalizeEmail(p.email);
    const user = await db.query.users.findFirst({
      where: eq(users.emailNormalized, emailNormalized),
    });
    /** Намеренно одинаковый ответ для "юзер не найден" и "неверный пароль" — анти-enum */
    if (!user || !user.passwordHash) {
      throw new AuthError('INVALID_CREDENTIALS', 'Неверный email или пароль');
    }
    if (user.status === 'banned') {
      throw new AuthError('BANNED', 'Учётная запись заблокирована');
    }
    const ok = await passwordService.verify(p.password, user.passwordHash);
    if (!ok) {
      throw new AuthError('INVALID_CREDENTIALS', 'Неверный email или пароль');
    }

    const tokens = await tokenService.issuePair({
      userId: user.id,
      role: user.role,
      userAgent: p.userAgent,
      ip: p.ip,
    });
    await this.touchLastLogin(user.id, p.ip);

    return { user: toDto(user), tokens };
  },

  /** Ротация: проверяем refresh, отзываем его, выдаём новую пару. */
  async refresh(opts: {
    refreshToken: string;
    userAgent?: string | null;
    ip?: string | null;
  }): Promise<{ user: UserDto; tokens: TokenPair }> {
    const decoded = await tokenService.verifyRefresh(opts.refreshToken);
    const user = await db.query.users.findFirst({ where: eq(users.id, decoded.sub) });
    if (!user) throw new AuthError('USER_NOT_FOUND', 'Пользователь не найден');
    if (user.status === 'banned') throw new AuthError('BANNED', 'Учётная запись заблокирована');

    const tokens = await tokenService.issuePair({
      userId: user.id,
      role: user.role,
      userAgent: opts.userAgent,
      ip: opts.ip,
      replacesId: decoded.rowId,
    });
    return { user: toDto(user), tokens };
  },

  async logout(refreshToken: string | undefined): Promise<void> {
    if (!refreshToken) return;
    try {
      const decoded = await tokenService.verifyRefresh(refreshToken);
      await tokenService.revoke(decoded.rowId);
    } catch {
      /** Невалидный refresh — просто пропускаем, всё равно cookies очистим. */
    }
  },

  async getById(userId: string): Promise<UserDto | null> {
    const u = await db.query.users.findFirst({ where: eq(users.id, userId) });
    return u ? toDto(u) : null;
  },

  /** Email-verification: создаём токен, отправляем письмо */
  async sendVerificationEmail(user: User): Promise<void> {
    if (user.emailVerifiedAt) return;
    const { plain, hash } = tokenService.generateOpaqueToken();
    const expiresAt = new Date(Date.now() + VERIFY_TTL_HOURS * 3_600_000);
    await db.insert(emailVerifications).values({
      userId: user.id,
      tokenHash: hash,
      expiresAt,
    });
    await authEmailService.sendVerificationEmail({
      to: user.email,
      name: user.name,
      token: plain,
    });
  },

  async verifyEmail(token: string): Promise<void> {
    const hash = tokenService.hashOpaque(token);
    const row = await db.query.emailVerifications.findFirst({
      where: and(eq(emailVerifications.tokenHash, hash), isNull(emailVerifications.usedAt)),
    });
    if (!row) throw new AuthError('INVALID_TOKEN', 'Неверная или уже использованная ссылка');
    if (row.expiresAt < new Date()) {
      throw new AuthError('TOKEN_EXPIRED', 'Срок ссылки истёк');
    }
    await db.transaction(async (tx) => {
      await tx
        .update(emailVerifications)
        .set({ usedAt: new Date() })
        .where(eq(emailVerifications.id, row.id));
      await tx
        .update(users)
        .set({ emailVerifiedAt: new Date(), updatedAt: new Date() })
        .where(eq(users.id, row.userId));
    });
  },

  /** Запрос на сброс. Намеренно "молчим" если email не найден — анти-enum. */
  async requestPasswordReset(email: string): Promise<void> {
    const emailNormalized = normalizeEmail(email);
    const user = await db.query.users.findFirst({
      where: eq(users.emailNormalized, emailNormalized),
    });
    if (!user) return;
    const { plain, hash } = tokenService.generateOpaqueToken();
    const expiresAt = new Date(Date.now() + RESET_TTL_MINUTES * 60_000);
    await db.insert(passwordResets).values({
      userId: user.id,
      tokenHash: hash,
      expiresAt,
    });
    await authEmailService.sendPasswordResetEmail({
      to: user.email,
      name: user.name,
      token: plain,
    });
  },

  async resetPassword(token: string, newPassword: string): Promise<void> {
    const hash = tokenService.hashOpaque(token);
    const row = await db.query.passwordResets.findFirst({
      where: and(eq(passwordResets.tokenHash, hash), isNull(passwordResets.usedAt)),
    });
    if (!row) throw new AuthError('INVALID_TOKEN', 'Неверная или уже использованная ссылка');
    if (row.expiresAt < new Date()) {
      throw new AuthError('TOKEN_EXPIRED', 'Срок ссылки истёк');
    }
    const passwordHash = await passwordService.hash(newPassword);
    await db.transaction(async (tx) => {
      await tx
        .update(passwordResets)
        .set({ usedAt: new Date() })
        .where(eq(passwordResets.id, row.id));
      await tx
        .update(users)
        .set({ passwordHash, updatedAt: new Date() })
        .where(eq(users.id, row.userId));
    });
    /** Безопасность: при смене пароля отзываем все сессии пользователя. */
    await tokenService.revokeAllForUser(row.userId);
  },

  async touchLastLogin(userId: string, ip: string | null | undefined): Promise<void> {
    await db
      .update(users)
      .set({ lastLoginAt: new Date(), lastLoginIp: ip ?? null })
      .where(eq(users.id, userId));
  },

  toDto,
};
