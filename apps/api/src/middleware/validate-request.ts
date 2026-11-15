import type { RequestHandler } from 'express';
import type { ZodType } from 'zod';

export function validateBody<T>(schema: ZodType<T>): RequestHandler {
  return (request, response, next) => {
    const result = schema.safeParse(request.body);
    if (!result.success) {
      response.status(422).json({
        success: false,
        message: 'Invalid request',
        error: {
          code: 'VALIDATION_ERROR',
          details: result.error.issues.map((issue) => ({
            field: issue.path.join('.'),
            message: issue.message,
          })),
        },
      });
      return;
    }
    request.body = result.data;
    next();
  };
}
