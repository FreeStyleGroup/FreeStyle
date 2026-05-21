import type { Request, Response } from 'express';
import { z } from 'zod';
import { adminUsersService } from '../services/admin/users.service.js';
import { adminOrdersService } from '../services/admin/orders.service.js';
import { adminAnalyticsService } from '../services/admin/analytics.service.js';
import { adminContentService } from '../services/admin/content.service.js';
import { adminAuditService } from '../services/admin/audit.service.js';
import {
  updateUserSchema,
  updateOrderSchema,
  createPostSchema,
  updatePostSchema,
  createCategorySchema,
  updateCategorySchema,
  usersListQuerySchema,
  ordersListQuerySchema,
  postsListQuerySchema,
} from '../validators/admin.validators.js';

function actorId(req: Request): string {
  if (!req.user) throw new Error('actor missing — requireAuth не отработал');
  return req.user.id;
}

const idParam = z.object({ id: z.string().uuid() });

export const adminController = {
  /* ── USERS ── */

  async listUsers(req: Request, res: Response): Promise<void> {
    const q = usersListQuerySchema.parse(req.query);
    const data = await adminUsersService.list(q);
    res.json({ success: true, ...data });
  },

  async getUser(req: Request, res: Response): Promise<void> {
    const { id } = idParam.parse(req.params);
    const user = await adminUsersService.getById(id);
    if (!user) { res.status(404).json({ success: false, error: 'Не найден' }); return; }
    res.json({ success: true, user });
  },

  async updateUser(req: Request, res: Response): Promise<void> {
    const { id } = idParam.parse(req.params);
    const dto = updateUserSchema.parse(req.body);
    const user = await adminUsersService.update(actorId(req), id, dto);
    res.json({ success: true, user });
  },

  /* ── ORDERS ── */

  async listOrders(req: Request, res: Response): Promise<void> {
    const q = ordersListQuerySchema.parse(req.query);
    const data = await adminOrdersService.list(q);
    res.json({ success: true, ...data });
  },

  async updateOrder(req: Request, res: Response): Promise<void> {
    const { id } = idParam.parse(req.params);
    const dto = updateOrderSchema.parse(req.body);
    await adminOrdersService.updateStatus(actorId(req), id, dto);
    res.json({ success: true });
  },

  /* ── ANALYTICS ── */

  async analytics(_req: Request, res: Response): Promise<void> {
    const data = await adminAnalyticsService.overview();
    res.json({ success: true, ...data });
  },

  /* ── CONTENT — POSTS ── */

  async listPosts(req: Request, res: Response): Promise<void> {
    const q = postsListQuerySchema.parse(req.query);
    const data = await adminContentService.listPosts(q);
    res.json({ success: true, ...data });
  },

  async getPost(req: Request, res: Response): Promise<void> {
    const { id } = idParam.parse(req.params);
    const post = await adminContentService.getPost(id);
    if (!post) { res.status(404).json({ success: false, error: 'Не найден' }); return; }
    res.json({ success: true, post });
  },

  async createPost(req: Request, res: Response): Promise<void> {
    const dto = createPostSchema.parse(req.body);
    const post = await adminContentService.createPost(actorId(req), dto);
    res.status(201).json({ success: true, post });
  },

  async updatePost(req: Request, res: Response): Promise<void> {
    const { id } = idParam.parse(req.params);
    const dto = updatePostSchema.parse(req.body);
    const post = await adminContentService.updatePost(actorId(req), id, dto);
    if (!post) { res.status(404).json({ success: false, error: 'Не найден' }); return; }
    res.json({ success: true, post });
  },

  async deletePost(req: Request, res: Response): Promise<void> {
    const { id } = idParam.parse(req.params);
    const ok = await adminContentService.deletePost(actorId(req), id);
    res.status(ok ? 200 : 404).json({ success: ok });
  },

  /* ── CONTENT — CATEGORIES ── */

  async listCategories(_req: Request, res: Response): Promise<void> {
    const items = await adminContentService.listCategories();
    res.json({ success: true, items });
  },

  async createCategory(req: Request, res: Response): Promise<void> {
    const dto = createCategorySchema.parse(req.body);
    const category = await adminContentService.createCategory(actorId(req), dto);
    res.status(201).json({ success: true, category });
  },

  async updateCategory(req: Request, res: Response): Promise<void> {
    const { id } = idParam.parse(req.params);
    const dto = updateCategorySchema.parse(req.body);
    const category = await adminContentService.updateCategory(actorId(req), id, dto);
    if (!category) { res.status(404).json({ success: false, error: 'Не найден' }); return; }
    res.json({ success: true, category });
  },

  async deleteCategory(req: Request, res: Response): Promise<void> {
    const { id } = idParam.parse(req.params);
    const ok = await adminContentService.deleteCategory(actorId(req), id);
    res.status(ok ? 200 : 404).json({ success: ok });
  },

  /* ── AUDIT ── */

  async listAudit(_req: Request, res: Response): Promise<void> {
    const items = await adminAuditService.list(100);
    res.json({ success: true, items });
  },
};
