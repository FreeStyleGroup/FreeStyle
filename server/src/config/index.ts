import 'dotenv/config';
import { z } from 'zod';

/**
 * Конфигурация сервера — единая точка истины.
 *
 * Все env-переменные проходят через Zod-валидацию: если что-то критичное
 * не задано или в неверном формате — сервер падает на старте с понятным
 * сообщением, а не валится в рантайме на первом запросе.
 *
 * Никаких `process.env.X!` и неявных строк "undefined" по проекту.
 */
const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().int().positive().default(3001),
  CLIENT_URL: z.string().url().default('http://localhost:5173'),

  /** Postgres */
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  DATABASE_POOL_MAX: z.coerce.number().int().positive().default(10),

  /** JWT (нужны на Phase 2 — Auth) */
  JWT_ACCESS_SECRET: z.string().min(32, 'JWT_ACCESS_SECRET must be ≥ 32 chars'),
  JWT_REFRESH_SECRET: z.string().min(32, 'JWT_REFRESH_SECRET must be ≥ 32 chars'),
  JWT_ACCESS_TTL: z.string().default('15m'),
  JWT_REFRESH_TTL: z.string().default('30d'),

  /** Cookie настройки */
  COOKIE_DOMAIN: z.string().optional(),
  COOKIE_SECURE: z
    .enum(['true', 'false'])
    .default('false')
    .transform((v) => v === 'true'),

  /** Travelpayouts */
  TP_API_TOKEN: z.string().default(''),
  TP_MARKER: z.string().default(''),
  TP_PROJECT_ID: z.string().default(''),
  TP_API_BASE_URL: z.string().url().default('https://api.travelpayouts.com'),
  TP_AFFILIATE_BASE_URL: z.string().url().default('https://tp.media'),

  /** Кэш */
  CACHE_DEFAULT_TTL: z.coerce.number().int().positive().default(900),
  CACHE_REFERENCE_TTL: z.coerce.number().int().positive().default(86_400),

  /** Rate-limit */
  RATE_LIMIT_WINDOW_MS: z.coerce.number().int().positive().default(900_000),
  RATE_LIMIT_MAX_REQUESTS: z.coerce.number().int().positive().default(100),

  /** Локаль/валюта */
  DEFAULT_LOCALE: z.enum(['ru', 'en', 'zh']).default('ru'),
  DEFAULT_CURRENCY: z.enum(['rub', 'usd', 'eur', 'cny', 'aed']).default('rub'),

  /** Bcrypt cost factor — 10 для dev, 12 для prod (балансируем скорость/безопасность) */
  BCRYPT_COST: z.coerce.number().int().min(8).max(15).default(10),

  /** SMTP для email-verification и password-reset.
   *  Если SMTP_HOST пустой — letters логируются в консоль (dev-режим). */
  SMTP_HOST: z.string().default(''),
  SMTP_PORT: z.coerce.number().int().positive().default(587),
  SMTP_SECURE: z
    .enum(['true', 'false'])
    .default('false')
    .transform((v) => v === 'true'),
  SMTP_USER: z.string().default(''),
  SMTP_PASSWORD: z.string().default(''),
  MAIL_FROM: z.string().default('FreeStyle.ru <no-reply@freestyle.ru>'),

  /** AI-провайдер (AITunnel — OpenAI-compatible proxy, RU-friendly) */
  AITUNNEL_API_KEY: z.string().default(''),
  AITUNNEL_BASE_URL: z.string().url().default('https://api.aitunnel.ru/v1'),
  AITUNNEL_MODEL: z.string().default('gpt-4o-mini'),

  /** Включить scheduler авто-публикации (отключать в тестах) */
  SCHEDULER_ENABLED: z.enum(['true', 'false']).default('true').transform((v) => v === 'true'),

  /** Регистрация новых пользователей. На время разработки закрыта (false). */
  REGISTRATION_OPEN: z.enum(['true', 'false']).default('false').transform((v) => v === 'true'),
});

const parsed = envSchema.safeParse(process.env);
if (!parsed.success) {
  // eslint-disable-next-line no-console -- logger ещё не инициализирован на этом этапе
  console.error('❌ Invalid environment configuration:');
  console.error(parsed.error.flatten().fieldErrors);
  process.exit(1);
}

const env = parsed.data;

export const config = {
  nodeEnv: env.NODE_ENV,
  port: env.PORT,
  clientUrl: env.CLIENT_URL,

  db: {
    url: env.DATABASE_URL,
    poolMax: env.DATABASE_POOL_MAX,
  },

  jwt: {
    accessSecret: env.JWT_ACCESS_SECRET,
    refreshSecret: env.JWT_REFRESH_SECRET,
    accessTtl: env.JWT_ACCESS_TTL,
    refreshTtl: env.JWT_REFRESH_TTL,
  },

  cookie: {
    domain: env.COOKIE_DOMAIN,
    secure: env.COOKIE_SECURE,
  },

  bcrypt: {
    cost: env.BCRYPT_COST,
  },

  smtp: {
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: env.SMTP_SECURE,
    user: env.SMTP_USER,
    password: env.SMTP_PASSWORD,
    from: env.MAIL_FROM,
    /** Если host не задан — letters пишутся в логи, фактически не отправляются */
    enabled: env.SMTP_HOST.length > 0,
  },

  ai: {
    apiKey: env.AITUNNEL_API_KEY,
    baseUrl: env.AITUNNEL_BASE_URL,
    model: env.AITUNNEL_MODEL,
    enabled: env.AITUNNEL_API_KEY.length > 0,
  },

  scheduler: {
    enabled: env.SCHEDULER_ENABLED,
  },

  registrationOpen: env.REGISTRATION_OPEN,

  tp: {
    apiToken: env.TP_API_TOKEN,
    marker: env.TP_MARKER,
    projectId: env.TP_PROJECT_ID,
    apiBaseUrl: env.TP_API_BASE_URL,
    affiliateBaseUrl: env.TP_AFFILIATE_BASE_URL,
  },

  cache: {
    defaultTtl: env.CACHE_DEFAULT_TTL,
    referenceTtl: env.CACHE_REFERENCE_TTL,
  },

  rateLimit: {
    windowMs: env.RATE_LIMIT_WINDOW_MS,
    maxRequests: env.RATE_LIMIT_MAX_REQUESTS,
  },

  defaultLocale: env.DEFAULT_LOCALE,
  defaultCurrency: env.DEFAULT_CURRENCY,
} as const;
