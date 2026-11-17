import { model, Schema, type InferSchemaType } from 'mongoose';

const eventSchema = new Schema(
  {
    weddingId: { type: Schema.Types.ObjectId, ref: 'Wedding', required: true },
    name: { type: String, required: true, trim: true, maxlength: 100 },
    description: { type: String, trim: true },
    eventType: { type: String, trim: true },
    startAt: { type: Date, required: true },
    endAt: { type: Date },
    timezone: { type: String, required: true, default: 'Asia/Kolkata' },
    venue: { type: Schema.Types.Mixed },
    assignedMembers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    status: { type: String, required: true, default: 'planned' },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true, collection: 'events' },
);

eventSchema.index({ weddingId: 1, startAt: 1 });
eventSchema.index({ weddingId: 1, status: 1 });

export type EventDocument = InferSchemaType<typeof eventSchema>;
export const EventModel = model('Event', eventSchema);
