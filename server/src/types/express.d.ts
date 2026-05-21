import type { UserDto } from '@freestyle/shared';

declare global {
  namespace Express {
    interface Request {
      /** Заполняется в requireAuth-middleware из access-cookie. */
      user?: UserDto;
    }
  }
}

export {};
