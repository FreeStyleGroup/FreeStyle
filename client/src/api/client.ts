import axios from 'axios';

/**
 * API-клиент.
 *
 * baseURL:
 *  - localhost dev: '/api' → Vite-proxy на http://localhost:3001 (см. vite.config.ts)
 *  - Vercel deploy: VITE_API_BASE_URL ставится в env переменных проекта
 *                   (например 'https://freestyle-server.vercel.app/api')
 *  - fallback '/api' — если build делается с тем же origin (один проект Vercel)
 */
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 15_000,
  headers: {
    'Content-Type': 'application/json',
  },
});
