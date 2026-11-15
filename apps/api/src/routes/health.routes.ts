import { Router } from 'express';
import { sendSuccess } from '../shared/api-response';

export const healthRouter = Router();
healthRouter.get('/', (_request, response) =>
  sendSuccess(response, 'API is healthy', { status: 'ok' }),
);
