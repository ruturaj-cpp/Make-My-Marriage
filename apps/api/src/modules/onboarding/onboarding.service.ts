import { createHash, randomBytes, randomUUID } from 'node:crypto';
import mongoose, { Types, type HydratedDocument } from 'mongoose';
import { partnerInvitationFormSchema, type OnboardingProgressPatch } from '@mmm/validators';
import { EventModel } from '../events/models/event.model';
import { MemberInvitationModel } from '../memberships/models/member-invitation.model';
import { WeddingMemberModel } from '../memberships/models/wedding-member.model';
import { UserModel } from '../users/models/user.model';
import { WeddingModel } from '../weddings/models/wedding.model';
import {
  OnboardingProgressModel,
  type OnboardingProgressDocument,
} from './models/onboarding-progress.model';

const orderedSteps = [
  'welcome',
  'couple-details',
  'wedding-details',
  'wedding-events',
  'invite-partner',
  'review',
] as const;

export class OnboardingConflictError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'OnboardingConflictError';
  }
}

const nextStep = (step: (typeof orderedSteps)[number]) =>
  orderedSteps[Math.min(orderedSteps.indexOf(step) + 1, orderedSteps.length - 1)]!;

function dateOnly(value?: Date | null) {
  return value ? value.toISOString().slice(0, 10) : undefined;
}

function publicProgress(progress: HydratedDocument<OnboardingProgressDocument>) {
  return {
    id: progress._id.toString(),
    status: progress.status,
    currentStep: progress.currentStep,
    completedSteps: progress.completedSteps,
    coupleDetails: {
      groomName: progress.coupleDetails?.groomName,
      brideName: progress.coupleDetails?.brideName,
      groomPhotoKey: progress.coupleDetails?.groomPhotoKey,
      bridePhotoKey: progress.coupleDetails?.bridePhotoKey,
    },
    weddingDetails: {
      city: progress.weddingDetails?.city,
      state: progress.weddingDetails?.state,
      venueName: progress.weddingDetails?.venueName,
      weddingType: progress.weddingDetails?.weddingType,
      weddingDate: dateOnly(progress.weddingDetails?.weddingDate),
    },
    events: progress.events.map((event) => ({
      name: event.name,
      ...(dateOnly(event.eventDate) ? { eventDate: dateOnly(event.eventDate) } : {}),
      custom: event.custom,
    })),
    invitation: progress.invitation ?? null,
    weddingId: progress.weddingId?.toString() ?? null,
    completedAt: progress.completedAt ?? null,
  };
}

export async function getOnboardingState(userId: string) {
  const membership = await WeddingMemberModel.findOne({ userId, status: 'active' }).exec();
  if (membership) {
    const progress = await OnboardingProgressModel.findOne({ userId }).exec();
    const wedding = await WeddingModel.findById(membership.weddingId)
      .select('name weddingDate location settings')
      .lean();
    const settings = wedding?.settings as
      | {
          coupleDetails?: {
            groomName?: string;
            brideName?: string;
            groomPhotoKey?: string;
            bridePhotoKey?: string;
          };
          plannedEvents?: { name: string; custom: boolean }[];
        }
      | undefined;
    const location = wedding?.location as
      { city?: string; state?: string; venueName?: string; weddingType?: string } | undefined;
    const eventDocuments = await EventModel.find({ weddingId: membership.weddingId })
      .select('name startAt eventType')
      .lean();
    return {
      status: 'completed' as const,
      currentStep: 'review' as const,
      completedSteps: [...orderedSteps],
      coupleDetails: settings?.coupleDetails ?? null,
      weddingDetails: wedding
        ? {
            weddingDate: dateOnly(wedding.weddingDate),
            city: location?.city,
            state: location?.state,
            venueName: location?.venueName,
            weddingType: location?.weddingType,
          }
        : null,
      events: [
        ...(settings?.plannedEvents ?? []).map((event) => ({
          name: event.name,
          custom: event.custom,
        })),
        ...eventDocuments.map((event) => ({
          name: event.name,
          eventDate: dateOnly(event.startAt),
          custom: event.eventType === 'custom',
        })),
      ],
      invitation: null,
      weddingId: membership.weddingId.toString(),
      weddingName: wedding?.name ?? null,
      role: membership.role,
      completedAt: progress?.completedAt ?? null,
    };
  }
  const progress = await OnboardingProgressModel.findOneAndUpdate(
    { userId },
    { $setOnInsert: { userId } },
    { new: true, upsert: true, setDefaultsOnInsert: true },
  ).exec();
  if (!progress) throw new Error('Could not initialize onboarding progress.');
  return publicProgress(progress);
}

function assertCurrentStepComplete(
  step: OnboardingProgressPatch['step'],
  progress: {
    coupleDetails?: { groomName?: string | null; brideName?: string | null };
    weddingDetails?: { city?: string | null; state?: string | null };
  },
) {
  if (
    step === 'couple-details' &&
    (!progress.coupleDetails?.groomName?.trim() || !progress.coupleDetails?.brideName?.trim())
  ) {
    throw new OnboardingConflictError('Enter both names before continuing.');
  }
  if (
    step === 'wedding-details' &&
    (!progress.weddingDetails?.city?.trim() || !progress.weddingDetails?.state?.trim())
  ) {
    throw new OnboardingConflictError('Enter the wedding city and state before continuing.');
  }
}

export async function saveOnboardingStep(userId: string, patch: OnboardingProgressPatch) {
  if (await WeddingMemberModel.exists({ userId, status: 'active' })) {
    throw new OnboardingConflictError('Workspace members cannot edit onboarding.');
  }
  const progress = await OnboardingProgressModel.findOneAndUpdate(
    { userId },
    { $setOnInsert: { userId } },
    { new: true, upsert: true, setDefaultsOnInsert: true },
  ).exec();
  if (!progress) throw new Error('Could not initialize onboarding progress.');
  if (progress?.status === 'completed')
    throw new OnboardingConflictError('Onboarding is already complete.');

  if (patch.step === 'invite-partner' && patch.data.invitation?.email) {
    const currentUser = await UserModel.findById(userId).select('email').lean();
    if (currentUser?.email.toLowerCase() === patch.data.invitation.email.toLowerCase()) {
      throw new OnboardingConflictError('You cannot invite your own account as your partner.');
    }
  }

  if (patch.completed) {
    const previousSteps = orderedSteps.slice(0, orderedSteps.indexOf(patch.step));
    if (previousSteps.some((step) => !progress!.completedSteps.includes(step))) {
      throw new OnboardingConflictError('Complete the previous step first.');
    }
  }

  if (patch.step === 'couple-details') {
    for (const [key, value] of Object.entries(patch.data))
      progress.set(`coupleDetails.${key}`, value);
  } else if (patch.step === 'wedding-details') {
    for (const [key, value] of Object.entries(patch.data))
      progress.set(`weddingDetails.${key}`, value);
  } else if (patch.step === 'wedding-events' && patch.data.events) {
    progress.set(
      'events',
      patch.data.events.map((event) => ({
        name: event.name,
        ...(event.eventDate ? { eventDate: event.eventDate } : {}),
        custom: event.custom ?? false,
      })),
    );
  } else if (patch.step === 'invite-partner' && patch.data.invitation) {
    progress.set('invitation', {
      ...(patch.data.invitation.email ? { email: patch.data.invitation.email } : {}),
      ...(patch.data.invitation.message ? { message: patch.data.invitation.message } : {}),
    });
  }

  if (patch.completed) {
    assertCurrentStepComplete(patch.step, progress);
    if (!progress.completedSteps.includes(patch.step)) progress.completedSteps.push(patch.step);
    progress.currentStep = nextStep(patch.step);
  } else {
    progress.currentStep = patch.step;
  }
  await progress.save();
  return publicProgress(progress);
}

function slugPart(value: string) {
  return value
    .normalize('NFKD')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 70);
}

export async function completeOnboarding(userId: string) {
  const currentMembership = await WeddingMemberModel.findOne({ userId, status: 'active' }).exec();
  if (currentMembership) {
    return {
      wedding: await WeddingModel.findById(currentMembership.weddingId).lean(),
      invitation: null,
      inviteUrl: null,
      alreadyCompleted: true,
    };
  }

  const progress = await OnboardingProgressModel.findOne({ userId }).exec();
  if (!progress) throw new OnboardingConflictError('Onboarding progress was not found.');
  if (progress.status === 'completed' && progress.weddingId) {
    return {
      wedding: await WeddingModel.findById(progress.weddingId).lean(),
      invitation: null,
      inviteUrl: null,
      alreadyCompleted: true,
    };
  }
  const requiredBeforeCreate = orderedSteps.slice(0, -1);
  if (requiredBeforeCreate.some((step) => !progress.completedSteps.includes(step))) {
    throw new OnboardingConflictError(
      'Complete each onboarding step before creating the workspace.',
    );
  }
  assertCurrentStepComplete('couple-details', progress);
  assertCurrentStepComplete('wedding-details', progress);

  const owner = await UserModel.findById(userId).select('email').lean();
  if (!owner) throw new OnboardingConflictError('Your user account could not be found.');
  const partnerEmail = progress.invitation?.email?.trim().toLowerCase();
  const invitationValidation = partnerInvitationFormSchema.safeParse({ email: partnerEmail ?? '' });
  if (!invitationValidation.success) {
    throw new OnboardingConflictError(
      'Enter a valid partner email address or clear the invitation field.',
    );
  }
  if (partnerEmail && partnerEmail === owner.email.toLowerCase()) {
    throw new OnboardingConflictError('You cannot invite your own account as your partner.');
  }

  const weddingId = new Types.ObjectId();
  const slug = `${slugPart(`${progress.coupleDetails.groomName}-${progress.coupleDetails.brideName}`) || 'wedding'}-${randomUUID().slice(0, 8)}`;
  const token = partnerEmail ? randomBytes(32).toString('base64url') : null;
  const tokenHash = token ? createHash('sha256').update(token).digest('hex') : null;
  const session = await mongoose.startSession();
  let result: {
    wedding: unknown;
    invitation: { status: string; email: string } | null;
    inviteUrl: string | null;
    alreadyCompleted: boolean;
  } = {
    wedding: null,
    invitation: null,
    inviteUrl: null,
    alreadyCompleted: false,
  };
  try {
    await session.withTransaction(async () => {
      const draft = await OnboardingProgressModel.findOne({ userId }).session(session).exec();
      if (!draft) throw new OnboardingConflictError('Onboarding progress was not found.');
      if (draft.status === 'completed' && draft.weddingId) {
        result = {
          wedding: await WeddingModel.findById(draft.weddingId).session(session).lean(),
          invitation: null,
          inviteUrl: null,
          alreadyCompleted: true,
        };
        return;
      }
      if (partnerEmail) {
        await MemberInvitationModel.updateMany(
          { email: partnerEmail, status: 'pending', expiresAt: { $lte: new Date() } },
          { $set: { status: 'expired' } },
          { session },
        );
        const invitedUser = await UserModel.findOne({ email: partnerEmail })
          .select('_id')
          .session(session)
          .lean();
        if (
          invitedUser &&
          (await WeddingMemberModel.exists({
            userId: invitedUser._id,
            status: 'active',
            role: { $in: ['owner', 'family'] },
          }).session(session))
        ) {
          throw new OnboardingConflictError(
            'This account already belongs to another couple workspace.',
          );
        }
        const pending = await MemberInvitationModel.findOne({
          email: partnerEmail,
          status: 'pending',
          expiresAt: { $gt: new Date() },
        })
          .session(session)
          .lean();
        if (pending)
          throw new OnboardingConflictError('This email already has a pending wedding invitation.');
      }

      const created = await WeddingModel.create(
        [
          {
            _id: weddingId,
            name: `${draft.coupleDetails.groomName} & ${draft.coupleDetails.brideName} Wedding`,
            slug,
            ownerId: new Types.ObjectId(userId),
            ...(draft.weddingDetails.weddingDate
              ? { weddingDate: draft.weddingDetails.weddingDate }
              : {}),
            timezone: 'Asia/Kolkata',
            currency: 'INR',
            location: {
              city: draft.weddingDetails.city,
              state: draft.weddingDetails.state,
              country: 'India',
              ...(draft.weddingDetails.venueName
                ? { venueName: draft.weddingDetails.venueName }
                : {}),
              ...(draft.weddingDetails.weddingType
                ? { weddingType: draft.weddingDetails.weddingType }
                : {}),
            },
            settings: {
              coupleDetails: {
                groomName: draft.coupleDetails.groomName,
                brideName: draft.coupleDetails.brideName,
                ...(draft.coupleDetails.groomPhotoKey
                  ? { groomPhotoKey: draft.coupleDetails.groomPhotoKey }
                  : {}),
                ...(draft.coupleDetails.bridePhotoKey
                  ? { bridePhotoKey: draft.coupleDetails.bridePhotoKey }
                  : {}),
              },
              plannedEvents: draft.events
                .filter((event) => !event.eventDate)
                .map((event) => ({ name: event.name, custom: event.custom })),
            },
            status: 'active',
          },
        ],
        { session },
      );

      await WeddingMemberModel.create(
        [
          {
            weddingId,
            userId: new Types.ObjectId(userId),
            role: 'owner',
            permissions: [],
            status: 'active',
            joinedAt: new Date(),
          },
        ],
        { session },
      );

      const scheduledEvents = draft.events.filter((event) => event.eventDate);
      if (scheduledEvents.length) {
        await EventModel.create(
          scheduledEvents.map((event) => ({
            weddingId,
            name: event.name,
            eventType: event.custom ? 'custom' : 'ceremony',
            startAt: event.eventDate,
            timezone: 'Asia/Kolkata',
            status: event.eventDate ? 'scheduled' : 'planned',
            createdBy: new Types.ObjectId(userId),
          })),
          { session },
        );
      }

      if (partnerEmail && tokenHash) {
        await MemberInvitationModel.create(
          [
            {
              weddingId,
              email: partnerEmail,
              invitedBy: new Types.ObjectId(userId),
              message: draft.invitation?.message,
              role: 'family',
              tokenHash,
              status: 'pending',
              expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            },
          ],
          { session },
        );
      }

      draft.status = 'completed';
      draft.currentStep = 'review';
      draft.weddingId = weddingId;
      draft.completedAt = new Date();
      draft.completedSteps = [...new Set([...draft.completedSteps, ...orderedSteps])];
      draft.set('coupleDetails', {});
      draft.set('weddingDetails', {});
      draft.set('events', []);
      draft.set('invitation', undefined);
      await draft.save({ session });

      result = {
        wedding: created[0]!.toObject(),
        invitation: partnerEmail ? { status: 'pending', email: partnerEmail } : null,
        inviteUrl: token ? `/invitations/accept#${token}` : null,
        alreadyCompleted: false,
      };
    });
  } finally {
    await session.endSession();
  }
  return result;
}
