import { z } from 'zod';

/**
 * Zod-валидаторы запросов /api/auth/*. Используются в контроллерах через .parse() —
 * любая ошибка валидации → 400 с подробным error.issues, который маппит errorHandler.
 */

const emailField = z.string().trim().toLowerCase().email('Некорректный email').max(320);

const passwordField = z
  .string()
  .min(8, 'Пароль должен быть не короче 8 символов')
  .max(200)
  .refine((p) => /[a-zA-Zа-яА-Я]/.test(p), 'Нужна хотя бы одна буква')
  .refine((p) => /\d/.test(p), 'Нужна хотя бы одна цифра');

export const registerSchema = z.object({
  email: emailField,
  password: passwordField,
  name: z.string().trim().min(2, 'Имя должно быть не короче 2 символов').max(120),
  marketingOptIn: z.boolean().optional(),
  locale: z.enum(['ru', 'en', 'zh']).optional(),
  currency: z.enum(['rub', 'usd', 'eur', 'cny', 'aed']).optional(),
});

export const loginSchema = z.object({
  email: emailField,
  password: z.string().min(1).max(200),
});

export const forgotPasswordSchema = z.object({
  email: emailField,
});

export const resetPasswordSchema = z.object({
  token: z.string().min(32).max(256),
  password: passwordField,
});

export const verifyEmailSchema = z.object({
  token: z.string().min(32).max(256),
});

export type RegisterDto = z.infer<typeof registerSchema>;
export type LoginDto = z.infer<typeof loginSchema>;
export type ForgotPasswordDto = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordDto = z.infer<typeof resetPasswordSchema>;
export type VerifyEmailDto = z.infer<typeof verifyEmailSchema>;
