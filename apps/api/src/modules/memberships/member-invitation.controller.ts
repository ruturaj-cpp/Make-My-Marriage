import { createHash } from 'node:crypto';
import mongoose, { Types } from 'mongoose';
import type { RequestHandler } from 'express';
import { acceptInvitationParamsSchema } from '@mmm/validators';
import { MemberInvitationModel } from './models/member-invitation.model';
import { WeddingMemberModel } from './models/wedding-member.model';
import { UserModel } from '../users/models/user.model';
import { WeddingModel } from '../weddings/models/wedding.model';
import { OnboardingProgressModel } from '../onboarding/models/onboarding-progress.model';
import { sendSuccess } from '../../shared/api-response';

const accept: RequestHandler = async (request, response, next) => {
  if (!request.session.userId) {
    response.status(401).json({
      success: false,
      message: 'Authentication is required.',
      error: { code: 'AUTHENTICATION_REQUIRED' },
    });
    return;
  }

  try {
    const { token } = acceptInvitationParamsSchema.parse(request.params);
    const tokenHash = createHash('sha256').update(token).digest('hex');
    const invitation = await MemberInvitationModel.findOne({ tokenHash })
      .select('+tokenHash')
      .exec();
    if (!invitation) {
      response.status(404).json({
        success: false,
        message: 'Invitation not found.',
        error: { code: 'INVITATION_NOT_FOUND' },
      });
      return;
    }

    const user = await UserModel.findById(request.session.userId).select('email status').lean();
    if (!user || user.status !== 'active') {
      response.status(401).json({
        success: false,
        message: 'Authentication is required.',
        error: { code: 'AUTHENTICATION_REQUIRED' },
      });
      return;
    }
    if (user.email.toLowerCase() !== invitation.email) {
      response.status(403).json({
        success: false,
        message: 'Sign in with the invited email address to accept this invitation.',
        error: { code: 'INVITATION_EMAIL_MISMATCH' },
      });
      return;
    }

    if (invitation.status === 'accepted') {
      const existing = await WeddingMemberModel.findOne({
        weddingId: invitation.weddingId,
        userId: user._id,
        status: 'active',
      }).exec();
      if (existing) {
        sendSuccess(response, 'Invitation already accepted', {
          weddingId: invitation.weddingId.toString(),
        });
        return;
      }
      response.status(409).json({
        success: false,
        message: 'This invitation has already been accepted.',
        error: { code: 'INVITATION_ALREADY_USED' },
      });
      return;
    }
    if (invitation.status !== 'pending') {
      response.status(410).json({
        success: false,
        message: 'This invitation is no longer active.',
        error: { code: 'INVITATION_EXPIRED' },
      });
      return;
    }
    if (invitation.expiresAt <= new Date()) {
      invitation.status = 'expired';
      await invitation.save();
      response.status(410).json({
        success: false,
        message: 'This invitation has expired.',
        error: { code: 'INVITATION_EXPIRED' },
      });
      return;
    }

    const mongoSession = await mongoose.startSession();
    let weddingId: Types.ObjectId | undefined;
    try {
      await mongoSession.withTransaction(async () => {
        const currentInvitation = await MemberInvitationModel.findById(invitation._id)
          .session(mongoSession)
          .exec();
        if (
          !currentInvitation ||
          currentInvitation.status !== 'pending' ||
          currentInvitation.expiresAt <= new Date()
        ) {
          throw new Error('INVITATION_NO_LONGER_PENDING');
        }
        const incompatibleMembership = await WeddingMemberModel.findOne({
          userId: user._id,
          status: 'active',
          role: { $in: ['owner', 'family'] },
          weddingId: { $ne: currentInvitation.weddingId },
        })
          .session(mongoSession)
          .exec();
        if (incompatibleMembership) throw new Error('ACCOUNT_ALREADY_IN_COUPLE_WORKSPACE');

        const member = await WeddingMemberModel.findOne({
          weddingId: currentInvitation.weddingId,
          userId: user._id,
        })
          .session(mongoSession)
          .exec();
        if (member) {
          member.status = 'active';
          member.joinedAt = new Date();
          member.role = 'family';
          member.invitedBy = currentInvitation.invitedBy;
          await member.save({ session: mongoSession });
        } else {
          await WeddingMemberModel.create(
            [
              {
                weddingId: currentInvitation.weddingId,
                userId: user._id,
                role: 'family',
                permissions: [],
                status: 'active',
                invitedBy: currentInvitation.invitedBy,
                joinedAt: new Date(),
              },
            ],
            { session: mongoSession },
          );
        }
        currentInvitation.status = 'accepted';
        currentInvitation.acceptedAt = new Date();
        await currentInvitation.save({ session: mongoSession });
        const onboarding = await OnboardingProgressModel.findOne({ userId: user._id })
          .session(mongoSession)
          .exec();
        if (onboarding) {
          onboarding.status = 'completed';
          onboarding.currentStep = 'review';
          onboarding.completedSteps = [
            'welcome',
            'couple-details',
            'wedding-details',
            'wedding-events',
            'invite-partner',
            'review',
          ];
          onboarding.weddingId = currentInvitation.weddingId;
          onboarding.completedAt = new Date();
          onboarding.set('coupleDetails', {});
          onboarding.set('weddingDetails', {});
          onboarding.set('events', []);
          onboarding.set('invitation', undefined);
          await onboarding.save({ session: mongoSession });
        }
        weddingId = currentInvitation.weddingId;
      });
    } finally {
      await mongoSession.endSession();
    }

    const wedding = weddingId ? await WeddingModel.findById(weddingId).select('name').lean() : null;
    sendSuccess(response, 'Invitation accepted', {
      weddingId: weddingId?.toString(),
      weddingName: wedding?.name,
    });
  } catch (error) {
    if (error instanceof Error && error.message === 'ACCOUNT_ALREADY_IN_COUPLE_WORKSPACE') {
      response.status(409).json({
        success: false,
        message: 'This account already belongs to another couple workspace.',
        error: { code: 'WORKSPACE_MEMBERSHIP_CONFLICT' },
      });
      return;
    }
    if (error instanceof Error && error.message === 'INVITATION_NO_LONGER_PENDING') {
      response.status(410).json({
        success: false,
        message: 'This invitation is no longer active.',
        error: { code: 'INVITATION_EXPIRED' },
      });
      return;
    }
    next(error);
  }
};

export const acceptInvitationController: RequestHandler[] = [accept];
