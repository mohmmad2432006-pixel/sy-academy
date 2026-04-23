import mongoose, { Schema, Document } from 'mongoose';

export interface SupportTicketDocument extends Document {
  userId: string;
  userName: string;
  userEmail: string;
  title: string;
  message: string;
  status: 'open' | 'in_progress' | 'resolved';
  assignedTo?: string;
  response?: string;
  createdAt: Date;
}

const SupportTicketSchema = new Schema({
  userId: { type: String, required: true },
  userName: { type: String, required: true },
  userEmail: { type: String, required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  status: { type: String, enum: ['open','in_progress','resolved'], default: 'open' },
  assignedTo: { type: String },
  response: { type: String },
}, { timestamps: true });

export default mongoose.models.SupportTicket || mongoose.model<SupportTicketDocument>('SupportTicket', SupportTicketSchema);
