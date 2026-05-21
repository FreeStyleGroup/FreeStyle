import type { Request, Response } from 'express';
import { z } from 'zod';
import { dashboardService } from '../services/cabinet/dashboard.service.js';
import { bookingsService } from '../services/cabinet/bookings.service.js';
import { favoritesService } from '../services/cabinet/favorites.service.js';
import { documentsService } from '../services/cabinet/documents.service.js';
import { walletService } from '../services/cabinet/wallet.service.js';
import { referralService } from '../services/cabinet/referral.service.js';
import { settingsService } from '../services/cabinet/settings.service.js';
import { tokenService } from '../services/auth/token.service.js';
import { REFRESH_COOKIE } from '../middleware/cookies.js';
import {
  updateProfileSchema,
  updateSettingsSchema,
  changePasswordSchema,
  createDocumentSchema,
  updateDocumentSchema,
  addFavoriteSchema,
} from '../validators/cabinet.validators.js';

function userId(req: Request): string {
  if (!req.user) throw new Error('user missing — requireAuth не отработал');
  return req.user.id;
}

/** Достаём jti текущей refresh-сессии (если есть) для пометки isCurrent */
async function currentRefreshRowId(req: Request): Promise<string | null> {
  const refreshToken = req.cookies?.[REFRESH_COOKIE] as string | undefined;
  if (!refreshToken) return null;
  try {
    const decoded = await tokenService.verifyRefresh(refreshToken);
    return decoded.rowId;
  } catch {
    return null;
  }
}

export const cabinetController = {
  async dashboard(req: Request, res: Response): Promise<void> {
    const data = await dashboardService.build(userId(req));
    res.json({ success: true, ...data });
  },

  async listBookings(req: Request, res: Response): Promise<void> {
    const items = await bookingsService.listForUser(userId(req));
    res.json({ success: true, items });
  },

  async listFavorites(req: Request, res: Response): Promise<void> {
    const items = await favoritesService.list(userId(req));
    res.json({ success: true, items });
  },

  async addFavorite(req: Request, res: Response): Promise<void> {
    const dto = addFavoriteSchema.parse(req.body);
    await favoritesService.add(userId(req), dto);
    res.json({ success: true });
  },

  async removeFavorite(req: Request, res: Response): Promise<void> {
    const params = z.object({
      type: z.enum(['flight', 'hotel', 'destination', 'post', 'tour']),
      refId: z.string().min(1),
    }).parse(req.params);
    await favoritesService.remove(userId(req), params.type, params.refId);
    res.json({ success: true });
  },

  async listDocuments(req: Request, res: Response): Promise<void> {
    const items = await documentsService.list(userId(req));
    res.json({ success: true, items });
  },

  async createDocument(req: Request, res: Response): Promise<void> {
    const dto = createDocumentSchema.parse(req.body);
    const doc = await documentsService.create(userId(req), dto);
    res.status(201).json({ success: true, document: doc });
  },

  async updateDocument(req: Request, res: Response): Promise<void> {
    const dto = updateDocumentSchema.parse(req.body);
    const { id } = z.object({ id: z.string().uuid() }).parse(req.params);
    const doc = await documentsService.update(userId(req), id, dto);
    if (!doc) {
      res.status(404).json({ success: false, error: 'Документ не найден' });
      return;
    }
    res.json({ success: true, document: doc });
  },

  async deleteDocument(req: Request, res: Response): Promise<void> {
    const { id } = z.object({ id: z.string().uuid() }).parse(req.params);
    const ok = await documentsService.remove(userId(req), id);
    res.status(ok ? 200 : 404).json({ success: ok });
  },

  async walletSummary(req: Request, res: Response): Promise<void> {
    const summary = await walletService.getSummary(userId(req));
    res.json({ success: true, ...summary });
  },

  async walletTransactions(req: Request, res: Response): Promise<void> {
    const kind = z.enum(['miles', 'cashback']).optional().parse(req.query.kind);
    const items = await walletService.listTransactions(userId(req), { kind });
    res.json({ success: true, items });
  },

  async referralStats(req: Request, res: Response): Promise<void> {
    const stats = await referralService.getStats(userId(req));
    res.json({ success: true, ...stats });
  },

  async updateProfile(req: Request, res: Response): Promise<void> {
    const dto = updateProfileSchema.parse(req.body);
    const user = await settingsService.updateProfile(userId(req), dto);
    res.json({ success: true, user });
  },

  async updateSettings(req: Request, res: Response): Promise<void> {
    const dto = updateSettingsSchema.parse(req.body);
    const user = await settingsService.updateSettings(userId(req), dto);
    res.json({ success: true, user });
  },

  async changePassword(req: Request, res: Response): Promise<void> {
    const dto = changePasswordSchema.parse(req.body);
    await settingsService.changePassword(userId(req), dto);
    res.json({ success: true });
  },

  async listSessions(req: Request, res: Response): Promise<void> {
    const current = await currentRefreshRowId(req);
    const items = await settingsService.listSessions(userId(req), current);
    res.json({ success: true, items });
  },

  async revokeSession(req: Request, res: Response): Promise<void> {
    const { id } = z.object({ id: z.string().uuid() }).parse(req.params);
    const ok = await settingsService.revokeSession(userId(req), id);
    res.status(ok ? 200 : 404).json({ success: ok });
  },
};
