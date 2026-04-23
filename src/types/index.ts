export type UserRole = 'student' | 'teacher' | 'sales' | 'support' | 'editor' | 'parent' | 'admin';

export interface User {
  _id?: string;
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: UserRole;
  phone?: string;
  bio?: string;
  // student
  enrolledCourses: string[];
  completedCourses: string[];
  parentId?: string;
  // teacher
  teachingCourses?: string[];
  // parent
  childrenIds?: string[];
  createdAt?: Date;
}

export interface Course {
  _id?: string;
  title: string;
  description: string;
  thumbnail: string;
  teacherId: string;
  teacherName: string;
  subject: string;
  grade: string;
  price: number;
  lessons: Lesson[];
  enrolled: number;
  rating: number;
  reviewsCount: number;
  isPublished: boolean;
  createdAt?: Date;
}

export interface Lesson {
  _id?: string;
  title: string;
  bunnyVideoId: string;
  duration: number;
  order: number;
  isFree: boolean;
  viewCount: number;
}

export interface ActivationCode {
  _id?: string;
  code: string;
  courseId: string;
  courseName: string;
  createdBy: string;
  usedBy?: string;
  usedAt?: Date;
  isUsed: boolean;
  price: number;
  createdAt?: Date;
}

export interface Subscription {
  _id?: string;
  studentId: string;
  studentName: string;
  courseIds: string[];
  totalPrice: number;
  monthlyAmount: number;
  paidMonths: number;
  totalMonths: number;
  salesId: string;
  status: 'active' | 'completed' | 'overdue';
  createdAt?: Date;
}

export interface SupportTicket {
  _id?: string;
  userId: string;
  userName: string;
  title: string;
  message: string;
  status: 'open' | 'in_progress' | 'resolved';
  assignedTo?: string;
  response?: string;
  createdAt?: Date;
}

export const GRADES = ['الصف العاشر', 'الصف الحادي عشر', 'الصف الثاني عشر - علمي', 'الصف الثاني عشر - أدبي'];
export const SUBJECTS = ['الرياضيات', 'الفيزياء', 'الكيمياء', 'الأحياء', 'اللغة العربية', 'اللغة الإنجليزية', 'التاريخ', 'الجغرافيا', 'الفلسفة', 'الاقتصاد'];
