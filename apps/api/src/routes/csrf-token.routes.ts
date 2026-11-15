import { Router } from 'express';
import { createCsrfToken } from '../middleware/csrf-protection';
import { sendSuccess } from '../shared/api-response';

export const csrfTokenRouter = Router();

csrfTokenRouter.get('/', (request, response) => {
  request.session.csrfToken ??= createCsrfToken();
  sendSuccess(response, 'CSRF token issued', { token: request.session.csrfToken });
});
