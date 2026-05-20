import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { config } from './config/index.js';
import routes from './routes/index.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();

/**
 * CORS: разрешаем нашему фронту + Vercel preview-доменам.
 * - Локально: http://localhost:5173
 * - Production: значение CLIENT_URL из env
 * - Preview: любой *.vercel.app (для PR-деплоев из GitHub)
 */
const allowedOrigins = new Set<string>([
  'http://localhost:5173',
  'http://localhost:3000',
]);
if (config.clientUrl) allowedOrigins.add(config.clientUrl);

app.use(cors({
  origin: (origin, callback) => {
    // requests без origin (curl, healthchecks) — пускаем
    if (!origin) return callback(null, true);
    if (allowedOrigins.has(origin)) return callback(null, true);
    // Vercel preview deploys — *.vercel.app
    if (/^https:\/\/[a-z0-9-]+\.vercel\.app$/i.test(origin)) return callback(null, true);
    return callback(new Error(`CORS: origin ${origin} not allowed`));
  },
  credentials: true,
}));

app.use(express.json());

app.use('/api', rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.maxRequests,
  message: { success: false, error: 'Слишком много запросов, попробуйте позже' },
}));

app.use('/api', routes);

app.use(errorHandler);

export default app;
