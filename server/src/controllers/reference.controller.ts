import type { Request, Response, NextFunction } from 'express';
import { referenceService } from '../services/travelpayouts/reference.service.js';

export const referenceController = {
  async getAirports(req: Request, res: Response, next: NextFunction) {
    try {
      const lang = (req.query.lang as string) || 'ru';
      const data = await referenceService.getAirports(lang);
      res.setHeader('Cache-Control', 'public, max-age=86400');
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  },

  async getCities(req: Request, res: Response, next: NextFunction) {
    try {
      const lang = (req.query.lang as string) || 'ru';
      const data = await referenceService.getCities(lang);
      res.setHeader('Cache-Control', 'public, max-age=86400');
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  },

  async getCountries(req: Request, res: Response, next: NextFunction) {
    try {
      const lang = (req.query.lang as string) || 'ru';
      const data = await referenceService.getCountries(lang);
      res.setHeader('Cache-Control', 'public, max-age=86400');
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  },

  async getAirlines(req: Request, res: Response, next: NextFunction) {
    try {
      const lang = (req.query.lang as string) || 'ru';
      const data = await referenceService.getAirlines(lang);
      res.setHeader('Cache-Control', 'public, max-age=86400');
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  },

  async autocomplete(req: Request, res: Response, next: NextFunction) {
    try {
      const query = (req.query.q as string) || '';
      const lang = (req.query.lang as string) || 'ru';
      const data = await referenceService.autocomplete(query, lang);
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  },
};
