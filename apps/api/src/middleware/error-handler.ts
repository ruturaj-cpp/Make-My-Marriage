import type { ErrorRequestHandler } from 'express';
import { logger } from '../shared/logger';

export const errorHandler: ErrorRequestHandler = (error: unknown, _request, response, next) => {
  void next;
  logger.error({ err: error }, 'Unhandled request error');
  response.status(500).json({
    success: false,
    message: 'An unexpected error occurred.',
    error: { code: 'INTERNAL_SERVER_ERROR' },
  });
};
