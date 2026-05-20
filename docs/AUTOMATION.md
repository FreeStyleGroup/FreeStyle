# Автоматизация · CI/CD, Vercel, cron

Деплой, прогрев кеша, бекапы, мониторинг. Всё что нужно чтобы FreeStyle жил без ручного вмешательства.

## Деплой — Vercel

### Структура monorepo на Vercel

У нас npm workspaces (`shared` / `server` / `client`). Vercel «из коробки» работает с Next.js, но для нашего раздельного `client` (Vite) + `server` (Express) нужна конфигурация.

**`vercel.json`** (в корне):

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "client/dist",
  "rewrites": [
    { "source": "/api/(.*)", "destination": "/api/$1" }
  ],
  "functions": {
    "server/dist/index.js": {
      "maxDuration": 30
    }
  }
}
```

> ⚠️ Текущий `vercel.json` в корне есть, но конкретное содержимое не проверял. Перед деплоем привести к этому виду.

### Альтернатива — два Vercel-проекта

Можно деплоить **разделённо**:
- **`freestyle-client`** — Vite-приложение из `client/`, статика на CDN
- **`freestyle-server`** — Node API из `server/`, как serverless functions

Это проще и масштабируется лучше. CORS настроен в `app.ts` через `CLIENT_URL` env.

### Env-переменные на Vercel

В dashboard Vercel → Project → Settings → Environment Variables:

| Переменная | Значение | Окружения |
|---|---|---|
| `NODE_ENV` | `production` | Production |
| `CLIENT_URL` | `https://freestyle.ru` (например) | Production |
| `TP_API_TOKEN` | реальный токен из ЛК TP | All |
| `TP_MARKER` | партнёрский ID | All |
| `DATABASE_URL` | URL Vercel Postgres / Neon | All |
| `JWT_SECRET` | случайные 64+ символа | All |
| `BLOB_READ_WRITE_TOKEN` | из Vercel Blob | All |
| `AITUNNEL_API_KEY` | (если включена AI-фабрика) | All |
| `KV_URL`, `KV_REST_API_URL`, `KV_REST_API_TOKEN` | для Vercel KV | All |

**Preview** = staging для feature-веток. Можно использовать те же ключи или отдельные тестовые.

### Команды

```bash
# Локально
vercel link              # привязать к проекту
vercel pull              # стянуть env
vercel dev               # запустить локально с настройками Vercel

# Деплой
vercel                   # preview deploy (для feature-веток)
vercel --prod            # prod deploy

# Логи
vercel logs              # последние логи production
vercel logs <url>        # логи конкретного deployment
```

## База данных

### Vercel Postgres

Самый простой путь — встроенная Postgres в Vercel:
1. Dashboard → Storage → Create → Postgres
2. Vercel автоматически добавит `DATABASE_URL` (и `POSTGRES_*` варианты) в env проекта
3. Подключение из server-кода через `drizzle-orm/postgres` уже сконфигурировано

### Миграции

```bash
# В server/
npm run db:generate       # сгенерирует SQL из schema.ts
npm run db:migrate        # применит миграции к DATABASE_URL
npm run db:studio         # GUI для просмотра БД (Drizzle Studio)
```

В `server/package.json` добавить:
```json
"scripts": {
  "db:generate": "drizzle-kit generate",
  "db:migrate":  "drizzle-kit migrate",
  "db:studio":   "drizzle-kit studio"
}
```

### Миграции на проде

После каждого деплоя, если есть новые миграции:
```bash
vercel env pull .env.production
DATABASE_URL=$(cat .env.production | grep DATABASE_URL) npm run db:migrate -w server
```

Или через GitHub Actions (см. ниже).

### Бэкапы БД

Vercel Postgres делает автоматические бэкапы (Point-in-Time Recovery на платных планах). На free-плане нужно вручную:

```bash
# Раз в сутки экспорт
pg_dump $DATABASE_URL > backup-$(date +%Y%m%d).sql
```

Лучше настроить **Neon** (бесплатные snapshot'ы) или GitHub Actions cron job.

## Кеш на проде — Vercel KV (Redis)

Сейчас в коде `node-cache` (in-memory). На Vercel functions stateless → кеш умирает между запросами.

**Решение:** заменить `services/cache.service.ts` обёрткой над Vercel KV:

```ts
import { kv } from '@vercel/kv';

export const cacheService = {
  async get<T>(key: string): Promise<T | undefined> {
    return await kv.get<T>(key) ?? undefined;
  },
  async set(key: string, value: any, ttlSeconds: number): Promise<void> {
    await kv.set(key, value, { ex: ttlSeconds });
  },
  async del(key: string): Promise<void> {
    await kv.del(key);
  },
};
```

Подключение:
1. Vercel Dashboard → Storage → Create → KV
2. Env-переменные `KV_*` появятся автоматически
3. `npm install -w server @vercel/kv`

**Совместимость:** интерфейс get/set/del тот же что у node-cache (только async). Все services TP менять не придётся — только обёртка.

## Cron задачи

Vercel поддерживает Cron Jobs (бесплатно до 2 cron в free plan, до 100 в Pro).

**`vercel.json`**:
```json
{
  "crons": [
    {
      "path": "/api/cron/warm-popular",
      "schedule": "0 */6 * * *"        // каждые 6 часов
    },
    {
      "path": "/api/cron/cleanup-sessions",
      "schedule": "0 3 * * *"           // в 3 ночи
    }
  ]
}
```

### Cron 1 · Прогрев кеша популярных направлений

`/api/cron/warm-popular` — раз в 6 часов прогревает кеш `getPopularDirections` для топ-городов (MOW, LED, KZN, SVX, OVB, ...) → юзеры всегда получают мгновенные данные на главной.

```ts
// server/src/routes/cron/warm-popular.ts
router.get('/', async (req, res) => {
  // Защита: Vercel передаёт authorization header с CRON_SECRET
  if (req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  const cities = ['MOW', 'LED', 'KZN', 'SVX', 'OVB', 'KRR', 'AER'];
  for (const origin of cities) {
    await flightsService.getPopularDirections(origin);
    await flightsService.getCheapTickets({ origin });
  }
  res.json({ ok: true, warmed: cities });
});
```

### Cron 2 · Чистка истёкших сессий

`/api/cron/cleanup-sessions` — раз в сутки удаляет refresh-сессии с истёкшим `expiresAt`.

```ts
router.get('/', async (req, res) => {
  if (req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  const result = await db.delete(sessions).where(lt(sessions.expiresAt, new Date()));
  res.json({ ok: true, deleted: result.rowCount });
});
```

### Cron 3 (опц.) · Sitemap regeneration

`/api/cron/regenerate-sitemap` — раз в сутки пересобирает `sitemap.xml` с новыми статьями блога. Или генерировать on-the-fly при запросе `/sitemap.xml`.

### Cron 4 (опц.) · Hot prices digest

`/api/cron/hot-deals` — раз в день находит топ-10 «горячих цен» через TP, сохраняет в БД таблицу `hot_deals`. На главной выводим эти 10 (без обращения к TP — быстрее).

## CI/CD через GitHub Actions

`.github/workflows/ci.yml`:

```yaml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      - run: npm run build
      - run: npm run lint
      # - run: npm run test       # когда добавим тесты

  deploy-preview:
    if: github.event_name == 'pull_request'
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm i -g vercel
      - run: vercel pull --yes --environment=preview --token=${{ secrets.VERCEL_TOKEN }}
      - run: vercel build --token=${{ secrets.VERCEL_TOKEN }}
      - run: vercel deploy --prebuilt --token=${{ secrets.VERCEL_TOKEN }}
```

Vercel сам делает auto-deploy при пуше в main, поэтому GitHub Actions нужны в основном для:
- Прохождения тестов перед мерджем (если будут unit/E2E)
- Применения миграций БД
- Создания custom preview URL

## Логи и мониторинг

### Pino-логи на Vercel

`pino` пишет в stdout → Vercel сохраняет последние ~6 часов. Для долгосрочного хранения:

**Опция 1:** Pino transport → Logtail / Axiom / Datadog (платно)
**Опция 2:** Vercel Log Drains → отправляют логи в S3 / Datadog (платно)
**Опция 3:** Достаточно `vercel logs` руками когда что-то падает (для старта проекта норм)

### Error tracking — Sentry

Бесплатный план достаточный.

```bash
npm install -w server @sentry/node
npm install -w client @sentry/react
```

В `server/src/index.ts`:
```ts
import * as Sentry from '@sentry/node';
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: config.nodeEnv,
  tracesSampleRate: 0.1,
});
```

### Uptime monitoring

Бесплатные сервисы: UptimeRobot, BetterStack, Pingdom.

Подписать на пинг `/api/health` каждые 5 минут. Email/Telegram при падении.

## Performance budget

| Метрика | Цель |
|---|---|
| First Contentful Paint | < 1.2 sec |
| Largest Contentful Paint | < 2.5 sec |
| CLS | < 0.1 |
| INP | < 200ms |
| Lighthouse SEO | > 95 |
| Lighthouse Performance | > 85 (mobile), > 95 (desktop) |
| API response (cached) | < 100ms |
| API response (TP miss) | < 1.5 sec |

Проверка: PageSpeed Insights + Vercel Analytics (включить в dashboard).

## Чек-лист перед prod-релизом

- [ ] Все env-переменные на Vercel заданы
- [ ] DNS A-запись на Vercel-хостинг, HTTPS включён
- [ ] Postgres migrations применены
- [ ] Cron jobs запланированы и протестированы (запустить руками `?secret=...`)
- [ ] Sentry DSN настроен
- [ ] UptimeRobot подписан на `/api/health`
- [ ] sitemap.xml генерируется и доступен
- [ ] robots.txt корректный (разрешает сканирование)
- [ ] favicon, apple-touch-icon, OG-image — есть
- [ ] Yandex.Metrika + GA4 счётчики работают
- [ ] Скорость на mobile тест — Lighthouse > 80
- [ ] 404 страница оформлена
- [ ] 500-ошибки не светят stack-traces клиенту
- [ ] Rate-limit на login (5 попыток / 15 мин) активен
- [ ] Backup БД настроен / документирован

## Локальная разработка

### Запуск

```bash
git clone <repo>
cd FreeStyle
npm install
cp .env.example .env
# отредактировать .env, заполнить TP_API_TOKEN и DATABASE_URL (локальный Postgres в Docker)
npm run db:migrate -w server
npm run dev
```

### Локальный Postgres через Docker

```bash
docker run -d \
  --name freestyle-pg \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=freestyle \
  -p 5432:5432 \
  postgres:16-alpine
```

`DATABASE_URL=postgres://postgres:postgres@localhost:5432/freestyle`

### Git flow

- `main` → prod (auto-deploy на Vercel)
- `develop` → staging (auto-deploy на preview)
- Feature branches → PR → review → merge в `develop` → потом в `main` для релиза
