/**
 * Vercel serverless entry point.
 *
 * Vercel автоматически распознаёт файлы в /api/ как serverless functions.
 * Экспортируем Express-app как default — Vercel пропустит через него все
 * запросы на /api/*.
 *
 * Локально для разработки по-прежнему используется src/index.ts (с app.listen()).
 */

import app from '../src/app.js';

export default app;
