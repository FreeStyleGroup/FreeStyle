import type { UserDto, UserRole, UserStatus, Locale, Currency } from './auth';
import type { BookingSummaryDto } from './cabinet';

export interface AdminListMeta {
  total: number;
  page: number;
  pageSize: number;
}

export interface AdminUsersListResponse {
  items: UserDto[];
  meta: AdminListMeta;
}

export interface AdminUsersQuery {
  q?: string;
  role?: UserRole;
  status?: UserStatus;
  page?: number;
  pageSize?: number;
}

export interface AdminUpdateUserRequest {
  role?: UserRole;
  status?: UserStatus;
  name?: string;
  /** Прямое начисление миль (для compensation flows) — пишет в wallet_transactions с type='manual_adjustment'. */
  milesAdjustment?: { amount: number; description: string };
}

export interface AdminOrdersQuery {
  q?: string;
  status?: 'pending' | 'confirmed' | 'paid' | 'cancelled' | 'completed' | 'refunded';
  type?: 'flight' | 'hotel' | 'tour' | 'visa' | 'transfer' | 'insurance';
  page?: number;
  pageSize?: number;
}

export interface AdminOrderItem extends BookingSummaryDto {
  userId: string;
  userName: string;
  userEmail: string;
}

export interface AdminOrdersListResponse {
  items: AdminOrderItem[];
  meta: AdminListMeta;
}

export interface AdminUpdateOrderRequest {
  status: 'pending' | 'confirmed' | 'paid' | 'cancelled' | 'completed' | 'refunded';
  adminNotes?: string;
}

/* ─── Analytics ─── */

export interface AnalyticsCard {
  label: string;
  value: number | string;
  /** Изменение в процентах к предыдущему периоду (если применимо) */
  delta?: number;
  hint?: string;
}

export interface SeriesPoint {
  date: string; /* YYYY-MM-DD */
  value: number;
}

export interface AdminAnalyticsResponse {
  cards: AnalyticsCard[];
  registrationsLast30d: SeriesPoint[];
  revenueLast30d: SeriesPoint[];
  bookingsByStatus: Array<{ status: string; count: number }>;
  topDestinations: Array<{ name: string; count: number }>;
}

/* ─── Content ─── */

export interface AdminPostListItem {
  id: string;
  slug: string;
  locale: Locale;
  title: string;
  status: 'draft' | 'scheduled' | 'published' | 'archived';
  authorId: string | null;
  categoryId: string | null;
  publishedAt: string | null;
  scheduledAt: string | null;
  viewsCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface AdminPostsListResponse {
  items: AdminPostListItem[];
  meta: AdminListMeta;
}

export interface AdminPostDto extends AdminPostListItem {
  excerpt: string | null;
  contentMd: string;
  contentHtml: string;
  coverUrl: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  seoKeywords: string | null;
  readingMinutes: number;
  tags: string[];
}

export interface CreatePostRequest {
  slug: string;
  locale: Locale;
  title: string;
  excerpt?: string;
  contentMd: string;
  coverUrl?: string;
  categoryId?: string | null;
  status?: 'draft' | 'scheduled' | 'published' | 'archived';
  publishedAt?: string | null;
  scheduledAt?: string | null;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
  tags?: string[];
}

export interface UpdatePostRequest extends Partial<CreatePostRequest> {}

export interface AdminCategoryDto {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  parentId: string | null;
  sortOrder: number;
  locale: Locale;
  createdAt: string;
}

export interface CreateCategoryRequest {
  slug: string;
  name: string;
  description?: string;
  parentId?: string | null;
  sortOrder?: number;
  locale: Locale;
}

export interface UpdateCategoryRequest extends Partial<CreateCategoryRequest> {}

/* ─── Audit log ─── */

export interface AdminAuditEntry {
  id: string;
  actorId: string | null;
  actorName: string | null;
  action: string;
  entityType: string | null;
  entityId: string | null;
  meta: Record<string, unknown>;
  createdAt: string;
}

/* re-export для удобства */
export type { Currency, Locale, UserRole };
