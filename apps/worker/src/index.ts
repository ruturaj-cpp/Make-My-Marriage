import { diagnosticsQueue } from './queues/diagnostics.queue';
import { diagnosticWorker } from './processors/diagnostic.processor';
import { logger } from './config/logger';

let closing = false;

async function shutdown(signal: string): Promise<void> {
  if (closing) return;
  closing = true;
  logger.info({ signal }, 'Worker shutdown started');
  await diagnosticWorker.close();
  await diagnosticsQueue.close();
}

diagnosticWorker.on('ready', () => logger.info('BullMQ worker connected to Redis'));
diagnosticWorker.on('error', (error) =>
  logger.error({ err: error }, 'BullMQ worker connection error'),
);
logger.info('Worker process started');
process.on('SIGINT', () => void shutdown('SIGINT').then(() => process.exit(0)));
process.on('SIGTERM', () => void shutdown('SIGTERM').then(() => process.exit(0)));
