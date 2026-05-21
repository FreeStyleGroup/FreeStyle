import { Router } from 'express';
import flightsRouter from './flights.routes.js';
import referenceRouter from './reference.routes.js';
import hotelsRouter from './hotels.routes.js';
import destinationsRouter from './destinations.routes.js';
import authRouter from './auth.routes.js';
import cabinetRouter from './cabinet.routes.js';
import adminRouter from './admin.routes.js';
import factoryRouter from './factory.routes.js';
import publicRouter from './public.routes.js';
import { checkDbConnection } from '../db/index.js';
import { logger } from '../utils/logger.js';

const router = Router();

router.use('/auth', authRouter);
router.use('/cabinet', cabinetRouter);
router.use('/', publicRouter);
router.use('/admin', adminRouter);
router.use('/factory', factoryRouter);
router.use('/flights', flightsRouter);
router.use('/reference', referenceRouter);
router.use('/hotels', hotelsRouter);
router.use('/destinations', destinationsRouter);

/**
 * Health endpoint — отдаёт состояние сервиса и его зависимостей.
 * Используется для liveness/readiness-проб (Docker, мониторинг).
 */
router.get('/health', async (_req, res) => {
  const checks = {
    db: 'ok' as 'ok' | 'error',
  };
  try {
    await checkDbConnection();
  } catch (err) {
    checks.db = 'error';
    logger.error({ err }, 'Health check: db unreachable');
  }
  const allOk = Object.values(checks).every((v) => v === 'ok');
  res.status(allOk ? 200 : 503).json({
    status: allOk ? 'ok' : 'degraded',
    checks,
    timestamp: new Date().toISOString(),
  });
});

export default router;
