import { Router } from 'express';
import { flightsController } from '../controllers/flights.controller.js';

const router = Router();

router.get('/prices', flightsController.getPrices);
router.get('/cheap', flightsController.getCheap);
router.get('/calendar', flightsController.getCalendar);
router.get('/popular', flightsController.getPopular);

export default router;
