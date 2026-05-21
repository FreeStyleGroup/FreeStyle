import { z } from 'zod';

export const generateIdeasSchema = z.object({
  topic: z.string().trim().min(3).max(500),
  count: z.number().int().min(1).max(10).default(5),
  locale: z.enum(['ru', 'en', 'zh']).default('ru'),
  categoryId: z.string().uuid().optional(),
});

export const updateIdeaStatusSchema = z.object({
  status: z.enum(['draft', 'approved', 'rejected', 'used']),
});

export const ideasListQuerySchema = z.object({
  status: z.enum(['draft', 'approved', 'rejected', 'used']).optional(),
});

export const schedulePublishSchema = z.object({
  postId: z.string().uuid(),
  channel: z.enum(['site', 'telegram', 'dzen', 'vk']),
  scheduledAt: z.string().datetime(),
});
