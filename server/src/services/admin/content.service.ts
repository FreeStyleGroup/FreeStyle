import { and, desc, eq, sql, type SQL } from 'drizzle-orm';
import MarkdownIt from 'markdown-it';
import { db } from '../../db/index.js';
import { posts, categories, auditLog, type Post, type Category } from '../../db/schema.js';
import type {
  AdminPostsListResponse,
  AdminPostDto,
  AdminPostListItem,
  CreatePostRequest,
  UpdatePostRequest,
  AdminCategoryDto,
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from '@freestyle/shared';

const md = new MarkdownIt({ html: false, linkify: true, breaks: false });

/** Грубая оценка времени чтения (200 wpm). */
function readingMinutes(text: string): number {
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

function toListItem(p: Post): AdminPostListItem {
  return {
    id: p.id,
    slug: p.slug,
    locale: p.locale,
    title: p.title,
    status: p.status,
    authorId: p.authorId,
    categoryId: p.categoryId,
    publishedAt: p.publishedAt?.toISOString() ?? null,
    scheduledAt: p.scheduledAt?.toISOString() ?? null,
    viewsCount: p.viewsCount,
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
  };
}

function toFullDto(p: Post): AdminPostDto {
  return {
    ...toListItem(p),
    excerpt: p.excerpt,
    contentMd: p.contentMd,
    contentHtml: p.contentHtml,
    coverUrl: p.coverUrl,
    seoTitle: p.seoTitle,
    seoDescription: p.seoDescription,
    seoKeywords: p.seoKeywords,
    readingMinutes: p.readingMinutes,
    tags: p.tags,
  };
}

function toCategoryDto(c: Category): AdminCategoryDto {
  return {
    id: c.id,
    slug: c.slug,
    name: c.name,
    description: c.description,
    parentId: c.parentId,
    sortOrder: c.sortOrder,
    locale: c.locale,
    createdAt: c.createdAt.toISOString(),
  };
}

export const adminContentService = {
  /* ── POSTS ── */

  async listPosts(q: { page?: number; pageSize?: number; status?: 'draft' | 'scheduled' | 'published' | 'archived' } = {}): Promise<AdminPostsListResponse> {
    const page = Math.max(1, q.page ?? 1);
    const pageSize = Math.min(100, Math.max(1, q.pageSize ?? 20));
    const offset = (page - 1) * pageSize;
    const conditions: SQL[] = [];
    if (q.status) conditions.push(eq(posts.status, q.status));
    const where = conditions.length ? and(...conditions) : undefined;

    const [rows, totalRows] = await Promise.all([
      db.query.posts.findMany({
        where,
        orderBy: [desc(posts.updatedAt)],
        limit: pageSize,
        offset,
      }),
      db.select({ count: sql<number>`count(*)::int` }).from(posts).where(where),
    ]);

    return {
      items: rows.map(toListItem),
      meta: { total: totalRows[0]?.count ?? 0, page, pageSize },
    };
  },

  async getPost(id: string): Promise<AdminPostDto | null> {
    const p = await db.query.posts.findFirst({ where: eq(posts.id, id) });
    return p ? toFullDto(p) : null;
  },

  async createPost(actorId: string, dto: CreatePostRequest): Promise<AdminPostDto> {
    const contentHtml = md.render(dto.contentMd);
    const [created] = await db
      .insert(posts)
      .values({
        slug: dto.slug,
        locale: dto.locale,
        title: dto.title,
        excerpt: dto.excerpt ?? null,
        contentMd: dto.contentMd,
        contentHtml,
        coverUrl: dto.coverUrl ?? null,
        categoryId: dto.categoryId ?? null,
        authorId: actorId,
        status: dto.status ?? 'draft',
        publishedAt:
          dto.status === 'published'
            ? (dto.publishedAt ? new Date(dto.publishedAt) : new Date())
            : null,
        scheduledAt: dto.scheduledAt ? new Date(dto.scheduledAt) : null,
        seoTitle: dto.seoTitle ?? null,
        seoDescription: dto.seoDescription ?? null,
        seoKeywords: dto.seoKeywords ?? null,
        tags: dto.tags ?? [],
        readingMinutes: readingMinutes(dto.contentMd),
      })
      .returning();
    await db.insert(auditLog).values({
      actorId,
      action: 'post.create',
      entityType: 'post',
      entityId: created.id,
      meta: { slug: created.slug },
    });
    return toFullDto(created);
  },

  async updatePost(actorId: string, id: string, dto: UpdatePostRequest): Promise<AdminPostDto | null> {
    const before = await db.query.posts.findFirst({ where: eq(posts.id, id) });
    if (!before) return null;
    const patch: Partial<typeof posts.$inferInsert> = { updatedAt: new Date() };
    if (dto.slug !== undefined) patch.slug = dto.slug;
    if (dto.locale) patch.locale = dto.locale;
    if (dto.title !== undefined) patch.title = dto.title;
    if (dto.excerpt !== undefined) patch.excerpt = dto.excerpt;
    if (dto.coverUrl !== undefined) patch.coverUrl = dto.coverUrl;
    if (dto.categoryId !== undefined) patch.categoryId = dto.categoryId;
    if (dto.seoTitle !== undefined) patch.seoTitle = dto.seoTitle;
    if (dto.seoDescription !== undefined) patch.seoDescription = dto.seoDescription;
    if (dto.seoKeywords !== undefined) patch.seoKeywords = dto.seoKeywords;
    if (dto.tags !== undefined) patch.tags = dto.tags;
    if (dto.contentMd !== undefined) {
      patch.contentMd = dto.contentMd;
      patch.contentHtml = md.render(dto.contentMd);
      patch.readingMinutes = readingMinutes(dto.contentMd);
    }
    if (dto.scheduledAt !== undefined) patch.scheduledAt = dto.scheduledAt ? new Date(dto.scheduledAt) : null;
    if (dto.status) {
      patch.status = dto.status;
      /** Если переводим в published и publishedAt нет — ставим now() */
      if (dto.status === 'published' && !before.publishedAt) {
        patch.publishedAt = dto.publishedAt ? new Date(dto.publishedAt) : new Date();
      }
    }
    const [updated] = await db.update(posts).set(patch).where(eq(posts.id, id)).returning();
    await db.insert(auditLog).values({
      actorId,
      action: 'post.update',
      entityType: 'post',
      entityId: id,
      meta: { keys: Object.keys(patch) },
    });
    return toFullDto(updated);
  },

  async deletePost(actorId: string, id: string): Promise<boolean> {
    const result = await db.delete(posts).where(eq(posts.id, id)).returning({ id: posts.id });
    if (result.length) {
      await db.insert(auditLog).values({
        actorId,
        action: 'post.delete',
        entityType: 'post',
        entityId: id,
        meta: {},
      });
    }
    return result.length > 0;
  },

  /* ── CATEGORIES ── */

  async listCategories(): Promise<AdminCategoryDto[]> {
    const rows = await db.query.categories.findMany({
      orderBy: [categories.sortOrder, categories.name],
    });
    return rows.map(toCategoryDto);
  },

  async createCategory(actorId: string, dto: CreateCategoryRequest): Promise<AdminCategoryDto> {
    const [created] = await db
      .insert(categories)
      .values({
        slug: dto.slug,
        name: dto.name,
        description: dto.description ?? null,
        parentId: dto.parentId ?? null,
        sortOrder: dto.sortOrder ?? 0,
        locale: dto.locale,
      })
      .returning();
    await db.insert(auditLog).values({
      actorId,
      action: 'category.create',
      entityType: 'category',
      entityId: created.id,
      meta: { slug: created.slug },
    });
    return toCategoryDto(created);
  },

  async updateCategory(actorId: string, id: string, dto: UpdateCategoryRequest): Promise<AdminCategoryDto | null> {
    const patch: Partial<typeof categories.$inferInsert> = { updatedAt: new Date() };
    if (dto.slug !== undefined) patch.slug = dto.slug;
    if (dto.name !== undefined) patch.name = dto.name;
    if (dto.description !== undefined) patch.description = dto.description;
    if (dto.parentId !== undefined) patch.parentId = dto.parentId;
    if (dto.sortOrder !== undefined) patch.sortOrder = dto.sortOrder;
    if (dto.locale !== undefined) patch.locale = dto.locale;
    const [u] = await db.update(categories).set(patch).where(eq(categories.id, id)).returning();
    if (!u) return null;
    await db.insert(auditLog).values({
      actorId,
      action: 'category.update',
      entityType: 'category',
      entityId: id,
      meta: { keys: Object.keys(patch) },
    });
    return toCategoryDto(u);
  },

  async deleteCategory(actorId: string, id: string): Promise<boolean> {
    const result = await db.delete(categories).where(eq(categories.id, id)).returning({ id: categories.id });
    if (result.length) {
      await db.insert(auditLog).values({
        actorId,
        action: 'category.delete',
        entityType: 'category',
        entityId: id,
        meta: {},
      });
    }
    return result.length > 0;
  },
};
