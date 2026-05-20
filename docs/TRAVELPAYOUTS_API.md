# Travelpayouts API · интеграция

Полная карта используемых endpoint'ов, токенов, кеша, affiliate-ссылок. Источник правды для серверной части.

## Документация TP

- Главная: https://support.travelpayouts.com/hc/ru
- API Data: https://support.travelpayouts.com/hc/ru/articles/203956163 (рейсы Aviasales)
- Hotellook (отели): https://support.travelpayouts.com/hc/ru/articles/203956213
- API ссылок для туров/каршеринга/страховок: https://support.travelpayouts.com/hc/ru/categories/200174869-API

## Env-переменные

| Переменная | Назначение | Пример |
|---|---|---|
| `TP_API_TOKEN` | API-токен из ЛК Travelpayouts (Tools → API access) | `a1b2c3d4...` (32 символа) |
| `TP_MARKER` | Партнёрский маркер (для аффилиатных ссылок) | `123456` |
| `TP_PROJECT_ID` | ID проекта в TP | `1` |
| `TP_API_BASE_URL` | Базовый URL data-API | `https://api.travelpayouts.com` |
| `TP_AFFILIATE_BASE_URL` | Базовый URL аффилиатных ссылок | `https://tp.media` |

Все ключи **только на сервере** (`.env` на бэкенде, env-переменные Vercel). Клиент к TP напрямую не ходит — только через наш `/api/...` proxy.

## Endpoint'ы рейсов (Aviasales Data)

Имплементированы в `server/src/services/travelpayouts/flights.service.ts`.

### 1. `GET /aviasales/v3/prices_for_dates` → `getPricesForDates()`

Цены на конкретные даты (для основной выдачи поиска).

**Параметры:**
- `origin` (обязательно) — IATA код города/аэропорта вылета (MOW, LED, ...)
- `destination` — IATA код прилёта (если опущен — best deals из origin)
- `departure_at` — `YYYY-MM-DD` или `YYYY-MM`
- `return_at` — для round-trip
- `direct` — `true` для только прямых рейсов
- `currency` — `rub` / `usd` / `eur` (default из конфига)
- `limit` — 1-100 (default 30)
- `one_way` — `true` для one-way
- `sorting` — `price` / `route`

**Маппинг ответа → `FlightOffer`** (см. shared/types/flight.ts).

**Кеш:** 15 минут (`config.cache.defaultTtl`).

**Frontend:** `/api/flights/prices?origin=MOW&destination=LED&departureAt=2026-06-01`.

### 2. `GET /v1/prices/cheap` → `getCheapTickets()`

Самые дешёвые билеты по направлениям (без точной даты). Удобно для блока «Цены от».

**Параметры:**
- `origin` — обязательно
- `destination` — опционально
- `depart_date` / `return_date` — для уточнения
- `currency`

Ответ — словарь `{destCode: {transfers: {ticket}}}` → разворачиваем в массив `FlightOffer[]`.

**Кеш:** 15 минут.

**Frontend:** `/api/flights/cheap?origin=MOW`.

### 3. `GET /v1/prices/calendar` → `getPriceCalendar()`

Календарь цен по датам (для виджета «дёшево по дням»).

**Параметры:**
- `origin`, `destination` — обязательно
- `depart_date`, `return_date`
- `currency`

Ответ — `{date: {price, airline, ...}}` → массив `PriceCalendarEntry[]`.

**Кеш:** 15 минут.

**Frontend:** `/api/flights/calendar?origin=MOW&destination=LED&departDate=2026-06`.

### 4. `GET /v1/city-directions` → `getPopularDirections()`

Топ-направлений из города. Для блока «Куда летают из Москвы» на HomePage.

**Параметры:**
- `origin` — обязательно
- `currency`

Ответ — словарь, разворачиваем в `PopularDirection[]`.

**Кеш:** 60 минут (статичнее чем цены).

**Frontend:** `/api/flights/popular?origin=MOW`.

## Справочники (Reference)

Имплементированы в `server/src/services/travelpayouts/reference.service.ts`.

| Endpoint TP | Метод | Назначение |
|---|---|---|
| `/data/ru/airports.json` | `getAirports()` | Список всех аэропортов с IATA-кодами |
| `/data/ru/cities.json` | `getCities()` | Список городов с координатами |
| `/data/airlines.json` | `getAirlines()` | Авиакомпании с лого |

**Кеш:** 24 часа (`config.cache.referenceTtl`). Это статичные данные.

**Frontend:**
- `/api/reference/airports?q=Москва` — поиск аэропорта по тексту (для AirportAutocomplete)
- `/api/reference/cities?q=Lond` — поиск города

## Hotellook (отели) — пока не имплементировано

API: `engine.hotellook.com`

Нужно добавить `server/src/services/travelpayouts/hotels.service.ts`:

| Endpoint | Назначение |
|---|---|
| `GET /api/v2/lookup.json?query=...` | Автокомплит отелей/городов |
| `GET /api/v2/cache.json?location=...&checkIn=...&checkOut=...&adults=2` | Цены на отели в локации |
| `GET /api/v2/static/hotels.json?locationId=...` | Статичные карточки отелей с фото |

**Affiliate-ссылка:** строить через `https://hotellook.com/...&marker=TP_MARKER` или `https://tp.media/r?marker=...&trs=...`.

Все запросы — с `token=TP_API_TOKEN`.

## Affiliate-ссылки

Имплементированы в `server/src/services/travelpayouts/affiliate.service.ts` + `flights.service.ts:buildAffiliateLink()`.

Сейчас только для авиа:
```
https://www.aviasales.ru{link}&marker={TP_MARKER}
```

**Доделать для:**
- Hotellook → `https://hotellook.com/?marker=...&hotelId=...`
- Travelpayouts универсальная ссылка → `https://tp.media/r?marker=...&trs=...&p=...`

## Кеш стратегия

| Что кешируем | TTL | Где |
|---|---|---|
| Прайсы (`prices_for_dates`, `cheap`, `calendar`) | 15 мин | node-cache in-memory |
| Топ-направления (`city-directions`) | 60 мин | node-cache |
| Справочники (airports, cities, airlines) | 24 часа | node-cache |

**Минусы текущей схемы:** после рестарта сервера кеш пустой. На проде Vercel-функции stateless → кеш не работает между запросами.

**Решение для prod:**
1. **Vercel KV (Redis)** — простейший путь, нативная интеграция с Vercel
2. Или **Upstash Redis** — fallback вариант
3. Или **Cloudflare KV** — если стек переедет на Cloudflare Workers

Подключение: заменить `services/cache.service.ts` обёрткой над Redis (тот же интерфейс get/set/del). Никакие другие файлы трогать не придётся.

## Rate Limiting

Сам Travelpayouts:
- 200 req/min на токен (обновляется)
- 429 при превышении → нужно бэкофф

У нас на сервере (`express-rate-limit`):
- `RATE_LIMIT_WINDOW_MS = 900000` (15 мин)
- `RATE_LIMIT_MAX_REQUESTS = 100` (на IP)

Это для защиты НАШЕГО API от ddos, не для TP. К TP идём через сервер → клиент не может его засрать.

## Что сделать дальше по интеграции TP

1. **`hotels.service.ts`** — hotellook autocomplete + cache.json + static
2. **`buildAffiliateLink()`** — универсальная функция для всех типов услуг (авиа / отели / каршеринг / страховка)
3. **`AffiliateService.getInsuranceLink()`**, `getCarRentalLink()`, `getToursLink()` — partner-ссылки на cherehapa / localrent / level.travel и т.п.
4. **Redis cache** — заменить node-cache на Vercel KV для production
5. **Retry-логика** в `tp.client.ts` — при 429 ждать `Retry-After` секунд и повторить
6. **Sentry** — логировать ошибки TP API чтобы видеть какие endpoint'ы валятся
