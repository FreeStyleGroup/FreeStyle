import cron, { type ScheduledTask } from 'node-cron';
import { config } from '../../config/index.js';
import { logger } from '../../utils/logger.js';
import { publisherService } from './publisher.service.js';

let task: ScheduledTask | null = null;

/**
 * Cron-планировщик автопубликаций.
 * Запускается каждую минуту и забирает все queued-jobs со scheduledAt <= now.
 * Можно отключить через SCHEDULER_ENABLED=false (например, для тестов).
 */
export function startScheduler(): void {
  if (!config.scheduler.enabled) {
    logger.info('Scheduler is disabled (SCHEDULER_ENABLED=false)');
    return;
  }
  if (task) return;
  task = cron.schedule(
    '* * * * *',
    () => {
      void publisherService.processPending().catch((err: unknown) => {
        logger.error({ err }, 'Scheduler tick failed');
      });
    },
    { timezone: 'Europe/Moscow' },
  );
  logger.info('Publish scheduler started (every minute, MSK)');
}

export function stopScheduler(): void {
  task?.stop();
  task = null;
}
