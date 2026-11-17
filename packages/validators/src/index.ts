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

export const onboardingStepSchema = z.enum([
  'welcome',
  'couple-details',
  'wedding-details',
  'wedding-events',
  'invite-partner',
  'review',
]);
export type OnboardingStep = z.infer<typeof onboardingStepSchema>;

const coupleDraftSchema = z.object({
  groomName: z.string().trim().max(100).optional(),
  brideName: z.string().trim().max(100).optional(),
  groomPhotoKey: z.string().max(512).optional(),
  bridePhotoKey: z.string().max(512).optional(),
});

const weddingDraftSchema = z.object({
  weddingDate: z.string().date().optional().or(z.literal('')),
  city: z.string().trim().max(100).optional(),
  state: z.string().trim().max(100).optional(),
  venueName: z.string().trim().max(160).optional(),
  weddingType: z.string().trim().max(80).optional(),
});

const onboardingEventSchema = z.object({
  name: z.string().trim().min(1).max(100),
  eventDate: z.string().date().optional().or(z.literal('')),
  custom: z.boolean().optional(),
});

const partnerDraftSchema = z.object({
  email: z.string().trim().max(254).toLowerCase().optional().or(z.literal('')),
  message: z.string().trim().max(500).optional(),
});

export const onboardingProgressPatchSchema = z.discriminatedUnion('step', [
  z.object({ step: z.literal('welcome'), data: z.object({}), completed: z.boolean().optional() }),
  z.object({
    step: z.literal('couple-details'),
    data: coupleDraftSchema,
    completed: z.boolean().optional(),
  }),
  z.object({
    step: z.literal('wedding-details'),
    data: weddingDraftSchema,
    completed: z.boolean().optional(),
  }),
  z.object({
    step: z.literal('wedding-events'),
    data: z.object({ events: z.array(onboardingEventSchema).max(30).optional() }),
    completed: z.boolean().optional(),
  }),
  z.object({
    step: z.literal('invite-partner'),
    data: z.object({ invitation: partnerDraftSchema.optional() }),
    completed: z.boolean().optional(),
  }),
  z.object({ step: z.literal('review'), data: z.object({}), completed: z.boolean().optional() }),
]);

export const acceptInvitationParamsSchema = z.object({
  token: z.string().regex(/^[A-Za-z0-9_-]{40,100}$/),
});

export const acceptInvitationResponseSchema = z.object({});

export type OnboardingProgressPatch = z.infer<typeof onboardingProgressPatchSchema>;

export const coupleDetailsFormSchema = z.object({
  groomName: z.string().trim().min(2, 'Enter the groom’s full name.').max(100),
  brideName: z.string().trim().min(2, 'Enter the bride’s full name.').max(100),
});

export const weddingDetailsFormSchema = z.object({
  weddingDate: z.string().date().optional().or(z.literal('')),
  city: z.string().trim().min(2, 'Enter the wedding city.').max(100),
  state: z.string().trim().min(2, 'Enter the state.').max(100),
  venueName: z.string().trim().max(160).optional(),
  weddingType: z.string().trim().max(80).optional(),
});

export const partnerInvitationFormSchema = z.object({
  email: z
    .string()
    .trim()
    .email('Enter a valid email address.')
    .max(254)
    .toLowerCase()
    .optional()
    .or(z.literal('')),
  message: z.string().trim().max(500).optional(),
});
