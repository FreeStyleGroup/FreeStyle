# Деплой FreeStyle.ru на reg.ru VPS

Полный гайд от подъёма пустого Ubuntu-VPS до работающего боевого сайта.

## 1. Заказ и первичная настройка VPS

1. Закажи на reg.ru тариф **VPS** (НЕ shared-hosting). Минимум: 2 vCPU, 2 GB RAM, 30 GB SSD. ОС — **Ubuntu 24.04 LTS**.
2. Открой SSH-доступ: получи IP, root-пароль (или сразу залей публичный ключ через панель reg.ru).
3. Сразу после первого входа:
   ```bash
   apt update && apt -y upgrade
   apt -y install ufw fail2ban
   adduser --disabled-password --gecos "" deploy
   usermod -aG sudo deploy
   mkdir -p /home/deploy/.ssh
   cp ~/.ssh/authorized_keys /home/deploy/.ssh/
   chown -R deploy:deploy /home/deploy/.ssh && chmod 700 /home/deploy/.ssh
   ufw allow OpenSSH && ufw allow http && ufw allow https && ufw --force enable
   ```
4. Под `deploy` отдельный keypair (положи его публичный ключ в `~/.ssh/authorized_keys`).
5. После проверки доступа под `deploy` — отключи root-логин:
   ```bash
   sudo sed -i 's/^#\?PermitRootLogin.*/PermitRootLogin no/' /etc/ssh/sshd_config
   sudo systemctl restart ssh
   ```

## 2. Установка Docker

```bash
curl -fsSL https://get.docker.com | sudo sh
sudo usermod -aG docker deploy
# Перелогинься чтобы группа docker применилась
sudo systemctl enable --now docker
docker compose version   # должна быть v2+
```

## 3. Клонирование репозитория

```bash
sudo mkdir -p /opt/freestyle
sudo chown deploy:deploy /opt/freestyle
cd /opt/freestyle
git clone https://github.com/<org>/freestyle.git .
# Если репо приватный — добавь deploy-key:
#  cat ~/.ssh/id_ed25519.pub  → GitHub repo settings → Deploy keys
```

## 4. .env для прода

```bash
cp .env.example .env
nano .env
```

Заполни критичные поля:
- `NODE_ENV=production`
- `CLIENT_URL=https://freestyle.ru`
- `DATABASE_URL` — оставь `postgres://freestyle:<password>@postgres:5432/freestyle`
- `POSTGRES_PASSWORD=<openssl rand -base64 24>`
- `JWT_ACCESS_SECRET` + `JWT_REFRESH_SECRET` — каждый `openssl rand -base64 48`, разные
- `COOKIE_DOMAIN=.freestyle.ru` (с точкой!)
- `COOKIE_SECURE=true`
- `AITUNNEL_API_KEY=...` — для контент-завода
- `SMTP_HOST/USER/PASSWORD/MAIL_FROM` — SendPulse / Mailgun / Я.Mail для бизнеса

`.env` уже в `.gitignore` — никогда не коммить.

## 5. Первый запуск

```bash
cd /opt/freestyle
docker compose -f docker-compose.prod.yml --env-file .env up -d --build
docker compose -f docker-compose.prod.yml logs -f
```

Сервер сам прогонит миграции при старте (`docker-entrypoint.sh`). Проверь:
```bash
curl http://localhost/api/health
# { "status": "ok", "checks": { "db": "ok" }, ... }
```

Сайт доступен по `http://<IP-VPS>` на 80-м порту.

## 6. DNS

В админке reg.ru:
- A-запись `freestyle.ru` → IP VPS
- A-запись `www.freestyle.ru` → тот же IP

Проверь: `dig +short freestyle.ru`.

## 7. HTTPS через Let's Encrypt

Самый простой путь — **certbot на хосте**, сертификаты монтируются в client-контейнер.

```bash
sudo apt -y install certbot
docker compose -f docker-compose.prod.yml stop client
sudo certbot certonly --standalone -d freestyle.ru -d www.freestyle.ru \
   --agree-tos --email you@freestyle.ru --no-eff-email
```

В `docker-compose.prod.yml` раскомментируй `volumes: - /etc/letsencrypt:/etc/letsencrypt:ro` и порт `443:443`.

Добавь HTTPS server-block в `nginx/freestyle.conf`:
```nginx
server {
    listen 443 ssl http2;
    server_name freestyle.ru www.freestyle.ru;
    ssl_certificate     /etc/letsencrypt/live/freestyle.ru/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/freestyle.ru/privkey.pem;
    # …все локации из 80-го server-блока
}
server {
    listen 80;
    server_name freestyle.ru www.freestyle.ru;
    return 301 https://$host$request_uri;
}
```

```bash
docker compose -f docker-compose.prod.yml up -d --build client
```

Авторенью раз в 12 часов:
```bash
echo "0 3 * * * certbot renew --pre-hook 'docker compose -f /opt/freestyle/docker-compose.prod.yml stop client' --post-hook 'docker compose -f /opt/freestyle/docker-compose.prod.yml start client'" | sudo tee /etc/cron.d/certbot
```

## 8. Первый админ

Зарегистрируй себя через UI на `/`, потом подними роль:
```bash
docker exec -it freestyle-postgres psql -U freestyle -d freestyle \
  -c "UPDATE users SET role='admin' WHERE email='you@freestyle.ru';"
```

`/admin/*` теперь доступен.

## 9. Бэкапы Postgres

```bash
sudo mkdir -p /backups/freestyle
cat <<'CRON' | sudo tee /etc/cron.daily/freestyle-backup
#!/bin/sh
TS=$(date +%F-%H%M)
docker exec freestyle-postgres pg_dump -U freestyle freestyle | gzip > /backups/freestyle/db-$TS.sql.gz
find /backups/freestyle -name 'db-*.sql.gz' -mtime +30 -delete
CRON
sudo chmod +x /etc/cron.daily/freestyle-backup
```

Раз в неделю — забираем дампы на отдельное хранилище (Yandex Object Storage / VK Cloud).

## 10. CI/CD (GitHub Actions)

Pushes в `main` → автодеплой через `.github/workflows/deploy.yml`. Добавь GitHub Secrets:

| Секрет | Значение |
|---|---|
| `VPS_HOST` | IP-адрес VPS |
| `VPS_USER` | `deploy` |
| `VPS_PORT` | `22` (или нестандартный) |
| `VPS_SSH_KEY` | приватная часть deploy-ключа целиком |
| `VPS_APP_DIR` | `/opt/freestyle` |

На VPS — публичная часть этого ключа в `/home/deploy/.ssh/authorized_keys`.

## 11. Мониторинг

Минимум на старте:
- `docker compose logs -f` через SSH
- `curl https://freestyle.ru/api/health` — статус БД
- Внешний uptime-мониторинг (BetterStack/UptimeRobot), бьющий по `/api/health` каждые 30 сек

Когда трафик подрастёт — Grafana + Prometheus.

## Траблшутинг

| Симптом | Что смотреть |
|---|---|
| `502 Bad Gateway` на `/api` | `docker compose logs server` — миграции прошли? `DATABASE_URL` верный? |
| Cookies не ставятся | `COOKIE_SECURE=true` без HTTPS — браузер не пишет. Включи HTTPS. |
| AI не отвечает | `AITUNNEL_API_KEY` пустой → возвращается stub. Заполни в `.env`. |
| Письма не уходят | `SMTP_HOST` пустой → пишется в лог. Заполни SMTP. |
| Server-контейнер в loop | `docker logs freestyle-server --tail 200` — почти всегда невалидный env (Zod-валидатор фейлится при старте). |

## Чек-лист первого боевого деплоя

- [ ] VPS заказан, ufw настроен, root-доступ закрыт
- [ ] Docker установлен, compose v2 работает
- [ ] Репо клонирован в `/opt/freestyle`, `.env` заполнен
- [ ] Postgres + server + client поднялись, `/api/health` отдаёт `ok`
- [ ] DNS A-запись смотрит на IP VPS
- [ ] SSL-сертификат выпущен, HTTPS работает
- [ ] Первый юзер зарегистрирован, повышен до `admin`
- [ ] Cron-бэкап Postgres настроен
- [ ] GitHub Actions деплой проходит по push в main
