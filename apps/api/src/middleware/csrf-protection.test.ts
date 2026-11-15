import type { Request, Response } from 'express';
import { describe, expect, it, vi } from 'vitest';
import { createCsrfToken, csrfProtection, matchesCsrfToken } from './csrf-protection';

describe('CSRF token utilities', () => {
  it('creates a random token that matches only itself', () => {
    const token = createCsrfToken();
    expect(token).toHaveLength(64);
    expect(matchesCsrfToken(token, token)).toBe(true);
    expect(matchesCsrfToken(token, `${token}x`)).toBe(false);
    expect(matchesCsrfToken(token, undefined)).toBe(false);
  });

  it('blocks unsafe requests without the session token and allows a matching token', () => {
    const response = { status: vi.fn().mockReturnThis(), json: vi.fn() } as unknown as Response;
    const next = vi.fn();
    const request = {
      method: 'POST',
      session: { csrfToken: 'expected-token' },
      get: vi.fn(() => undefined),
    } as unknown as Request;

    csrfProtection(request, response, next);

    expect(response.status).toHaveBeenCalledWith(403);
    expect(next).not.toHaveBeenCalled();

    const validRequest = {
      method: 'PATCH',
      session: { csrfToken: 'expected-token' },
      get: vi.fn(() => 'expected-token'),
    } as unknown as Request;
    const validNext = vi.fn();

    csrfProtection(validRequest, response, validNext);

    expect(validNext).toHaveBeenCalledOnce();
  });
});
