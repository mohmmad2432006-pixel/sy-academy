'use client'
import { useEffect, useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import DashboardLayout from '@/components/dashboard/DashboardLayout'
import { FiKey, FiDollarSign, FiPlus, FiCopy, FiCheck } from 'react-icons/fi'
import toast from 'react-hot-toast'

const SIDEBAR = [
  { label: 'الرئيسية', href: '/sales', icon: '🏠' },
  { label: 'إنشاء أكواد', href: '/sales/cards', icon: '🎟️' },
  { label: 'الأقساط', href: '/sales/installments', icon: '💳' },
]

export default function SalesDashboard() {
  const { user, userData, loading } = useAuth()
  const router = useRouter()
  const [courses, setCourses] = useState<any[]>([])
  const [cards, setCards] = useState<any[]>([])
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [form, setForm] = useState({ courseId: '', count: 1, expiryDays: 365 })
  const [creating, setCreating] = useState(false)

  useEffect(() => {
    if (!loading && !user) router.push('/auth/login')
    if (!loading && userData && !['sales', 'admin'].includes(userData.role)) router.push('/student')
  }, [loading, user, userData, router])

  useEffect(() => {
    if (!user) return
    user.getIdToken().then(token => {
      const h = { Authorization: `Bearer ${token}` }
      Promise.all([
        fetch('/api/courses', { headers: h }).then(r => r.json()),
        fetch('/api/cards?limit=20', { headers: h }).then(r => r.json()),
      ]).then(([cd, kd]) => {
        setCourses(cd.courses || [])
        setCards(kd.cards || [])
      }).catch(() => {})
    })
  }, [user])

  const createCards = async () => {
    if (!form.courseId) return toast.error('اختر الدورة أولاً')
    setCreating(true)
    try {
      const token = await user!.getIdToken()
      const res = await fetch('/api/cards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (res.ok) {
        toast.success(`تم إنشاء ${form.count} كود بنجاح!`)
        setCards(prev => [...(data.cards || []), ...prev])
      } else toast.error(data.error || 'فشل الإنشاء')
    } finally { setCreating(false) }
  }

  const copyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code)
    setCopiedId(id)
    toast.success('تم نسخ الكود!')
    setTimeout(() => setCopiedId(null), 2000)
  }

  if (loading) return <div className="min-h-screen hero-bg flex items-center justify-center"><div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"/></div>

  return (
    <DashboardLayout sidebarItems={SIDEBAR} role="sales" title="لوحة المبيعات">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-royal-950">لوحة المبيعات 💰</h1>
        <p className="text-gray-500 mt-1">إنشاء أكواد التفعيل وإدارة الأقساط</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Create Cards */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-black text-royal-900 text-lg mb-4 flex items-center gap-2">
            <FiPlus className="text-royal-500"/> إنشاء أكواد تفعيل
          </h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-bold text-gray-700 mb-2 block">الدورة</label>
              <select
                value={form.courseId}
                onChange={e => setForm({ ...form, courseId: e.target.value })}
                className="input-field"
              >
                <option value="">-- اختر دورة --</option>
                {courses.map((c: any) => (
                  <option key={c._id} value={c._id}>{c.title} — {c.subject}</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-bold text-gray-700 mb-2 block">عدد الأكواد</label>
                <input type="number" min={1} max={100} value={form.count}
                  onChange={e => setForm({ ...form, count: +e.target.value })}
                  className="input-field" />
              </div>
              <div>
                <label className="text-sm font-bold text-gray-700 mb-2 block">الصلاحية (أيام)</label>
                <input type="number" min={30} max={3650} value={form.expiryDays}
                  onChange={e => setForm({ ...form, expiryDays: +e.target.value })}
                  className="input-field" />
              </div>
            </div>
            <button onClick={createCards} disabled={creating} className="btn-primary w-full text-center disabled:opacity-60">
              {creating ? 'جاري الإنشاء...' : `🎟️ إنشاء ${form.count} كود`}
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="space-y-4">
          <div className="bg-royal-50 rounded-2xl p-5 flex items-center gap-4">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm"><FiKey className="text-royal-500 text-2xl"/></div>
            <div><div className="text-2xl font-black text-gray-800">{cards.length}</div><div className="text-gray-500 text-sm">أكواد منشأة</div></div>
          </div>
          <div className="bg-green-50 rounded-2xl p-5 flex items-center gap-4">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm"><FiCheck className="text-green-500 text-2xl"/></div>
            <div><div className="text-2xl font-black text-gray-800">{cards.filter((c:any)=>c.status==='used').length}</div><div className="text-gray-500 text-sm">أكواد مستخدمة</div></div>
          </div>
          <div className="bg-amber-50 rounded-2xl p-5 flex items-center gap-4">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm"><FiDollarSign className="text-amber-500 text-2xl"/></div>
            <div><div className="text-2xl font-black text-gray-800">{cards.filter((c:any)=>c.status==='unused').length}</div><div className="text-gray-500 text-sm">أكواد متاحة</div></div>
          </div>
        </div>
      </div>

      {/* Cards List */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="font-black text-royal-900 text-lg mb-4">آخر الأكواد المنشأة</h2>
        {cards.length === 0 ? (
          <div className="text-center py-10"><div className="text-4xl mb-2">🎟️</div><p className="text-gray-500">لا توجد أكواد بعد</p></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-right py-3 px-4 text-gray-500 font-bold">الكود</th>
                  <th className="text-right py-3 px-4 text-gray-500 font-bold">الدورة</th>
                  <th className="text-right py-3 px-4 text-gray-500 font-bold">الحالة</th>
                  <th className="text-right py-3 px-4 text-gray-500 font-bold">نسخ</th>
                </tr>
              </thead>
              <tbody>
                {cards.map((c: any) => (
                  <tr key={c._id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="py-3 px-4 font-mono font-bold text-royal-800 tracking-widest">{c.code}</td>
                    <td className="py-3 px-4 text-gray-600">{c.courseName || '—'}</td>
                    <td className="py-3 px-4">
                      <span className={`badge ${c.status==='unused'?'bg-green-100 text-green-700':c.status==='used'?'bg-gray-100 text-gray-500':'bg-red-100 text-red-600'}`}>
                        {c.status==='unused'?'متاح':c.status==='used'?'مستخدم':'منتهي'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {c.status === 'unused' && (
                        <button onClick={() => copyCode(c.code, c._id)} className="text-royal-500 hover:text-royal-700 transition-colors">
                          {copiedId === c._id ? <FiCheck className="text-green-500"/> : <FiCopy/>}
                        </button>
                      )}
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
