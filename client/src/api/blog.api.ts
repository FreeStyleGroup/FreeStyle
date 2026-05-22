import { apiClient } from './client';
import { isPreview, mockBlogList, mockBlogCategories } from '@/lib/preview';
import type {
  PublicPostsListResponse,
  PublicPostsQuery,
  PublicPostDto,
  PublicCategoryDto,
} from '@freestyle/shared';

interface List<T> { success: true; items: T[] }

async function pv<T>(real: () => Promise<T>, mock: () => T): Promise<T> {
  if (isPreview()) {
    try { return await real(); } catch { return mock(); }
  }
  return real();
}

export const blogApi = {
  listPosts: (query: PublicPostsQuery = {}) => pv<PublicPostsListResponse>(
    async () => (await apiClient.get<{ success: true } & PublicPostsListResponse>('/blog/posts', { params: query })).data,
    mockBlogList,
  ),

  async getPost(slug: string, locale?: string): Promise<PublicPostDto | null> {
    try {
      const { data } = await apiClient.get<{ success: true; post: PublicPostDto }>(`/blog/posts/${encodeURIComponent(slug)}`, {
        params: locale ? { locale } : undefined,
      });
      return data.post;
    } catch {
      if (isPreview()) {
        const list = mockBlogList().items;
        const item = list.find((p) => p.slug === slug) ?? list[0];
        return {
          ...item,
          contentHtml: '<p>В preview-режиме здесь будет полный текст статьи. После деплоя бэкенда контент придёт из БД.</p><h2>Подзаголовок раздела</h2><p>Параграф с <strong>выделением</strong> и <em>курсивом</em> для проверки стилей.</p>',
          seoTitle: item.title,
          seoDescription: item.excerpt,
          seoKeywords: item.tags.join(', '),
          related: list.filter((p) => p.slug !== slug).slice(0, 4),
        };
      }
      return null;
    }
  },

  listCategories: (locale?: string) => pv<PublicCategoryDto[]>(
    async () => (await apiClient.get<List<PublicCategoryDto>>('/blog/categories', { params: locale ? { locale } : undefined })).data.items,
    () => mockBlogCategories,
  ),
};
