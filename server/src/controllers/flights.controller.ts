import type { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { flightsService } from '../services/travelpayouts/flights.service.js';

const pricesSchema = z.object({
  origin: z.string().min(2).max(4),
  destination: z.string().min(2).max(4).optional(),
  departureAt: z.string().optional(),
  returnAt: z.string().optional(),
  direct: z.coerce.boolean().optional(),
  currency: z.string().max(3).optional(),
  limit: z.coerce.number().min(1).max(100).optional(),
  oneWay: z.coerce.boolean().optional(),
});

const calendarSchema = z.object({
  origin: z.string().min(2).max(4),
  destination: z.string().min(2).max(4),
  departDate: z.string(),
  returnDate: z.string().optional(),
  currency: z.string().max(3).optional(),
});

const popularSchema = z.object({
  origin: z.string().min(2).max(4),
  currency: z.string().max(3).optional(),
});

export const flightsController = {
  async getPrices(req: Request, res: Response, next: NextFunction) {
    try {
      const params = pricesSchema.parse(req.query);
      const data = await flightsService.getPricesForDates(params);
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  },

  async getCheap(req: Request, res: Response, next: NextFunction) {
    try {
      const params = pricesSchema.parse(req.query);
      const data = await flightsService.getCheapTickets({
        origin: params.origin,
        destination: params.destination,
        departDate: params.departureAt,
        returnDate: params.returnAt,
        currency: params.currency,
      });
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  },

  async getCalendar(req: Request, res: Response, next: NextFunction) {
    try {
      const params = calendarSchema.parse(req.query);
      const data = await flightsService.getPriceCalendar(params);
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  },

  async getPopular(req: Request, res: Response, next: NextFunction) {
    try {
      const params = popularSchema.parse(req.query);
      const data = await flightsService.getPopularDirections(params.origin, params.currency);
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  },
};
