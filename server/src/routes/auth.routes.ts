import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { authController } from '../controllers/auth.controller.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { requireAuth } from '../middleware/requireAuth.js';

const router = Router();

/**
 * Per-route rate-limits. Гораздо строже общего /api лимита из app.ts —
 * brute-force и enum-атаки на login/forgot должны упираться раньше.
 */
const loginLimiter = rateLimit({
  windowMs: 15 * 60_000,
  max: 10,
  keyGenerator: (req) => `${req.ip}:${(req.body as { email?: string })?.email ?? ''}`,
  message: { success: false, error: 'Слишком много попыток входа, попробуйте через 15 минут' },
  standardHeaders: true,
  legacyHeaders: false,
});

const registerLimiter = rateLimit({
  windowMs: 60 * 60_000,
  max: 5,
  message: { success: false, error: 'Слишком много регистраций с этого IP' },
});

const forgotLimiter = rateLimit({
  windowMs: 60 * 60_000,
  max: 5,
  message: { success: false, error: 'Слишком много запросов сброса пароля' },
});

router.post('/register', registerLimiter, asyncHandler(authController.register));
router.post('/login', loginLimiter, asyncHandler(authController.login));
router.post('/refresh', asyncHandler(authController.refresh));
router.post('/logout', asyncHandler(authController.logout));
router.get('/me', requireAuth, asyncHandler(authController.me));

router.post('/forgot-password', forgotLimiter, asyncHandler(authController.forgotPassword));
router.post('/reset-password', asyncHandler(authController.resetPassword));
router.post('/verify-email', asyncHandler(authController.verifyEmail));

export default router;
