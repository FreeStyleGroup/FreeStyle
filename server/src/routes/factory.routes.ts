import { Router } from 'express';
import { factoryController } from '../controllers/factory.controller.js';
import { requireAuth } from '../middleware/requireAuth.js';
import { requireRole } from '../middleware/requireRole.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

const router = Router();
router.use(requireAuth, requireRole('editor', 'admin'));

router.get('/ideas',              asyncHandler(factoryController.listIdeas));
router.post('/ideas/generate',    asyncHandler(factoryController.generateIdeas));
router.patch('/ideas/:id',        asyncHandler(factoryController.updateIdeaStatus));
router.post('/ideas/:id/article', asyncHandler(factoryController.generateArticle));

router.get('/jobs',               asyncHandler(factoryController.listJobs));
router.post('/jobs',              asyncHandler(factoryController.schedulePublish));
router.delete('/jobs/:id',        asyncHandler(factoryController.cancelJob));

export default router;
