import type { RequestHandler } from 'express';
import { onboardingProgressPatchSchema } from '@mmm/validators';
import { validateBody } from '../../middleware/validate-request';
import { sendSuccess } from '../../shared/api-response';
import {
  completeOnboarding,
  getOnboardingState,
  OnboardingConflictError,
  saveOnboardingStep,
} from './onboarding.service';

const getMine: RequestHandler = async (request, response, next) => {
  try {
    const state = await getOnboardingState(request.session.userId!);
    sendSuccess(response, 'Onboarding progress retrieved', state);
  } catch (error) {
    next(error);
  }
};

const saveMine: RequestHandler = async (request, response, next) => {
  try {
    const state = await saveOnboardingStep(
      request.session.userId!,
      onboardingProgressPatchSchema.parse(request.body),
    );
    sendSuccess(response, 'Onboarding progress saved', state);
  } catch (error) {
    if (error instanceof OnboardingConflictError) {
      response
        .status(409)
        .json({ success: false, message: error.message, error: { code: 'ONBOARDING_CONFLICT' } });
      return;
    }
    next(error);
  }
};

const createWorkspace: RequestHandler = async (request, response, next) => {
  try {
    const result = await completeOnboarding(request.session.userId!);
    sendSuccess(
      response,
      result.alreadyCompleted
        ? 'Wedding workspace already exists'
        : 'Wedding workspace created successfully',
      result,
      result.alreadyCompleted ? 200 : 201,
    );
  } catch (error) {
    if (error instanceof OnboardingConflictError) {
      response
        .status(409)
        .json({ success: false, message: error.message, error: { code: 'ONBOARDING_CONFLICT' } });
      return;
    }
    next(error);
  }
};

export const onboardingController = {
  getMine,
  saveMine: [validateBody(onboardingProgressPatchSchema), saveMine] as RequestHandler[],
  createWorkspace,
};
