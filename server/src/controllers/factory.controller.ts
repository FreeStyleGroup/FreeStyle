import type { Request, Response } from 'express';
import { z } from 'zod';
import { ideasService } from '../services/factory/ideas.service.js';
import { articleService } from '../services/factory/article.service.js';
import { publisherService } from '../services/factory/publisher.service.js';
import {
  generateIdeasSchema,
  updateIdeaStatusSchema,
  ideasListQuerySchema,
  schedulePublishSchema,
} from '../validators/factory.validators.js';

function actorId(req: Request): string {
  if (!req.user) throw new Error('actor missing');
  return req.user.id;
}

const idParam = z.object({ id: z.string().uuid() });

export const factoryController = {
  /* ─── IDEAS ─── */

  async listIdeas(req: Request, res: Response): Promise<void> {
    const q = ideasListQuerySchema.parse(req.query);
    const items = await ideasService.list(q);
    res.json({ success: true, items });
  },

  async generateIdeas(req: Request, res: Response): Promise<void> {
    const dto = generateIdeasSchema.parse(req.body);
    const items = await ideasService.generate({ ...dto, actorId: actorId(req) });
    res.status(201).json({ success: true, items });
  },

  async updateIdeaStatus(req: Request, res: Response): Promise<void> {
    const { id } = idParam.parse(req.params);
    const { status } = updateIdeaStatusSchema.parse(req.body);
    const idea = await ideasService.setStatus(actorId(req), id, status);
    if (!idea) { res.status(404).json({ success: false, error: 'Не найдена' }); return; }
    res.json({ success: true, idea });
  },

  /* ─── ARTICLE GENERATION ─── */

  async generateArticle(req: Request, res: Response): Promise<void> {
    const { id } = idParam.parse(req.params);
    const post = await articleService.generateFromIdea(actorId(req), id);
    res.status(201).json({ success: true, post });
  },

  /* ─── PUBLISH JOBS ─── */

  async listJobs(_req: Request, res: Response): Promise<void> {
    const items = await publisherService.list();
    res.json({ success: true, items });
  },

  async schedulePublish(req: Request, res: Response): Promise<void> {
    const dto = schedulePublishSchema.parse(req.body);
    const job = await publisherService.schedule(actorId(req), {
      postId: dto.postId,
      channel: dto.channel,
      scheduledAt: new Date(dto.scheduledAt),
    });
    res.status(201).json({ success: true, job });
  },

  async cancelJob(req: Request, res: Response): Promise<void> {
    const { id } = idParam.parse(req.params);
    const ok = await publisherService.cancel(actorId(req), id);
    res.status(ok ? 200 : 404).json({ success: ok });
  },
};
