import type { OnboardingStep } from '@mmm/validators';
import { apiRequest } from '../../lib/api-client';

export type OnboardingEvent = { name: string; eventDate?: string; custom?: boolean };
export type OnboardingState = {
  id?: string;
  status: 'in_progress' | 'completed';
  currentStep: OnboardingStep;
  completedSteps: OnboardingStep[];
  coupleDetails: {
    groomName?: string;
    brideName?: string;
    groomPhotoKey?: string;
    bridePhotoKey?: string;
  } | null;
  weddingDetails: {
    weddingDate?: string;
    city?: string;
    state?: string;
    venueName?: string;
    weddingType?: string;
  } | null;
  events: OnboardingEvent[];
  invitation: { email?: string; message?: string } | null;
  weddingId: string | null;
  weddingName?: string | null;
  role?: string;
  completedAt?: string | null;
};

export type OnboardingEnvelope = { success: true; message: string; data: OnboardingState };
export type SaveStepInput = {
  step: OnboardingStep;
  data: Record<string, unknown>;
  completed?: boolean;
};
export type CompleteOnboardingEnvelope = {
  success: true;
  message: string;
  data: {
    wedding: { _id: string; name: string; slug: string; status: string } | null;
    invitation: { status: 'pending'; email: string } | null;
    inviteUrl: string | null;
    alreadyCompleted: boolean;
  };
};

export function getOnboarding() {
  return apiRequest<OnboardingEnvelope>('/onboarding/me');
}

export function saveOnboarding(input: SaveStepInput) {
  return apiRequest<OnboardingEnvelope>('/onboarding/me', {
    method: 'PATCH',
    body: JSON.stringify(input),
  });
}

export function completeOnboarding() {
  return apiRequest<CompleteOnboardingEnvelope>('/onboarding/complete', {
    method: 'POST',
    body: '{}',
  });
}
