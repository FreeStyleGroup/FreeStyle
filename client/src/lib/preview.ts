/**
 * Preview-режим — позволяет смотреть защищённые страницы (кабинет/админка)
 * на Vercel-деплое БЕЗ работающего бэкенда. Активируется env-переменной
 *
 *   VITE_PREVIEW_AUTH=admin   (или user, editor)
 *
 * В preview:
 *   - auth-store сразу подставляет фейкового юзера, не дёргает /api/auth/me
 *   - AuthGuard/RoleGuard пропускают
 *   - api-helper'ы при network-error возвращают mock-данные
 *
 * Для прода НЕ ставить — иначе все увидят админку.
 */

import type {
  UserDto, CabinetDashboardDto, BookingSummaryDto, FavoriteDto,
  DocumentDto, WalletSummaryDto, WalletTxnDto, ReferralStatsDto, SessionDto,
  AdminAnalyticsResponse, AdminUsersListResponse, AdminOrdersListResponse,
  AdminPostsListResponse, AdminCategoryDto, AdminAuditEntry,
  PublicPostsListResponse, PublicCategoryDto, CountryListItem,
  IdeaDto, PublishJobDto,
} from '@freestyle/shared';

export type PreviewRole = 'user' | 'editor' | 'admin';

export function previewRole(): PreviewRole | null {
  const v = (import.meta.env.VITE_PREVIEW_AUTH ?? '').toString().trim().toLowerCase();
  if (v === 'admin' || v === 'editor' || v === 'user') return v;
  return null;
}

export function isPreview(): boolean {
  return previewRole() !== null;
}

/* ─── Mock user ─── */

const NOW = new Date().toISOString();

export function mockUser(role: PreviewRole = 'admin'): UserDto {
  return {
    id: 'preview-user-uuid',
    email: role === 'admin' ? 'admin@freestyle.ru' : role === 'editor' ? 'editor@freestyle.ru' : 'demo@freestyle.ru',
    emailVerifiedAt: NOW,
    name: role === 'admin' ? 'Алексей Админов' : role === 'editor' ? 'Мария Редакторова' : 'Иван Демов',
    phone: '+7 999 123-45-67',
    avatarUrl: null,
    role,
    status: 'active',
    locale: 'ru',
    currency: 'rub',
    tier: 'gold',
    milesBalance: 6420,
    cashbackBalance: '3850.00',
    marketingOptIn: true,
    preferences: {},
    createdAt: '2025-08-15T10:30:00.000Z',
    lastLoginAt: NOW,
  };
}

/* ─── Mock cabinet ─── */

const mockBookings: BookingSummaryDto[] = [
  { id: 'b1', publicId: 'FS-2026-001234', type: 'flight', status: 'paid',      amount: '32500.00', currency: 'rub', title: 'Москва → Стамбул',  startsAt: '2026-07-15T08:30:00Z', createdAt: '2026-04-20T12:00:00Z' },
  { id: 'b2', publicId: 'FS-2026-001235', type: 'hotel',  status: 'confirmed', amount: '78000.00', currency: 'rub', title: 'Hilton Istanbul Bomonti · 5 ночей', startsAt: '2026-07-15T14:00:00Z', createdAt: '2026-04-20T12:30:00Z' },
  { id: 'b3', publicId: 'FS-2025-009876', type: 'flight', status: 'completed', amount: '45000.00', currency: 'rub', title: 'Москва → Дубай (обратно)', startsAt: '2025-11-10T03:00:00Z', createdAt: '2025-09-15T18:00:00Z' },
  { id: 'b4', publicId: 'FS-2025-009854', type: 'tour',   status: 'completed', amount: '210000.00', currency: 'rub', title: 'Грузия · винный тур · 7 дней', startsAt: '2025-09-05T00:00:00Z', createdAt: '2025-07-20T11:00:00Z' },
];

export function mockDashboard(): CabinetDashboardDto {
  const user = mockUser('admin');
  return {
    user,
    wallet: { tier: 'gold', milesBalance: 6420, cashbackBalance: '3850.00', nextTier: 'platinum', milesToNextTier: 13580 },
    upcomingTrips: mockBookings.slice(0, 2),
    documentsCount: 3,
    favoritesCount: 7,
    expiringDocuments: [
      { id: 'd1', name: 'Загранпаспорт', expiresAt: '2026-09-15T00:00:00Z' },
    ],
  };
}

export const mockBookingsList: BookingSummaryDto[] = mockBookings;

export const mockFavorites: FavoriteDto[] = [
  { type: 'hotel',       refId: 'h_dubai_1',  payload: { title: 'Atlantis The Palm',  subtitle: 'Дубай · 5★' }, createdAt: '2026-04-15T10:00:00Z' },
  { type: 'destination', refId: 'IST',        payload: { title: 'Стамбул',            subtitle: 'Турция'    }, createdAt: '2026-04-10T15:00:00Z' },
  { type: 'flight',      refId: 'flight_dxb', payload: { title: 'Москва → Дубай',     subtitle: '11 апреля · 24 900 ₽' }, createdAt: '2026-04-05T09:00:00Z' },
];

export const mockDocuments: DocumentDto[] = [
  { id: 'd1', type: 'foreign_passport', name: 'Загранпаспорт Алексея', number: '75 1234567', issuedAt: '2021-09-15T00:00:00Z', expiresAt: '2026-09-15T00:00:00Z', countryCode: 'RU', fileUrl: null, meta: {}, createdAt: NOW, updatedAt: NOW },
  { id: 'd2', type: 'passport',         name: 'Российский паспорт',    number: '4523 678910', issuedAt: '2018-02-20T00:00:00Z', expiresAt: null, countryCode: 'RU', fileUrl: null, meta: {}, createdAt: NOW, updatedAt: NOW },
  { id: 'd3', type: 'visa',             name: 'Шенген-виза C',         number: 'D8123456', issuedAt: '2025-06-10T00:00:00Z', expiresAt: '2026-06-10T00:00:00Z', countryCode: 'ES', fileUrl: null, meta: {}, createdAt: NOW, updatedAt: NOW },
];

export function mockWalletSummary(): WalletSummaryDto {
  return {
    tier: 'gold', milesBalance: 6420, cashbackBalance: '3850.00',
    nextTier: 'platinum', milesToNextTier: 13580,
    recentTransactions: mockWalletTxns.slice(0, 5),
  };
}

export const mockWalletTxns: WalletTxnDto[] = [
  { id: 't1', kind: 'miles',    type: 'accrual',         amount: '1500',  currency: null, description: 'Начисление за рейс FS-2026-001234', bookingId: 'b1', createdAt: '2026-04-20T12:05:00Z' },
  { id: 't2', kind: 'cashback', type: 'accrual',         amount: '650',   currency: 'rub', description: 'Кэшбэк за бронь отеля',           bookingId: 'b2', createdAt: '2026-04-20T12:35:00Z' },
  { id: 't3', kind: 'miles',    type: 'accrual',         amount: '2200',  currency: null, description: 'Тур по Грузии',                    bookingId: 'b4', createdAt: '2025-07-20T11:30:00Z' },
  { id: 't4', kind: 'cashback', type: 'accrual',         amount: '3200',  currency: 'rub', description: 'Кэшбэк за перелёт в Дубай',        bookingId: 'b3', createdAt: '2025-09-15T18:10:00Z' },
  { id: 't5', kind: 'miles',    type: 'manual_adjustment', amount: '500', currency: null, description: 'Бонус приветствия',                bookingId: null, createdAt: '2025-08-15T10:35:00Z' },
];

export function mockReferral(): ReferralStatsDto {
  return {
    code: 'FRSTL12X',
    shareUrl: 'https://freestyle.ru/?ref=FRSTL12X',
    signupsCount: 7,
    bookingsCount: 3,
    totalMilesEarned: 1500,
    recentRedemptions: [
      { invitedName: 'Дмитрий К.',   invitedAt: '2026-04-12T10:00:00Z', awardedAt: '2026-04-20T15:00:00Z', milesAwarded: 500 },
      { invitedName: 'Елена С.',      invitedAt: '2026-04-08T14:30:00Z', awardedAt: null, milesAwarded: 0 },
      { invitedName: 'Максим Б.',     invitedAt: '2026-03-22T09:15:00Z', awardedAt: '2026-04-01T11:00:00Z', milesAwarded: 500 },
    ],
  };
}

export const mockSessions: SessionDto[] = [
  { id: 's1', userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120', ip: '192.168.1.45', createdAt: '2026-05-22T09:00:00Z', expiresAt: '2026-06-21T09:00:00Z', isCurrent: true },
  { id: 's2', userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_4) AppleWebKit/605.1.15 Safari/604.1',                       ip: '10.0.0.12',   createdAt: '2026-05-18T18:30:00Z', expiresAt: '2026-06-17T18:30:00Z', isCurrent: false },
];

/* ─── Mock admin ─── */

export function mockAnalytics(): AdminAnalyticsResponse {
  const days30: { date: string; value: number }[] = [];
  const now = new Date('2026-05-22');
  for (let i = 30; i >= 0; i--) {
    const d = new Date(now); d.setDate(d.getDate() - i);
    days30.push({ date: d.toISOString().slice(0, 10), value: Math.floor(Math.random() * 30 + 8) });
  }
  const revenue30 = days30.map((d) => ({ date: d.date, value: d.value * (Math.floor(Math.random() * 5000) + 8000) }));

  return {
    cards: [
      { label: 'Всего пользователей',  value: 1247, hint: 'за всё время' },
      { label: 'Регистрации (7 дней)',  value: 89 },
      { label: 'Регистрации (30 дней)', value: 412 },
      { label: 'Выручка',               value: '8 245 000', hint: 'оплаченные + завершённые' },
    ],
    registrationsLast30d: days30,
    revenueLast30d: revenue30,
    bookingsByStatus: [
      { status: 'paid',      count: 187 },
      { status: 'confirmed', count: 94 },
      { status: 'completed', count: 542 },
      { status: 'cancelled', count: 28 },
      { status: 'pending',   count: 12 },
    ],
    topDestinations: [],
  };
}

export function mockAdminUsers(): AdminUsersListResponse {
  return {
    items: [
      { ...mockUser('user'),   id: 'u1', name: 'Анна Петрова',   email: 'anna.petrova@gmail.com',  tier: 'silver',   milesBalance: 1200,  createdAt: '2026-05-20T10:00:00Z' },
      { ...mockUser('user'),   id: 'u2', name: 'Игорь Соколов',  email: 'isokolov@mail.ru',         tier: 'gold',     milesBalance: 8400,  createdAt: '2026-04-15T14:00:00Z' },
      { ...mockUser('user'),   id: 'u3', name: 'Елизавета Ким',   email: 'liza.kim@ya.ru',           tier: 'platinum', milesBalance: 24500, createdAt: '2025-12-08T09:30:00Z' },
      { ...mockUser('editor'), id: 'u4', name: 'Мария Редакторова', email: 'editor@freestyle.ru',  tier: 'bronze',   milesBalance: 0,     createdAt: '2025-09-01T08:00:00Z' },
      { ...mockUser('admin'),  id: 'u5', name: 'Алексей Админов',   email: 'admin@freestyle.ru',    tier: 'gold',     milesBalance: 6420,  createdAt: '2025-08-15T10:30:00Z' },
    ],
    meta: { total: 1247, page: 1, pageSize: 20 },
  };
}

export function mockAdminOrders(): AdminOrdersListResponse {
  return {
    items: mockBookings.map((b, i) => ({
      ...b,
      userId: `u${i + 1}`,
      userName: ['Анна Петрова', 'Игорь Соколов', 'Елизавета Ким', 'Дмитрий Орлов'][i] ?? '—',
      userEmail: ['anna@gmail.com', 'isokolov@mail.ru', 'liza@ya.ru', 'orlov@yandex.ru'][i] ?? '—',
    })),
    meta: { total: 863, page: 1, pageSize: 20 },
  };
}

export function mockAdminPosts(): AdminPostsListResponse {
  return {
    items: [
      { id: 'p1', slug: 'turkey-2026',     locale: 'ru', title: 'Турция 2026: куда поехать кроме Анталии', status: 'published', authorId: null, categoryId: 'c1', publishedAt: '2026-05-10T12:00:00Z', scheduledAt: null, viewsCount: 4280, createdAt: '2026-05-08T10:00:00Z', updatedAt: '2026-05-10T12:00:00Z' },
      { id: 'p2', slug: 'dubai-budget',    locale: 'ru', title: 'Дубай на 50 000 ₽: реально или нет',      status: 'published', authorId: null, categoryId: 'c1', publishedAt: '2026-05-05T15:30:00Z', scheduledAt: null, viewsCount: 8125, createdAt: '2026-05-03T09:00:00Z', updatedAt: '2026-05-05T15:30:00Z' },
      { id: 'p3', slug: 'georgia-wine',    locale: 'ru', title: 'Винный тур в Кахетию своим ходом',         status: 'draft',     authorId: null, categoryId: 'c2', publishedAt: null, scheduledAt: null, viewsCount: 0, createdAt: '2026-05-20T14:00:00Z', updatedAt: '2026-05-22T11:00:00Z' },
      { id: 'p4', slug: 'bali-visa-2026',  locale: 'ru', title: 'Виза на Бали в 2026: пошаговый гайд',     status: 'scheduled', authorId: null, categoryId: 'c3', publishedAt: null, scheduledAt: '2026-05-28T08:00:00Z', viewsCount: 0, createdAt: '2026-05-19T12:00:00Z', updatedAt: '2026-05-21T16:00:00Z' },
    ],
    meta: { total: 47, page: 1, pageSize: 20 },
  };
}

export const mockCategories: AdminCategoryDto[] = [
  { id: 'c1', slug: 'destinations',     name: 'Направления',       description: 'Гайды по странам',    parentId: null, sortOrder: 0, locale: 'ru', createdAt: NOW },
  { id: 'c2', slug: 'gastro',           name: 'Гастрономия',       description: 'Еда и вино',          parentId: null, sortOrder: 1, locale: 'ru', createdAt: NOW },
  { id: 'c3', slug: 'visas',            name: 'Визы и формальности', description: null,                parentId: null, sortOrder: 2, locale: 'ru', createdAt: NOW },
  { id: 'c4', slug: 'tips',             name: 'Лайфхаки',          description: 'Советы для опытных', parentId: null, sortOrder: 3, locale: 'ru', createdAt: NOW },
];

export const mockAudit: AdminAuditEntry[] = [
  { id: 'a1', actorId: 'u5', actorName: 'Алексей Админов',     action: 'user.update',     entityType: 'user',    entityId: 'u3',  meta: { diff: { tier: { from: 'gold', to: 'platinum' } } }, createdAt: '2026-05-22T09:15:00Z' },
  { id: 'a2', actorId: 'u4', actorName: 'Мария Редакторова',   action: 'post.create',     entityType: 'post',    entityId: 'p4',  meta: { slug: 'bali-visa-2026' }, createdAt: '2026-05-19T12:00:00Z' },
  { id: 'a3', actorId: 'u5', actorName: 'Алексей Админов',     action: 'booking.update',  entityType: 'booking', entityId: 'b1',  meta: { diff: { status: { from: 'confirmed', to: 'paid' } } }, createdAt: '2026-04-20T12:05:00Z' },
];

/* ─── Mock public ─── */

export function mockBlogList(): PublicPostsListResponse {
  return {
    items: [
      { id: 'p1', slug: 'turkey-2026',  locale: 'ru', title: 'Турция 2026: куда поехать кроме Анталии', excerpt: 'Кеме р, Каш, Алаверди — три недооценённых курорта Эгейского побережья.', coverUrl: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=800&q=80', categoryId: 'c1', categoryName: 'Направления', categorySlug: 'destinations', authorName: 'Редакция FreeStyle', publishedAt: '2026-05-10T12:00:00Z', readingMinutes: 8, viewsCount: 4280, tags: ['турция', 'эгейское море'] },
      { id: 'p2', slug: 'dubai-budget', locale: 'ru', title: 'Дубай на 50 000 ₽: реально или нет',      excerpt: 'Маршрут на 5 дней с бюджетным жильём, шавермой и фристайлом по пляжам.', coverUrl: 'https://images.unsplash.com/photo-1518684079-3c830dcef090?w=800&q=80', categoryId: 'c1', categoryName: 'Направления', categorySlug: 'destinations', authorName: 'Алексей',           publishedAt: '2026-05-05T15:30:00Z', readingMinutes: 12, viewsCount: 8125, tags: ['дубай', 'бюджет', 'оаэ'] },
    ],
    meta: { total: 2, page: 1, pageSize: 12 },
  };
}

export const mockBlogCategories: PublicCategoryDto[] = [
  { id: 'c1', slug: 'destinations',  name: 'Направления',  description: null, locale: 'ru', postsCount: 2 },
  { id: 'c2', slug: 'gastro',        name: 'Гастрономия',  description: null, locale: 'ru', postsCount: 0 },
  { id: 'c3', slug: 'visas',         name: 'Визы',          description: null, locale: 'ru', postsCount: 0 },
];

/* ─── Mock factory ─── */

export const mockIdeas: IdeaDto[] = [
  { id: 'i1', prompt: 'Премиум-туры в Японию весной', title: 'Сакура без толпы: как поехать в Японию в апреле', outline: '— Лучшие районы\n— Логистика билетов\n— Минские варианты отелей', keywords: ['япония', 'сакура', 'весна'], categoryId: 'c1', locale: 'ru', status: 'approved', resultingPostId: null, createdAt: '2026-05-15T10:00:00Z' },
  { id: 'i2', prompt: 'Премиум-туры в Японию весной', title: 'Гастрономический Токио на 5 дней', outline: '— Топ-5 ресторанов\n— Уличная еда\n— Бронирование Michelin', keywords: ['токио', 'гастрономия'], categoryId: 'c2', locale: 'ru', status: 'draft', resultingPostId: null, createdAt: '2026-05-15T10:00:30Z' },
];

export const mockJobs: PublishJobDto[] = [
  { id: 'j1', postId: 'p4', postTitle: 'Виза на Бали в 2026: пошаговый гайд', channel: 'site', status: 'queued', scheduledAt: '2026-05-28T08:00:00Z', startedAt: null, completedAt: null, externalRefId: null, attempts: 0, lastError: null, createdAt: '2026-05-21T16:00:00Z' },
];

/* ─── Mock countries ─── */

export const mockCountries: CountryListItem[] = [
  { code: 'TR', slug: 'turkey',   name: 'Турция',  nameEn: 'Turkey',   flag: '🇹🇷', capital: 'Анкара',  currency: 'TRY', currencyName: 'Турецкая лира', language: ['Турецкий'],     timeZone: 'UTC+3', flightTimeFromMoscow: '3-4 часа', visa: { required: 'no', note: 'Безвизовый', stayDays: 60 },          climate: { summary: 'Средиземноморский', bestSeason: 'Май-октябрь' },  cities: [], heroImage: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=1600&q=80', shortDescription: 'Стамбул, Анталия, Каппадокия', popular: true },
  { code: 'AE', slug: 'uae',      name: 'ОАЭ',     nameEn: 'UAE',      flag: '🇦🇪', capital: 'Абу-Даби', currency: 'AED', currencyName: 'Дирхам',         language: ['Арабский'],     timeZone: 'UTC+4', flightTimeFromMoscow: '5 часов',  visa: { required: 'no', note: 'Безвизовый', stayDays: 90 },          climate: { summary: 'Пустынный',         bestSeason: 'Октябрь-апрель' },     cities: [], heroImage: 'https://images.unsplash.com/photo-1518684079-3c830dcef090?w=1600&q=80', shortDescription: 'Дубай зимой',                  popular: true },
  { code: 'TH', slug: 'thailand', name: 'Таиланд', nameEn: 'Thailand', flag: '🇹🇭', capital: 'Бангкок',  currency: 'THB', currencyName: 'Бат',             language: ['Тайский'],      timeZone: 'UTC+7', flightTimeFromMoscow: '9-10 часов',visa: { required: 'no', note: 'Безвизовый', stayDays: 60 },          climate: { summary: 'Тропический',       bestSeason: 'Ноябрь-март' },       cities: [], heroImage: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=1600&q=80', shortDescription: 'Острова, храмы, уличная еда', popular: true },
];
