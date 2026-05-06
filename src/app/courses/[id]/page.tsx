'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import VideoPlayer from '@/components/video/VideoPlayer'
import { FiBook, FiUsers, FiLock, FiPlay, FiChevronDown, FiChevronUp } from 'react-icons/fi'
import Link from 'next/link'

export default function CourseDetailPage() {
  const { id } = useParams()
  const { user, userData } = useAuth()
  const router = useRouter()
  const [course, setCourse] = useState<any>(null)
  const [lessons, setLessons] = useState<any[]>([])
  const [enrollment, setEnrollment] = useState<any>(null)
  const [activeLesson, setActiveLesson] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [expandedLesson, setExpandedLesson] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    fetch(`/api/courses/${id}`).then(r => r.json()).then(d => {
      setCourse(d.course)
      setLoading(false)
    })
    fetch(`/api/lessons?courseId=${id}`).then(r => r.json()).then(d => {
      setLessons(d.lessons || [])
    })
  }, [id])

  useEffect(() => {
    if (!user || !id) return
    user.getIdToken().then(token => {
      fetch(`/api/student/enrollments`, { headers: { Authorization: `Bearer ${token}` } })
        .then(r => r.json()).then(d => {
          const en = (d.enrollments || []).find((e: any) => e.courseId === id)
          setEnrollment(en || null)
        })
    })
  }, [user, id])

  const getLessonSrc = (lesson: any): string => {
    if (lesson.videoSource === 'bunny' && lesson.bunnyLibraryId && lesson.bunnyVideoId) {
      return `https://vz-${lesson.bunnyLibraryId}.b-cdn.net/${lesson.bunnyVideoId}/playlist.m3u8`
    }
    return lesson.uploadedVideoUrl || ''
  }

  if (loading) return (
    <div className="min-h-screen hero-bg flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"/>
    </div>
  )

  if (!course) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="text-5xl mb-4">😕</div>
        <h2 className="text-xl font-bold text-gray-700">الدورة غير موجودة</h2>
        <Link href="/courses" className="btn-primary mt-4 inline-block">العودة للدورات</Link>
      </div>
    </div>
  )

  const isEnrolled = !!enrollment

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Video Player */}
            {activeLesson ? (
              <div className="mb-6">
                <VideoPlayer
                  src={getLessonSrc(activeLesson)}
                  sourceType={activeLesson.videoSource}
                  title={activeLesson.title}
                />
                <div className="mt-4">
                  <h2 className="text-xl font-black text-royal-900">{activeLesson.title}</h2>
                  {activeLesson.description && <p className="text-gray-500 mt-1">{activeLesson.description}</p>}
                </div>
              </div>
            ) : (
              <div className="hero-bg rounded-2xl h-64 flex items-center justify-center mb-6">
                <div className="text-center text-white">
                  <FiPlay className="text-5xl mx-auto mb-3 opacity-70"/>
                  <p className="font-bold">اختر درساً للبدء</p>
                </div>
              </div>
            )}

            {/* Course Info */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
              <div className="flex items-start gap-4 mb-4">
                <span className="badge bg-royal-100 text-royal-700 text-sm">{course.subject}</span>
                <span className="badge bg-amber-100 text-amber-700 text-sm">{course.grade}</span>
              </div>
              <h1 className="text-2xl font-black text-royal-950 mb-2">{course.title}</h1>
              <p className="text-gray-500 leading-relaxed">{course.description}</p>
              <div className="flex items-center gap-6 mt-4 pt-4 border-t border-gray-100 text-sm text-gray-500">
                <span className="flex items-center gap-1"><FiBook /> {course.lessonsCount} درس</span>
                <span className="flex items-center gap-1"><FiUsers /> {course.studentsCount} طالب</span>
                <span className="font-bold text-royal-700">المدرّس: {course.teacherName}</span>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Enrollment Card */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6 sticky top-4">
              <div className="text-2xl font-black text-royal-700 mb-4">
                {course.price === 0 ? 'مجاني' : `${course.price.toLocaleString()} ل.س`}
              </div>
              {isEnrolled ? (
                <div className="bg-green-50 text-green-700 rounded-xl p-3 text-center font-bold text-sm">
                  ✅ أنت مسجّل في هذه الدورة
                </div>
              ) : (
                <div>
                  <p className="text-gray-500 text-sm mb-4">تحتاج كود تفعيل للوصول لهذه الدورة</p>
                  {user ? (
                    <Link href="/student" className="btn-primary w-full text-center block">
                      🎟️ تفعيل بكود
                    </Link>
                  ) : (
                    <Link href="/auth/register" className="btn-primary w-full text-center block">
                      سجّل وابدأ
                    </Link>
                  )}
                </div>
              )}
            </div>

            {/* Lessons List */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h3 className="font-black text-royal-900 mb-4">محتوى الدورة</h3>
              {lessons.length === 0 ? (
                <p className="text-gray-400 text-sm text-center py-4">لا توجد دروس بعد</p>
              ) : (
                <div className="space-y-2">
                  {lessons.map((lesson: any) => (
                    <div key={lesson._id}>
                      <button
                        onClick={() => {
                          if (!isEnrolled && !['admin','teacher','editor'].includes(userData?.role || '')) return
                          setActiveLesson(lesson)
                        }}
                        className={`w-full flex items-center justify-between p-3 rounded-xl text-right transition-colors ${
                          activeLesson?._id === lesson._id
                            ? 'bg-royal-50 border border-royal-200'
                            : 'hover:bg-gray-50 border border-transparent'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm ${
                            activeLesson?._id === lesson._id ? 'bg-royal-600 text-white' : 'bg-gray-100'
                          }`}>
                            {lesson.order}
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-sm text-royal-900">{lesson.title}</div>
                          </div>
                        </div>
                        {!isEnrolled && !['admin','teacher','editor'].includes(userData?.role || '') ? (
                          <FiLock className="text-gray-400 flex-shrink-0"/>
                        ) : (
                          <FiPlay className="text-royal-400 flex-shrink-0"/>
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
