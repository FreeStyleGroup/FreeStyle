import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { publicController } from '../controllers/public.controller.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { optionalAuth } from '../middleware/requireAuth.js';

const router = Router();

/** Антиспам для формы контактов — 5 сообщений в час с одного IP */
const contactLimiter = rateLimit({
  windowMs: 60 * 60_000,
  max: 5,
  message: { success: false, error: 'Слишком много обращений, попробуйте позже' },
  standardHeaders: true,
  legacyHeaders: false,
});

router.get('/blog/posts',          asyncHandler(publicController.listPosts));
router.get('/blog/categories',     asyncHandler(publicController.listCategories));
router.get('/blog/posts/:slug',    asyncHandler(publicController.getPost));

router.get('/countries',           asyncHandler(publicController.listCountries));
router.get('/countries/:slug',     asyncHandler(publicController.getCountry));

router.post('/contact', contactLimiter, optionalAuth, asyncHandler(publicController.submitContact));

export default router;
