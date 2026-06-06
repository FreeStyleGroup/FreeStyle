# FreeStyle.ru — AI-travel «убираем наценку за незнание»: роадмап внедрения

> Статус: план (стартуем позже). Документ — меню модулей: выбираем, что строим, по фазам.

## Context (зачем)
FreeStyle.ru — не «ещё один агрегатор», а ультрасовременный AAA lifestyle-проект для свободных людей, которые **не переплачивают**. Северная звезда из концепта: **ИИ убирает «наценку за незнание»** (те 60–70%, что турист платит за незнание правильного дня вылета, нетуристического района, бесплатной альтернативы платному). Превращаем 5 шагов AI-travel-системы (подбор направления → дешёвые билеты → антитуристический маршрут → ИИ-гид/переводчик/консьерж → оптимизация бюджета в поездке) в реальные фичи продукта поверх уже готовой архитектуры, + 4 хайтек-решения (выбраны: индекс наценки, price-watch, режим «в поездке» PWA, мультимодальный/голосовой Феликс).

Монетизация сквозная: любая рекомендация заканчивается партнёрской кнопкой «купить» (Travelpayouts marker **304805** через `tp.media`).

## Фундамент (что уже есть — строим на этом, не с нуля)
- **AI-клиент**: `server/src/services/ai/client.ts` — `aiClient.chat()` / `chatJson()` (AITunnel, OpenAI-совместимый, gpt-4o-mini, graceful-stub без ключа). Сейчас используется только Content Factory. **Переиспользуем как мозг Феликса.**
- **Travelpayouts** (`server/src/services/travelpayouts/*`): рейсы wired — `getPricesForDates`, `getCheapTickets`, **`getPriceCalendar` (лучший день!)**, `getPopularDirections`; `reference.service` (аэропорты/города/автокомплит); `affiliate.service` (`buildFlightLink/Hotel/Car/Insurance/Tour` → marker 304805). Кеш через `cacheService`. Отели — пока только affiliate-ссылка (без данных).
- **Кабинет/БД** (`server/src/db/schema.ts`, Drizzle): users (tier/miles/cashback), bookings, wallet_transactions, favorites, user_documents, referrals, posts/ideas/publish_jobs, audit_log, contact_messages. Кабинет и админка — реальные. **Content Factory** (idea→article→publish) — рабочий референс AI-пайплайна. Пустые слоты под фичи: `client/src/pages/cabinet/TimelinePage.tsx`, `RecommendationsPage.tsx`.
- **Феликс UI готов, но заглушка**: `client/src/components/ai/{AIChip,AIFAB,AIChatModal,AIChatContext}.tsx`, `pages/ConciergePage.tsx` — есть чат, быстрые промпты, история в state; **нет бэкенда** (`AIChatContext.sendMessage` — `setTimeout`-заглушка), нет `/api/ai/chat`, нет инжекта travel-данных, нет стриминга/персистенции.

## Ключевое архитектурное решение: Феликс = AI-агент с инструментами (function-calling)
Не «болталка», а агент, который **сам вызывает наши сервисы** и отвечает живыми ценами + готовой ссылкой «купить». AITunnel поддерживает tool-calling.

- Новый `POST /api/ai/chat` (SSE-стриминг) → `chatController` → `chatService`:
  - системный промпт «Феликс — консьерж, экономящий 60–70% наценки» (+ персона из ConciergePage);
  - инжект контекста: профиль/локаль/валюта юзера, его недавние поиски/избранное, активная поездка;
  - **TOOLS** (обёртки над существующим кодом — переиспользуем, не дублируем):
    - `search_flights` → `flightsService.getPricesForDates`
    - `cheapest_day` → `flightsService.getPriceCalendar`
    - `popular_directions` → `flightsService.getPopularDirections`
    - `resolve_place` → `referenceService.autocomplete`
    - `plan_trip` → новый `tripPlanner` (Module B)
    - `watch_price` → новый `priceWatch` (Module E)
    - `buy_link` → `affiliateService.*` (marker 304805)
  - LLM выбирает tool → мы выполняем → результат обратно в модель → финальный ответ с ценами и кнопками «купить».
- Персистенция: новая таблица `ai_conversations` (userId, messages jsonb, createdAt); per-user rate-limit (отдельно от общего); запись в `audit_log`.
- Клиент: новый `client/src/api/ai.api.ts` + переключить `AIChatContext.sendMessage` со `setTimeout`-заглушки на реальный SSE-стрим; рендер «карточек рейсов/кнопок купить» внутри сообщений.

---

## Модули (выбираем, что строим)

### Module A — «Мозг Феликса» (AI-агент с инструментами) — ENABLER
Оживляет ядро концепта: `/api/ai/chat` (SSE) + tool-calling над Travelpayouts + персистенция + клиентский стрим. После него Феликс реально подбирает и отвечает живыми ценами с кнопкой «купить».
- Новое: `server/src/services/ai/chat.service.ts`, `tools.ts`; `routes/ai.routes.ts`; `controllers/ai.controller.ts`; таблица `ai_conversations`; `client/src/api/ai.api.ts`; правка `AIChatContext`/`AIChatModal` (стрим + карточки).
- Переиспуем: `aiClient`, все `flightsService`/`reference`/`affiliate`.

### Module B — AI Trip Planner (шаги 1, 3, 5 концепта)
Промпт «10 дней, вылет из X, бюджет Y, тепло, без виз» → **5 направлений с расчётами** (перелёт+жильё+общий бюджет) → выбранное разворачивается в **день-за-днём антитуристический маршрут** (без топ-10 TripAdvisor, еда для местных, бесплатные альтернативы) + смета. Сохраняется в кабинет, дополняется в поездке.
- Новые таблицы (паттерн `schema.ts`): `ai_trips` (userId, title, status, dates, budget, currency, destinations jsonb, itinerary jsonb), `budget_lines` (tripId, category, estimated/actual, isPaid).
- Сервисы: `cabinet/trips.service.ts`, `cabinet/budgets.service.ts`; tool `plan_trip` (для Module A) использует `aiClient.chatJson` + TP-цены для реалистичной сметы.
- Эндпоинты: `cabinet.routes` (+ /trips, /trips/:id/itinerary|budget). Клиент: `cabinet/TripsPage.tsx` + `TripDetailPage.tsx` (карта MapLibre, день-за-днём, бюджет), задействуем слоты `TimelinePage`/`RecommendationsPage`.

### Module C — Интеллект «дешёвые билеты» (шаг 2)
Поверх уже готовых данных: **календарь лучших цен** (`getPriceCalendar` уже есть — нужен UI), **альтернативные аэропорты** (вывести через гео из `reference` + мульти-origin `getPricesForDates`), «лучший день/время вылета», прямой vs пересадка.
- Новое в основном на клиенте (`FlightResultsPage`, новый `PriceCalendar` компонент) + тонкий derive-сервис альт-аэропортов.

### Module D — «Индекс наценки за незнание» + геймификация экономии (выбрано)
Фирменная фича-дифференциатор. По каждому поиску/плану показываем, **сколько ты сэкономил** vs «туристическая цена» (baseline): лучший день −X%, альт-аэропорт −Y%, прямой/пересадка, нетуристический район. Начисляем **мили за сэкономленное** (переиспуем `wallet_transactions`/tier), бейджи «сэкономил N₽».
- Новое: `savings.service.ts` (расчёт baseline vs best), бейдж-компонент, опц. `savings_log`. Переиспуем wallet/tier/referrals.

### Module E — Price-watch + проактивные уведомления (выбрано)
Следим за маршрутом/направлением, бьём письмом (SMTP уже в конфиге) / push когда цена ≤ цели. Возвращает юзеров на сайт.
- Новое: таблица `price_watches` (userId, type, route, targetPrice, status, expiresAt); `priceWatch.service.ts` + фоновый чекер (паттерн `factory/scheduler.ts` — уже крутится каждую минуту); tool `watch_price` для Феликса; `cabinet/PriceWatchesPage.tsx`; email-шаблон.

### Module F — Режим «в поездке» (PWA / офлайн) (выбрано)
Шаг 4+5 концепта в кармане: устанавливаемое PWA, AI-гид по гео («стою у X — 3 неочевидных факта и куда дальше пешком»), фразы для торга/врача на местном языке, ежевечерний разбор бюджета. Офлайн-кеш активной поездки (маршрут/смета/фразы) через service worker.
- Новое: PWA-манифест + SW (`vite-plugin-pwa`), офлайн-кеш активного `ai_trip`, гео-tool в чате, режим «в поездке» в UI кабинета/Феликса.

### Module G — Мультимодальный / голосовой Феликс (выбрано)
Голосовой ввод (Web Speech API / Whisper через AITunnel) + фото места/меню/вывески → vision-модель → факты, перевод, советы. Хайтек-вау.
- Новое: загрузка изображения в `/api/ai/chat` (vision-модель AITunnel), голос на клиенте, мультимодальные сообщения в `AIChatModal`.

### Module H — Lifestyle/community-слой (vision, опционально)
«Социальная сеть для свободных» (есть в SEO-ключах): шеринг своих маршрутов/планов, лента маршрутов от других, лайки/сохранение. Растит контент и удержание.
- Новое: публичные `ai_trips` (share-флаг) + лента; переиспуем posts/Content Factory под user-generated.

## Монетизация (сквозная)
Каждая рекомендация Феликса/планировщика/поиска заканчивается партнёрской кнопкой «купить» через `affiliateService` (marker 304805, sub_id по разделу для аналитики конверсий). Tool `buy_link` встраивает её прямо в ответы чата.

## Дополнения модели данных (Drizzle, по паттерну `server/src/db/schema.ts` + миграция `drizzle-kit generate`)
`ai_conversations` (A) · `ai_trips` + `budget_lines` (B) · `price_watches` (E) · опц. `savings_log` (D) · share-флаг на `ai_trips` (H). FK `onDelete: cascade` к users, индексы на userId/status — как в существующих таблицах.

## Рекомендованная очередь фаз
1. **Module A** (мозг Феликса) — enabler, максимальный «вау», оживляет весь концепт.
2. **Module B + D** (Trip Planner + индекс наценки) — ядро ценности «не переплачивай».
3. **Module C + E** (дешёвые билеты + price-watch) — на готовых данных, быстрый ROI + удержание.
4. **Module F + G** (PWA «в поездке» + мультимодальный Феликс) — хайтек-дифференциация.
5. **Module H** (community) — рост, когда ядро устоялось.

## Verification (по каждому модулю)
- `npm run build -w shared && npm run typecheck -w server && npm run lint -w client` — зелёно перед пушем (CI это и гоняет).
- Локально `npm run dev`: Феликс отвечает живыми ценами; tool-calls возвращают данные Travelpayouts; ответы содержат валидные affiliate-ссылки (marker 304805).
- Миграции применяются (`docker-entrypoint.sh` → `migrate.js`); новые таблицы видны.
- Кабинетные страницы (Trips/PriceWatches) грузят реальные данные; price-watch шлёт письмо при срабатывании.
- E2E на бою через CI-автодеплой; проверка с реальным `AITUNNEL_API_KEY` и `TP_API_TOKEN`.

## Открытые вопросы (решим перед стартом фазы)
- Модель для Феликса: gpt-4o-mini (дёшево) vs более сильная для агента/vision — подберём по качеству tool-calling.
- Источник «нетуристического» контента: чистый AI vs курировать через Content Factory (надёжнее, SEO-бонус).
- Push-канал для price-watch: email (готов) сразу; web-push/Telegram — позже.
