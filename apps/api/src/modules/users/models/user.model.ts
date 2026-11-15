import { model, Schema, type InferSchemaType } from 'mongoose';

const userSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, trim: true },
    passwordHash: { type: String, required: true, select: false },
    profileImage: { type: String },
    preferredLanguage: { type: String, required: true, default: 'en' },
    emailVerifiedAt: { type: Date },
    phoneVerifiedAt: { type: Date },
    status: { type: String, required: true },
  },
  { timestamps: true, collection: 'users' },
);

userSchema.index({ email: 1 }, { unique: true });

export type UserDocument = InferSchemaType<typeof userSchema>;
export const UserModel = model('User', userSchema);
