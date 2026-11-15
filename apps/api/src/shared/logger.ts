import pino from 'pino';
import { env } from '../config/env';

export const logger = pino({
  level: env.NODE_ENV === 'development' ? 'debug' : 'info',
  redact: {
    paths: ['req.headers.authorization', 'req.headers.cookie', 'res.headers.set-cookie'],
    censor: '[Redacted]',
  },
});
