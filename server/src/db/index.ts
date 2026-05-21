import { drizzle, type PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import postgres, { type Sql } from 'postgres';
import { config } from '../config/index.js';
import { logger } from '../utils/logger.js';
import * as schema from './schema.js';

/**
 * Production-grade Postgres connection pool через postgres-js (рекомендованный
 * драйвер для Drizzle). Один pool на процесс, реюзаем для всех запросов.
 *
 * Pool size подобран под сервер ~512MB RAM + 2 vCPU (стартовый VPS).
 * Если будем масштабироваться — пересмотрим `max` и `idle_timeout`.
 */
const client: Sql = postgres(config.db.url, {
  max: config.db.poolMax,
  idle_timeout: 20,
  connect_timeout: 10,
  prepare: true,
  /** Логируем ошибки соединения через pino, не через console */
  onnotice: (notice) => logger.warn({ notice }, 'pg notice'),
  /** SSL для managed-Postgres / прода — управляется через DATABASE_URL (?sslmode=require) */
});

export const db: PostgresJsDatabase<typeof schema> = drizzle(client, {
  schema,
  logger: config.nodeEnv === 'development'
    ? {
        logQuery: (query, params) => {
          logger.debug({ query, params }, 'drizzle query');
        },
      }
    : false,
});

/**
 * Health-check: используется в `/api/health` и при старте сервера —
 * подтверждаем, что Postgres достижим до того как Express начнёт принимать трафик.
 */
export async function checkDbConnection(): Promise<void> {
  await client`select 1 as ok`;
}

/**
 * Graceful shutdown — закрываем пул при SIGTERM/SIGINT, чтобы Docker корректно
 * перезапускал контейнер без зависших соединений.
 */
export async function closeDb(): Promise<void> {
  await client.end({ timeout: 5 });
}

export { schema };
