import { Router } from 'express';
import flightsRouter from './flights.routes.js';
import referenceRouter from './reference.routes.js';
import hotelsRouter from './hotels.routes.js';
import destinationsRouter from './destinations.routes.js';

const router = Router();

router.use('/flights', flightsRouter);
router.use('/reference', referenceRouter);
router.use('/hotels', hotelsRouter);
router.use('/destinations', destinationsRouter);

router.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

export default router;
