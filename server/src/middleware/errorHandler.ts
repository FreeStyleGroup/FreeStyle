import type { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { logger } from '../utils/logger.js';

export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction) {
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

  logger.error(err, 'Unhandled error');

  res.status(500).json({
    success: false,
    error: 'Внутренняя ошибка сервера',
  });
}
