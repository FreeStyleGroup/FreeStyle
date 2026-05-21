import type { Request, Response, NextFunction } from 'express';
import type { UserRole } from '@freestyle/shared';

/**
 * RBAC: пропускает только пользователей с одной из перечисленных ролей.
 * Должен идти ПОСЛЕ requireAuth.
 *
 *   router.delete('/posts/:id', requireAuth, requireRole('editor', 'admin'), ...)
 */
export function requireRole(...allowed: UserRole[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ success: false, error: 'Не авторизован' });
      return;
    }
    if (!allowed.includes(req.user.role)) {
      res.status(403).json({ success: false, error: 'Недостаточно прав' });
      return;
    }
    next();
  };
}
