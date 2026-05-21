import axios, { type AxiosError, type AxiosRequestConfig } from 'axios';

/**
 * API-клиент.
 *
 * baseURL:
 *  - localhost dev: '/api' → Vite-proxy на http://localhost:3001 (см. vite.config.ts)
 *  - Vercel deploy: VITE_API_BASE_URL ставится в env переменных проекта
 *                   (например 'https://freestyle-server.vercel.app/api')
 *  - fallback '/api' — если build делается с тем же origin (один проект Vercel)
 *
 * withCredentials: true — обязательно для отправки httpOnly cookies (auth).
 */
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 15_000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Авто-обновление access-токена при 401.
 * - Получаем 401 → дёргаем POST /auth/refresh (он сам ставит новые cookies).
 * - Если refresh успешен — повторяем оригинальный запрос.
 * - Если refresh упал — пробрасываем 401 наверх, auth-store должен разлогинить.
 *
 * Чтобы избежать lavin-of-refresh при параллельных 401, держим единый promise.
 */
let refreshPromise: Promise<void> | null = null;

function refreshAccessToken(): Promise<void> {
  if (!refreshPromise) {
    refreshPromise = apiClient
      .post('/auth/refresh')
      .then(() => undefined)
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as AxiosRequestConfig & { _retry?: boolean };
    const url = original?.url ?? '';
    /** Не пытаемся рефрешить сам refresh/login/logout — иначе цикл. */
    const isAuthFlow = /\/auth\/(refresh|login|logout|register)$/.test(url);
    if (error.response?.status === 401 && !original?._retry && !isAuthFlow) {
      original._retry = true;
      try {
        await refreshAccessToken();
        return apiClient(original);
      } catch {
        /** упало — отдаём оригинальную 401 наверх */
      }
    }
    return Promise.reject(error);
  },
);
