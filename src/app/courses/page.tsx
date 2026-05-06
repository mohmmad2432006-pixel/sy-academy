'use client'
import { useState, useEffect } from 'react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Link from 'next/link'
import { FiSearch, FiFilter, FiBook, FiUsers, FiPlay } from 'react-icons/fi'

const SUBJECTS = ['الكل', 'الرياضيات', 'الفيزياء', 'الكيمياء', 'الأحياء', 'اللغة العربية', 'اللغة الإنجليزية', 'التاريخ', 'الجغرافيا']
const GRADES = ['الكل', 'الصف التاسع', 'الصف العاشر', 'الصف الحادي عشر', 'الصف الثاني عشر']

interface Course {
  _id: string
  title: string
  subject: string
  grade: string
  teacherName: string
  description: string
  thumbnail?: string
  price: number
  lessonsCount: number
  studentsCount: number
  isActive: boolean
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [subject, setSubject] = useState('الكل')
  const [grade, setGrade] = useState('الكل')

  useEffect(() => {
    fetch('/api/courses').then(r => r.json()).then(d => {
      setCourses(d.courses || [])
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  const filtered = courses.filter(c => {
    const matchSearch = c.title.includes(search) || c.teacherName.includes(search)
    const matchSubject = subject === 'الكل' || c.subject === subject
    const matchGrade = grade === 'الكل' || c.grade === grade
    return matchSearch && matchSubject && matchGrade
  })

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Header */}
      <div className="hero-bg py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-5xl font-black text-white mb-4">
            الدورات التعليمية
          </h1>
          <p className="text-royal-200 text-lg max-w-2xl mx-auto">
            اختر دورتك من أفضل المدرسين السوريين وابدأ رحلتك نحو النجاح
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10">
        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <FiSearch className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="ابحث عن دورة أو مدرس..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="input-field pr-11"
              />
            </div>
            <select
              value={subject}
              onChange={e => setSubject(e.target.value)}
              className="input-field md:w-48"
            >
              {SUBJECTS.map(s => <option key={s}>{s}</option>)}
            </select>
            <select
              value={grade}
              onChange={e => setGrade(e.target.value)}
              className="input-field md:w-48"
            >
              {GRADES.map(g => <option key={g}>{g}</option>)}
            </select>
          </div>
        </div>

        {/* Courses Grid */}
        {loading ? (
          <div className="text-center py-20">
            <div className="w-12 h-12 border-4 border-royal-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-500">جاري التحميل...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-xl font-bold text-gray-700 mb-2">لا توجد دورات</h3>
            <p className="text-gray-500">لم نجد دورات تطابق بحثك، حاول تغيير الفلتر</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(course => (
              <CourseCard key={course._id} course={course} />
            ))}
          </div>
        )}
      </div>

      <Footer />
    </main>
  )
}

function CourseCard({ course }: { course: Course }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300 group">
      {/* Thumbnail */}
      <div className="h-40 hero-bg relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <FiPlay className="text-white/50 text-6xl group-hover:scale-110 transition-transform duration-300" />
        </div>
        <div className="absolute top-3 right-3">
          <span className="badge bg-white/20 text-white border border-white/30">{course.subject}</span>
        </div>
        <div className="absolute bottom-3 left-3">
          <span className="badge bg-gold-500 text-white">{course.grade}</span>
        </div>
      </div>

      <div className="p-5">
        <h3 className="font-black text-royal-900 text-lg mb-1 leading-tight">{course.title}</h3>
        <p className="text-gray-500 text-sm mb-3">الأستاذ: {course.teacherName}</p>
        <p className="text-gray-600 text-sm leading-relaxed line-clamp-2 mb-4">{course.description}</p>

        <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
          <span className="flex items-center gap-1"><FiBook /> {course.lessonsCount} درس</span>
          <span className="flex items-center gap-1"><FiUsers /> {course.studentsCount} طالب</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="font-black text-royal-700 text-lg">
            {course.price === 0 ? 'مجاني' : `${course.price.toLocaleString()} ل.س`}
          </div>
          <Link href={`/courses/${course._id}`} className="btn-primary py-2 px-5 text-sm">
            عرض الدورة
          </Link>
        </div>
      </div>
    </div>
  )
}
