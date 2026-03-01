import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { config } from './config/index.js';
import routes from './routes/index.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();

app.use(cors({
  origin: config.clientUrl,
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
