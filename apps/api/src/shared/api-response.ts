import type { Response } from 'express';

export function sendSuccess<T>(response: Response, message: string, data: T, status = 200): void {
  response.status(status).json({ success: true, message, data });
}
