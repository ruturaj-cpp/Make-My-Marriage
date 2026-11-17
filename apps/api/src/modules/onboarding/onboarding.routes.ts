import { Router } from 'express';
import { requireAuthentication } from '../../middleware/require-authentication';
import { onboardingController } from './onboarding.controller';

export const onboardingRouter = Router();
onboardingRouter.use(requireAuthentication);
onboardingRouter.get('/me', onboardingController.getMine);
onboardingRouter.patch('/me', ...onboardingController.saveMine);
onboardingRouter.post('/complete', onboardingController.createWorkspace);
