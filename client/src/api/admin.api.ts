import { apiClient } from './client';
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

export const adminApi = {
  /* users */
  async listUsers(q: AdminUsersQuery = {}): Promise<AdminUsersListResponse> {
    const { data } = await apiClient.get<{ success: true } & AdminUsersListResponse>('/admin/users', { params: q });
    return data;
  },
  async getUser(id: string): Promise<UserDto> {
    const { data } = await apiClient.get<{ success: true; user: UserDto }>(`/admin/users/${id}`);
    return data.user;
  },
  async updateUser(id: string, payload: AdminUpdateUserRequest): Promise<UserDto> {
    const { data } = await apiClient.patch<{ success: true; user: UserDto }>(`/admin/users/${id}`, payload);
    return data.user;
  },

  /* orders */
  async listOrders(q: AdminOrdersQuery = {}): Promise<AdminOrdersListResponse> {
    const { data } = await apiClient.get<{ success: true } & AdminOrdersListResponse>('/admin/orders', { params: q });
    return data;
  },
  async updateOrder(id: string, payload: AdminUpdateOrderRequest): Promise<void> {
    await apiClient.patch(`/admin/orders/${id}`, payload);
  },

  /* analytics */
  async analytics(): Promise<AdminAnalyticsResponse> {
    const { data } = await apiClient.get<{ success: true } & AdminAnalyticsResponse>('/admin/analytics');
    return data;
  },

  /* posts */
  async listPosts(q: { status?: 'draft' | 'scheduled' | 'published' | 'archived'; page?: number; pageSize?: number } = {}): Promise<AdminPostsListResponse> {
    const { data } = await apiClient.get<{ success: true } & AdminPostsListResponse>('/admin/posts', { params: q });
    return data;
  },
  async getPost(id: string): Promise<AdminPostDto> {
    const { data } = await apiClient.get<{ success: true; post: AdminPostDto }>(`/admin/posts/${id}`);
    return data.post;
  },
  async createPost(payload: CreatePostRequest): Promise<AdminPostDto> {
    const { data } = await apiClient.post<{ success: true; post: AdminPostDto }>('/admin/posts', payload);
    return data.post;
  },
  async updatePost(id: string, payload: UpdatePostRequest): Promise<AdminPostDto> {
    const { data } = await apiClient.patch<{ success: true; post: AdminPostDto }>(`/admin/posts/${id}`, payload);
    return data.post;
  },
  async deletePost(id: string): Promise<void> {
    await apiClient.delete(`/admin/posts/${id}`);
  },

  /* categories */
  async listCategories(): Promise<AdminCategoryDto[]> {
    const { data } = await apiClient.get<List<AdminCategoryDto>>('/admin/categories');
    return data.items;
  },
  async createCategory(payload: CreateCategoryRequest): Promise<AdminCategoryDto> {
    const { data } = await apiClient.post<{ success: true; category: AdminCategoryDto }>('/admin/categories', payload);
    return data.category;
  },
  async updateCategory(id: string, payload: UpdateCategoryRequest): Promise<AdminCategoryDto> {
    const { data } = await apiClient.patch<{ success: true; category: AdminCategoryDto }>(`/admin/categories/${id}`, payload);
    return data.category;
  },
  async deleteCategory(id: string): Promise<void> {
    await apiClient.delete(`/admin/categories/${id}`);
  },

  /* audit */
  async listAudit(): Promise<AdminAuditEntry[]> {
    const { data } = await apiClient.get<List<AdminAuditEntry>>('/admin/audit');
    return data.items;
  },
};
