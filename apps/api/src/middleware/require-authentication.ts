import type { RequestHandler } from 'express';

export const requireAuthentication: RequestHandler = (request, response, next) => {
  if (!request.session.userId) {
    response.status(401).json({
      success: false,
      message: 'Authentication is required.',
      error: { code: 'AUTHENTICATION_REQUIRED' },
    });
    return;
  }
  next();
};
