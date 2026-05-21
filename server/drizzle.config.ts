import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

/**
 * Drizzle Kit config — управляет генерацией миграций и Studio.
 *
 * Команды:
 *   npm run db:generate  — сгенерировать миграцию из изменений в schema.ts
 *   npm run db:migrate   — применить миграции (CLI-раннер в src/db/migrate.ts)
 *   npm run db:push      — синхронизация без миграций (только для dev!)
 *   npm run db:studio    — браузер БД на http://local.drizzle.studio
 */
export default defineConfig({
  schema: './src/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL ?? '',
  },
  /** В диффы попадают только enums/таблицы/индексы из нашей схемы */
  schemaFilter: ['public'],
  /** Чёткие имена снапшотов для ревью в git */
  verbose: true,
  strict: true,
});
