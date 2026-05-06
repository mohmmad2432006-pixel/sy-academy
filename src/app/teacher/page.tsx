'use client'
import { useEffect, useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import DashboardLayout from '@/components/dashboard/DashboardLayout'
import { FiBook, FiUsers, FiEye, FiBarChart2, FiPlus } from 'react-icons/fi'

const SIDEBAR = [
  { label: 'الرئيسية', href: '/teacher', icon: '🏠' },
  { label: 'دوراتي', href: '/teacher/courses', icon: '📚' },
  { label: 'إحصائيات المشاهدات', href: '/teacher/stats', icon: '📊' },
]

export default function TeacherDashboard() {
  const { user, userData, loading } = useAuth()
  const router = useRouter()
  const [stats, setStats] = useState({ courses: 0, students: 0, views: 0 })
  const [courses, setCourses] = useState<any[]>([])

  useEffect(() => {
    if (!loading && !user) router.push('/auth/login')
    if (!loading && userData && !['teacher', 'admin'].includes(userData.role)) router.push('/student')
  }, [loading, user, userData, router])

  useEffect(() => {
    if (!user) return
    user.getIdToken().then(token => {
      fetch('/api/teacher/courses', { headers: { Authorization: `Bearer ${token}` } })
        .then(r => r.json()).then(d => {
          setCourses(d.courses || [])
          const totalStudents = (d.courses || []).reduce((a: number, c: any) => a + (c.studentsCount || 0), 0)
          const totalViews = (d.courses || []).reduce((a: number, c: any) => a + (c.viewsCount || 0), 0)
          setStats({ courses: (d.courses || []).length, students: totalStudents, views: totalViews })
        }).catch(() => {})
    })
  }, [user])

  if (loading) return <div className="min-h-screen hero-bg flex items-center justify-center"><div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin" /></div>

  return (
    <DashboardLayout sidebarItems={SIDEBAR} role="teacher" title="لوحة المدرّس">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-royal-950">مرحباً، {userData?.name} 👨‍🏫</h1>
        <p className="text-gray-500 mt-1">تابع دوراتك وإحصائيات طلابك</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <StatCard icon={<FiBook className="text-royal-500 text-2xl"/>} label="دوراتي" value={stats.courses} color="bg-royal-50" />
        <StatCard icon={<FiUsers className="text-green-500 text-2xl"/>} label="إجمالي الطلاب" value={stats.students} color="bg-green-50" />
        <StatCard icon={<FiEye className="text-purple-500 text-2xl"/>} label="إجمالي المشاهدات" value={stats.views} color="bg-purple-50" />
      </div>

      {/* Courses Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="font-black text-royal-900 text-lg mb-4 flex items-center gap-2">
          <FiBarChart2 className="text-royal-500" /> إحصائيات دوراتي
        </h2>
        {courses.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-5xl mb-3">📚</div>
            <p className="text-gray-500">لا توجد دورات بعد</p>
            <p className="text-gray-400 text-sm mt-1">تواصل مع فريق التحرير لإضافة دوراتك</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-right py-3 px-4 text-gray-500 font-bold">الدورة</th>
                  <th className="text-right py-3 px-4 text-gray-500 font-bold">المادة</th>
                  <th className="text-right py-3 px-4 text-gray-500 font-bold">الطلاب</th>
                  <th className="text-right py-3 px-4 text-gray-500 font-bold">المشاهدات</th>
                  <th className="text-right py-3 px-4 text-gray-500 font-bold">الدروس</th>
                  <th className="text-right py-3 px-4 text-gray-500 font-bold">الحالة</th>
                </tr>
              </thead>
              <tbody>
                {courses.map((c: any) => (
                  <tr key={c._id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4 font-bold text-royal-900">{c.title}</td>
                    <td className="py-3 px-4 text-gray-600">{c.subject}</td>
                    <td className="py-3 px-4">
                      <span className="flex items-center gap-1 text-green-600 font-bold">
                        <FiUsers /> {c.studentsCount || 0}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="flex items-center gap-1 text-purple-600 font-bold">
                        <FiEye /> {c.viewsCount || 0}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-600">{c.lessonsCount || 0} درس</td>
                    <td className="py-3 px-4">
                      <span className={`badge ${c.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                        {c.isActive ? 'نشطة' : 'معلّقة'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

function StatCard({ icon, label, value, color }: any) {
  return (
    <div className={`${color} rounded-2xl p-5 flex items-center gap-4`}>
      <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">{icon}</div>
      <div>
        <div className="text-2xl font-black text-gray-800">{value}</div>
        <div className="text-gray-500 text-sm">{label}</div>
      </div>
    </div>
  )
}
