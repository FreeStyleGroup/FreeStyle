# Redesign Plan · FreeStyle

Консолидированный roadmap. Что и в каком порядке делаем, чтобы превратить текущий MVP в production-ready проект с премиум-дизайном, реальными данными от Travelpayouts, админкой, ролями и блогом.

> **Источники структуры/визуала:** [travelask.ru](https://travelask.ru/) (UX, навигация, блоки) + `D:/Claude/China-Bitrix/drafts/travel-v2/` (search-виджет, 3D, премиум-стиль). Подробности в `DESIGN_SYSTEM.md`.

## Целевая картина (что должно быть в конце)

1. **Главная** с современным hero, 3D-элементом, search-виджетом на 7-8 категорий
2. **Реальные данные** от Travelpayouts (рейсы, отели через hotellook, affiliate-ссылки)
3. **Все 14 страниц рабочие** — не заглушки, а с UI и данными
4. **Аутентификация** — регистрация / логин / профиль / роли user/editor/admin
5. **Админ-дашборд** `/admin/` для editor/admin с защитой
6. **Контент-фабрика** — TipTap-редактор для статей блога + AI-помощник (опц.)
7. **Публичный блог** `/blog/` с категориями
8. **БД** PostgreSQL через Vercel Postgres
9. **Деплой** на Vercel с правильными env, кешем (Vercel KV), Blob-хранилищем
10. **SEO** — meta + Schema.org для статей и направлений

## Roadmap по фазам

### Фаза 0 · Подготовка (0.5 дня)

- [ ] **`.env`** — реальные `TP_API_TOKEN` + `TP_MARKER` из ЛК Travelpayouts
- [ ] Создать БД на Vercel Postgres / Neon → положить `DATABASE_URL` в env
- [ ] Создать Vercel Blob store → `BLOB_READ_WRITE_TOKEN`
- [ ] Сгенерировать `JWT_SECRET` (64+ символов)
- [ ] Проверить: `npm run dev` запускает client+server, `/api/health` отдаёт ok

### Фаза 1 · Дизайн-токены и визуальный фундамент (1 день)

- [ ] В `client/src/index.css` подключить **`@theme`** Tailwind 4 с палитрой из `DESIGN_SYSTEM.md`
- [ ] Подключить шрифты Manrope + Inter + JetBrains Mono в `index.html`
- [ ] Установить **lucide-react** — `npm install -w client lucide-react`
- [ ] Скопировать структуру hero+search-tabs из `D:/Claude/China-Bitrix/drafts/travel-v2/index-v2.php` → адаптировать на React
- [ ] Из `D:/Claude/China-Bitrix/drafts/travel-v2/style-v2.css` вытащить токены анимаций / shadow / blur → внести в `index.css`
- [ ] Header / Footer переписать в стиль travelask (горизонтальная навигация 7 категорий)

**Чекпойнт:** главная страница имеет премиум-вид, hero с поиском, навигация наверху.

### Фаза 2 · Search-виджеты (2 дня)

- [ ] **SearchTabs** — 8 табов (Рейсы / Отели / Туры / Каршеринг / Ж/Д / Автобусы / Экскурсии / Страховки)
- [ ] **FlightSearchForm** — доделать UI: Откуда/Куда swap-кнопка, react-day-picker для дат, PassengerSelector dropdown
- [ ] **HotelSearchForm** — Город / Checkin-Checkout / Гости / Звёзды
- [ ] **AirportAutocomplete** — добавить тачскрин-friendly список (для мобилки), показ кода аэропорта
- [ ] Все формы submit → переход на соответствующий `/results` с query params

**Чекпойнт:** все 8 табов рабочие на главной, формы отправляют запросы.

### Фаза 3 · Реальные данные от Travelpayouts (2 дня)

- [ ] **Рейсы** — `FlightResultsPage` подключить к `/api/flights/prices`, рендерить `FlightCard`
- [ ] Фильтры на странице результатов (sidebar 280px): цена, направления, авиакомпания, прямой/с пересадкой, время вылета
- [ ] Пагинация (limit/offset через TP)
- [ ] **Hotels** — добавить `server/src/services/travelpayouts/hotels.service.ts` с hotellook API, подключить `HotelsPage` к `/api/hotels/search`
- [ ] **Popular directions** — на главной блок «Куда летают из Москвы», данные через `/api/flights/popular`
- [ ] **DestinationCard** — карточки направлений с фото из `destinations.json` (либо из TP hotellook static)
- [ ] **AffiliateService** — универсальная функция `buildLink(type, params)` для всех типов

**Чекпойнт:** реальные цены TP отображаются на сайте, клики ведут на партнёрские ссылки aviasales/hotellook.

### Фаза 4 · БД + Auth (1 день)

- [ ] **Drizzle** + Postgres подключить:
  ```bash
  npm install -w server drizzle-orm postgres
  npm install -w server -D drizzle-kit @types/jsonwebtoken @types/bcrypt
  ```
- [ ] `server/src/db/schema.ts` — таблицы `users`, `posts`, `sessions` (см. `ADMIN_CMS_BLOG.md`)
- [ ] Миграции `drizzle-kit` → создать таблицы
- [ ] **Auth endpoints** (`/api/auth/{register,login,logout,refresh,me}`)
- [ ] **Middleware** `requireAuth` + `requireRole`
- [ ] **Frontend store** — Zustand `auth.store.ts` (login/logout/persist token)
- [ ] **Pages**: `LoginPage`, `RegisterPage`, `ProfilePage`
- [ ] **`ProtectedRoute`** компонент

**Чекпойнт:** можно зарегистрироваться, залогиниться, посмотреть профиль. JWT работают.

### Фаза 5 · Админ-дашборд + контент-фабрика (2 дня)

- [ ] **TipTap** установить:
  ```bash
  npm install -w client @tiptap/react @tiptap/starter-kit @tiptap/extension-image @tiptap/extension-link
  ```
- [ ] **AdminLayout** + sidebar + защита `/admin/*` через `ProtectedRoute role="editor"`
- [ ] **`AdminPostsListPage`** — таблица постов с фильтрами status/category, кнопки «Edit», «Publish», «Delete»
- [ ] **`AdminPostEditorPage`** — TipTap WYSIWYG + поля slug/title/excerpt/category/tags/SEO + кнопка обложки → загрузка в Vercel Blob
- [ ] **Admin posts endpoints** (`/api/admin/posts/*`)
- [ ] **Admin uploads** (`/api/admin/uploads/image` → Vercel Blob)
- [ ] **`AdminUsersPage`** + смена ролей (только admin)

**Чекпойнт:** admin может зайти в `/admin/posts`, создать статью с обложкой и текстом, опубликовать.

### Фаза 6 · Публичный блог (1 день)

- [ ] **`BlogListPage`** `/blog` — сетка `PostCard` 3-в-ряд, фильтры по category
- [ ] **`BlogPostPage`** `/blog/:slug` — рендер contentHtml, meta-теги (через `react-helmet-async`), Schema.org Article
- [ ] **`BlogCategoryPage`** `/blog/category/:cat`
- [ ] **Pagination** (10 постов на страницу)
- [ ] Blog добавить в header navigation

**Чекпойнт:** статьи отображаются публично, можно расшарить URL, SEO meta присутствует.

### Фаза 7 · Доработка страниц (1-2 дня)

- [ ] **ToursPage** — UI поиска туров, ссылки на партнёрку level.travel или travelata
- [ ] **InsurancePage** — форма + партнёрка cherehapa
- [ ] **CarRentalPage** — партнёрка localrent или rentalcars
- [ ] **TrainsPage** — заглушка с честной надписью «РЖД, скоро»; или партнёрка tutu.ru
- [ ] **BusesPage** — партнёрка busfor / GoEuro / FlixBus
- [ ] **ExcursionsPage** — партнёрка sputnik8 / weatlas
- [ ] **AllTransportPage** — общий поиск (рейсы + поезда + автобусы одной формой)
- [ ] **DestinationsPage** + **DestinationDetailPage** — сетка направлений + детальная страница с фото / гайдами / средними ценами

**Чекпойнт:** все 14 страниц не «404», на каждой есть осмысленный UI и хотя бы partner-ссылка.

### Фаза 8 · SEO + аналитика (0.5 дня)

- [ ] **`react-helmet-async`** — meta-теги (title/description/keywords/OG) на каждой странице
- [ ] **Schema.org** JSON-LD: Organization (site-wide), Article (для постов блога), BreadcrumbList
- [ ] **Yandex.Metrika** + **Google Analytics 4** — установка через event Goals
- [ ] **sitemap.xml** auto-generation (страницы + посты) endpoint `/sitemap.xml`
- [ ] **robots.txt** — корректный

**Чекпойнт:** сайт SEO-готов, метрика собирает события.

### Фаза 9 · Деплой + автоматизация (0.5 дня)

См. `AUTOMATION.md` (следующий доку).

- [ ] **Vercel** — настроить env, build commands для monorepo
- [ ] **Vercel Postgres / Neon** — миграции применить на проде
- [ ] **Vercel KV** — заменить node-cache на Redis для серверного кеша TP
- [ ] **Vercel Blob** — настроить для картинок блога
- [ ] **Domain** — подключить (TBD)
- [ ] **HTTPS** — автомат Vercel

**Чекпойнт:** сайт доступен по prod-домену, всё работает с реальными данными.

### Фаза 10 · AI-фабрика (опционально, +2 дня)

См. `ADMIN_CMS_BLOG.md` секцию «AI-помощник».

- [ ] **AITunnel-клиент** на сервере (`server/src/services/ai/aitunnel.client.ts`)
- [ ] `/api/admin/ai/draft` — генератор черновика по теме
- [ ] `/api/admin/ai/improve` — rewrite/expand/shorten выделенного текста
- [ ] `/api/admin/ai/seo` — авто-генерация meta по контенту
- [ ] Кнопки ✨ в toolbar `PostEditor`

## Что НЕ делаем в первой итерации

- Соцлогин (VK/Google) — потом
- Email-подтверждение / SMTP — потом
- Многоязычность статей (RU/EN) — пока RU only, EN через i18n уже есть
- Платный raksa / премиум-аккаунты — нет монетизации сейчас
- Native mobile app — только web (responsive)
- Чат-поддержка / Intercom — потом
- Push-уведомления — потом
- A/B тесты / эксперименты — потом

## Оценка времени по фазам

| Фаза | Дни |
|---|---|
| 0 · Подготовка | 0.5 |
| 1 · Дизайн-токены | 1 |
| 2 · Search-виджеты | 2 |
| 3 · TP данные | 2 |
| 4 · БД + Auth | 1 |
| 5 · Админка + CMS | 2 |
| 6 · Публичный блог | 1 |
| 7 · Доработка 14 страниц | 1.5 |
| 8 · SEO + аналитика | 0.5 |
| 9 · Деплой | 0.5 |
| 10 · AI-фабрика (опц.) | 2 |
| **MVP без AI** | **~12 дней** |
| **С AI-фабрикой** | **~14 дней** |

## Критерии готовности (Definition of Done)

✅ MVP считается готовым когда:
1. Все 14 страниц рендерятся без ошибок и имеют осмысленный UI
2. Поиск рейсов + отелей даёт реальные данные TP
3. Affiliate-ссылки работают (можно перейти на aviasales/hotellook)
4. Регистрация/логин работают, есть 3 роли
5. Админ может создать статью, опубликовать её, она видна на `/blog/:slug`
6. SEO meta-теги присутствуют на всех страницах
7. Сайт развёрнут на Vercel и доступен по HTTPS-домену
8. Все ключи (TP, JWT, БД, Blob) в env Vercel, не в коде

## Команды для каждой фазы

Большинство фаз начинаются с одной из этих команд:

```bash
# Запуск разработки
npm run dev

# Применить миграции (после фазы 4)
npm run db:migrate -w server

# Билд продакшен
npm run build

# Деплой на Vercel
vercel --prod
```
