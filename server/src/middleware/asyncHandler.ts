import type { Request, Response, NextFunction, RequestHandler } from 'express';

/**
 * Express не передаёт async-ошибки в errorHandler автоматически.
 * Эта обёртка делает это за нас — все наши контроллеры пишутся как async и
 * заворачиваются в asyncHandler.
 */
export function asyncHandler<T extends Request = Request>(
  fn: (req: T, res: Response, next: NextFunction) => Promise<unknown>,
): RequestHandler {
  return (req, res, next) => {
    Promise.resolve(fn(req as T, res, next)).catch(next);
  };
}
