import type { Response, CookieOptions } from 'express';
import { config } from '../config/index.js';
import { tokenService } from '../services/auth/token.service.js';

export const ACCESS_COOKIE = 'fs_access';
export const REFRESH_COOKIE = 'fs_refresh';

/**
 * Унифицированные настройки cookies. SameSite=Lax — компромисс между
 * безопасностью и удобством (работает при кликах с email-ссылок).
 * Для прода нужен HTTPS — COOKIE_SECURE=true.
 */
function baseOptions(): CookieOptions {
  return {
    httpOnly: true,
    secure: config.cookie.secure,
    sameSite: 'lax',
    domain: config.cookie.domain,
    path: '/',
  };
}

export function setAuthCookies(
  res: Response,
  tokens: { accessToken: string; refreshToken: string },
): void {
  res.cookie(ACCESS_COOKIE, tokens.accessToken, {
    ...baseOptions(),
    maxAge: tokenService.ACCESS_TTL_SEC * 1000,
  });
  res.cookie(REFRESH_COOKIE, tokens.refreshToken, {
    ...baseOptions(),
    /** Refresh-cookie доступна только на /api/auth/* — уменьшаем surface attack. */
    path: '/api/auth',
    maxAge: tokenService.REFRESH_TTL_SEC * 1000,
  });
}

export function clearAuthCookies(res: Response): void {
  res.clearCookie(ACCESS_COOKIE, { ...baseOptions() });
  res.clearCookie(REFRESH_COOKIE, { ...baseOptions(), path: '/api/auth' });
}
