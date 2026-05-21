import app from './app.js';
import { config } from './config/index.js';
import { logger } from './utils/logger.js';
import { referenceService } from './services/travelpayouts/reference.service.js';
import { checkDbConnection, closeDb } from './db/index.js';
import { startScheduler, stopScheduler } from './services/factory/scheduler.js';

/**
 * Bootstrap: проверяем БД и прогреваем reference-кэш до того как Express
 * откроет порт — фейлим быстро, если что-то не так.
 */
const start = async (): Promise<void> => {
  await checkDbConnection();
  logger.info('Postgres connection OK');

  await referenceService.warmCache();

  startScheduler();

  const server = app.listen(config.port, () => {
    logger.info(`FreeStyle server running on port ${config.port}`);
    logger.info(`Environment: ${config.nodeEnv}`);
  });

  /** Graceful shutdown для Docker SIGTERM */
  const shutdown = async (signal: string): Promise<void> => {
    logger.info({ signal }, 'Shutting down gracefully…');
    stopScheduler();
    server.close(async () => {
      await closeDb();
      logger.info('Shutdown complete');
      process.exit(0);
    });
    setTimeout(() => {
      logger.error('Forced exit after 10s');
      process.exit(1);
    }, 10_000).unref();
  };

  process.on('SIGTERM', () => void shutdown('SIGTERM'));
  process.on('SIGINT', () => void shutdown('SIGINT'));
};

start().catch((err) => {
  logger.fatal(err, 'Failed to start server');
  process.exit(1);
});
