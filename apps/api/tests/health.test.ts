import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import type { Server } from 'node:http';
import request from 'supertest';

process.env.NODE_ENV = 'test';
process.env.MONGODB_URI ??= 'mongodb://127.0.0.1:27017/make_my_marriage_test';
process.env.SESSION_SECRET ??= 'test-session-secret-that-is-long-enough';

const { app } = await import('../src/app');
let server: Server;
let baseUrl: string;

beforeAll(async () => {
  server = app.listen(0);
  await new Promise<void>((resolve) => server.once('listening', resolve));
  const address = server.address();
  if (!address || typeof address === 'string') throw new Error('Could not bind test server');
  baseUrl = `http://127.0.0.1:${address.port}`;
});

afterAll(async () => {
  await new Promise<void>((resolve, reject) =>
    server.close((error) => (error ? reject(error) : resolve())),
  );
});

describe('GET /api/v1/health', () => {
  it('returns the documented health response without a database connection', async () => {
    const response = await request(baseUrl).get('/api/v1/health').expect(200);
    expect(response.body).toMatchObject({ success: true, data: { status: 'ok' } });
  });
});
