# Админка + Роли + Контент-фабрика (блог)

Что добавляется поверх MVP:
- **Аутентификация** с ролями `user` / `admin`
- **Админ-дашборд** на отдельном защищённом разделе `/admin/`
- **Контент-фабрика** — CMS для блога/статей/гайдов прямо в админке
- **БД** для пользователей и контента

Берём концепцию из Гастротехники `content_factory` (AITunnel + IdeaFactory + ArticleFactory + AutoPublisher), упрощаем под одну инстанцию FreeStyle.

## Архитектурный стек

| Слой | Технология | Почему |
|---|---|---|
| **БД** | PostgreSQL (через Vercel Postgres / Neon) | SQL, типизированная, бесплатный план Vercel хватит на старт |
| **ORM** | Drizzle ORM | TypeScript-first, без рантайма, легче Prisma, отлично с Edge runtime |
| **Миграции** | drizzle-kit | Идёт в комплекте с Drizzle |
| **Auth** | JWT (access + refresh) + bcrypt | Без внешних провайдеров, всё своё, простая ролевая модель |
| **Файлы (картинки в блог)** | Vercel Blob (или Cloudinary) | Хранилище для медиа |
| **Rich text** | TipTap (или Lexical) | Современный WYSIWYG на React |
| **Markdown альт.** | unified + remark + rehype | Если контент-команда предпочитает MD |
| **AI-помощник (опц.)** | AITunnel/OpenAI | Генератор черновика статьи по теме, переиспользуем подход Гастротехники |

## Модель данных

### `users` — пользователи и админы

```ts
{
  id: uuid              // PK
  email: text unique
  passwordHash: text    // bcrypt
  role: enum('user', 'editor', 'admin')  // editor = пишет в блог, admin = всё
  name: text
  avatar: text?
  createdAt: timestamp
  updatedAt: timestamp
  lastLoginAt: timestamp?
}
```

### `posts` — статьи блога

```ts
{
  id: uuid              // PK
  slug: text unique     // URL: /blog/<slug>/
  title: text
  excerpt: text         // короткое описание для карточки
  contentHtml: text     // отрендеренный HTML
  contentJson: jsonb    // TipTap-JSON для редактирования
  coverImageUrl: text?
  authorId: uuid → users.id
  category: text        // 'guide' | 'news' | 'review' | 'tips'
  tags: text[]          // ['turkey', 'budget', 'family']
  status: enum('draft', 'published', 'archived')
  publishedAt: timestamp?
  createdAt: timestamp
  updatedAt: timestamp
  
  // SEO
  metaTitle: text?
  metaDescription: text?
  metaKeywords: text?
  
  // Stats
  viewsCount: int default 0
  readMinutes: int      // авто-рассчёт
}
```

### `post_revisions` — версионирование (опционально)

История правок статей. Можно сделать позже.

### `tags` — словарь тегов (опционально)

Если статей будет много — выделить теги в отдельную таблицу. Для MVP — массив text[] в `posts.tags`.

### `comments` — комментарии к статьям (опционально, V2)

Только для аутентифицированных. Модерация — admin.

### `sessions` — refresh-токены (для security)

```ts
{
  id: uuid
  userId: uuid → users.id
  refreshTokenHash: text
  userAgent: text
  ip: inet
  expiresAt: timestamp
  createdAt: timestamp
}
```

## API endpoints (новые)

### Auth — `server/src/routes/auth.routes.ts`

| Endpoint | Метод | Назначение |
|---|---|---|
| `POST /api/auth/register` | open | Регистрация (роль `user` по умолчанию) |
| `POST /api/auth/login` | open | Логин → access + refresh JWT |
| `POST /api/auth/refresh` | open (с refresh-токеном) | Обновление access |
| `POST /api/auth/logout` | auth | Удалить refresh-сессию |
| `GET /api/auth/me` | auth | Профиль текущего пользователя |
| `PATCH /api/auth/me` | auth | Обновить профиль |

### Posts (публичные) — `server/src/routes/posts.routes.ts`

| Endpoint | Метод | Назначение |
|---|---|---|
| `GET /api/posts` | open | Список опубликованных (фильтр: category, tag, search, pagination) |
| `GET /api/posts/:slug` | open | Один пост по slug — увеличивает viewsCount |

### Admin posts — `server/src/routes/admin/posts.routes.ts`

Все требуют `role: editor | admin`.

| Endpoint | Метод | Назначение |
|---|---|---|
| `GET /api/admin/posts` | editor | Все посты включая draft/archived |
| `POST /api/admin/posts` | editor | Создать |
| `GET /api/admin/posts/:id` | editor | Получить для редактирования (с contentJson) |
| `PATCH /api/admin/posts/:id` | editor | Обновить |
| `DELETE /api/admin/posts/:id` | admin | Удалить (мягко в archived или жёстко) |
| `POST /api/admin/posts/:id/publish` | editor | Опубликовать (status=published, set publishedAt) |
| `POST /api/admin/posts/:id/draft` | editor | Вернуть в черновик |

### Admin users — `server/src/routes/admin/users.routes.ts`

Все требуют `role: admin`.

| Endpoint | Метод | Назначение |
|---|---|---|
| `GET /api/admin/users` | admin | Список пользователей |
| `PATCH /api/admin/users/:id/role` | admin | Сменить роль |
| `DELETE /api/admin/users/:id` | admin | Удалить (мягко) |

### Admin uploads — `server/src/routes/admin/uploads.routes.ts`

| Endpoint | Метод | Назначение |
|---|---|---|
| `POST /api/admin/uploads/image` | editor | Загрузить картинку в Vercel Blob → вернуть URL |

### Admin analytics (V2)

| Endpoint | Метод | Назначение |
|---|---|---|
| `GET /api/admin/stats` | admin | Сводка: пользователей, статей, просмотров, popular posts |

### AI helper (V2)

| Endpoint | Метод | Назначение |
|---|---|---|
| `POST /api/admin/ai/draft` | editor | LLM генерирует черновик по теме (TipTap-JSON) |
| `POST /api/admin/ai/improve` | editor | LLM улучшает фрагмент текста (rewrite/expand/shorten) |
| `POST /api/admin/ai/seo` | editor | LLM сгенерит meta-title/description/keywords по контенту |

## Структура клиента — добавляется

```
client/src/
├── pages/
│   ├── blog/
│   │   ├── BlogListPage.tsx              /blog
│   │   ├── BlogPostPage.tsx              /blog/:slug
│   │   └── BlogCategoryPage.tsx          /blog/category/:cat
│   ├── auth/
│   │   ├── LoginPage.tsx                 /login
│   │   ├── RegisterPage.tsx              /register
│   │   └── ProfilePage.tsx               /profile
│   └── admin/                            /admin/*  (защищено ProtectedRoute)
│       ├── AdminDashboardPage.tsx
│       ├── AdminPostsListPage.tsx        /admin/posts
│       ├── AdminPostEditorPage.tsx       /admin/posts/new + /admin/posts/:id/edit
│       ├── AdminUsersPage.tsx            /admin/users
│       └── AdminStatsPage.tsx            /admin/stats
├── components/
│   ├── auth/
│   │   ├── LoginForm.tsx
│   │   ├── RegisterForm.tsx
│   │   └── ProtectedRoute.tsx
│   ├── blog/
│   │   ├── PostCard.tsx
│   │   ├── PostMeta.tsx                  // дата, автор, время чтения
│   │   ├── PostBody.tsx                  // рендер contentHtml + стили
│   │   └── PostsList.tsx
│   ├── admin/
│   │   ├── AdminLayout.tsx               // sidebar + content (отдельный от MainLayout)
│   │   ├── AdminSidebar.tsx
│   │   ├── PostEditor.tsx                // TipTap WYSIWYG + поля meta
│   │   ├── PostsTable.tsx
│   │   ├── UsersTable.tsx
│   │   └── ImageUploader.tsx
│   └── ui/
│       ├── DataTable.tsx                 // переиспользуемая таблица
│       └── ConfirmDialog.tsx
├── store/                                // Zustand (для auth state + admin state)
│   ├── auth.store.ts
│   └── admin.store.ts
└── api/
    ├── auth.api.ts
    ├── posts.api.ts
    └── admin.api.ts
```

## Защита маршрутов

### Frontend — `ProtectedRoute`

```tsx
function ProtectedRoute({ children, role }) {
  const { user, isLoading } = useAuth();
  if (isLoading) return <Spinner />;
  if (!user) return <Navigate to="/login" />;
  if (role && !hasRole(user, role)) return <Navigate to="/" />;
  return children;
}

// В App.tsx
<Route path="/admin/*" element={<ProtectedRoute role="editor"><AdminLayout /></ProtectedRoute>}>
  <Route index element={<AdminDashboardPage />} />
  <Route path="posts" element={<AdminPostsListPage />} />
  ...
</Route>
```

### Backend — middleware

```ts
// middleware/auth.ts
export const requireAuth = (req, res, next) => { /* verify JWT, set req.user */ };
export const requireRole = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) return res.status(403).json({ error: 'Forbidden' });
  next();
};

// в routes:
router.post('/posts', requireAuth, requireRole('editor', 'admin'), handler);
```

## Контент-фабрика — UX редактирования

### Редактор статьи (`PostEditor.tsx`)

Слева — форма (заголовок, slug, категория, теги, обложка, SEO-блок).
Справа — TipTap WYSIWYG для контента.
Внизу — toolbar (Сохранить черновик / Опубликовать / Удалить / Предпросмотр).

```
┌───────────────────────────────────────────────────────────┐
│ ← Список       Заголовок: [_______________________]       │
│ Slug: [_______]   Категория: [▾]   Status: [draft]        │
├───────────────────────────────────────────────────────────┤
│  ┌─────────────────┐  ┌──────────────────────────────┐    │
│  │ COVER           │  │ [B][I][U][H1][H2][link][img]│    │
│  │ [upload]        │  ├──────────────────────────────┤    │
│  │                 │  │                              │    │
│  │ Excerpt         │  │   TipTap WYSIWYG editor      │    │
│  │ [           ]   │  │                              │    │
│  │                 │  │                              │    │
│  │ Tags            │  │                              │    │
│  │ [_________]     │  │                              │    │
│  │                 │  │                              │    │
│  │ SEO             │  │                              │    │
│  │  Title  [   ]   │  │                              │    │
│  │  Descr  [   ]   │  │                              │    │
│  │  Keys   [   ]   │  │                              │    │
│  └─────────────────┘  └──────────────────────────────┘    │
│                                                            │
│  [💾 Черновик]  [👁 Превью]  [🚀 Опубликовать]  [🗑]      │
└───────────────────────────────────────────────────────────┘
```

### AI-помощник (V2)

В toolbar редактора кнопки:
- ✨ Сгенерировать черновик по теме (открывает модалку с promt)
- ✨ Улучшить выделенный текст (select → rewrite/expand/shorten)
- ✨ SEO meta автоматически (по контенту → title/desc/keywords)

Это аналог `content_factory` из Гастротехники, но проще — без отдельной idea/topic-фабрики, без публикации в TG/Дзен.

## Зависимости которые добавляются

### Server

```bash
npm install -w server \
  drizzle-orm postgres \
  jsonwebtoken bcrypt \
  zod \
  @vercel/blob

npm install -w server -D \
  drizzle-kit \
  @types/jsonwebtoken @types/bcrypt
```

### Client

```bash
npm install -w client \
  @tiptap/react @tiptap/starter-kit \
  @tiptap/extension-image @tiptap/extension-link \
  zustand \
  react-hook-form \
  zod @hookform/resolvers
```

## Env-переменные (новые)

```
# Database
DATABASE_URL=postgresql://...

# JWT
JWT_SECRET=...                  # длинная случайная строка (64+ символов)
JWT_ACCESS_EXPIRES=15m
JWT_REFRESH_EXPIRES=30d

# bcrypt
BCRYPT_ROUNDS=12

# Vercel Blob
BLOB_READ_WRITE_TOKEN=...

# AI (опционально, для контент-фабрики V2)
AITUNNEL_API_KEY=...
AITUNNEL_BASE_URL=https://api.aitunnel.ru/v1
```

## Roadmap (поэтапно)

### Фаза 1 · Foundation (1-2 дня)
- Подключить PostgreSQL + Drizzle + миграции
- Auth endpoints (`/api/auth/*`) + middleware
- Frontend store (Zustand auth.store)
- LoginPage + RegisterPage + ProtectedRoute

### Фаза 2 · Минимальная админка (2 дня)
- AdminLayout + Sidebar + защищённые routes `/admin/*`
- AdminPostsListPage (таблица постов)
- AdminPostEditorPage (с TipTap редактором)
- POST/GET/PATCH `/api/admin/posts/*`
- Image upload в Vercel Blob

### Фаза 3 · Публичный блог (1 день)
- BlogListPage `/blog` + PostCard сетка
- BlogPostPage `/blog/:slug` с рендером contentHtml
- SEO meta-теги (через `react-helmet-async`)
- BlogCategoryPage `/blog/category/:cat`

### Фаза 4 · Управление пользователями (1 день)
- AdminUsersPage — таблица + смена ролей
- `/api/admin/users/*` endpoints

### Фаза 5 · AI-фабрика (опционально, +2 дня)
- AI-генератор черновика
- Rewriter в редакторе
- SEO авто-генерация

### Фаза 6 · Аналитика (опционально, +1 день)
- AdminStatsPage с popular posts / views
- Yandex.Metrika / GA4 интеграция

**Итого MVP админки и блога:** 4-5 дней.
**С AI-фабрикой и аналитикой:** 7-8 дней.

## Безопасность

- Пароли — bcrypt rounds 12+
- JWT secret — длинная случайная строка в env
- Refresh-токены — хранятся **hash** в БД, при logout удаляются
- HTTPS обязательно (Vercel дефолт)
- Rate-limit на `/api/auth/login` усиленный (5 попыток / 15 мин)
- CSRF — не критично т.к. JWT в Authorization header, не cookie
- XSS защита — TipTap сам санитизирует HTML, плюс `DOMPurify` при рендере на странице
- SQL injection — Drizzle параметризует
- Загрузка картинок — проверка MIME-type + размер до 5 MB

## Что не делаем сейчас

- Соцлогин (Google/VK) — позже, через простой OAuth2 на сервере
- Email-подтверждение регистрации — позже (нужен SMTP)
- 2FA — позже
- Audit log админских действий — позже
- Многоязычные посты — RU only на старте, EN через i18n потом
