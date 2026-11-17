import { model, Schema, type InferSchemaType } from 'mongoose';

const coupleSchema = new Schema(
  {
    groomName: { type: String, trim: true, maxlength: 100 },
    brideName: { type: String, trim: true, maxlength: 100 },
    groomPhotoKey: { type: String, maxlength: 512 },
    bridePhotoKey: { type: String, maxlength: 512 },
  },
  { _id: false },
);

const weddingDetailsSchema = new Schema(
  {
    weddingDate: { type: Date },
    city: { type: String, trim: true, maxlength: 100 },
    state: { type: String, trim: true, maxlength: 100 },
    venueName: { type: String, trim: true, maxlength: 160 },
    weddingType: { type: String, trim: true, maxlength: 80 },
  },
  { _id: false },
);

const onboardingEventSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    eventDate: { type: Date },
    custom: { type: Boolean, default: false },
  },
  { _id: false },
);

const partnerInvitationDraftSchema = new Schema(
  {
    email: { type: String, trim: true, lowercase: true, maxlength: 254 },
    message: { type: String, trim: true, maxlength: 500 },
  },
  { _id: false },
);

const onboardingProgressSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    status: {
      type: String,
      enum: ['in_progress', 'completed'],
      default: 'in_progress',
      required: true,
    },
    currentStep: {
      type: String,
      enum: [
        'welcome',
        'couple-details',
        'wedding-details',
        'wedding-events',
        'invite-partner',
        'review',
      ],
      default: 'welcome',
      required: true,
    },
    completedSteps: { type: [String], default: [] },
    coupleDetails: { type: coupleSchema, default: () => ({}) },
    weddingDetails: { type: weddingDetailsSchema, default: () => ({}) },
    events: { type: [onboardingEventSchema], default: [] },
    invitation: { type: partnerInvitationDraftSchema, default: undefined },
    weddingId: { type: Schema.Types.ObjectId, ref: 'Wedding' },
    completedAt: { type: Date },
  },
  { timestamps: true, collection: 'onboardingprogress' },
);

export type OnboardingProgressDocument = InferSchemaType<typeof onboardingProgressSchema>;
export const OnboardingProgressModel = model('OnboardingProgress', onboardingProgressSchema);
