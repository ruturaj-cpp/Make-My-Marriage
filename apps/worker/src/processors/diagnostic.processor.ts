import { Worker } from 'bullmq';
import type { DiagnosticJobData } from '../jobs/diagnostic.job';
import { logger } from '../config/logger';
import { redisConnection } from '../queues/connection';

export const diagnosticWorker = new Worker<DiagnosticJobData>(
  'worker-diagnostics',
  async (job) => {
    logger.info({ jobId: job.id, requestedAt: job.data.requestedAt }, 'Diagnostic job processed');
  },
  { connection: redisConnection },
);

diagnosticWorker.on('failed', (job, error) =>
  logger.error({ jobId: job?.id, err: error }, 'Worker job failed'),
);
