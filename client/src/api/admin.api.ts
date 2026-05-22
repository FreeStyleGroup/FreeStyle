import { apiClient } from './client';
import { isPreview, mockAnalytics, mockAdminUsers, mockAdminOrders, mockAdminPosts, mockCategories, mockAudit, mockUser } from '@/lib/preview';
import type {
  AdminUsersListResponse,
  AdminUsersQuery,
  AdminUpdateUserRequest,
  UserDto,
  AdminOrdersListResponse,
  AdminOrdersQuery,
  AdminUpdateOrderRequest,
  AdminAnalyticsResponse,
  AdminPostsListResponse,
  AdminPostDto,
  CreatePostRequest,
  UpdatePostRequest,
  AdminCategoryDto,
  CreateCategoryRequest,
  UpdateCategoryRequest,
  AdminAuditEntry,
} from '@freestyle/shared';

interface List<T> { success: true; items: T[] }

async function pv<T>(real: () => Promise<T>, mock: () => T): Promise<T> {
  if (isPreview()) {
    try { return await real(); } catch { return mock(); }
  }
  return real();
}

export const adminApi = {
  /* users */
  listUsers: (_q: AdminUsersQuery = {}) => pv<AdminUsersListResponse>(
    async () => (await apiClient.get<{ success: true } & AdminUsersListResponse>('/admin/users', { params: _q })).data,
    mockAdminUsers,
  ),

  getUser: (id: string) => pv<UserDto>(
    async () => (await apiClient.get<{ success: true; user: UserDto }>(`/admin/users/${id}`)).data.user,
    () => mockUser('user'),
  ),

  async updateUser(id: string, payload: AdminUpdateUserRequest): Promise<UserDto> {
    if (isPreview()) return mockUser(payload.role ?? 'user');
    const { data } = await apiClient.patch<{ success: true; user: UserDto }>(`/admin/users/${id}`, payload);
    return data.user;
  },

  /* orders */
  listOrders: (_q: AdminOrdersQuery = {}) => pv<AdminOrdersListResponse>(
    async () => (await apiClient.get<{ success: true } & AdminOrdersListResponse>('/admin/orders', { params: _q })).data,
    mockAdminOrders,
  ),

  async updateOrder(id: string, payload: AdminUpdateOrderRequest): Promise<void> {
    if (isPreview()) return;
    await apiClient.patch(`/admin/orders/${id}`, payload);
  },

  /* analytics */
  analytics: () => pv<AdminAnalyticsResponse>(
    async () => (await apiClient.get<{ success: true } & AdminAnalyticsResponse>('/admin/analytics')).data,
    mockAnalytics,
  ),

  /* posts */
  listPosts: (_q: { status?: 'draft' | 'scheduled' | 'published' | 'archived'; page?: number; pageSize?: number } = {}) => pv<AdminPostsListResponse>(
    async () => (await apiClient.get<{ success: true } & AdminPostsListResponse>('/admin/posts', { params: _q })).data,
    mockAdminPosts,
  ),

  async getPost(id: string): Promise<AdminPostDto> {
    if (isPreview()) {
      const item = mockAdminPosts().items[0];
      return { ...item, excerpt: 'Краткий анонс статьи', contentMd: '# Заголовок\n\nЭто пример контента статьи в режиме preview.\n\n## Подзаголовок\n\nТекст параграфа с **жирным** и *курсивом*.', contentHtml: '<h1>Заголовок</h1><p>Это пример контента статьи в режиме preview.</p>', coverUrl: null, seoTitle: null, seoDescription: null, seoKeywords: null, readingMinutes: 5, tags: ['demo'] };
    }
    const { data } = await apiClient.get<{ success: true; post: AdminPostDto }>(`/admin/posts/${id}`);
    return data.post;
  },

  async createPost(payload: CreatePostRequest): Promise<AdminPostDto> {
    if (isPreview()) {
      const item = mockAdminPosts().items[0];
      return { ...item, ...payload, contentHtml: '<p>preview</p>', readingMinutes: 1, excerpt: payload.excerpt ?? null, coverUrl: payload.coverUrl ?? null, categoryId: payload.categoryId ?? null, seoTitle: payload.seoTitle ?? null, seoDescription: payload.seoDescription ?? null, seoKeywords: payload.seoKeywords ?? null, tags: payload.tags ?? [], authorId: null, status: payload.status ?? 'draft', publishedAt: null, scheduledAt: payload.scheduledAt ?? null, viewsCount: 0, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    }
    const { data } = await apiClient.post<{ success: true; post: AdminPostDto }>('/admin/posts', payload);
    return data.post;
  },

  async updatePost(id: string, payload: UpdatePostRequest): Promise<AdminPostDto> {
    if (isPreview()) return this.getPost(id);
    const { data } = await apiClient.patch<{ success: true; post: AdminPostDto }>(`/admin/posts/${id}`, payload);
    return data.post;
  },

  async deletePost(id: string): Promise<void> {
    if (isPreview()) return;
    await apiClient.delete(`/admin/posts/${id}`);
  },

  /* categories */
  listCategories: () => pv<AdminCategoryDto[]>(
    async () => (await apiClient.get<List<AdminCategoryDto>>('/admin/categories')).data.items,
    () => mockCategories,
  ),

  async createCategory(payload: CreateCategoryRequest): Promise<AdminCategoryDto> {
    if (isPreview()) return { id: 'preview', slug: payload.slug, name: payload.name, description: payload.description ?? null, parentId: payload.parentId ?? null, sortOrder: payload.sortOrder ?? 0, locale: payload.locale, createdAt: new Date().toISOString() };
    const { data } = await apiClient.post<{ success: true; category: AdminCategoryDto }>('/admin/categories', payload);
    return data.category;
  },

  async updateCategory(id: string, payload: UpdateCategoryRequest): Promise<AdminCategoryDto> {
    if (isPreview()) return mockCategories[0];
    const { data } = await apiClient.patch<{ success: true; category: AdminCategoryDto }>(`/admin/categories/${id}`, payload);
    return data.category;
  },

  async deleteCategory(id: string): Promise<void> {
    if (isPreview()) return;
    await apiClient.delete(`/admin/categories/${id}`);
  },

  /* audit */
  listAudit: () => pv<AdminAuditEntry[]>(
    async () => (await apiClient.get<List<AdminAuditEntry>>('/admin/audit')).data.items,
    () => mockAudit,
  ),
};
