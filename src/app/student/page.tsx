'use client'
import { useEffect, useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { FiBook, FiAward, FiClock, FiKey, FiMessageSquare, FiLogOut, FiUser } from 'react-icons/fi'
import toast from 'react-hot-toast'

export default function StudentDashboard() {
  const { user, userData, logout, loading } = useAuth()
  const router = useRouter()
  const [activationCode, setActivationCode] = useState('')
  const [activating, setActivating] = useState(false)
  const [enrollments, setEnrollments] = useState<any[]>([])

  useEffect(() => {
    if (!loading && !user) router.push('/auth/login')
    if (!loading && userData && userData.role !== 'student') {
      router.push(`/${userData.role}`)
    }
  }, [loading, user, userData, router])

  useEffect(() => {
    if (user) {
      user.getIdToken().then(token => {
        fetch('/api/student/enrollments', {
          headers: { Authorization: `Bearer ${token}` }
        }).then(r => r.json()).then(d => setEnrollments(d.enrollments || []))
      })
    }
  }, [user])

  const handleActivate = async () => {
    if (!activationCode.trim()) return toast.error('أدخل كود التفعيل')
    setActivating(true)
    try {
      const token = await user!.getIdToken()
      const res = await fetch('/api/cards/activate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ code: activationCode.trim() }),
      })
      const data = await res.json()
      if (res.ok) {
        toast.success('تم تفعيل الدورة بنجاح! 🎉')
        setActivationCode('')
      } else {
        toast.error(data.error || 'كود غير صحيح')
      }
    } finally {
      setActivating(false)
    }
  }

  if (loading) return (
    <div className="min-h-screen hero-bg flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-l border-gray-200 flex flex-col fixed h-full shadow-sm">
        <div className="p-6 border-b border-gray-100">
          <Link href="/" className="font-black text-royal-900 text-xl">
            Sy <span className="text-gold-500">Academy</span>
          </Link>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          <SideLink href="/student" icon={<FiBook />} label="دوراتي" active />
          <SideLink href="/student/profile" icon={<FiUser />} label="ملفي الشخصي" />
          <SideLink href="/student/tickets" icon={<FiMessageSquare />} label="الدعم الفني" />
        </nav>
        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-royal-100 flex items-center justify-center">
              <FiUser className="text-royal-600" />
            </div>
            <div>
              <div className="font-bold text-sm text-gray-800">{userData?.name || user?.displayName}</div>
              <div className="text-xs text-gray-400">طالب</div>
            </div>
          </div>
          <button onClick={logout} className="w-full flex items-center gap-2 text-red-500 hover:bg-red-50 rounded-xl px-4 py-2 text-sm font-medium transition-colors">
            <FiLogOut /> تسجيل الخروج
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="mr-64 flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-black text-royal-950">
            أهلاً، {userData?.name || user?.displayName} 👋
          </h1>
          <p className="text-gray-500 mt-1">متابعة دراستك ونجاحك يبدأ من هنا</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <StatCard icon={<FiBook className="text-royal-500 text-2xl" />} label="الدورات المفعّلة" value={enrollments.length} bg="bg-royal-50" />
          <StatCard icon={<FiAward className="text-gold-500 text-2xl" />} label="الدروس المكتملة" value="0" bg="bg-amber-50" />
          <StatCard icon={<FiClock className="text-green-500 text-2xl" />} label="ساعات الدراسة" value="0" bg="bg-green-50" />
        </div>

        {/* Activate Code */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-8">
          <h2 className="font-black text-royal-900 text-lg mb-4 flex items-center gap-2">
            <FiKey className="text-gold-500" /> تفعيل دورة جديدة
          </h2>
          <p className="text-gray-500 text-sm mb-4">أدخل كود التفعيل الذي حصلت عليه من قسم المبيعات</p>
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="أدخل كود التفعيل..."
              value={activationCode}
              onChange={e => setActivationCode(e.target.value.toUpperCase())}
              className="input-field flex-1 tracking-widest font-mono text-center"
              maxLength={16}
            />
            <button
              onClick={handleActivate}
              disabled={activating}
              className="btn-gold px-6"
            >
              {activating ? 'جاري التفعيل...' : 'تفعيل'}
            </button>
          </div>
        </div>

        {/* Enrolled Courses */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-black text-royal-900 text-lg mb-4">دوراتي المفعّلة</h2>
          {enrollments.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-5xl mb-3">📚</div>
              <p className="text-gray-500">لا توجد دورات مفعّلة بعد</p>
              <p className="text-gray-400 text-sm mt-1">فعّل كودك أعلاه للبدء</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {enrollments.map((en: any) => (
                <div key={en._id} className="border border-gray-200 rounded-xl p-4 hover:border-royal-300 transition-colors">
                  <h3 className="font-bold text-royal-900">{en.courseTitle || 'دورة'}</h3>
                  <div className="mt-2 bg-gray-100 rounded-full h-2">
                    <div className="bg-royal-500 h-2 rounded-full" style={{ width: `${en.progress || 0}%` }} />
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>{en.progress || 0}% مكتمل</span>
                    <Link href={`/courses/${en.courseId}`} className="text-royal-600 font-bold hover:underline">
                      متابعة الدراسة ←
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

function StatCard({ icon, label, value, bg }: any) {
  return (
    <div className={`${bg} rounded-2xl p-5 flex items-center gap-4`}>
      <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
        {icon}
      </div>
      <div>
        <div className="text-2xl font-black text-gray-800">{value}</div>
        <div className="text-gray-500 text-sm">{label}</div>
      </div>
    </div>
  )
}

function SideLink({ href, icon, label, active }: any) {
  return (
    <Link href={href} className={`sidebar-link ${active ? 'active' : ''}`}>
      {icon} {label}
    </Link>
  )
}
