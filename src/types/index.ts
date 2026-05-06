export type UserRole = 'student' | 'teacher' | 'sales' | 'support' | 'editor' | 'admin'
export type UserStatus = 'pending' | 'active' | 'suspended'
export type EnrollmentStatus = 'active' | 'expired' | 'suspended'
export type CardStatus = 'unused' | 'used' | 'expired'
export type TicketStatus = 'open' | 'in_progress' | 'resolved' | 'closed'
export type TicketPriority = 'low' | 'medium' | 'high'
export type InstallmentStatus = 'pending' | 'paid' | 'overdue'

export interface IUser {
  _id: string
  name: string
  email: string
  phone?: string
  photoURL?: string
  role: UserRole
  status: UserStatus
  firebaseUid: string
  parentEmail?: string
  deviceFingerprints: string[]
  currentDeviceId?: string
  createdAt: Date
  updatedAt: Date
}

export interface ICourse {
  _id: string
  title: string
  subject: string
  grade: string
  teacherId: string
  teacherName: string
  description: string
  thumbnail?: string
  price: number
  isActive: boolean
  lessonsCount: number
  studentsCount: number
  createdAt: Date
}

export interface ILesson {
  _id: string
  courseId: string
  title: string
  description?: string
  order: number
  videoSource: 'bunny' | 'upload'
  bunnyVideoId?: string
  bunnyLibraryId?: string
  uploadedVideoUrl?: string
  duration?: number
  viewsCount: number
  isPublished: boolean
  createdAt: Date
}

export interface IEnrollment {
  _id: string
  studentId: string
  courseId: string
  activatedByCardId?: string
  enrolledAt: Date
  expiresAt?: Date
  status: EnrollmentStatus
  progress: number
  lastWatchedLessonId?: string
}

export interface ICard {
  _id: string
  code: string
  courseId: string
  courseName: string
  createdBySalesId: string
  usedByStudentId?: string
  status: CardStatus
  price: number
  expiresAt?: Date
  activatedAt?: Date
  createdAt: Date
}

export interface IInstallment {
  _id: string
  studentId: string
  studentName: string
  createdBySalesId: string
  courses: string[]
  totalAmount: number
  monthlyAmount: number
  paidMonths: number
  totalMonths: number
  nextDueDate: Date
  status: InstallmentStatus
  payments: { date: Date; amount: number; note?: string }[]
  createdAt: Date
}

export interface ITicket {
  _id: string
  studentId: string
  studentName: string
  subject: string
  description: string
  status: TicketStatus
  priority: TicketPriority
  assignedToId?: string
  messages: {
    senderId: string
    senderName: string
    message: string
    sentAt: Date
  }[]
  createdAt: Date
  updatedAt: Date
}

export interface IDevice {
  _id: string
  userId: string
  fingerprint: string
  userAgent: string
  ip?: string
  lastSeenAt: Date
  createdAt: Date
}

export interface IProgress {
  _id: string
  studentId: string
  lessonId: string
  courseId: string
  watchedSeconds: number
  totalSeconds: number
  completed: boolean
  lastWatchedAt: Date
}
