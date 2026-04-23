import mongoose, { Schema, Document } from 'mongoose';

export interface SubscriptionDocument extends Document {
  studentId: string;
  studentName: string;
  studentEmail: string;
  courseIds: string[];
  totalPrice: number;
  monthlyAmount: number;
  paidMonths: number;
  totalMonths: number;
  salesId: string;
  salesName: string;
  status: 'active' | 'completed' | 'overdue';
  payments: { month: number; amount: number; paidAt: Date }[];
  createdAt: Date;
}

const SubscriptionSchema = new Schema({
  studentId: { type: String, required: true },
  studentName: { type: String, required: true },
  studentEmail: { type: String, required: true },
  courseIds: [{ type: String }],
  totalPrice: { type: Number, required: true },
  monthlyAmount: { type: Number, required: true },
  paidMonths: { type: Number, default: 0 },
  totalMonths: { type: Number, required: true },
  salesId: { type: String, required: true },
  salesName: { type: String, required: true },
  status: { type: String, enum: ['active','completed','overdue'], default: 'active' },
  payments: [{ month: Number, amount: Number, paidAt: Date }],
}, { timestamps: true });

export default mongoose.models.Subscription || mongoose.model<SubscriptionDocument>('Subscription', SubscriptionSchema);
