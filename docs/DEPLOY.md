# Deploy · пошагово первый запуск на Vercel

Цель: разворачиваем **два независимых проекта Vercel** — `freestyle-client` (Vite SPA) и `freestyle-server` (Express serverless). Каждый деплоится своим CLI или авто-деплоем из GitHub, имеет свой preview URL на каждую feature-ветку.

## Что в итоге будет

| Проект Vercel | Что | URL после деплоя |
|---|---|---|
| `freestyle-client` | React SPA, Vite | `https://freestyle-client.vercel.app` |
| `freestyle-server` | Express API, serverless | `https://freestyle-server.vercel.app/api/*` |

Клиент стучится в `VITE_API_BASE_URL` = домен server-проекта. На каждый PR в GitHub оба деплоятся параллельно, получаешь два preview-URL.

## Подготовка

1. Создать аккаунт https://vercel.com (привязать GitHub)
2. Залить FreeStyle на GitHub в один репозиторий (если ещё не сделано)
3. Получить актуальный `TP_API_TOKEN` из ЛК Travelpayouts
4. Установить Vercel CLI локально:
   ```bash
   npm i -g vercel
   vercel login
   ```

## Шаг 1 · Деплой backend (server)

### 1.1. Импорт проекта в Vercel

В Vercel dashboard:
1. **Add New → Project**
2. Выбрать GitHub-репозиторий FreeStyle
3. **Configure project**:
   - **Project Name:** `freestyle-server`
   - **Framework Preset:** `Other`
   - **Root Directory:** `server`  ← важно, указать вложенную папку
   - **Build Command:** оставить из vercel.json (`npm run build`)
   - **Output Directory:** оставить из vercel.json (`dist`)
   - **Install Command:** оставить из vercel.json (`cd .. && npm install`)
4. **Environment Variables** (добавить все из `server/.env.example`):
   ```
   NODE_ENV=production
   TP_API_TOKEN=<реальный_токен>
   TP_MARKER=<маркер>
   TP_PROJECT_ID=<id>
   TP_API_BASE_URL=https://api.travelpayouts.com
   TP_AFFILIATE_BASE_URL=https://tp.media
   CACHE_DEFAULT_TTL=900
   CACHE_REFERENCE_TTL=86400
   RATE_LIMIT_WINDOW_MS=900000
   RATE_LIMIT_MAX_REQUESTS=100
   DEFAULT_LOCALE=ru
   DEFAULT_CURRENCY=rub
   CLIENT_URL=https://freestyle-client.vercel.app
   ```
   > `CLIENT_URL` пока поставь предполагаемый — после деплоя client'а вернёмся и поправим на реальный
5. **Deploy** → подождать ~1-2 минуты

После сборки получишь URL вида `https://freestyle-server.vercel.app`. Проверь:
```
GET https://freestyle-server.vercel.app/api/health
→ {"status":"ok","timestamp":"..."}
```

### 1.2. Деплой через CLI (альтернатива GitHub-импорта)

```bash
cd server
vercel link          # создаст проект freestyle-server
vercel --prod        # сразу prod-деплой
```

Env-переменные тоже можно через CLI:
```bash
vercel env add TP_API_TOKEN production
# вставить значение
vercel env add CLIENT_URL production
# ...
```

## Шаг 2 · Деплой frontend (client)

### 2.1. Импорт в Vercel

1. **Add New → Project**
2. Выбрать тот же GitHub-репозиторий FreeStyle
3. **Configure project**:
   - **Project Name:** `freestyle-client`
   - **Framework Preset:** Vercel сам распознает `vite` из `client/vercel.json`
   - **Root Directory:** `client`
   - Остальное из vercel.json
4. **Environment Variables**:
   ```
   VITE_API_BASE_URL=https://freestyle-server.vercel.app/api
   ```
   > Подставь реальный URL server'а из шага 1
5. **Deploy**

Получишь URL вида `https://freestyle-client.vercel.app`. Открой — должна загрузиться главная.

### 2.2. Обновить CLIENT_URL в server'е

Возвращаемся в **`freestyle-server`** → Settings → Environment Variables → редактируем `CLIENT_URL` на реальный URL клиента → **Redeploy** проекта (Deployments → latest → Redeploy).

Это критично для CORS: server разрешает запросы только с того origin, который указан в `CLIENT_URL`.

## Шаг 3 · Проверка

Открой `https://freestyle-client.vercel.app`:
- Главная отрисовалась с hero
- DevTools Network: запросы `/api/destinations`, `/api/flights/popular?...` идут на `freestyle-server.vercel.app` и возвращают 200
- Если CORS-ошибка — проверь что `CLIENT_URL` в env server-проекта **точно совпадает** с доменом клиента (с https://, без `/` в конце)

## Шаг 4 · Кастомный домен (опц.)

В каждом проекте Vercel → Settings → Domains → Add. Купить домен (например `freestyle.travel`) — Vercel DNS подскажет какие записи добавить у регистратора.

Стандарт:
- `freestyle.travel` → `freestyle-client` (apex domain)
- `api.freestyle.travel` → `freestyle-server`

Не забудь обновить:
- `VITE_API_BASE_URL` в client → `https://api.freestyle.travel/api`
- `CLIENT_URL` в server → `https://freestyle.travel`

## Auto-deploy из GitHub

После того как оба проекта импортированы из GitHub:
- **Push в `main`** → автоматический prod-деплой обоих проектов
- **Push в feature-ветку** → preview-деплой (свой URL для каждой ветки)
- **PR в GitHub** → Vercel бот пишет в PR ссылки на preview обоих проектов

Можно настроить **ignore unchanged folders**:
- Project Settings → Git → Ignored Build Step
- Указать команду: `git diff --quiet HEAD^ HEAD ./client` (для client-проекта)
- Это пропустит build если client/ не менялся в коммите

## Локальная разработка остаётся как есть

`npm run dev` в корне поднимает:
- client на http://localhost:5173
- server на http://localhost:3001

Vite-proxy перенаправляет `/api/*` на server. Vercel-конфиги при локальном dev игнорируются.

## Troubleshooting

### CORS error на проде
- Проверь `CLIENT_URL` в env server'а — должен быть **точно** `https://freestyle-client.vercel.app` (без слеша)
- После правки — Redeploy server'а

### 404 на /api/* у server
- Проверь `server/vercel.json` rewrites
- Проверь что `server/api/index.ts` экспортирует app как default
- В Logs Vercel смотри что serverless function отрабатывает

### 500 на /api/flights/*
- `TP_API_TOKEN` не задан или неверный → проверь env
- Logs покажут ответ от api.travelpayouts.com

### Vite не подтягивает env-переменную
- Перезапусти dev-сервер после правки `.env.local`
- Проверь что переменная начинается с `VITE_` — иначе Vite её игнорирует

### Сборка падает на `cd .. && npm install`
- Vercel Build Logs → проверь что monorepo workspaces резолвятся
- Иногда нужно убрать `installCommand` и оставить дефолтный `npm install` (Vercel сам поймёт)

## Чек-лист первого деплоя

- [ ] FreeStyle залит в GitHub
- [ ] Vercel CLI установлен (`vercel login`)
- [ ] `freestyle-server` импортирован, env заданы, `/api/health` отвечает
- [ ] `freestyle-client` импортирован, `VITE_API_BASE_URL` задан, главная грузится
- [ ] `CLIENT_URL` в server обновлён, redeploy сделан
- [ ] CORS работает (нет ошибок в DevTools при запросах)
- [ ] Preview URL открывается с другого устройства/из приватного окна
