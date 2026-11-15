import { model, Schema, type InferSchemaType } from 'mongoose';

const weddingSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, trim: true, lowercase: true },
    ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    weddingDate: { type: Date },
    timezone: { type: String, required: true },
    currency: { type: String, required: true },
    location: { type: Schema.Types.Mixed },
    theme: { type: Schema.Types.Mixed },
    settings: { type: Schema.Types.Mixed },
    status: { type: String, required: true },
  },
  { timestamps: true, collection: 'weddings' },
);

weddingSchema.index({ slug: 1 }, { unique: true });
weddingSchema.index({ ownerId: 1 });
weddingSchema.index({ status: 1 });

export type WeddingDocument = InferSchemaType<typeof weddingSchema>;
export const WeddingModel = model('Wedding', weddingSchema);
