import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';
import { config } from '../config/index.js';
import { logger } from '../utils/logger.js';

/**
 * Папка миграций резолвится относительно ЭТОГО файла, а не cwd.
 * dev:  server/src/db/migrate.ts  → ../../drizzle = server/drizzle
 * prod: server/dist/db/migrate.js → ../../drizzle = server/drizzle (скопирована в Docker)
 * Иначе `./drizzle` ломается в контейнере (cwd=/app, а миграции в /app/server/drizzle).
 */
const migrationsFolder = resolve(dirname(fileURLToPath(import.meta.url)), '../../drizzle');

/**
 * CLI-раннер миграций. Запускается вручную (`npm run db:migrate`)
 * и автоматически в Docker entrypoint перед стартом сервера.
 *
 * Использует отдельное короткоживущее соединение (max:1) — не трогает
 * прод-пул из src/db/index.ts.
 */
async function main(): Promise<void> {
  logger.info({ url: redactUrl(config.db.url) }, 'Running drizzle migrations…');

  const migrationClient = postgres(config.db.url, { max: 1 });
  const migrationDb = drizzle(migrationClient);

  try {
    await migrate(migrationDb, { migrationsFolder });
    logger.info('Migrations applied successfully');
  } finally {
    await migrationClient.end({ timeout: 5 });
  }
}

function redactUrl(url: string): string {
  return url.replace(/\/\/([^:]+):([^@]+)@/, '//$1:****@');
}

main().catch((err) => {
  logger.fatal(err, 'Migration failed');
  process.exit(1);
});
