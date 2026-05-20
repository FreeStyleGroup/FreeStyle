# Текущее состояние FreeStyle (на момент старта редизайна)

Снимок проекта **«как есть»**. Что работает, что недоделано, где косяки. На основе этого строим план редизайна.

## Сводка готовности

| Слой | Готовность | Комментарий |
|---|---|---|
| **Архитектура (client/server/shared)** | ✅ ~95% | npm workspaces, TS, Vite — структура зрелая |
| **Travelpayouts: рейсы** | ✅ ~80% | tp.client, flights.service (4 endpoint), типы — основа есть, нужно тестирование с реальным токеном |
| **Travelpayouts: справочники** | ✅ ~70% | reference.service (аэропорты/города), кеш 24h |
| **Travelpayouts: отели** | 🟨 ~30% | hotels.controller + routes есть, но сервис не подключён к hotellook API |
| **Travelpayouts: affiliate-ссылки** | ✅ ~60% | affiliate.service есть, buildAffiliateLink работает только для авиа |
| **Поиск (UI)** | 🟨 ~50% | FlightSearchForm + HotelSearchForm + AirportAutocomplete есть, но UI «как у всех» — нужен редизайн под China travel-v2 |
| **Дизайн** | 🟥 ~10% | дефолтный Tailwind, без брендинга, без 3D, без премиум-стиля |
| **Страницы (всего 14)** | 🟨 ~40% | Home/Flights/FlightResults/Hotels — каркас, остальные (Tours/Insurance/Trains/Buses/Excursions/CarRental/AllTransport) — заглушки |
| **i18n** | ✅ ~60% | i18next подключён, нужны полные RU/EN словари |
| **Auth** | 🟨 ~30% | AuthModal как компонент есть, но без backend (нет /api/auth) |
| **CI/CD** | 🟨 ~20% | vercel.json есть, реальный деплой не тестировался |
| **Документация** | 🟥 ~0% | докпапки до сегодня не было, всё в коде |

## Что есть детально

### Client (`client/src/`)

- **Routes (`App.tsx`)** — 14 страниц через React Router 6
- **Layout** — `MainLayout` + `Header` + `Footer`
- **Search-компоненты** — `SearchTabs`, `CategoryBar`, `FlightSearchForm`, `HotelSearchForm`, `AirportAutocomplete`, `PassengerSelector`
- **Cards** — `DestinationCard`, `FlightCard`
- **UI-kit** — `Button`, `Modal`, `Skeleton`, `Spinner`
- **Hooks** — `useAutocomplete`, `useDebounce`, `useFlightSearch`
- **API-клиенты** — `client.ts` (axios инстанс) + `destinations.api.ts` / `flights.api.ts` / `reference.api.ts`
- **Стили** — Tailwind 4 (через `@tailwindcss/vite`), без отдельных компонентных стилей
- **i18n** — i18next подключён в `i18n/index.ts`
- **react-day-picker** — пакет уже в зависимостях (для выбора дат в поиске)

### Server (`server/src/`)

- **Express + CORS + rate-limit + errorHandler** — продакшен-готовая обвязка
- **Routes** под `/api/`: `flights`, `hotels`, `reference`, `destinations`, `health`
- **Controllers** — Zod-валидация query-параметров, передача в сервисы
- **Services TP**:
  - `tp.client.ts` — axios-обёртка над Travelpayouts с baseURL из конфига
  - `flights.service.ts` — **4 endpoint**: `prices_for_dates`, `cheap`, `calendar`, `city-directions` (popular)
  - `reference.service.ts` — airports/cities
  - `affiliate.service.ts` — генерация партнёрских ссылок (только авиа сейчас)
- **Cache** — `node-cache` обёртка через `cacheService.get/set`, TTL 15 мин для рейсов / 24 ч для справочников
- **Logger** — `pino` + `pino-pretty`
- **Config** — `dotenv`, все ключи через env
- **Data** — `destinations.json` (статичный seed)

### Shared (`shared/src/`)

Типы для контракта client↔server:
- `types/api.ts` — `ApiResponse<T>` стандарт
- `types/destination.ts`
- `types/flight.ts` — `FlightOffer`, `PriceCalendarEntry`, `PopularDirection`
- `types/hotel.ts`
- `types/reference.ts` — `Airport`, `City`

## Известные проблемы / долги

### 🔴 Критичное

1. **Дизайн не финальный** — дефолтный Tailwind, нет брендинга, нет премиум-стиля. Главная задача редизайна
2. **Hotels через TP не подключены** — есть routes/controllers, но `hotels.service.ts` отсутствует (нужен hotellook API)
3. **Нет E2E с реальным TP-токеном** — все services работают по описанию API, но интеграция не тестировалась

### 🟡 Средние

4. **Affiliate-link только для авиа** — для отелей/каршеринга/страховок ссылки не строятся (`buildAffiliateLink` хардкоден на aviasales.ru)
5. **destinations.json** — статика, не из БД, не из TP. ОК для MVP, но в перспективе подтягивать топ-направления из TP API
6. **Страницы Tours / Insurance / Trains / Buses / Excursions / CarRental / AllTransport** — заглушки без реального API
7. **AuthModal** — UI есть, backend `/api/auth` нет
8. **Skeleton/Spinner** есть, но не везде используются (loading states пропущены)
9. **Error boundaries** — нет глобального React Error Boundary

### 🟢 Мелочи

10. **i18n** — RU словарь полный, EN — местами заглушки
11. **mobile** — Tailwind responsive есть, но не проверено на устройствах
12. **SEO** — meta-теги через `react-helmet-async` не подключены (важно для landing pages)
13. **Analytics** — нет ни Yandex.Metrika, ни GA4

## Что работает «из коробки»

- ✅ `npm install && npm run dev` — поднимает client + server
- ✅ Routing на все 14 страниц
- ✅ Запрос на `/api/health` отвечает
- ✅ Запрос на `/api/flights/cheap?origin=MOW` отдаёт данные (при условии валидного `TP_API_TOKEN` в `.env`)
- ✅ AirportAutocomplete с debounce работает
- ✅ FlightSearchForm submit → переход на `/flights/results?...`

## Чего нет в коде

- ❌ Серверный кеш Redis (только in-memory node-cache — после рестарта пусто)
- ❌ Database (вся динамика идёт через TP, своих данных нет — это OK для MVP)
- ❌ Очереди (Bull/Bee) — не нужны пока
- ❌ WebSocket / SSE — не нужны
- ❌ Логи в файл — pino пишет только в stdout
- ❌ Хелсчеки кроме `/api/health`
- ❌ Sentry / error tracking
- ❌ Tests (unit / E2E) — папок `tests/` или `__tests__/` нет

## Деплой

- **Vercel** — `vercel.json` в корне. Конфигурация под monorepo (workspaces) не проверена, скорее всего нужен фикс
- Перед prod-деплоем понадобится: реальный `TP_API_TOKEN` + `TP_MARKER` + правильный `CLIENT_URL` в env-переменных Vercel
