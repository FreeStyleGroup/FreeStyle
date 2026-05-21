import type { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { logger } from '../utils/logger.js';
import { AuthError } from '../services/auth/auth.service.js';

const AUTH_STATUS: Record<AuthError['code'], number> = {
  EMAIL_TAKEN: 409,
  INVALID_CREDENTIALS: 401,
  USER_NOT_FOUND: 404,
  INVALID_TOKEN: 400,
  TOKEN_EXPIRED: 410,
  EMAIL_NOT_VERIFIED: 403,
  BANNED: 403,
};

export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction): void {
  if (err instanceof ZodError) {
    res.status(400).json({
      success: false,
      error: 'Некорректные параметры запроса',
      details: err.errors.map((e) => ({
        field: e.path.join('.'),
        message: e.message,
      })),
    });
    return;
  }

  if (err instanceof AuthError) {
    res.status(AUTH_STATUS[err.code]).json({
      success: false,
      code: err.code,
      error: err.message,
    });
    return;
  }

  logger.error(err, 'Unhandled error');
  res.status(500).json({
    success: false,
    error: 'Внутренняя ошибка сервера',
  });
}
