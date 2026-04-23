import mongoose, { Schema, Document } from 'mongoose';

export interface CourseDocument extends Document {
  title: string;
  description: string;
  thumbnail: string;
  teacherId: string;
  teacherName: string;
  subject: string;
  grade: string;
  price: number;
  lessons: {
    title: string;
    bunnyVideoId: string;
    duration: number;
    order: number;
    isFree: boolean;
    viewCount: number;
  }[];
  enrolled: number;
  rating: number;
  reviewsCount: number;
  isPublished: boolean;
  createdAt: Date;
}

const LessonSchema = new Schema({
  title: { type: String, required: true },
  bunnyVideoId: { type: String, required: true },
  duration: { type: Number, default: 0 },
  order: { type: Number, required: true },
  isFree: { type: Boolean, default: false },
  viewCount: { type: Number, default: 0 },
});

const CourseSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  thumbnail: { type: String, default: '' },
  teacherId: { type: String, required: true },
  teacherName: { type: String, required: true },
  subject: { type: String, required: true },
  grade: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  lessons: [LessonSchema],
  enrolled: { type: Number, default: 0 },
  rating: { type: Number, default: 0 },
  reviewsCount: { type: Number, default: 0 },
  isPublished: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.models.Course || mongoose.model<CourseDocument>('Course', CourseSchema);
