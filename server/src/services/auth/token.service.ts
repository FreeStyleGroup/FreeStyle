import { createHash, randomBytes, randomUUID } from 'node:crypto';
import jwt, { type SignOptions } from 'jsonwebtoken';
import { eq } from 'drizzle-orm';
import { db } from '../../db/index.js';
import { refreshTokens } from '../../db/schema.js';
import { config } from '../../config/index.js';
import { logger } from '../../utils/logger.js';

/**
 * Access-token payload — компактный, читается на каждом запросе.
 * Намеренно НЕ кладём sensitive-поля, только id + role для middleware-проверок.
 */
export interface AccessTokenPayload {
  sub: string;
  role: 'user' | 'editor' | 'admin';
  type: 'access';
}

/**
 * Refresh-token payload — содержит jti, который маппится на строку в refresh_tokens.
 * Сам токен мы храним как sha256-хеш, в JWT же jti — это PK строки.
 */
export interface RefreshTokenPayload {
  sub: string;
  jti: string;
  type: 'refresh';
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
  refreshRowId: string;
}

function sha256(input: string): string {
  return createHash('sha256').update(input).digest('hex');
}

function parseTtlToSeconds(ttl: string): number {
  /** Поддержка форматов "15m", "30d", "12h", "3600" */
  const match = /^(\d+)([smhd])?$/.exec(ttl.trim());
  if (!match) throw new Error(`Invalid TTL format: ${ttl}`);
  const value = Number(match[1]);
  const unit = match[2] ?? 's';
  switch (unit) {
    case 's': return value;
    case 'm': return value * 60;
    case 'h': return value * 3_600;
    case 'd': return value * 86_400;
    default:  return value;
  }
}

const ACCESS_TTL_SEC = parseTtlToSeconds(config.jwt.accessTtl);
const REFRESH_TTL_SEC = parseTtlToSeconds(config.jwt.refreshTtl);

interface IssueOptions {
  userId: string;
  role: AccessTokenPayload['role'];
  userAgent?: string | null;
  ip?: string | null;
  /** Если ротация — id предыдущей строки, которая будет помечена replacedBy */
  replacesId?: string;
}

export const tokenService = {
  ACCESS_TTL_SEC,
  REFRESH_TTL_SEC,

  /** Создать новую пару токенов и записать refresh в БД. */
  async issuePair(opts: IssueOptions): Promise<TokenPair> {
    const refreshRowId = randomUUID();
    const refreshPayload: RefreshTokenPayload = {
      sub: opts.userId,
      jti: refreshRowId,
      type: 'refresh',
    };
    const accessPayload: AccessTokenPayload = {
      sub: opts.userId,
      role: opts.role,
      type: 'access',
    };

    const accessOpts: SignOptions = { expiresIn: ACCESS_TTL_SEC };
    const refreshOpts: SignOptions = { expiresIn: REFRESH_TTL_SEC };

    const accessToken = jwt.sign(accessPayload, config.jwt.accessSecret, accessOpts);
    const refreshToken = jwt.sign(refreshPayload, config.jwt.refreshSecret, refreshOpts);

    const expiresAt = new Date(Date.now() + REFRESH_TTL_SEC * 1000);

    await db.insert(refreshTokens).values({
      id: refreshRowId,
      userId: opts.userId,
      tokenHash: sha256(refreshToken),
      userAgent: opts.userAgent ?? null,
      ip: opts.ip ?? null,
      expiresAt,
    });

    if (opts.replacesId) {
      await db
        .update(refreshTokens)
        .set({ revokedAt: new Date(), replacedById: refreshRowId })
        .where(eq(refreshTokens.id, opts.replacesId));
    }

    return { accessToken, refreshToken, refreshRowId };
  },

  /** Верифицировать access-token. Бросает при невалидном токене. */
  verifyAccess(token: string): AccessTokenPayload {
    const decoded = jwt.verify(token, config.jwt.accessSecret) as AccessTokenPayload;
    if (decoded.type !== 'access') throw new Error('Wrong token type');
    return decoded;
  },

  /** Верифицировать refresh-token + сверить с БД. Бросает при невалидном. */
  async verifyRefresh(token: string): Promise<RefreshTokenPayload & { rowId: string }> {
    const decoded = jwt.verify(token, config.jwt.refreshSecret) as RefreshTokenPayload;
    if (decoded.type !== 'refresh') throw new Error('Wrong token type');

    const row = await db.query.refreshTokens.findFirst({
      where: eq(refreshTokens.id, decoded.jti),
    });
    if (!row) throw new Error('Refresh row not found');
    if (row.tokenHash !== sha256(token)) throw new Error('Token hash mismatch');
    if (row.revokedAt) {
      /** Если кто-то предъявил уже отозванный refresh — это потенциальный re-use.
       *  Отзываем весь chain пользователя в качестве меры безопасности. */
      logger.warn(
        { userId: row.userId, jti: decoded.jti },
        'Refresh token reuse detected — revoking all tokens for user',
      );
      await this.revokeAllForUser(row.userId);
      throw new Error('Refresh token already revoked (chain revoked)');
    }
    if (row.expiresAt < new Date()) throw new Error('Refresh token expired');
    return { ...decoded, rowId: row.id };
  },

  /** Отозвать конкретную refresh-строку (например, при logout) */
  async revoke(rowId: string): Promise<void> {
    await db
      .update(refreshTokens)
      .set({ revokedAt: new Date() })
      .where(eq(refreshTokens.id, rowId));
  },

  /** Отозвать ВСЕ refresh-токены пользователя (logout всех устройств / reuse-инцидент) */
  async revokeAllForUser(userId: string): Promise<void> {
    await db
      .update(refreshTokens)
      .set({ revokedAt: new Date() })
      .where(eq(refreshTokens.userId, userId));
  },

  /** Случайный токен для email-verification / password-reset (32 байта → 64 hex) */
  generateOpaqueToken(): { plain: string; hash: string } {
    const plain = randomBytes(32).toString('hex');
    return { plain, hash: sha256(plain) };
  },

  hashOpaque(plain: string): string {
    return sha256(plain);
  },
};
