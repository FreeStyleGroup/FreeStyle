import app from './app.js';
import { config } from './config/index.js';
import { logger } from './utils/logger.js';
import { referenceService } from './services/travelpayouts/reference.service.js';

const start = async () => {
  // Warm reference data cache on startup
  await referenceService.warmCache();

  app.listen(config.port, () => {
    logger.info(`FreeStyle server running on port ${config.port}`);
    logger.info(`Environment: ${config.nodeEnv}`);
  });
};

start().catch((err) => {
  logger.fatal(err, 'Failed to start server');
  process.exit(1);
});
