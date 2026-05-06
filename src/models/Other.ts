import mongoose, { Schema } from 'mongoose'

// Activation Cards
const CardSchema = new Schema({
  code: { type: String, required: true, unique: true },
  courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
  courseName: { type: String, required: true },
  createdBySalesId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  usedByStudentId: { type: Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, enum: ['unused', 'used', 'expired'], default: 'unused' },
  price: { type: Number, default: 0 },
  expiresAt: Date,
  activatedAt: Date,
}, { timestamps: true })

// Enrollments
const EnrollmentSchema = new Schema({
  studentId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
  activatedByCardId: { type: Schema.Types.ObjectId, ref: 'Card' },
  expiresAt: Date,
  status: { type: String, enum: ['active', 'expired', 'suspended'], default: 'active' },
  progress: { type: Number, default: 0 },
  lastWatchedLessonId: { type: Schema.Types.ObjectId, ref: 'Lesson' },
}, { timestamps: true })

// Support Tickets
const TicketSchema = new Schema({
  studentId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  studentName: { type: String, required: true },
  subject: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: String, enum: ['open', 'in_progress', 'resolved', 'closed'], default: 'open' },
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  assignedToId: { type: Schema.Types.ObjectId, ref: 'User' },
  messages: [{
    senderId: { type: Schema.Types.ObjectId, ref: 'User' },
    senderName: String,
    message: String,
    sentAt: { type: Date, default: Date.now },
  }],
}, { timestamps: true })

// Installments
const InstallmentSchema = new Schema({
  studentId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  studentName: { type: String, required: true },
  createdBySalesId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  courses: [{ type: Schema.Types.ObjectId, ref: 'Course' }],
  totalAmount: { type: Number, required: true },
  monthlyAmount: { type: Number, required: true },
  paidMonths: { type: Number, default: 0 },
  totalMonths: { type: Number, required: true },
  nextDueDate: Date,
  status: { type: String, enum: ['pending', 'paid', 'overdue'], default: 'pending' },
  payments: [{
    date: { type: Date, default: Date.now },
    amount: Number,
    note: String,
  }],
}, { timestamps: true })

// Lesson Progress
const ProgressSchema = new Schema({
  studentId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  lessonId: { type: Schema.Types.ObjectId, ref: 'Lesson', required: true },
  courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
  watchedSeconds: { type: Number, default: 0 },
  totalSeconds: { type: Number, default: 0 },
  completed: { type: Boolean, default: false },
  lastWatchedAt: { type: Date, default: Date.now },
}, { timestamps: true })

export const Card = mongoose.models.Card || mongoose.model('Card', CardSchema)
export const Enrollment = mongoose.models.Enrollment || mongoose.model('Enrollment', EnrollmentSchema)
export const Ticket = mongoose.models.Ticket || mongoose.model('Ticket', TicketSchema)
export const Installment = mongoose.models.Installment || mongoose.model('Installment', InstallmentSchema)
export const Progress = mongoose.models.Progress || mongoose.model('Progress', ProgressSchema)
