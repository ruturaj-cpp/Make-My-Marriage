import { model, Schema, type InferSchemaType } from 'mongoose';

const invitationSchema = new Schema(
  {
    weddingId: { type: Schema.Types.ObjectId, ref: 'Wedding', required: true },
    email: { type: String, required: true, trim: true, lowercase: true, maxlength: 254 },
    invitedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    message: { type: String, trim: true, maxlength: 500 },
    role: { type: String, enum: ['family'], default: 'family', required: true },
    tokenHash: { type: String, required: true, unique: true, select: false },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'expired', 'revoked'],
      default: 'pending',
      required: true,
    },
    expiresAt: { type: Date, required: true },
    acceptedAt: { type: Date },
  },
  { timestamps: true, collection: 'memberinvitations' },
);

invitationSchema.index({ email: 1, status: 1 });
invitationSchema.index(
  { email: 1 },
  { unique: true, partialFilterExpression: { status: 'pending' } },
);
invitationSchema.index({ weddingId: 1, status: 1 });

export type MemberInvitationDocument = InferSchemaType<typeof invitationSchema>;
export const MemberInvitationModel = model('MemberInvitation', invitationSchema);
