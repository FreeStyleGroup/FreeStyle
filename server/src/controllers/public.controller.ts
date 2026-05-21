import type { Request, Response } from 'express';
import { z } from 'zod';
import { blogService } from '../services/public/blog.service.js';
import { contactService } from '../services/public/contact.service.js';
import { countriesService } from '../services/public/countries.service.js';
import { publicPostsQuerySchema, contactSchema } from '../validators/public.validators.js';

const slugParam = z.object({ slug: z.string().min(1).max(160) });

export const publicController = {
  /* ─── BLOG ─── */
  async listPosts(req: Request, res: Response): Promise<void> {
    const q = publicPostsQuerySchema.parse(req.query);
    const data = await blogService.list(q);
    res.json({ success: true, ...data });
  },

  async getPost(req: Request, res: Response): Promise<void> {
    const { slug } = slugParam.parse(req.params);
    const locale = typeof req.query.locale === 'string' ? req.query.locale : undefined;
    const post = await blogService.getBySlug(slug, locale);
    if (!post) { res.status(404).json({ success: false, error: 'Статья не найдена' }); return; }
    res.json({ success: true, post });
  },

  async listCategories(req: Request, res: Response): Promise<void> {
    const locale = typeof req.query.locale === 'string' ? req.query.locale : undefined;
    const items = await blogService.listCategories(locale);
    res.json({ success: true, items });
  },

  /* ─── CONTACT ─── */
  async submitContact(req: Request, res: Response): Promise<void> {
    const dto = contactSchema.parse(req.body);
    const userAgent = req.headers['user-agent'] ?? undefined;
    const ip = (req.headers['x-forwarded-for']?.toString().split(',')[0].trim()
      ?? req.socket.remoteAddress
      ?? undefined);
    await contactService.save({
      ...dto,
      userId: req.user?.id,
      userAgent: userAgent ?? undefined,
      ip: ip ?? undefined,
    });
    res.json({
      success: true,
      message: 'Спасибо! Ваше сообщение получено. Мы ответим в течение 24 часов.',
    });
  },

  /* ─── COUNTRIES ─── */
  async listCountries(_req: Request, res: Response): Promise<void> {
    const items = countriesService.list();
    res.json({ success: true, items });
  },

  async getCountry(req: Request, res: Response): Promise<void> {
    const { slug } = slugParam.parse(req.params);
    const country = await countriesService.getBySlug(slug);
    if (!country) { res.status(404).json({ success: false, error: 'Страна не найдена' }); return; }
    const enriched = await countriesService.enrichFromTP(country);
    res.json({ success: true, country: enriched });
  },
};
