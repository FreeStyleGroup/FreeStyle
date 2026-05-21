import bcrypt from 'bcryptjs';
import { config } from '../../config/index.js';

/**
 * Bcrypt-обёртки с cost-фактором из конфига.
 * Cost=10 для dev (≈100мс), 12 для prod (≈250мс) — рекомендация OWASP 2025.
 */
export const passwordService = {
  hash(plain: string): Promise<string> {
    return bcrypt.hash(plain, config.bcrypt.cost);
  },

  verify(plain: string, hash: string): Promise<boolean> {
    return bcrypt.compare(plain, hash);
  },

  /** Проверка по политике паролей. Используется в Zod-валидаторах. */
  isStrongEnough(plain: string): { ok: true } | { ok: false; reason: string } {
    if (plain.length < 8) return { ok: false, reason: 'пароль короче 8 символов' };
    if (plain.length > 200) return { ok: false, reason: 'пароль длиннее 200 символов' };
    if (!/[a-zA-Zа-яА-Я]/.test(plain)) return { ok: false, reason: 'нужна хотя бы одна буква' };
    if (!/\d/.test(plain)) return { ok: false, reason: 'нужна хотя бы одна цифра' };
    return { ok: true };
  },
};
