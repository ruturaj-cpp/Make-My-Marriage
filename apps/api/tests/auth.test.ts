import { afterAll, beforeEach, describe, expect, it, vi } from 'vitest';
import type { Server } from 'node:http';
import session from 'express-session';
import request from 'supertest';

process.env.NODE_ENV = 'test';
process.env.MONGODB_URI ??= 'mongodb://127.0.0.1:27017/make_my_marriage_test';
process.env.SESSION_SECRET ??= 'test-session-secret-that-is-long-enough';

const { authenticateCredentials, registerUser, DuplicateEmailError } = vi.hoisted(() => {
  class DuplicateEmailError extends Error {
    constructor() {
      super('An account with this email already exists.');
      this.name = 'DuplicateEmailError';
    }
  }
  return {
    authenticateCredentials: vi.fn(),
    registerUser: vi.fn(),
    DuplicateEmailError,
  };
});
vi.mock('../src/modules/auth/auth.service', () => ({
  authenticateCredentials,
  registerUser,
  DuplicateEmailError,
}));

const { createApp } = await import('../src/app');
const app = createApp(new session.MemoryStore());
let server: Server;
let baseUrl: string;

beforeEach(() => {
  authenticateCredentials.mockReset();
  registerUser.mockReset();
});

beforeEach(async () => {
  if (server) return;
  server = app.listen(0);
  await new Promise<void>((resolve) => server.once('listening', resolve));
  const address = server.address();
  if (!address || typeof address === 'string') throw new Error('Could not bind test server');
  baseUrl = `http://127.0.0.1:${address.port}`;
});

describe('POST /api/v1/auth/login', () => {
  it('sets a session for valid credentials and rotates the CSRF token', async () => {
    authenticateCredentials.mockResolvedValue({
      id: 'user-1',
      name: 'Asha',
      email: 'asha@example.com',
    });
    const agent = request.agent(baseUrl);
    const firstTokenResponse = await agent.get('/api/v1/csrf-token').expect(200);
    const firstToken = firstTokenResponse.body.data.token as string;

    const response = await agent
      .post('/api/v1/auth/login')
      .set('X-CSRF-Token', firstToken)
      .send({ email: 'Asha@Example.com', password: 'a valid password' })
      .expect(200);

    expect(response.body).toMatchObject({
      success: true,
      message: 'Login successful',
      data: { user: { id: 'user-1', name: 'Asha', email: 'asha@example.com' } },
    });
    const nextTokenResponse = await agent.get('/api/v1/csrf-token').expect(200);
    expect(nextTokenResponse.body.data.token).not.toBe(firstToken);
  });

  it('rejects invalid credentials without revealing which value was wrong', async () => {
    authenticateCredentials.mockResolvedValue(null);
    const agent = request.agent(baseUrl);
    const token = (await agent.get('/api/v1/csrf-token')).body.data.token as string;
    const response = await agent
      .post('/api/v1/auth/login')
      .set('X-CSRF-Token', token)
      .send({ email: 'asha@example.com', password: 'wrong' })
      .expect(401);

    expect(response.body.error.code).toBe('INVALID_CREDENTIALS');
    expect(response.body.message).toContain('Email or password');
  });

  it('requires a CSRF token and validates the request body', async () => {
    const agent = request.agent(baseUrl);
    await agent.post('/api/v1/auth/login').send({ email: 'bad', password: '' }).expect(403);
    const token = (await agent.get('/api/v1/csrf-token')).body.data.token as string;
    await agent
      .post('/api/v1/auth/login')
      .set('X-CSRF-Token', token)
      .send({ email: 'bad', password: '' })
      .expect(422);
  });
});

describe('POST /api/v1/auth/register', () => {
  it('registers a user without returning a password hash, then accepts login', async () => {
    const user = { id: 'user-2', name: 'Asha Rao', email: 'asha@example.com' };
    registerUser.mockResolvedValue(user);
    const agent = request.agent(baseUrl);
    const csrfToken = (await agent.get('/api/v1/csrf-token')).body.data.token as string;

    const registration = await agent
      .post('/api/v1/auth/register')
      .set('X-CSRF-Token', csrfToken)
      .send({ name: ' Asha Rao ', email: 'ASHA@example.com', password: 'WeddingPlan123' })
      .expect(201);
    expect(registration.body).toMatchObject({
      success: true,
      message: 'Registration successful',
      data: { user },
    });
    expect(registration.body.data.user).not.toHaveProperty('passwordHash');

    authenticateCredentials.mockResolvedValue(user);
    const login = await agent
      .post('/api/v1/auth/login')
      .set('X-CSRF-Token', csrfToken)
      .send({ email: user.email, password: 'WeddingPlan123' })
      .expect(200);
    expect(login.body.data.user).toEqual(user);
    expect(login.headers['set-cookie']).toBeDefined();
  });

  it('rejects duplicate email addresses with a conflict response', async () => {
    registerUser.mockRejectedValue(new DuplicateEmailError());
    const agent = request.agent(baseUrl);
    const csrfToken = (await agent.get('/api/v1/csrf-token')).body.data.token as string;
    const response = await agent
      .post('/api/v1/auth/register')
      .set('X-CSRF-Token', csrfToken)
      .send({ name: 'Asha Rao', email: 'asha@example.com', password: 'WeddingPlan123' })
      .expect(409);
    expect(response.body.error.code).toBe('EMAIL_ALREADY_EXISTS');
  });

  it('rejects invalid emails, missing fields, and short passwords', async () => {
    const agent = request.agent(baseUrl);
    const csrfToken = (await agent.get('/api/v1/csrf-token')).body.data.token as string;
    await agent
      .post('/api/v1/auth/register')
      .set('X-CSRF-Token', csrfToken)
      .send({ name: 'Asha Rao', email: 'invalid', password: 'WeddingPlan123' })
      .expect(422);
    await agent
      .post('/api/v1/auth/register')
      .set('X-CSRF-Token', csrfToken)
      .send({ name: 'Asha Rao', email: 'asha@example.com' })
      .expect(422);
    await agent
      .post('/api/v1/auth/register')
      .set('X-CSRF-Token', csrfToken)
      .send({ name: 'Asha Rao', email: 'asha@example.com', password: 'short' })
      .expect(422);
    expect(registerUser).not.toHaveBeenCalled();
  });
});

afterAll(async () => {
  if (server)
    await new Promise<void>((resolve, reject) =>
      server.close((error) => (error ? reject(error) : resolve())),
    );
});
