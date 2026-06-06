#!/usr/bin/env bash
# ═══════════════════════════════════════════════════════════════════
#  FreeStyle.ru — production deploy (reg.ru VPS)
#
#  Что делает:
#    1) Перепроверяет окружение (docker, compose, нужные файлы).
#    2) Готовит .env: генерит секреты ОДИН раз, при повторном запуске
#       сохраняет существующие (иначе разъедется пароль Postgres).
#    3) Собирает и поднимает стек (postgres + server + client/nginx).
#    4) Ждёт, пока сервер станет healthy, и показывает статус.
#
#  Идемпотентно: можно запускать повторно как «передеплой» — секреты
#  не перегенерируются, контейнеры пересобираются и перезапускаются.
#
#  Запуск:  bash scripts/prod-deploy.sh
# ═══════════════════════════════════════════════════════════════════
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$ROOT_DIR"

COMPOSE_FILE="docker-compose.prod.yml"
ENV_FILE=".env"
ENV_EXAMPLE=".env.example"
SERVER_CONTAINER="freestyle-server"

log()  { printf '\033[1;36m▶ %s\033[0m\n' "$*"; }
ok()   { printf '\033[1;32m✓ %s\033[0m\n' "$*"; }
warn() { printf '\033[1;33m! %s\033[0m\n' "$*"; }
die()  { printf '\033[1;31m✗ %s\033[0m\n' "$*" >&2; exit 1; }
trap 'die "Ошибка на строке $LINENO. Деплой прерван (см. сообщение выше)."' ERR

# ─────────────────────────────────────────────────────────────────
# 1. Preflight — перепроверка окружения
# ─────────────────────────────────────────────────────────────────
log "Проверка окружения…"
[ -f "$COMPOSE_FILE" ] || die "Не найден $COMPOSE_FILE. Запусти скрипт из корня репозитория FreeStyle (где лежит docker-compose.prod.yml)."
[ -f "$ENV_EXAMPLE" ]  || die "Не найден $ENV_EXAMPLE."
command -v docker >/dev/null 2>&1 || die "docker не установлен. Поставь: curl -fsSL https://get.docker.com | sh"
docker info >/dev/null 2>&1 || die "docker-демон недоступен (не запущен или нет прав). Проверь: systemctl status docker, и что пользователь в группе docker."
docker compose version >/dev/null 2>&1 || die "docker compose v2 не найден (нужен Compose plugin v2+)."
ok "docker $(docker --version | awk '{print $3}' | tr -d ','), compose $(docker compose version --short)"

if command -v ss >/dev/null 2>&1 && ss -ltn 2>/dev/null | grep -q ':80 '; then
  warn "Порт 80 уже кем-то слушается. Если это не наш контейнер — будет конфликт (apache/nginx на хосте?)."
fi

# ─────────────────────────────────────────────────────────────────
# 2. .env — секреты и прод-значения (идемпотентно)
# ─────────────────────────────────────────────────────────────────
gen()    { tr -dc 'A-Za-z0-9' < /dev/urandom | head -c "$1"; }
get_kv() { if [ -f "$ENV_FILE" ]; then sed -n "s/^$1=//p" "$ENV_FILE" | head -1; fi; }

set_kv() {
  local k="$1" v="$2" ev
  if grep -q "^${k}=" "$ENV_FILE"; then
    ev=$(printf '%s' "$v" | sed -e 's/[|&\\]/\\&/g')   # экранируем спецсимволы для sed
    sed -i "s|^${k}=.*|${k}=${ev}|" "$ENV_FILE"
  else
    printf '%s=%s\n' "$k" "$v" >> "$ENV_FILE"
  fi
}

# Секрет: сохранить существующий валидный, иначе сгенерировать новый.
ensure_secret() {
  local k="$1" len="$2" cur
  cur="$(get_kv "$k")"
  case "$cur" in
    ''|change-me*|*change-me*|your_*)
      set_kv "$k" "$(gen "$len")"; printf '  %s — сгенерирован\n' "$k" ;;
    *)
      printf '  %s — сохранён существующий\n' "$k" ;;
  esac
}

if [ ! -f "$ENV_FILE" ]; then
  log "Создаю $ENV_FILE из $ENV_EXAMPLE…"
  cp "$ENV_EXAMPLE" "$ENV_FILE"
else
  log "$ENV_FILE уже есть — сохраняю секреты, обновляю прод-значения. Бэкап → ${ENV_FILE}.bak"
  cp "$ENV_FILE" "${ENV_FILE}.bak"
fi

log "Секреты:"
ensure_secret POSTGRES_PASSWORD   32
ensure_secret JWT_ACCESS_SECRET   64
ensure_secret JWT_REFRESH_SECRET  64

PG_PASS="$(get_kv POSTGRES_PASSWORD)"
log "Прод-значения:"
set_kv NODE_ENV       production
set_kv CLIENT_URL     https://freestyle.ru
set_kv DATABASE_URL   "postgres://freestyle:${PG_PASS}@postgres:5432/freestyle"
set_kv COOKIE_DOMAIN  .freestyle.ru
set_kv COOKIE_SECURE  true
set_kv BCRYPT_COST    12
chmod 600 "$ENV_FILE"

# Валидация критичного — иначе сервер не стартует / не сядет на БД.
JA="$(get_kv JWT_ACCESS_SECRET)"; JR="$(get_kv JWT_REFRESH_SECRET)"
[ "${#PG_PASS}" -ge 16 ] || die "POSTGRES_PASSWORD слишком короткий (${#PG_PASS})."
[ "${#JA}" -ge 32 ]      || die "JWT_ACCESS_SECRET < 32 символов."
[ "${#JR}" -ge 32 ]      || die "JWT_REFRESH_SECRET < 32 символов."
ok ".env готов (секреты заданы, права 600)"

grep -E '^(NODE_ENV|CLIENT_URL|COOKIE_DOMAIN|COOKIE_SECURE|BCRYPT_COST)=' "$ENV_FILE" | sed 's/^/    /'
TP="$(get_kv TP_API_TOKEN)"
if [ -n "$TP" ] && [ "$TP" != "your_travelpayouts_api_token_here" ]; then
  ok "TP_API_TOKEN задан"
else
  warn "TP_API_TOKEN не задан — поиск рейсов/отелей вернёт пусто. Впиши позже в .env и перезапусти скрипт."
fi

# ─────────────────────────────────────────────────────────────────
# 3. Сборка и запуск
# ─────────────────────────────────────────────────────────────────
log "Сборка и запуск контейнеров (первый раз — несколько минут)…"
docker compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" up -d --build

# ─────────────────────────────────────────────────────────────────
# 4. Ожидание готовности (по healthcheck контейнера сервера)
# ─────────────────────────────────────────────────────────────────
log "Жду, пока сервер станет healthy (миграции + подключение к БД)…"
HEALTHY=0
for i in $(seq 1 60); do
  status="$(docker inspect --format '{{if .State.Health}}{{.State.Health.Status}}{{else}}none{{end}}' "$SERVER_CONTAINER" 2>/dev/null || echo missing)"
  case "$status" in
    healthy) HEALTHY=1; break ;;
    unhealthy) warn "сервер пока unhealthy (попытка $i/60)…" ;;
  esac
  sleep 3
done

echo
docker compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" ps
echo

if [ "$HEALTHY" -eq 1 ]; then
  ok "Сервер healthy. Проверка API:"
  if command -v curl >/dev/null 2>&1; then curl -fsS http://localhost/api/health && echo; fi
  PUB_IP="$( (command -v curl >/dev/null 2>&1 && curl -fsS --max-time 5 https://api.ipify.org) || hostname -I | awk '{print $1}' || true)"
  echo
  ok "Сайт поднят: http://${PUB_IP:-<IP_VPS>}  (и http://freestyle.ru — как только DNS укажет на этот сервер)"
  echo "Следующие шаги:"
  echo "  1) (опц.) впиши TP_API_TOKEN / AITUNNEL_API_KEY / SMTP_* в .env и запусти скрипт снова."
  echo "  2) Выпусти HTTPS (SSL) — отдельный шаг."
else
  warn "Сервер не стал healthy за отведённое время. Смотри логи:"
  echo "  docker compose -f $COMPOSE_FILE logs --tail 100 server"
  echo "  docker compose -f $COMPOSE_FILE logs --tail 40 postgres"
  die "Запуск не подтверждён — разберись по логам выше (чаще всего: невалидный .env или БД ещё стартует)."
fi
