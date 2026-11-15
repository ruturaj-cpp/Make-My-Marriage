import { Queue } from 'bullmq';
import { redisConnection } from './connection';

export const diagnosticsQueue = new Queue('worker-diagnostics', { connection: redisConnection });
