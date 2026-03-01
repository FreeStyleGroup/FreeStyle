import { Router } from 'express';
import { destinationsController } from '../controllers/destinations.controller.js';

const router = Router();

router.get('/', destinationsController.getAll);
router.get('/:slug', destinationsController.getBySlug);

export default router;
