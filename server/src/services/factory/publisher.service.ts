import { and, desc, eq, lte } from 'drizzle-orm';
import { db } from '../../db/index.js';
import { publishJobs, posts, auditLog, type PublishJob } from '../../db/schema.js';
import { articleService } from './article.service.js';
import { logger } from '../../utils/logger.js';

export interface PublishJobDto {
  id: string;
  postId: string;
  postTitle: string;
  channel: 'site' | 'telegram' | 'dzen' | 'vk';
  status: 'queued' | 'running' | 'done' | 'failed' | 'cancelled';
  scheduledAt: string;
  startedAt: string | null;
  completedAt: string | null;
  externalRefId: string | null;
  attempts: number;
  lastError: string | null;
  createdAt: string;
}

function toDto(j: PublishJob, postTitle: string): PublishJobDto {
  return {
    id: j.id,
    postId: j.postId,
    postTitle,
    channel: j.channel,
    status: j.status,
    scheduledAt: j.scheduledAt.toISOString(),
    startedAt: j.startedAt?.toISOString() ?? null,
    completedAt: j.completedAt?.toISOString() ?? null,
    externalRefId: j.externalRefId,
    attempts: j.attempts,
    lastError: j.lastError,
    createdAt: j.createdAt.toISOString(),
  };
}

export const publisherService = {
  async list(): Promise<PublishJobDto[]> {
    const rows = await db
      .select({ job: publishJobs, postTitle: posts.title })
      .from(publishJobs)
      .leftJoin(posts, eq(posts.id, publishJobs.postId))
      .orderBy(desc(publishJobs.scheduledAt))
      .limit(200);
    return rows.map((r) => toDto(r.job, r.postTitle ?? '—'));
  },

  async schedule(actorId: string, opts: { postId: string; channel: 'site' | 'telegram' | 'dzen' | 'vk'; scheduledAt: Date }): Promise<PublishJobDto> {
    const [job] = await db
      .insert(publishJobs)
      .values({
        postId: opts.postId,
        channel: opts.channel,
        status: 'queued',
        scheduledAt: opts.scheduledAt,
      })
      .returning();
    await db.insert(auditLog).values({
      actorId,
      action: 'publish.schedule',
      entityType: 'publish_job',
      entityId: job.id,
      meta: { channel: opts.channel, scheduledAt: opts.scheduledAt.toISOString() },
    });
    const post = await db.query.posts.findFirst({ where: eq(posts.id, opts.postId) });
    /** Если это публикация на сайт, ставим scheduledAt пост'у тоже — для SEO/UI */
    if (opts.channel === 'site') {
      await db
        .update(posts)
        .set({ status: 'scheduled', scheduledAt: opts.scheduledAt })
        .where(eq(posts.id, opts.postId));
    }
    return toDto(job, post?.title ?? '—');
  },

  async cancel(actorId: string, jobId: string): Promise<boolean> {
    const result = await db
      .update(publishJobs)
      .set({ status: 'cancelled', completedAt: new Date() })
      .where(eq(publishJobs.id, jobId))
      .returning({ id: publishJobs.id });
    if (result.length) {
      await db.insert(auditLog).values({
        actorId,
        action: 'publish.cancel',
        entityType: 'publish_job',
        entityId: jobId,
        meta: {},
      });
    }
    return result.length > 0;
  },

  /**
   * Запуск pending-задач. Вызывается планировщиком каждую минуту.
   * Для каждой выполненной — атомарно меняем статус и пишем в audit.
   */
  async processPending(now: Date = new Date()): Promise<void> {
    const due = await db.query.publishJobs.findMany({
      where: and(eq(publishJobs.status, 'queued'), lte(publishJobs.scheduledAt, now)),
      limit: 20,
    });
    if (due.length === 0) return;

    for (const job of due) {
      const startedAt = new Date();
      await db
        .update(publishJobs)
        .set({ status: 'running', startedAt, attempts: job.attempts + 1 })
        .where(eq(publishJobs.id, job.id));

      try {
        await dispatchByChannel(job);
        await db
          .update(publishJobs)
          .set({ status: 'done', completedAt: new Date() })
          .where(eq(publishJobs.id, job.id));
        logger.info({ jobId: job.id, channel: job.channel }, 'Publish job done');
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        logger.error({ jobId: job.id, err: msg }, 'Publish job failed');
        await db
          .update(publishJobs)
          .set({
            status: job.attempts + 1 >= 3 ? 'failed' : 'queued',
            lastError: msg,
            completedAt: job.attempts + 1 >= 3 ? new Date() : null,
          })
          .where(eq(publishJobs.id, job.id));
      }
    }
  },
};

async function dispatchByChannel(job: PublishJob): Promise<void> {
  switch (job.channel) {
    case 'site':
      await articleService.publishNow(job.postId);
      return;
    case 'telegram':
    case 'dzen':
    case 'vk':
      /** Будут реализованы отдельным релизом — нужны API-ключи каналов */
      throw new Error(`Channel "${job.channel}" не настроен (нужны API-ключи).`);
  }
}
