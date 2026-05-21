/**
 * Auth-related DTO/типы для клиента и сервера.
 * Enum-значения вручную дублируют pgEnum'ы в server/src/db/schema.ts —
 * это сознательное решение, чтобы shared не зависел от drizzle/postgres.
 */

export type UserRole = 'user' | 'editor' | 'admin';
export type UserStatus = 'active' | 'banned' | 'pending';
export type Locale = 'ru' | 'en' | 'zh';
export type Currency = 'rub' | 'usd' | 'eur' | 'cny' | 'aed';

/** Публичный DTO пользователя — без passwordHash и других чувствительных полей */
export interface UserDto {
  id: string;
  email: string;
  emailVerifiedAt: string | null;
  name: string;
  phone: string | null;
  avatarUrl: string | null;
  role: UserRole;
  status: UserStatus;
  locale: Locale;
  currency: Currency;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  milesBalance: number;
  cashbackBalance: string;
  marketingOptIn: boolean;
  preferences: Record<string, unknown>;
  createdAt: string;
  lastLoginAt: string | null;
}

/** Ответ /api/auth/me, /api/auth/login, /api/auth/register */
export interface AuthMeResponse {
  user: UserDto;
}

/** Тело запроса /api/auth/register */
export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  marketingOptIn?: boolean;
  locale?: Locale;
  currency?: Currency;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
}

export interface VerifyEmailRequest {
  token: string;
}
