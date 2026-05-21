# `server/src/db` — Postgres + Drizzle ORM

Слой работы с БД для FreeStyle.ru. Никакого raw SQL вне миграций, никаких `pg.query` в сервисах — только через `db` из этого модуля и Drizzle-query builder.

## Файлы

| Файл | Назначение |
|---|---|
| `schema.ts` | Все таблицы и enums. Единая точка истины — отсюда генерятся миграции, типы вытаскиваются `$inferSelect / $inferInsert`. |
| `index.ts` | Подключение к Postgres (postgres-js + Drizzle), `db` для запросов, `checkDbConnection`, `closeDb`. |
| `migrate.ts` | CLI-раннер миграций. Запускается через `npm run db:migrate` и в Docker entrypoint. |

Миграции лежат в `server/drizzle/` (git-tracked, генерятся `drizzle-kit generate`).

## Команды

```bash
# Локально поднять Postgres
docker compose up -d postgres

# Сгенерировать миграцию из изменений schema.ts
npm run db:generate

# Применить миграции (в проде делается автоматически в Docker entrypoint)
npm run db:migrate

# Быстрый sync без миграций — ТОЛЬКО для dev-экспериментов!
npm run db:push

# Браузер БД на http://local.drizzle.studio
npm run db:studio
```

## Workflow при изменении схемы

1. Редактируем `schema.ts` (добавили колонку / таблицу / enum).
2. `npm run db:generate` — Drizzle создаёт новый файл в `drizzle/NNNN_*.sql`.
3. **Смотрим diff** SQL-файла в git — Drizzle иногда генерит неоптимально, ревью обязательно.
4. `npm run db:migrate` — применяем локально, проверяем.
5. Коммитим `schema.ts` + папку `drizzle/` вместе. На проде миграции применятся при старте контейнера.

## Соглашения

- **UUID PK** на всех бизнес-сущностях (`gen_random_uuid()` через `defaultRandom()`).
- **timestamps с TZ** (`timestamp({ withTimezone: true })`) везде. Никаких naive timestamps.
- **`created_at` / `updated_at`** на каждой таблице, soft-delete (`deleted_at`) где нужен аудит.
- **FK с явным `onDelete`** — `cascade` для зависимых данных (refresh_tokens, favorites), `restrict` для бизнес-критичных (bookings → users), `set null` для опциональных связей (post.authorId).
- **Индексы** на все FK + поля поиска/сортировки.
- **Enum'ы через pgEnum** (не varchar+CHECK), чтобы получить тип на TS-стороне.
- **jsonb** для гибких payload'ов (booking.payload, audit.meta), с `$type<T>()` для типизации.

## Что НЕ делаем

- ❌ `db.execute(sql\`SELECT...\`)` в сервисах — только через query-builder
- ❌ Прямые `client.query()` в обход Drizzle (теряется типобезопасность)
- ❌ Ручные `ALTER TABLE` через psql — только через миграции
- ❌ `as User` / type assertions — Drizzle сам выводит типы корректно
