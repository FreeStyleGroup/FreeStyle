# FreeStyle · Документация проекта

Travel-сайт по бронированию авиабилетов / отелей / каршеринга / туров / страхования через **Travelpayouts API**.

## Стек

| Слой | Технологии |
|---|---|
| **Client** | React 19 + Vite 6 + TypeScript 5.7 + Tailwind 4 + React Router 6 + i18next + date-fns + axios |
| **Server** | Node + Express 4 + TypeScript + Zod + node-cache + pino-logger + express-rate-limit |
| **Shared** | Общие TypeScript-типы (`@freestyle/shared`) для типизации API-контрактов клиент↔сервер |
| **Workspace** | npm workspaces (`shared` / `server` / `client`) |
| **Деплой** | Vercel (vercel.json в корне) |

## Структура

```
FreeStyle/
├── client/               React 19 SPA (Vite)
│   └── src/
│       ├── api/          axios-обёртки над server endpoints
│       ├── components/   auth / cards / layout / search / ui
│       ├── data/         статичные данные (destinations)
│       ├── hooks/        useAutocomplete / useDebounce / useFlightSearch
│       ├── i18n/         i18next setup
│       ├── pages/        Home / Flights / Hotels / CarRental / Buses / Excursions / Insurance / ...
│       └── App.tsx + main.tsx
├── server/               Node + Express API
│   └── src/
│       ├── controllers/  destinations / flights / hotels / reference
│       ├── routes/       routes по контроллерам
│       ├── services/     cache.service.ts (node-cache wrapper)
│       ├── middleware/   errorHandler
│       ├── config/       env config
│       ├── data/         destinations.json (статичный seed)
│       └── app.ts + index.ts
├── shared/               общие типы
│   └── src/types/        api / destination / flight / hotel / reference
├── docs/                 ← мы здесь
├── package.json          workspace root
└── vercel.json
```

## Документы в этой папке

| Файл | Назначение |
|---|---|
| **README.md** | Это |
| **CURRENT_STATE.md** | Что уже сделано в коде на момент старта редизайна |
| **DESIGN_SYSTEM.md** | Дизайн-система — токены, паттерны. Источники: travelask.ru (UX) + China-Bitrix `travel-v2` (визуал + 3D) |
| **REDESIGN_PLAN.md** | Консолидированный roadmap — UI + БД + админка + блог + TP. Что в каком порядке делаем |
| **TRAVELPAYOUTS_API.md** | Интеграция с Travelpayouts (endpoints, токены, кеш, partner_id, marker, fallback) |
| **ADMIN_CMS_BLOG.md** | Админка + роли (user/editor/admin) + контент-фабрика для блога (Drizzle + JWT + TipTap) |
| **AUTOMATION.md** | CI/CD Vercel, cron-задачи (кеш популярных направлений), env / Vercel Postgres / Blob |
| **DEPLOY.md** | Пошаговый первый деплой на Vercel — 2 проекта (client + server), env, CORS, troubleshooting |

## Базовые команды

```bash
# В корне проекта
npm install              # установит зависимости всех workspace'ов
npm run dev              # client + server в режиме разработки (concurrently)
npm run build            # билд shared → server → client
npm run start            # запустит prod-сервер
npm run lint             # tsc check во всех workspace'ах
```

## Контекст редизайна

- **За основу UI** берём `D:/Claude/China-Bitrix/drafts/travel-v2/` — там готовый современный search-виджет с 3D-моделями (поэтапно реализованный весной 2026)
- **Travelpayouts API** интегрируется на сервере (proxy через `/api/`), клиент не светит ключ
- **Цель**: довести FreeStyle до production-ready состояния с правильным дизайном и реальными данными от Travelpayouts (рейсы, отели, страховки, экскурсии)
