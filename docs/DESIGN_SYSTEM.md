# Design System · FreeStyle

Дизайн-язык проекта. Источники вдохновения, токены, паттерны.

## Источники вдохновения

### 1. UX/структура → **travelask.ru** ([эталон навигации и блоков])

Чему учимся:
- **Множественные карточки поиска** на главной (рейсы / туры / отели / ж/д / автобусы / страховки / экскурсии) — каждая со своим изображением и кнопкой «Найти»
- **Горизонтальная навигация** сверху с теми же 7 категориями
- **Контентные блоки ниже**:
  - Новости туризма
  - Журнал о путешествиях (статьи + фотоотчёты)
  - Путеводитель (популярные города и страны)
  - Q&A сообщества
  - Фото дня (галерея)
- **Карточки с изображениями + микро-иконки + слайдеры**

### 2. Визуал и компоненты → **China-Bitrix `travel-v2`**

Лежит в `D:\Claude\China-Bitrix\drafts\travel-v2\`:
- `index-v2.php` — каркас разметки (57 KB, актуальная версия)
- `style-v2.css` — стили (13 KB)
- `script-v2.js` — JS-логика поиска, 3D, табы (24 KB)

Чему учимся:
- **Современный search-виджет** с табами
- **3D-модели** в hero (вращающаяся планета / самолёт / globe)
- Премиум-стиль с глассморфизмом + большие крупные заголовки
- Микроанимации при скролле

> ⚠️ China делалась под Bitrix — там PHP+vanilla JS. У нас React+TS. Берём **дизайн (CSS-токены, компоновку, анимации)**, переписываем компоненты на React.

## Палитра

Главный фирменный цвет TBD — на старте берём **глубокий синий + tropical-акценты** под travel-настроение. Финальную палитру согласуем после первого мокапа.

### Базовый набор (стартовый)

```css
--fs-brand-900: #0b2545;     /* dark navy — заголовки, фон шапки */
--fs-brand-700: #134074;     /* primary blue */
--fs-brand-500: #1f7ae0;     /* accent (кнопки, ссылки) */
--fs-brand-300: #8ec3ff;     /* hover/soft */
--fs-brand-50:  #eaf2ff;     /* light background */

--fs-coral-500: #ff6b6b;     /* tropical accent (sale badges, promo) */
--fs-sand-500:  #f5cb5c;     /* секондари акцент */
--fs-mint-500:  #06d6a0;     /* success / discount */

--fs-ink-900:   #0f172a;     /* primary text */
--fs-ink-700:   #334155;     /* secondary text */
--fs-ink-500:   #64748b;     /* tertiary text */
--fs-ink-300:   #cbd5e1;     /* borders */
--fs-bg-0:      #ffffff;
--fs-bg-1:      #f8fafc;     /* page background */
--fs-bg-2:      #f1f5f9;     /* card hover bg */
```

### Tailwind 4 конфиг

В `client/src/index.css` подключение через `@theme`:

```css
@import "tailwindcss";

@theme {
  --color-brand-900: #0b2545;
  --color-brand-700: #134074;
  --color-brand-500: #1f7ae0;
  --color-brand-300: #8ec3ff;
  --color-brand-50:  #eaf2ff;
  --color-coral-500: #ff6b6b;
  --color-sand-500:  #f5cb5c;
  --color-mint-500:  #06d6a0;
  --font-display: "Manrope", "Inter", system-ui, sans-serif;
  --font-sans:    "Inter", system-ui, sans-serif;
}
```

После этого можно писать `bg-brand-500`, `text-coral-500`, `font-display` и т.д.

## Шрифты

- **Display** (заголовки крупные) — **Manrope** 600/700, или **Onest** как альтернатива
- **Sans** (body) — **Inter** 400/500/600
- **Mono** (цены, номера рейсов) — `JetBrains Mono` / `ui-monospace`, tabular-nums

Подключение в `index.html`:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Manrope:wght@600;700;800&display=swap">
```

## Радиусы и тени

```css
--fs-radius-sm: 8px;
--fs-radius-md: 12px;
--fs-radius-lg: 18px;
--fs-radius-xl: 24px;       /* hero-карточки */
--fs-radius-full: 9999px;   /* пиллы, кнопки */

--fs-shadow-sm: 0 2px 8px rgba(15, 23, 42, 0.04);
--fs-shadow-md: 0 12px 32px -12px rgba(15, 23, 42, 0.12);
--fs-shadow-lg: 0 24px 60px -20px rgba(15, 23, 42, 0.18);
--fs-shadow-glow: 0 0 0 4px rgba(31, 122, 224, 0.18);   /* focus */
```

## Компонентные паттерны

### 1. Hero с поиском (главная)

```
┌──────────────────────────────────────────────────────────┐
│  HEADER (logo · navigation · auth)                       │
├──────────────────────────────────────────────────────────┤
│                                                          │
│         ✈️ Большой заголовок          [3D-globe]         │
│         «Куда летим сегодня?»                            │
│                                                          │
│   ┌── tabs ──────────────────────────┐                   │
│   │ [Рейсы] [Отели] [Туры] [Ж/Д] [..] │                   │
│   ├──────────────────────────────────┤                   │
│   │  Откуда   →   Куда    │  Даты    │                   │
│   │  Пассажиры            │ [Найти]  │                   │
│   └──────────────────────────────────┘                   │
│                                                          │
├──────────────────────────────────────────────────────────┤
│   QUICK CARDS — 7 категорий (как у travelask)            │
├──────────────────────────────────────────────────────────┤
│   POPULAR DIRECTIONS (карточки 4-в-ряд)                  │
├──────────────────────────────────────────────────────────┤
│   JOURNAL / гайды / статьи                               │
├──────────────────────────────────────────────────────────┤
│   FOOTER                                                 │
└──────────────────────────────────────────────────────────┘
```

### 2. Search-виджет (центральный компонент)

Берём из China-Bitrix `travel-v2`:
- Табы сверху (Рейсы / Отели / Ж/Д / Автобусы / Туры / Каршеринг / Страховка / Экскурсии)
- Под табом — релевантная форма (для рейсов — Откуда/Куда + даты + пассажиры; для отелей — Город + даты + гости; ...)
- Кнопка «Найти» большая, акцентная (brand-500)
- Glassmorphism (фоновый блюр) если стоит над hero-картинкой

### 3. Карточка направления (Destination Card)

```
┌──────────────────┐
│  [photo cover]   │     ← aspect-ratio 4:3
│                  │
│  ❤ Saint Petersburg
│  от 4 500 ₽
│  Прямой · ~1.5ч  │
└──────────────────┘
```

Hover: лёгкий `translateY(-3px)` + `shadow-md`.

### 4. Карточка рейса (Flight Card)

```
┌─────────────────────────────────────────────────┐
│ [logo] AEROFLOT · SU-1234        4 500 ₽       │
│                                  Выбрать →     │
│ 09:30 → 11:45 MOW → LED · 2ч 15м · прямой       │
└─────────────────────────────────────────────────┘
```

Цена в tabular-nums, brand-700 цвет.

### 5. Layout sidebar + content (на страницах результатов)

```
┌─────┬──────────────────────┐
│ F   │  CARDS (one column)  │
│ I   │  CARDS               │
│ L   │  CARDS               │
│ T   │                      │
│ E   │  pagination          │
│ R   │                      │
│ S   │                      │
└─────┴──────────────────────┘
```

Sidebar 280px фикс, content 1fr. На мобиле — фильтры в drawer'е.

## 3D-элементы (опционально, из China-Bitrix v2)

В hero на главной можно добавить вращающийся 3D-globe или самолёт. Технологии:
- **Three.js** (через `@react-three/fiber` + `@react-three/drei`) — react-friendly
- Либо CSS 3D-transforms + большой PNG со spritesheet (легче в загрузке)

Если будем делать — добавим `@react-three/fiber` в `client/package.json`. Решим после первого мокапа hero.

## Иконки

- **Lucide React** — `lucide-react` пакет, ~1000 line-иконок, тонкие stroke 1.5px
- Импорт: `import { Plane, Bed, MapPin } from 'lucide-react'`

Размер по умолчанию — `w-5 h-5` (20px) для inline, `w-6 h-6` (24px) для самостоятельных, `w-12 h-12` (48px) для hero-карточек категорий.

## Адаптив

Tailwind breakpoints (использовать как есть):
- `sm:` 640px
- `md:` 768px (планшет)
- `lg:` 1024px (десктоп)
- `xl:` 1280px
- `2xl:` 1536px

Container — `max-w-7xl` (1280px) + `mx-auto` + `px-4 lg:px-6`.

## Микроанимации

- Hover на карточках: `transition-transform duration-200 hover:-translate-y-1`
- Focus на input: `transition-shadow focus:shadow-glow` (через custom utility)
- Reveal-on-scroll: можно через `framer-motion` (если решим — добавим), либо CSS `@starting-style` для Tailwind 4
- Skeleton loading при ожидании ответа TP — есть `Skeleton` компонент в `ui/`, использовать его

## Что копируем из China-Bitrix `travel-v2`

| Из China | Куда в FreeStyle |
|---|---|
| `index-v2.php` структура hero+search-tabs | → React-компонент `pages/HomePage.tsx` + `components/search/SearchTabs.tsx` |
| `style-v2.css` дизайн-токены | → `client/src/index.css` через `@theme` |
| `script-v2.js` логика табов + autocomplete | → существующие хуки `useAutocomplete`, `useDebounce` (доделать) |
| 3D-globe (если есть в China) | → опционально `@react-three/fiber` |

Конкретные правки — в `REDESIGN_PLAN.md` (следующий документ).
