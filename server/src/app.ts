import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import { config } from './config/index.js';
import routes from './routes/index.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();

/**
 * Trust первого reverse-proxy (nginx на VPS / Vercel edge) — нужно для
 * корректных req.ip, X-Forwarded-For и secure cookies через HTTPS.
 */
app.set('trust proxy', 1);

/**
 * CORS: разрешаем нашему фронту + Vercel preview-доменам.
 * credentials: true обязательно — иначе cookies не будут отправляться cross-origin.
 */
const allowedOrigins = new Set<string>([
  'http://localhost:5173',
  'http://localhost:3000',
]);
if (config.clientUrl) allowedOrigins.add(config.clientUrl);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.has(origin)) return callback(null, true);
    if (/^https:\/\/[a-z0-9-]+\.vercel\.app$/i.test(origin)) return callback(null, true);
    return callback(new Error(`CORS: origin ${origin} not allowed`));
  },
  credentials: true,
}));

app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());

app.use('/api', rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.maxRequests,
  message: { success: false, error: 'Слишком много запросов, попробуйте позже' },
  standardHeaders: true,
  legacyHeaders: false,
}));

app.use('/api', routes);

app.use(errorHandler);

export default app;
