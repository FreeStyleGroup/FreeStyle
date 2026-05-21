import type { Request, Response, NextFunction } from 'express';
import { tokenService } from '../services/auth/token.service.js';
import { authService } from '../services/auth/auth.service.js';
import { ACCESS_COOKIE } from './cookies.js';

/**
 * Гард: проверяет access-cookie, грузит юзера, кладёт в req.user.
 * Если токена нет или он невалиден — 401 без раскрытия причины.
 *
 * Использование:
 *   router.get('/me', requireAuth, controller.me)
 */
export async function requireAuth(req: Request, res: Response, next: NextFunction): Promise<void> {
  const token = req.cookies?.[ACCESS_COOKIE];
  if (!token) {
    res.status(401).json({ success: false, error: 'Не авторизован' });
    return;
  }
  try {
    const payload = tokenService.verifyAccess(token);
    const user = await authService.getById(payload.sub);
    if (!user || user.status === 'banned') {
      res.status(401).json({ success: false, error: 'Не авторизован' });
      return;
    }
    req.user = user;
    next();
  } catch {
    res.status(401).json({ success: false, error: 'Не авторизован' });
  }
}

/**
 * Опциональный гард: пытается распарсить токен, но не падает 401 если нет.
 * Удобно для эндпоинтов, которые отдают разный контент для гостей/юзеров.
 */
export async function optionalAuth(req: Request, _res: Response, next: NextFunction): Promise<void> {
  const token = req.cookies?.[ACCESS_COOKIE];
  if (!token) return next();
  try {
    const payload = tokenService.verifyAccess(token);
    const user = await authService.getById(payload.sub);
    if (user && user.status !== 'banned') req.user = user;
  } catch {
    /** ignore */
  }
  next();
}
