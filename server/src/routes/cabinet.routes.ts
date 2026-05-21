import { Router } from 'express';
import { cabinetController } from '../controllers/cabinet.controller.js';
import { requireAuth } from '../middleware/requireAuth.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

const router = Router();

/** Все эндпоинты кабинета требуют авторизованного пользователя. */
router.use(requireAuth);

router.get('/dashboard', asyncHandler(cabinetController.dashboard));

router.get('/bookings', asyncHandler(cabinetController.listBookings));

router.get('/favorites', asyncHandler(cabinetController.listFavorites));
router.post('/favorites', asyncHandler(cabinetController.addFavorite));
router.delete('/favorites/:type/:refId', asyncHandler(cabinetController.removeFavorite));

router.get('/documents', asyncHandler(cabinetController.listDocuments));
router.post('/documents', asyncHandler(cabinetController.createDocument));
router.patch('/documents/:id', asyncHandler(cabinetController.updateDocument));
router.delete('/documents/:id', asyncHandler(cabinetController.deleteDocument));

router.get('/wallet', asyncHandler(cabinetController.walletSummary));
router.get('/wallet/transactions', asyncHandler(cabinetController.walletTransactions));

router.get('/referral', asyncHandler(cabinetController.referralStats));

router.patch('/profile', asyncHandler(cabinetController.updateProfile));
router.patch('/settings', asyncHandler(cabinetController.updateSettings));
router.post('/change-password', asyncHandler(cabinetController.changePassword));

router.get('/sessions', asyncHandler(cabinetController.listSessions));
router.delete('/sessions/:id', asyncHandler(cabinetController.revokeSession));

export default router;
