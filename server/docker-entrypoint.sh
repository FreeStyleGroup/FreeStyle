#!/bin/sh
# ════════════════════════════════════════════════════════════════
#  FreeStyle.ru server entrypoint:
#  1) Применяем миграции Drizzle (идемпотентно)
#  2) Запускаем сервер
# ════════════════════════════════════════════════════════════════
set -e

echo "[entrypoint] Applying database migrations…"
node server/dist/db/migrate.js

echo "[entrypoint] Starting FreeStyle server…"
exec node server/dist/index.js
