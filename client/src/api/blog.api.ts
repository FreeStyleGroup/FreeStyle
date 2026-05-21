import { apiClient } from './client';
import type {
  PublicPostsListResponse,
  PublicPostsQuery,
  PublicPostDto,
  PublicCategoryDto,
} from '@freestyle/shared';

interface List<T> { success: true; items: T[] }

export const blogApi = {
  async listPosts(query: PublicPostsQuery = {}): Promise<PublicPostsListResponse> {
    const { data } = await apiClient.get<{ success: true } & PublicPostsListResponse>('/blog/posts', { params: query });
    return data;
  },

  async getPost(slug: string, locale?: string): Promise<PublicPostDto | null> {
    try {
      const { data } = await apiClient.get<{ success: true; post: PublicPostDto }>(`/blog/posts/${encodeURIComponent(slug)}`, {
        params: locale ? { locale } : undefined,
      });
      return data.post;
    } catch {
      return null;
    }
  },

  async listCategories(locale?: string): Promise<PublicCategoryDto[]> {
    const { data } = await apiClient.get<List<PublicCategoryDto>>('/blog/categories', {
      params: locale ? { locale } : undefined,
    });
    return data.items;
  },
};
