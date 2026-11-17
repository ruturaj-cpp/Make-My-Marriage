import { describe, expect, it } from 'vitest';
import {
  appLanguageSchema,
  loginRequestSchema,
  registrationFormSchema,
  registrationRequestSchema,
  coupleDetailsFormSchema,
  onboardingProgressPatchSchema,
  partnerInvitationFormSchema,
  weddingDetailsFormSchema,
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

describe('onboarding schemas', () => {
  it('requires the couple names and wedding location while allowing undecided date and venue', () => {
    expect(
      coupleDetailsFormSchema.safeParse({ groomName: 'Arjun', brideName: 'Mira' }).success,
    ).toBe(true);
    expect(weddingDetailsFormSchema.safeParse({ city: 'Jaipur', state: 'Rajasthan' }).success).toBe(
      true,
    );
    expect(weddingDetailsFormSchema.safeParse({ city: '', state: '' }).success).toBe(false);
  });

  it('allows optional invitations and validates an entered address', () => {
    expect(partnerInvitationFormSchema.safeParse({}).success).toBe(true);
    expect(partnerInvitationFormSchema.safeParse({ email: 'not-an-email' }).success).toBe(false);
  });

  it('accepts an empty event selection and rejects an invalid step payload', () => {
    expect(
      onboardingProgressPatchSchema.safeParse({
        step: 'wedding-events',
        data: { events: [] },
        completed: true,
      }).success,
    ).toBe(true);
    expect(
      onboardingProgressPatchSchema.safeParse({ step: 'couple-details', data: { groomName: 42 } })
        .success,
    ).toBe(false);
  });
});
