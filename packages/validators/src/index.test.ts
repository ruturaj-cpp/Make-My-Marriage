import { describe, expect, it } from 'vitest';
import {
  appLanguageSchema,
  loginRequestSchema,
  registrationFormSchema,
  registrationRequestSchema,
} from './index';

describe('app language schema', () => {
  it('accepts the product languages and rejects unsupported values', () => {
    expect(appLanguageSchema.parse('mr')).toBe('mr');
    expect(appLanguageSchema.safeParse('fr').success).toBe(false);
  });
});

describe('registration schemas', () => {
  it('normalizes registration fields and requires matching passwords in the form', () => {
    expect(
      registrationFormSchema.parse({
        name: ' Asha Rao ',
        email: ' ASHA@example.com ',
        password: 'WeddingPlan123',
        confirmPassword: 'WeddingPlan123',
      }),
    ).toEqual({
      name: 'Asha Rao',
      email: 'asha@example.com',
      password: 'WeddingPlan123',
      confirmPassword: 'WeddingPlan123',
    });
    expect(
      registrationFormSchema.safeParse({
        name: 'Asha Rao',
        email: 'asha@example.com',
        password: 'WeddingPlan123',
        confirmPassword: 'another-password',
      }).success,
    ).toBe(false);
  });

  it('rejects malformed email, missing fields, and weak passwords', () => {
    expect(
      registrationRequestSchema.safeParse({ name: '', email: 'invalid', password: 'short' })
        .success,
    ).toBe(false);
  });
});

describe('login request schema', () => {
  it('normalizes email addresses and preserves passwords', () => {
    expect(
      loginRequestSchema.parse({ email: '  USER@example.com ', password: ' A b 123 ' }),
    ).toEqual({
      email: 'user@example.com',
      password: ' A b 123 ',
    });
  });

  it('rejects missing or malformed credentials', () => {
    expect(loginRequestSchema.safeParse({ email: 'nope', password: '' }).success).toBe(false);
  });
});
