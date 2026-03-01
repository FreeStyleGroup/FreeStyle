import { Router } from 'express';
import { hotelsController } from '../controllers/hotels.controller.js';

const router = Router();

router.get('/search', hotelsController.search);

export default router;
