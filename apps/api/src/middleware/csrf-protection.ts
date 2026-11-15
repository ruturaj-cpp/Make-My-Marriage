import { randomBytes, timingSafeEqual } from 'node:crypto';
import type { RequestHandler } from 'express';

const safeMethods = new Set(['GET', 'HEAD', 'OPTIONS']);

export function matchesCsrfToken(
  expected: string | undefined,
  received: string | undefined,
): boolean {
  if (!expected || !received) return false;
  const expectedBytes = Buffer.from(expected);
  const receivedBytes = Buffer.from(received);
  return (
    expectedBytes.length === receivedBytes.length && timingSafeEqual(expectedBytes, receivedBytes)
  );
}

export const csrfProtection: RequestHandler = (request, response, next) => {
  if (safeMethods.has(request.method.toUpperCase())) {
    next();
    return;
  }

  if (!matchesCsrfToken(request.session.csrfToken, request.get('x-csrf-token'))) {
    response.status(403).json({
      success: false,
      message: 'A valid CSRF token is required.',
      error: { code: 'CSRF_TOKEN_INVALID' },
    });
    return;
  }

  next();
};

export function createCsrfToken(): string {
  return randomBytes(32).toString('hex');
}
