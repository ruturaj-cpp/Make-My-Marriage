import { Router } from 'express';
import { requireAuthentication } from '../../middleware/require-authentication';
import { acceptInvitationController } from './member-invitation.controller';

export const memberInvitationRouter = Router();
memberInvitationRouter.post('/:token/accept', requireAuthentication, ...acceptInvitationController);
