import * as argon2 from 'argon2';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const { createUser, findExistingUser, findUser } = vi.hoisted(() => ({
  createUser: vi.fn(),
  findExistingUser: vi.fn(),
  findUser: vi.fn(),
}));
vi.mock('../src/modules/users/models/user.model', () => ({
  UserModel: { create: createUser, exists: findExistingUser, findOne: findUser },
}));

const { registerUser, authenticateCredentials, DuplicateEmailError } =
  await import('../src/modules/auth/auth.service');

describe('registerUser service', () => {
  beforeEach(() => {
    createUser.mockReset();
    findExistingUser.mockReset();
    findUser.mockReset();
    findExistingUser.mockResolvedValue(null);
  });

  it('stores an Argon2id hash and returns only the public user fields', async () => {
    createUser.mockImplementation(async (fields: Record<string, string>) => ({
      _id: { toString: () => 'user-3' },
      name: fields.name,
      email: fields.email,
      passwordHash: fields.passwordHash,
    }));

    const result = await registerUser({
      name: 'Asha Rao',
      email: 'asha@example.com',
      password: 'WeddingPlan123',
    });

    const stored = createUser.mock.calls[0][0] as Record<string, string>;
    expect(stored.passwordHash).toMatch(/^\$argon2id\$/);
    await expect(argon2.verify(stored.passwordHash, 'WeddingPlan123')).resolves.toBe(true);
    expect(stored).not.toHaveProperty('password');
    expect(result).toEqual({ id: 'user-3', name: 'Asha Rao', email: 'asha@example.com' });
  });

  it('authenticates an account using the hash produced during registration', async () => {
    let storedUser: Record<string, unknown> | undefined;
    createUser.mockImplementation(async (fields: Record<string, string>) => {
      storedUser = { _id: { toString: () => 'user-4' }, ...fields };
      return storedUser;
    });
    const created = await registerUser({
      name: 'Asha Rao',
      email: 'asha@example.com',
      password: 'WeddingPlan123',
    });
    findUser.mockReturnValue({ select: () => ({ exec: async () => storedUser }) });

    await expect(
      authenticateCredentials({ email: created.email, password: 'WeddingPlan123' }),
    ).resolves.toEqual(created);
    await expect(
      authenticateCredentials({ email: created.email, password: 'incorrect-password' }),
    ).resolves.toBeNull();
  });

  it('rejects an already registered email without creating another user', async () => {
    findExistingUser.mockResolvedValue({ _id: 'existing' });

    await expect(
      registerUser({ name: 'Asha Rao', email: 'asha@example.com', password: 'WeddingPlan123' }),
    ).rejects.toBeInstanceOf(DuplicateEmailError);
    expect(createUser).not.toHaveBeenCalled();
  });
});
