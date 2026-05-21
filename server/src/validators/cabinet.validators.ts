import { z } from 'zod';

const isoDateOptional = z.string().datetime().optional();

export const updateProfileSchema = z.object({
  name: z.string().trim().min(2).max(120).optional(),
  phone: z.string().trim().max(32).nullable().optional(),
  avatarUrl: z.string().url().nullable().optional(),
});

export const updateSettingsSchema = z.object({
  locale: z.enum(['ru', 'en', 'zh']).optional(),
  currency: z.enum(['rub', 'usd', 'eur', 'cny', 'aed']).optional(),
  marketingOptIn: z.boolean().optional(),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1).max(200),
  newPassword: z
    .string()
    .min(8, 'Пароль должен быть не короче 8 символов')
    .max(200)
    .refine((p) => /[a-zA-Zа-яА-Я]/.test(p), 'Нужна хотя бы одна буква')
    .refine((p) => /\d/.test(p), 'Нужна хотя бы одна цифра'),
});

export const createDocumentSchema = z.object({
  type: z.enum([
    'passport',
    'foreign_passport',
    'visa',
    'id_card',
    'driver_license',
    'photo',
    'other',
  ]),
  name: z.string().trim().min(1).max(160),
  number: z.string().trim().max(64).optional(),
  issuedAt: isoDateOptional,
  expiresAt: isoDateOptional,
  countryCode: z.string().length(2).optional(),
  fileUrl: z.string().url().optional(),
  meta: z.record(z.unknown()).optional(),
});

export const updateDocumentSchema = createDocumentSchema.partial();

export const addFavoriteSchema = z.object({
  type: z.enum(['flight', 'hotel', 'destination', 'post', 'tour']),
  refId: z.string().min(1).max(160),
  payload: z.record(z.unknown()).default({}),
});
