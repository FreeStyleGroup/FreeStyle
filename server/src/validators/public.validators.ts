import { z } from 'zod';

export const publicPostsQuerySchema = z.object({
  locale: z.enum(['ru', 'en', 'zh']).optional(),
  category: z.string().min(1).max(120).optional(),
  tag: z.string().min(1).max(40).optional(),
  q: z.string().max(200).optional(),
  page: z.coerce.number().int().min(1).optional(),
  pageSize: z.coerce.number().int().min(1).max(50).optional(),
});

export const contactSchema = z.object({
  name: z.string().trim().min(2, 'Имя — минимум 2 символа').max(120),
  email: z.string().trim().toLowerCase().email('Некорректный email').max(320),
  phone: z.string().trim().max(32).optional(),
  subject: z.string().trim().max(200).optional(),
  message: z.string().trim().min(10, 'Сообщение — минимум 10 символов').max(5000),
  sourcePage: z.string().max(500).optional(),
});
