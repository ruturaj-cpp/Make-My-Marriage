import { z } from 'zod';

export const appLanguageSchema = z.enum(['en', 'mr', 'hi']);
export type AppLanguageValue = z.infer<typeof appLanguageSchema>;

export const loginRequestSchema = z.object({
  email: z.string().trim().email('Enter a valid email address.').max(254).toLowerCase(),
  password: z.string().min(1, 'Enter your password.'),
});

export type LoginRequest = z.infer<typeof loginRequestSchema>;

export const registrationRequestSchema = z.object({
  name: z.string().trim().min(2, 'Enter your full name.').max(100, 'Name is too long.'),
  email: z.string().trim().email('Enter a valid email address.').max(254).toLowerCase(),
  password: z.string().min(8, 'Use at least 8 characters for your password.').max(128),
});

export const registrationFormSchema = registrationRequestSchema
  .extend({ confirmPassword: z.string().min(1, 'Confirm your password.') })
  .refine((values) => values.password === values.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match.',
  });

export type RegistrationRequest = z.infer<typeof registrationRequestSchema>;
export type RegistrationFormValues = z.infer<typeof registrationFormSchema>;
