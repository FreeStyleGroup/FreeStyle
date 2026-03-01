import type { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { affiliateService } from '../services/travelpayouts/affiliate.service.js';

const searchSchema = z.object({
  city: z.string().min(1),
  checkIn: z.string(),
  checkOut: z.string(),
  adults: z.coerce.number().min(1).max(10).optional(),
});

export const hotelsController = {
  async search(req: Request, res: Response, next: NextFunction) {
    try {
      const params = searchSchema.parse(req.query);
      const affiliateLink = affiliateService.buildHotelLink({
        city: params.city,
        checkIn: params.checkIn,
        checkOut: params.checkOut,
        adults: params.adults,
      });

      res.json({
        success: true,
        data: {
          city: params.city,
          checkIn: params.checkIn,
          checkOut: params.checkOut,
          affiliateLink,
          provider: 'Booking.com',
        },
      });
    } catch (error) {
      next(error);
    }
  },
};
