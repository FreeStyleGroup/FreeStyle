# ════════════════════════════════════════════════════════════════
#  FreeStyle.ru — server Dockerfile (multi-stage)
#  Build context: репо-корень (см. docker-compose.prod.yml)
# ════════════════════════════════════════════════════════════════

FROM node:22-alpine AS deps
RUN apk add --no-cache tzdata
WORKDIR /app

# Workspace метаданные
COPY package.json package-lock.json tsconfig.base.json ./
COPY shared/package.json shared/
COPY server/package.json server/
COPY client/package.json client/

# Только prod + build-dev зависимости
RUN npm ci --workspaces --include-workspace-root


FROM deps AS build
WORKDIR /app
COPY shared/ shared/
COPY server/ server/
# Сначала собираем shared (CommonJS dist) — сервер резолвит @freestyle/shared
# в рантайме как готовый JS, а tsc сервера — по dist/index.d.ts (чистый emit в dist/).
RUN npm run build -w shared && npm run build --workspace=@freestyle/server


FROM node:22-alpine AS runner
RUN apk add --no-cache tzdata curl
ENV TZ=Europe/Moscow
ENV NODE_ENV=production
WORKDIR /app

# Production-only зависимости для server + shared
COPY package.json package-lock.json ./
COPY shared/package.json shared/
COPY server/package.json server/
COPY client/package.json client/
RUN npm ci --omit=dev --workspaces --include-workspace-root \
 && npm cache clean --force

# Билд + миграции + shared sources (нужны для @freestyle/shared workspace alias)
COPY --from=build /app/server/dist server/dist
COPY --from=build /app/shared shared
COPY server/drizzle server/drizzle

# Healthcheck
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD curl -fsS http://localhost:3001/api/health || exit 1

EXPOSE 3001

# Entrypoint: запускает миграции и потом сервер
COPY server/docker-entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

USER node
CMD ["/usr/local/bin/entrypoint.sh"]
