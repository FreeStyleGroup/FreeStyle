import { z } from 'zod';

export const updateUserSchema = z.object({
  role: z.enum(['user', 'editor', 'admin']).optional(),
  status: z.enum(['active', 'banned', 'pending']).optional(),
  name: z.string().trim().min(2).max(120).optional(),
  milesAdjustment: z
    .object({
      amount: z.number().int().min(-1_000_000).max(1_000_000),
      description: z.string().min(1).max(500),
    })
    .optional(),
});

export const updateOrderSchema = z.object({
  status: z.enum(['pending', 'confirmed', 'paid', 'cancelled', 'completed', 'refunded']),
  adminNotes: z.string().max(2000).optional(),
});

const localeSchema = z.enum(['ru', 'en', 'zh']);
const postStatusSchema = z.enum(['draft', 'scheduled', 'published', 'archived']);

export const createPostSchema = z.object({
  slug: z.string().trim().min(1).max(160).regex(/^[a-z0-9-]+$/i, 'slug: только латиница, цифры и дефис'),
  locale: localeSchema,
  title: z.string().trim().min(1).max(300),
  excerpt: z.string().max(1000).optional(),
  contentMd: z.string().min(1),
  coverUrl: z.string().url().optional(),
  categoryId: z.string().uuid().nullable().optional(),
  status: postStatusSchema.optional(),
  publishedAt: z.string().datetime().nullable().optional(),
  scheduledAt: z.string().datetime().nullable().optional(),
  seoTitle: z.string().max(300).optional(),
  seoDescription: z.string().max(1000).optional(),
  seoKeywords: z.string().max(500).optional(),
  tags: z.array(z.string().min(1).max(40)).max(20).optional(),
});

export const updatePostSchema = createPostSchema.partial();

export const createCategorySchema = z.object({
  slug: z.string().trim().min(1).max(120).regex(/^[a-z0-9-]+$/i),
  name: z.string().trim().min(1).max(160),
  description: z.string().max(1000).optional(),
  parentId: z.string().uuid().nullable().optional(),
  sortOrder: z.number().int().min(0).max(10_000).optional(),
  locale: localeSchema,
});

export const updateCategorySchema = createCategorySchema.partial();

export const usersListQuerySchema = z.object({
  q: z.string().optional(),
  role: z.enum(['user', 'editor', 'admin']).optional(),
  status: z.enum(['active', 'banned', 'pending']).optional(),
  page: z.coerce.number().int().min(1).optional(),
  pageSize: z.coerce.number().int().min(1).max(100).optional(),
});

export const ordersListQuerySchema = z.object({
  q: z.string().optional(),
  status: z.enum(['pending', 'confirmed', 'paid', 'cancelled', 'completed', 'refunded']).optional(),
  type: z.enum(['flight', 'hotel', 'tour', 'visa', 'transfer', 'insurance']).optional(),
  page: z.coerce.number().int().min(1).optional(),
  pageSize: z.coerce.number().int().min(1).max(100).optional(),
});

export const postsListQuerySchema = z.object({
  status: postStatusSchema.optional(),
  page: z.coerce.number().int().min(1).optional(),
  pageSize: z.coerce.number().int().min(1).max(100).optional(),
});
