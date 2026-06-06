import type { Request, Response } from 'express';
import { config } from '../config/index.js';
import { authService } from '../services/auth/auth.service.js';
import { setAuthCookies, clearAuthCookies, REFRESH_COOKIE } from '../middleware/cookies.js';
import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  verifyEmailSchema,
} from '../validators/auth.validators.js';

function clientMeta(req: Request): { userAgent: string | null; ip: string | null } {
  return {
    userAgent: req.headers['user-agent'] ?? null,
    ip: (req.headers['x-forwarded-for']?.toString().split(',')[0].trim()
      ?? req.socket.remoteAddress
      ?? null),
  };
}

export const authController = {
  async register(req: Request, res: Response): Promise<void> {
    if (!config.registrationOpen) {
      res.status(403).json({ success: false, error: 'Регистрация новых пользователей временно закрыта' });
      return;
    }
    const dto = registerSchema.parse(req.body);
    const meta = clientMeta(req);
    const { user, tokens } = await authService.register({ ...dto, ...meta });
    setAuthCookies(res, tokens);
    res.status(201).json({ success: true, user });
  },

  async login(req: Request, res: Response): Promise<void> {
    const dto = loginSchema.parse(req.body);
    const meta = clientMeta(req);
    const { user, tokens } = await authService.login({ ...dto, ...meta });
    setAuthCookies(res, tokens);
    res.json({ success: true, user });
  },

  async refresh(req: Request, res: Response): Promise<void> {
    const refreshToken = req.cookies?.[REFRESH_COOKIE] as string | undefined;
    if (!refreshToken) {
      res.status(401).json({ success: false, error: 'Нет refresh-токена' });
      return;
    }
    const meta = clientMeta(req);
    try {
      const { user, tokens } = await authService.refresh({ refreshToken, ...meta });
      setAuthCookies(res, tokens);
      res.json({ success: true, user });
    } catch {
      clearAuthCookies(res);
      res.status(401).json({ success: false, error: 'Невалидный refresh-токен' });
    }
  },

  async logout(req: Request, res: Response): Promise<void> {
    const refreshToken = req.cookies?.[REFRESH_COOKIE] as string | undefined;
    await authService.logout(refreshToken);
    clearAuthCookies(res);
    res.json({ success: true });
  },

  async me(req: Request, res: Response): Promise<void> {
    /** requireAuth заполняет req.user — если попали сюда, юзер точно есть. */
    res.json({ success: true, user: req.user });
  },

  async forgotPassword(req: Request, res: Response): Promise<void> {
    const { email } = forgotPasswordSchema.parse(req.body);
    await authService.requestPasswordReset(email);
    /** Намеренно одинаковый ответ — анти-enum по существующим email'ам */
    res.json({
      success: true,
      message: 'Если такой email зарегистрирован — на него отправлено письмо',
    });
  },

  async resetPassword(req: Request, res: Response): Promise<void> {
    const { token, password } = resetPasswordSchema.parse(req.body);
    await authService.resetPassword(token, password);
    res.json({ success: true });
  },

  async verifyEmail(req: Request, res: Response): Promise<void> {
    const { token } = verifyEmailSchema.parse(req.body);
    await authService.verifyEmail(token);
    res.json({ success: true });
  },
};
