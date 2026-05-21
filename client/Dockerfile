# ════════════════════════════════════════════════════════════════
#  FreeStyle.ru — client Dockerfile (multi-stage)
#  Билдит React-приложение и раздаёт через nginx, который заодно
#  проксирует /api/* на server-контейнер.
#  Build context: репо-корень.
# ════════════════════════════════════════════════════════════════

FROM node:22-alpine AS deps
WORKDIR /app

COPY package.json package-lock.json tsconfig.base.json ./
COPY shared/package.json shared/
COPY server/package.json server/
COPY client/package.json client/

RUN npm ci --workspaces --include-workspace-root


FROM deps AS build
WORKDIR /app
COPY shared/ shared/
COPY client/ client/

# VITE_API_BASE_URL обычно НЕ нужен в проде, потому что nginx сам
# проксирует /api/* в server. Если фронт деплоится отдельно — задай в env.
ARG VITE_API_BASE_URL=
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

RUN npm run build --workspace=@freestyle/client


FROM nginx:1.27-alpine AS runner
RUN apk add --no-cache curl
COPY --from=build /app/client/dist /usr/share/nginx/html
COPY nginx/freestyle.conf /etc/nginx/conf.d/default.conf

HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
  CMD curl -fsS http://localhost/ || exit 1

EXPOSE 80
