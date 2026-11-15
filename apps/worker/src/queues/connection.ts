import type { ConnectionOptions } from 'bullmq';
import { env } from '../config/env';

export const redisConnection: ConnectionOptions = {
  host: env.REDIS_HOST,
  port: env.REDIS_PORT,
  ...(env.REDIS_PASSWORD ? { password: env.REDIS_PASSWORD } : {}),
  maxRetriesPerRequest: null,
};
