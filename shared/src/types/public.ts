/**
 * Публичные API-типы: блог (чтение), форма контактов, страны.
 * Используются и фронтом (страницы /blog, /contacts, /countries),
 * и сервером (controllers + validators).
 */

import type { Locale } from './auth';

/* ─── BLOG (public read) ────────────────────────────────────── */

export interface PublicPostListItem {
  id: string;
  slug: string;
  locale: Locale;
  title: string;
  excerpt: string | null;
  coverUrl: string | null;
  categoryId: string | null;
  categoryName: string | null;
  categorySlug: string | null;
  authorName: string | null;
  publishedAt: string;
  readingMinutes: number;
  viewsCount: number;
  tags: string[];
}

export interface PublicPostDto extends PublicPostListItem {
  contentHtml: string;
  seoTitle: string | null;
  seoDescription: string | null;
  seoKeywords: string | null;
  /** Похожие посты (из той же категории, без текущего) — для блока «Читайте также» */
  related: PublicPostListItem[];
}

export interface PublicPostsListResponse {
  items: PublicPostListItem[];
  meta: { total: number; page: number; pageSize: number };
}

export interface PublicPostsQuery {
  locale?: Locale;
  category?: string;
  tag?: string;
  q?: string;
  page?: number;
  pageSize?: number;
}

export interface PublicCategoryDto {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  locale: Locale;
  postsCount: number;
}

/* ─── CONTACT FORM ──────────────────────────────────────────── */

export interface ContactRequest {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  sourcePage?: string;
}

export interface ContactResponse {
  success: true;
  message: string;
}

/* ─── COUNTRIES ─────────────────────────────────────────────── */

export interface CountryListItem {
  code: string;
  slug: string;
  name: string;
  nameEn: string;
  flag: string;
  capital: string;
  currency: string;
  currencyName: string;
  language: string[];
  timeZone: string;
  flightTimeFromMoscow: string;
  visa: {
    required: 'no' | 'on-arrival' | 'e-visa' | 'yes';
    note: string;
    stayDays?: number;
  };
  climate: {
    summary: string;
    bestSeason: string;
  };
  cities: Array<{ name: string; code: string }>;
  heroImage: string;
  shortDescription: string;
  popular: boolean;
}

export interface CountryDto extends CountryListItem {
  longDescription: string;
}
