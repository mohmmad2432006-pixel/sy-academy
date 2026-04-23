import mongoose, { Schema, Document } from 'mongoose';

export interface ActivationCodeDocument extends Document {
  code: string;
  courseId: string;
  courseName: string;
  createdBy: string;
  usedBy?: string;
  usedAt?: Date;
  isUsed: boolean;
  price: number;
  createdAt: Date;
}

const ActivationCodeSchema = new Schema({
  code: { type: String, required: true, unique: true, uppercase: true },
  courseId: { type: String, required: true },
  courseName: { type: String, required: true },
  createdBy: { type: String, required: true },
  usedBy: { type: String },
  usedAt: { type: Date },
  isUsed: { type: Boolean, default: false },
  price: { type: Number, required: true },
}, { timestamps: true });

export default mongoose.models.ActivationCode || mongoose.model<ActivationCodeDocument>('ActivationCode', ActivationCodeSchema);
