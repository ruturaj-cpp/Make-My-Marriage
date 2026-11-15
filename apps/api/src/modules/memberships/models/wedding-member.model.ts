import { model, Schema, type InferSchemaType } from 'mongoose';

const weddingMemberSchema = new Schema(
  {
    weddingId: { type: Schema.Types.ObjectId, ref: 'Wedding', required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    role: { type: String, enum: ['owner', 'family', 'planner'], required: true },
    permissions: { type: [String], default: [] },
    status: { type: String, required: true },
    invitedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    joinedAt: { type: Date },
  },
  { timestamps: true, collection: 'weddingmembers' },
);

weddingMemberSchema.index({ weddingId: 1, userId: 1 }, { unique: true });

export type WeddingMemberDocument = InferSchemaType<typeof weddingMemberSchema>;
export const WeddingMemberModel = model('WeddingMember', weddingMemberSchema);
