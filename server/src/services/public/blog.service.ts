import { and, desc, eq, sql, type SQL } from 'drizzle-orm';
import { db } from '../../db/index.js';
import { posts, categories, users, type Post } from '../../db/schema.js';
import type {
  PublicPostListItem,
  PublicPostDto,
  PublicPostsListResponse,
  PublicPostsQuery,
  PublicCategoryDto,
} from '@freestyle/shared';

interface PostRowJoined {
  post: Post;
  categoryName: string | null;
  categorySlug: string | null;
  authorName: string | null;
}

function toListItem(row: PostRowJoined): PublicPostListItem {
  const p = row.post;
  return {
    id: p.id,
    slug: p.slug,
    locale: p.locale,
    title: p.title,
    excerpt: p.excerpt,
    coverUrl: p.coverUrl,
    categoryId: p.categoryId,
    categoryName: row.categoryName,
    categorySlug: row.categorySlug,
    authorName: row.authorName,
    publishedAt: (p.publishedAt ?? p.createdAt).toISOString(),
    readingMinutes: p.readingMinutes,
    viewsCount: p.viewsCount,
    tags: p.tags,
  };
}

export const blogService = {
  async list(q: PublicPostsQuery): Promise<PublicPostsListResponse> {
    const page = Math.max(1, q.page ?? 1);
    const pageSize = Math.min(50, Math.max(1, q.pageSize ?? 12));
    const offset = (page - 1) * pageSize;

    const conditions: SQL[] = [eq(posts.status, 'published')];
    if (q.locale) conditions.push(eq(posts.locale, q.locale));
    if (q.category) {
      conditions.push(sql`${posts.categoryId} IN (SELECT id FROM categories WHERE slug = ${q.category})`);
    }
    if (q.tag) {
      conditions.push(sql`${posts.tags} ? ${q.tag}`);
    }
    if (q.q?.trim()) {
      const term = `%${q.q.trim()}%`;
      conditions.push(sql`(${posts.title} ILIKE ${term} OR ${posts.excerpt} ILIKE ${term})`);
    }
    const where = and(...conditions);

    const [rows, totals] = await Promise.all([
      db
        .select({
          post: posts,
          categoryName: categories.name,
          categorySlug: categories.slug,
          authorName: users.name,
        })
        .from(posts)
        .leftJoin(categories, eq(categories.id, posts.categoryId))
        .leftJoin(users, eq(users.id, posts.authorId))
        .where(where)
        .orderBy(desc(posts.publishedAt), desc(posts.createdAt))
        .limit(pageSize)
        .offset(offset),
      db.select({ count: sql<number>`count(*)::int` }).from(posts).where(where),
    ]);

    return {
      items: rows.map(toListItem),
      meta: { total: totals[0]?.count ?? 0, page, pageSize },
    };
  },

  async getBySlug(slug: string, locale?: string): Promise<PublicPostDto | null> {
    const conds: SQL[] = [eq(posts.status, 'published'), eq(posts.slug, slug)];
    if (locale) conds.push(eq(posts.locale, locale as 'ru' | 'en' | 'zh'));
    const row = await db
      .select({
        post: posts,
        categoryName: categories.name,
        categorySlug: categories.slug,
        authorName: users.name,
      })
      .from(posts)
      .leftJoin(categories, eq(categories.id, posts.categoryId))
      .leftJoin(users, eq(users.id, posts.authorId))
      .where(and(...conds))
      .limit(1);
    if (row.length === 0) return null;

    const base = toListItem(row[0]);
    const post = row[0].post;

    /** Похожие — из той же категории, без текущего, до 4 шт. */
    const related = await this.related(post.id, post.categoryId, post.locale, 4);

    /** Атомарный инкремент просмотров (fire-and-forget — не блокируем ответ ошибкой) */
    void db
      .update(posts)
      .set({ viewsCount: sql`${posts.viewsCount} + 1` })
      .where(eq(posts.id, post.id))
      .catch(() => {});

    return {
      ...base,
      contentHtml: post.contentHtml,
      seoTitle: post.seoTitle,
      seoDescription: post.seoDescription,
      seoKeywords: post.seoKeywords,
      related,
    };
  },

  async related(
    excludeId: string,
    categoryId: string | null,
    locale: 'ru' | 'en' | 'zh',
    limit = 4,
  ): Promise<PublicPostListItem[]> {
    const conds: SQL[] = [eq(posts.status, 'published'), eq(posts.locale, locale)];
    if (categoryId) conds.push(eq(posts.categoryId, categoryId));
    conds.push(sql`${posts.id} <> ${excludeId}`);

    const rows = await db
      .select({
        post: posts,
        categoryName: categories.name,
        categorySlug: categories.slug,
        authorName: users.name,
      })
      .from(posts)
      .leftJoin(categories, eq(categories.id, posts.categoryId))
      .leftJoin(users, eq(users.id, posts.authorId))
      .where(and(...conds))
      .orderBy(desc(posts.publishedAt))
      .limit(limit);

    return rows.map(toListItem);
  },

  async listCategories(locale?: string): Promise<PublicCategoryDto[]> {
    const conditions: SQL[] = [];
    if (locale) conditions.push(eq(categories.locale, locale as 'ru' | 'en' | 'zh'));
    const where = conditions.length ? and(...conditions) : undefined;

    const rows = await db
      .select({
        id: categories.id,
        slug: categories.slug,
        name: categories.name,
        description: categories.description,
        locale: categories.locale,
        postsCount: sql<number>`(SELECT count(*)::int FROM posts WHERE category_id = ${categories.id} AND status = 'published')`,
      })
      .from(categories)
      .where(where)
      .orderBy(categories.sortOrder, categories.name);

    return rows.map((r) => ({
      id: r.id,
      slug: r.slug,
      name: r.name,
      description: r.description,
      locale: r.locale,
      postsCount: r.postsCount,
    }));
  },
};
