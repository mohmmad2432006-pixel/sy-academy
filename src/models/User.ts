import mongoose, { Schema, Document } from 'mongoose';

export interface UserDocument extends Document {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: 'student' | 'teacher' | 'sales' | 'support' | 'editor' | 'parent' | 'admin';
  phone?: string;
  bio?: string;
  enrolledCourses: string[];
  completedCourses: string[];
  teachingCourses: string[];
  childrenIds: string[];
  parentId?: string;
  isActive: boolean;
  createdAt: Date;
}

const UserSchema = new Schema({
  uid: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  displayName: { type: String, required: true },
  photoURL: { type: String, default: '' },
  role: { type: String, enum: ['student','teacher','sales','support','editor','parent','admin'], default: 'student' },
  phone: { type: String, default: '' },
  bio: { type: String, default: '' },
  enrolledCourses: [{ type: String }],
  completedCourses: [{ type: String }],
  teachingCourses: [{ type: String }],
  childrenIds: [{ type: String }],
  parentId: { type: String },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.models.User || mongoose.model<UserDocument>('User', UserSchema);
