import { sql } from 'drizzle-orm';
import {
  pgEnum,
  pgTable,
  uuid,
  text,
  varchar,
  boolean,
  integer,
  numeric,
  timestamp,
  jsonb,
  index,
  uniqueIndex,
  primaryKey,
  type AnyPgColumn,
} from 'drizzle-orm/pg-core';

/* ─────────────────────────────────────────────────────────────
 * Enums
 * ────────────────────────────────────────────────────────────*/

export const userRoleEnum = pgEnum('user_role', ['user', 'editor', 'admin']);
export const userStatusEnum = pgEnum('user_status', ['active', 'banned', 'pending']);
export const localeEnum = pgEnum('locale', ['ru', 'en', 'zh']);
export const currencyEnum = pgEnum('currency', ['rub', 'usd', 'eur', 'cny', 'aed']);

export const oauthProviderEnum = pgEnum('oauth_provider', [
  'yandex',
  'vk',
  'telegram',
]);

export const userTierEnum = pgEnum('user_tier', ['bronze', 'silver', 'gold', 'platinum']);

export const documentTypeEnum = pgEnum('document_type', [
  'passport',
  'foreign_passport',
  'visa',
  'id_card',
  'driver_license',
  'photo',
  'other',
]);

export const walletTxnTypeEnum = pgEnum('wallet_txn_type', [
  'accrual',
  'spend',
  'refund',
  'manual_adjustment',
  'expired',
]);

export const walletKindEnum = pgEnum('wallet_kind', ['miles', 'cashback']);

export const postStatusEnum = pgEnum('post_status', [
  'draft',
  'scheduled',
  'published',
  'archived',
]);

export const bookingTypeEnum = pgEnum('booking_type', [
  'flight',
  'hotel',
  'tour',
  'visa',
  'transfer',
  'insurance',
]);

export const bookingStatusEnum = pgEnum('booking_status', [
  'pending',
  'confirmed',
  'paid',
  'cancelled',
  'completed',
  'refunded',
]);

export const favoriteTypeEnum = pgEnum('favorite_type', [
  'flight',
  'hotel',
  'destination',
  'post',
  'tour',
]);

export const ideaStatusEnum = pgEnum('idea_status', [
  'draft',
  'approved',
  'rejected',
  'used',
]);

export const publishChannelEnum = pgEnum('publish_channel', [
  'site',
  'telegram',
  'dzen',
  'vk',
]);

export const publishJobStatusEnum = pgEnum('publish_job_status', [
  'queued',
  'running',
  'done',
  'failed',
  'cancelled',
]);

export const contactMessageStatusEnum = pgEnum('contact_message_status', [
  'new',
  'in_progress',
  'resolved',
  'spam',
]);

/* ─────────────────────────────────────────────────────────────
 * users — ядро. Все профильные поля плюс soft-delete.
 * ────────────────────────────────────────────────────────────*/

export const users = pgTable(
  'users',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    email: varchar('email', { length: 320 }).notNull(),
    emailNormalized: varchar('email_normalized', { length: 320 }).notNull(),
    emailVerifiedAt: timestamp('email_verified_at', { withTimezone: true }),
    passwordHash: text('password_hash'),

    name: varchar('name', { length: 120 }).notNull(),
    phone: varchar('phone', { length: 32 }),
    avatarUrl: text('avatar_url'),

    role: userRoleEnum('role').default('user').notNull(),
    status: userStatusEnum('status').default('active').notNull(),
    locale: localeEnum('locale').default('ru').notNull(),
    currency: currencyEnum('currency').default('rub').notNull(),

    /** Loyalty: tier + текущие балансы. Транзакции — в wallet_transactions. */
    tier: userTierEnum('tier').default('bronze').notNull(),
    milesBalance: integer('miles_balance').default(0).notNull(),
    cashbackBalance: numeric('cashback_balance', { precision: 12, scale: 2 })
      .default('0')
      .notNull(),

    /** Маркетинговые согласия (для email-маркетинга, push'ей и т.д.) */
    marketingOptIn: boolean('marketing_opt_in').default(false).notNull(),

    /** Произвольные настройки UI/нотификаций */
    preferences: jsonb('preferences').$type<Record<string, unknown>>().default({}).notNull(),

    lastLoginAt: timestamp('last_login_at', { withTimezone: true }),
    lastLoginIp: varchar('last_login_ip', { length: 64 }),

    createdAt: timestamp('created_at', { withTimezone: true })
      .default(sql`now()`)
      .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .default(sql`now()`)
      .notNull(),
    deletedAt: timestamp('deleted_at', { withTimezone: true }),
  },
  (t) => ({
    emailNormalizedUq: uniqueIndex('users_email_normalized_uq').on(t.emailNormalized),
    roleIdx: index('users_role_idx').on(t.role),
    statusIdx: index('users_status_idx').on(t.status),
    createdAtIdx: index('users_created_at_idx').on(t.createdAt),
  }),
);

/* ─────────────────────────────────────────────────────────────
 * social_accounts — OAuth-привязки (Yandex/VK/Telegram)
 * ────────────────────────────────────────────────────────────*/

export const socialAccounts = pgTable(
  'social_accounts',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id')
      .references(() => users.id, { onDelete: 'cascade' })
      .notNull(),
    provider: oauthProviderEnum('provider').notNull(),
    providerUserId: varchar('provider_user_id', { length: 128 }).notNull(),
    /** Дополнительные данные провайдера (имя/email/avatar в момент авторизации) */
    profile: jsonb('profile').$type<Record<string, unknown>>().default({}).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true })
      .default(sql`now()`)
      .notNull(),
  },
  (t) => ({
    providerUq: uniqueIndex('social_provider_user_uq').on(t.provider, t.providerUserId),
    userIdx: index('social_user_idx').on(t.userId),
  }),
);

/* ─────────────────────────────────────────────────────────────
 * refresh_tokens — rotating refresh-token store.
 * Храним хеш (sha256), не plain. На каждый ротейт создаём новую запись
 * и помечаем предыдущую как revoked + replacedById для аудита.
 * ────────────────────────────────────────────────────────────*/

export const refreshTokens = pgTable(
  'refresh_tokens',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id')
      .references(() => users.id, { onDelete: 'cascade' })
      .notNull(),
    tokenHash: varchar('token_hash', { length: 128 }).notNull(),
    userAgent: text('user_agent'),
    ip: varchar('ip', { length: 64 }),

    expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true })
      .default(sql`now()`)
      .notNull(),
    revokedAt: timestamp('revoked_at', { withTimezone: true }),

    /** Self-fk: новый refresh, заменивший этот (для обнаружения reuse-атак) */
    replacedById: uuid('replaced_by_id').references((): AnyPgColumn => refreshTokens.id, {
      onDelete: 'set null',
    }),
  },
  (t) => ({
    tokenHashUq: uniqueIndex('refresh_token_hash_uq').on(t.tokenHash),
    userIdx: index('refresh_user_idx').on(t.userId),
    expiresIdx: index('refresh_expires_idx').on(t.expiresAt),
  }),
);

/* ─────────────────────────────────────────────────────────────
 * email_verifications / password_resets — короткоживущие токены
 * ────────────────────────────────────────────────────────────*/

export const emailVerifications = pgTable(
  'email_verifications',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id')
      .references(() => users.id, { onDelete: 'cascade' })
      .notNull(),
    tokenHash: varchar('token_hash', { length: 128 }).notNull(),
    expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
    usedAt: timestamp('used_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true })
      .default(sql`now()`)
      .notNull(),
  },
  (t) => ({
    tokenHashUq: uniqueIndex('email_verif_token_hash_uq').on(t.tokenHash),
    userIdx: index('email_verif_user_idx').on(t.userId),
  }),
);

export const passwordResets = pgTable(
  'password_resets',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id')
      .references(() => users.id, { onDelete: 'cascade' })
      .notNull(),
    tokenHash: varchar('token_hash', { length: 128 }).notNull(),
    expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
    usedAt: timestamp('used_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true })
      .default(sql`now()`)
      .notNull(),
  },
  (t) => ({
    tokenHashUq: uniqueIndex('pwd_reset_token_hash_uq').on(t.tokenHash),
    userIdx: index('pwd_reset_user_idx').on(t.userId),
  }),
);

/* ─────────────────────────────────────────────────────────────
 * categories — для блога и контент-завода.
 * Self-fk для иерархии (опционально).
 * ────────────────────────────────────────────────────────────*/

export const categories = pgTable(
  'categories',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    slug: varchar('slug', { length: 120 }).notNull(),
    name: varchar('name', { length: 160 }).notNull(),
    description: text('description'),
    parentId: uuid('parent_id').references((): AnyPgColumn => categories.id, {
      onDelete: 'set null',
    }),
    sortOrder: integer('sort_order').default(0).notNull(),
    locale: localeEnum('locale').default('ru').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true })
      .default(sql`now()`)
      .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .default(sql`now()`)
      .notNull(),
  },
  (t) => ({
    slugLocaleUq: uniqueIndex('categories_slug_locale_uq').on(t.slug, t.locale),
    parentIdx: index('categories_parent_idx').on(t.parentId),
  }),
);

/* ─────────────────────────────────────────────────────────────
 * posts — статьи блога. Markdown + html-сниппет (для отдачи без рендера).
 * ────────────────────────────────────────────────────────────*/

export const posts = pgTable(
  'posts',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    slug: varchar('slug', { length: 160 }).notNull(),
    locale: localeEnum('locale').default('ru').notNull(),

    title: text('title').notNull(),
    excerpt: text('excerpt'),
    contentMd: text('content_md').notNull(),
    contentHtml: text('content_html').notNull(),
    coverUrl: text('cover_url'),

    /** SEO */
    seoTitle: text('seo_title'),
    seoDescription: text('seo_description'),
    seoKeywords: text('seo_keywords'),

    /** Связи */
    authorId: uuid('author_id').references(() => users.id, { onDelete: 'set null' }),
    categoryId: uuid('category_id').references(() => categories.id, { onDelete: 'set null' }),

    /** Состояние */
    status: postStatusEnum('status').default('draft').notNull(),
    publishedAt: timestamp('published_at', { withTimezone: true }),
    scheduledAt: timestamp('scheduled_at', { withTimezone: true }),

    /** Метрики */
    viewsCount: integer('views_count').default(0).notNull(),
    readingMinutes: integer('reading_minutes').default(0).notNull(),

    /** Теги — простой массив строк, без отдельной таблицы (для MVP достаточно) */
    tags: jsonb('tags').$type<string[]>().default([]).notNull(),

    createdAt: timestamp('created_at', { withTimezone: true })
      .default(sql`now()`)
      .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .default(sql`now()`)
      .notNull(),
  },
  (t) => ({
    slugLocaleUq: uniqueIndex('posts_slug_locale_uq').on(t.slug, t.locale),
    statusIdx: index('posts_status_idx').on(t.status),
    publishedAtIdx: index('posts_published_at_idx').on(t.publishedAt),
    categoryIdx: index('posts_category_idx').on(t.categoryId),
    authorIdx: index('posts_author_idx').on(t.authorId),
  }),
);

/* ─────────────────────────────────────────────────────────────
 * bookings — заказы пользователя: перелёты, отели, туры, визы.
 * Каждый тип хранит спецификацию в payload (jsonb), нормализованные суммы — в колонках.
 * ────────────────────────────────────────────────────────────*/

export const bookings = pgTable(
  'bookings',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    /** Человеко-читаемый номер для клиента (FS-2026-000123) */
    publicId: varchar('public_id', { length: 24 }).notNull(),

    userId: uuid('user_id')
      .references(() => users.id, { onDelete: 'restrict' })
      .notNull(),

    type: bookingTypeEnum('type').notNull(),
    status: bookingStatusEnum('status').default('pending').notNull(),

    /** Сумма заказа в валюте платежа */
    amount: numeric('amount', { precision: 14, scale: 2 }).notNull(),
    currency: currencyEnum('currency').notNull(),

    /** Внешний референс провайдера (TP order id, hotel PNR, etc.) */
    providerRefId: varchar('provider_ref_id', { length: 128 }),

    /** Полный спекcп заказа: маршрут, гости, опции, ссылки, etc. */
    payload: jsonb('payload').$type<Record<string, unknown>>().default({}).notNull(),

    /** Заметки агента / админа */
    adminNotes: text('admin_notes'),

    createdAt: timestamp('created_at', { withTimezone: true })
      .default(sql`now()`)
      .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .default(sql`now()`)
      .notNull(),
    paidAt: timestamp('paid_at', { withTimezone: true }),
    cancelledAt: timestamp('cancelled_at', { withTimezone: true }),
    completedAt: timestamp('completed_at', { withTimezone: true }),
  },
  (t) => ({
    publicIdUq: uniqueIndex('bookings_public_id_uq').on(t.publicId),
    userIdx: index('bookings_user_idx').on(t.userId),
    statusIdx: index('bookings_status_idx').on(t.status),
    typeIdx: index('bookings_type_idx').on(t.type),
    createdAtIdx: index('bookings_created_at_idx').on(t.createdAt),
  }),
);

/* ─────────────────────────────────────────────────────────────
 * favorites — избранное (отели, направления, статьи).
 * Composite-pk на (userId, type, refId) гарантирует идемпотентность.
 * ────────────────────────────────────────────────────────────*/

export const favorites = pgTable(
  'favorites',
  {
    userId: uuid('user_id')
      .references(() => users.id, { onDelete: 'cascade' })
      .notNull(),
    type: favoriteTypeEnum('type').notNull(),
    refId: varchar('ref_id', { length: 160 }).notNull(),
    payload: jsonb('payload').$type<Record<string, unknown>>().default({}).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true })
      .default(sql`now()`)
      .notNull(),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.userId, t.type, t.refId] }),
    userTypeIdx: index('favorites_user_type_idx').on(t.userId, t.type),
  }),
);

/* ─────────────────────────────────────────────────────────────
 * ideas — Content Factory: AI-сгенерированные идеи статей.
 * ────────────────────────────────────────────────────────────*/

export const ideas = pgTable(
  'ideas',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    /** Prompt/seed для генерации (тема, ключи, целевая аудитория) */
    prompt: text('prompt').notNull(),
    /** Сгенерированный заголовок */
    title: text('title').notNull(),
    /** Outline в markdown */
    outline: text('outline'),
    /** Estimated keywords / SEO targets */
    keywords: jsonb('keywords').$type<string[]>().default([]).notNull(),

    categoryId: uuid('category_id').references(() => categories.id, { onDelete: 'set null' }),
    locale: localeEnum('locale').default('ru').notNull(),

    status: ideaStatusEnum('status').default('draft').notNull(),
    /** Если идея превратилась в пост — линк */
    resultingPostId: uuid('resulting_post_id').references(() => posts.id, {
      onDelete: 'set null',
    }),

    createdById: uuid('created_by_id').references(() => users.id, { onDelete: 'set null' }),
    createdAt: timestamp('created_at', { withTimezone: true })
      .default(sql`now()`)
      .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .default(sql`now()`)
      .notNull(),
  },
  (t) => ({
    statusIdx: index('ideas_status_idx').on(t.status),
    categoryIdx: index('ideas_category_idx').on(t.categoryId),
  }),
);

/* ─────────────────────────────────────────────────────────────
 * publish_jobs — расписание автопубликаций по каналам.
 * ────────────────────────────────────────────────────────────*/

export const publishJobs = pgTable(
  'publish_jobs',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    postId: uuid('post_id')
      .references(() => posts.id, { onDelete: 'cascade' })
      .notNull(),
    channel: publishChannelEnum('channel').notNull(),

    status: publishJobStatusEnum('status').default('queued').notNull(),
    scheduledAt: timestamp('scheduled_at', { withTimezone: true }).notNull(),
    startedAt: timestamp('started_at', { withTimezone: true }),
    completedAt: timestamp('completed_at', { withTimezone: true }),

    /** Внешний идентификатор публикации (post_id в Telegram, в Дзене и т.д.) */
    externalRefId: varchar('external_ref_id', { length: 256 }),
    /** Кол-во попыток + сообщение последней ошибки */
    attempts: integer('attempts').default(0).notNull(),
    lastError: text('last_error'),

    createdAt: timestamp('created_at', { withTimezone: true })
      .default(sql`now()`)
      .notNull(),
  },
  (t) => ({
    postIdx: index('publish_jobs_post_idx').on(t.postId),
    statusIdx: index('publish_jobs_status_idx').on(t.status),
    scheduledIdx: index('publish_jobs_scheduled_idx').on(t.scheduledAt),
  }),
);

/* ─────────────────────────────────────────────────────────────
 * user_documents — паспорта, визы, фото для быстрого ввода в брони.
 * Файлы лежат на диске (server/uploads/...) либо в S3-совместимом storage;
 * в БД храним только метаданные + URL.
 * ────────────────────────────────────────────────────────────*/

export const userDocuments = pgTable(
  'user_documents',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id')
      .references(() => users.id, { onDelete: 'cascade' })
      .notNull(),
    type: documentTypeEnum('type').notNull(),
    /** Произвольное имя от пользователя ("Загранпаспорт Алексея") */
    name: varchar('name', { length: 160 }).notNull(),
    /** Серия/номер документа — храним в plain (не для платежей, не PCI). */
    number: varchar('number', { length: 64 }),
    /** Полная дата выдачи / окончания — для напоминаний об истечении. */
    issuedAt: timestamp('issued_at', { withTimezone: true }),
    expiresAt: timestamp('expires_at', { withTimezone: true }),
    /** Имя страны выдачи в формате ISO 3166-1 alpha-2 ("RU", "AE", ...) */
    countryCode: varchar('country_code', { length: 2 }),
    /** URL файла-скана (фото/PDF). Прямая ссылка на uploads/ или CDN. */
    fileUrl: text('file_url'),
    /** Произвольные доп.поля (имя/фамилия латиницей и т.п.) */
    meta: jsonb('meta').$type<Record<string, unknown>>().default({}).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true })
      .default(sql`now()`)
      .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .default(sql`now()`)
      .notNull(),
  },
  (t) => ({
    userIdx: index('user_docs_user_idx').on(t.userId),
    typeIdx: index('user_docs_type_idx').on(t.userId, t.type),
    expiresIdx: index('user_docs_expires_idx').on(t.expiresAt),
  }),
);

/* ─────────────────────────────────────────────────────────────
 * wallet_transactions — все движения по милям и кэшбэку.
 * Балансы в users (cached) ОБЯЗАНЫ совпадать с суммой транзакций.
 * ────────────────────────────────────────────────────────────*/

export const walletTransactions = pgTable(
  'wallet_transactions',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id')
      .references(() => users.id, { onDelete: 'cascade' })
      .notNull(),
    kind: walletKindEnum('kind').notNull(),
    type: walletTxnTypeEnum('type').notNull(),
    /** Положительное для accrual/refund, отрицательное для spend/expired */
    amount: numeric('amount', { precision: 14, scale: 2 }).notNull(),
    /** Денежная валюта для cashback (RUB/USD/EUR); для миль — null */
    currency: currencyEnum('currency'),
    description: text('description').notNull(),
    /** Связанный заказ (если транзакция накопления/возврата по брони) */
    bookingId: uuid('booking_id').references(() => bookings.id, {
      onDelete: 'set null',
    }),
    createdAt: timestamp('created_at', { withTimezone: true })
      .default(sql`now()`)
      .notNull(),
  },
  (t) => ({
    userIdx: index('wallet_user_idx').on(t.userId),
    userKindIdx: index('wallet_user_kind_idx').on(t.userId, t.kind),
    createdAtIdx: index('wallet_created_at_idx').on(t.createdAt),
  }),
);

/* ─────────────────────────────────────────────────────────────
 * referrals — реф-код юзера + агрегированная статистика.
 * referral_redemptions — кто кого пригласил и какие миль начислены.
 * ────────────────────────────────────────────────────────────*/

export const referrals = pgTable(
  'referrals',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    ownerId: uuid('owner_id')
      .references(() => users.id, { onDelete: 'cascade' })
      .notNull(),
    code: varchar('code', { length: 24 }).notNull(),
    signupsCount: integer('signups_count').default(0).notNull(),
    bookingsCount: integer('bookings_count').default(0).notNull(),
    totalMilesEarned: integer('total_miles_earned').default(0).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true })
      .default(sql`now()`)
      .notNull(),
  },
  (t) => ({
    codeUq: uniqueIndex('referrals_code_uq').on(t.code),
    ownerUq: uniqueIndex('referrals_owner_uq').on(t.ownerId),
  }),
);

export const referralRedemptions = pgTable(
  'referral_redemptions',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    referralId: uuid('referral_id')
      .references(() => referrals.id, { onDelete: 'cascade' })
      .notNull(),
    invitedUserId: uuid('invited_user_id')
      .references(() => users.id, { onDelete: 'cascade' })
      .notNull(),
    /** Первичная регистрация — миль начислили */
    awardedAt: timestamp('awarded_at', { withTimezone: true }),
    milesAwarded: integer('miles_awarded').default(0).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true })
      .default(sql`now()`)
      .notNull(),
  },
  (t) => ({
    referralIdx: index('referral_redemptions_referral_idx').on(t.referralId),
    invitedUq: uniqueIndex('referral_redemptions_invited_uq').on(t.invitedUserId),
  }),
);

/* ─────────────────────────────────────────────────────────────
 * contact_messages — заявки из формы «Контакты» на сайте.
 * Любой может оставить (анонимно или авторизованным).
 * Админка через AdminUsersService потом сможет смотреть/менять статус.
 * ────────────────────────────────────────────────────────────*/

export const contactMessages = pgTable(
  'contact_messages',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    /** Если автор — авторизованный юзер, кладём его id; для гостей null */
    userId: uuid('user_id').references(() => users.id, { onDelete: 'set null' }),

    name: varchar('name', { length: 120 }).notNull(),
    email: varchar('email', { length: 320 }).notNull(),
    phone: varchar('phone', { length: 32 }),
    subject: varchar('subject', { length: 200 }),
    message: text('message').notNull(),

    /** Дополнительный контекст: страница откуда отправили, UA, реф-источник */
    sourcePage: text('source_page'),
    userAgent: text('user_agent'),
    ip: varchar('ip', { length: 64 }),

    status: contactMessageStatusEnum('status').default('new').notNull(),
    adminNotes: text('admin_notes'),

    createdAt: timestamp('created_at', { withTimezone: true })
      .default(sql`now()`)
      .notNull(),
    repliedAt: timestamp('replied_at', { withTimezone: true }),
  },
  (t) => ({
    statusIdx: index('contact_status_idx').on(t.status),
    createdAtIdx: index('contact_created_at_idx').on(t.createdAt),
    emailIdx: index('contact_email_idx').on(t.email),
  }),
);

/* ─────────────────────────────────────────────────────────────
 * audit_log — для админки: кто что сделал.
 * ────────────────────────────────────────────────────────────*/

export const auditLog = pgTable(
  'audit_log',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    actorId: uuid('actor_id').references(() => users.id, { onDelete: 'set null' }),
    action: varchar('action', { length: 80 }).notNull(),
    entityType: varchar('entity_type', { length: 80 }),
    entityId: varchar('entity_id', { length: 64 }),
    /** Произвольные детали изменения (diff, before/after, ip и т.д.) */
    meta: jsonb('meta').$type<Record<string, unknown>>().default({}).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true })
      .default(sql`now()`)
      .notNull(),
  },
  (t) => ({
    actorIdx: index('audit_actor_idx').on(t.actorId),
    actionIdx: index('audit_action_idx').on(t.action),
    entityIdx: index('audit_entity_idx').on(t.entityType, t.entityId),
    createdAtIdx: index('audit_created_at_idx').on(t.createdAt),
  }),
);

/* ─────────────────────────────────────────────────────────────
 * Type aliases — экспортируем для использования в сервисах/контроллерах.
 * ────────────────────────────────────────────────────────────*/

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type RefreshToken = typeof refreshTokens.$inferSelect;
export type NewRefreshToken = typeof refreshTokens.$inferInsert;

export type SocialAccount = typeof socialAccounts.$inferSelect;

export type Category = typeof categories.$inferSelect;
export type Post = typeof posts.$inferSelect;
export type NewPost = typeof posts.$inferInsert;

export type Booking = typeof bookings.$inferSelect;
export type NewBooking = typeof bookings.$inferInsert;

export type Favorite = typeof favorites.$inferSelect;
export type Idea = typeof ideas.$inferSelect;
export type PublishJob = typeof publishJobs.$inferSelect;
export type AuditLogEntry = typeof auditLog.$inferSelect;

export type UserDocument = typeof userDocuments.$inferSelect;
export type NewUserDocument = typeof userDocuments.$inferInsert;
export type WalletTransaction = typeof walletTransactions.$inferSelect;
export type NewWalletTransaction = typeof walletTransactions.$inferInsert;
export type Referral = typeof referrals.$inferSelect;
export type ReferralRedemption = typeof referralRedemptions.$inferSelect;
export type ContactMessage = typeof contactMessages.$inferSelect;
export type NewContactMessage = typeof contactMessages.$inferInsert;
