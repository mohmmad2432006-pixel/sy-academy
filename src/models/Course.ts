import mongoose, { Schema } from 'mongoose'

const CourseSchema = new Schema({
  title: { type: String, required: true },
  subject: { type: String, required: true },
  grade: { type: String, required: true },
  teacherId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  teacherName: { type: String, required: true },
  description: String,
  thumbnail: String,
  price: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  lessonsCount: { type: Number, default: 0 },
  studentsCount: { type: Number, default: 0 },
}, { timestamps: true })

const LessonSchema = new Schema({
  courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
  title: { type: String, required: true },
  description: String,
  order: { type: Number, required: true },
  videoSource: { type: String, enum: ['bunny', 'upload'], required: true },
  bunnyVideoId: String,
  bunnyLibraryId: String,
  uploadedVideoUrl: String,
  duration: Number,
  viewsCount: { type: Number, default: 0 },
  isPublished: { type: Boolean, default: false },
}, { timestamps: true })

export const Course = mongoose.models.Course || mongoose.model('Course', CourseSchema)
export const Lesson = mongoose.models.Lesson || mongoose.model('Lesson', LessonSchema)
