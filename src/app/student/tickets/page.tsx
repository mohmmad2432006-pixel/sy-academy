'use client'
import { useEffect, useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { FiArrowRight, FiSend, FiSmartphone } from 'react-icons/fi'
import toast from 'react-hot-toast'

export default function StudentTicketsPage() {
  const { user, userData, loading } = useAuth()
  const router = useRouter()
  const [tickets, setTickets] = useState<any[]>([])
  const [form, setForm] = useState({ subject: '', description: '', priority: 'medium' })
  const [sending, setSending] = useState(false)
  const [tab, setTab] = useState<'list' | 'new'>('list')

  useEffect(() => {
    if (!loading && !user) router.push('/auth/login')
  }, [loading, user, router])

  useEffect(() => {
    if (!user) return
    user.getIdToken().then(token => {
      fetch('/api/tickets', { headers: { Authorization: `Bearer ${token}` } })
        .then(r => r.json()).then(d => setTickets(d.tickets || []))
    })
  }, [user])

  const submitTicket = async () => {
    if (!form.subject.trim() || !form.description.trim()) return toast.error('أكمل البيانات')
    setSending(true)
    try {
      const token = await user!.getIdToken()
      const res = await fetch('/api/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        toast.success('تم إرسال التذكرة بنجاح!')
        setForm({ subject: '', description: '', priority: 'medium' })
        setTab('list')
        const data = await res.json()
        setTickets(prev => [data.ticket, ...prev])
      } else toast.error('فشل الإرسال')
    } finally { setSending(false) }
  }

  const requestDeviceUnlock = async () => {
    if (!confirm('هل تريد إرسال طلب فك قيد الجهاز؟')) return
    const token = await user!.getIdToken()
    const res = await fetch('/api/devices', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ reason: 'أطلب فك قيد الجهاز بسبب تغيير الجهاز' }),
    })
    if (res.ok) toast.success('تم إرسال الطلب!')
    else toast.error('فشل الإرسال')
  }

  if (loading) return null

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="hero-bg py-8">
        <div className="max-w-3xl mx-auto px-4">
          <div className="flex items-center gap-3 mb-2">
            <Link href="/student" className="text-white/70 hover:text-white transition-colors">
              <FiArrowRight />
            </Link>
            <h1 className="text-2xl font-black text-white">الدعم الفني</h1>
          </div>
          <p className="text-royal-200 text-sm">تواصل مع فريق الدعم لأي مشكلة</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Device blocked warning */}
        {userData?.deviceBlocked && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-5 mb-6">
            <div className="flex items-start gap-3">
              <FiSmartphone className="text-red-500 text-xl mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-black text-red-700 mb-1">تم كشف جهاز جديد</h3>
                <p className="text-red-600 text-sm">حسابك مرتبط بجهاز آخر. لا يمكنك مشاهدة الدروس على هذا الجهاز.</p>
                <button onClick={requestDeviceUnlock} className="mt-3 bg-red-600 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-red-700 transition-colors">
                  طلب فك قيد الجهاز
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-3 mb-6">
          <button onClick={() => setTab('list')} className={`px-5 py-2 rounded-xl font-bold text-sm transition-colors ${tab==='list'?'bg-royal-600 text-white':'bg-white text-gray-600 border border-gray-200'}`}>
            تذاكري ({tickets.length})
          </button>
          <button onClick={() => setTab('new')} className={`px-5 py-2 rounded-xl font-bold text-sm transition-colors ${tab==='new'?'bg-royal-600 text-white':'bg-white text-gray-600 border border-gray-200'}`}>
            + تذكرة جديدة
          </button>
        </div>

        {tab === 'new' ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-black text-royal-900 text-lg mb-4">تذكرة دعم جديدة</h2>
            <div className="space-y-4">
              <input
                placeholder="موضوع المشكلة *"
                value={form.subject}
                onChange={e => setForm({ ...form, subject: e.target.value })}
                className="input-field"
              />
              <select
                value={form.priority}
                onChange={e => setForm({ ...form, priority: e.target.value })}
                className="input-field"
              >
                <option value="low">منخفض الأولوية</option>
                <option value="medium">متوسط الأولوية</option>
                <option value="high">عاجل</option>
              </select>
              <textarea
                placeholder="اشرح مشكلتك بالتفصيل *"
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
                className="input-field resize-none h-32"
              />
              <button onClick={submitTicket} disabled={sending} className="btn-primary w-full text-center disabled:opacity-60 flex items-center justify-center gap-2">
                <FiSend /> {sending ? 'جاري الإرسال...' : 'إرسال التذكرة'}
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {tickets.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
                <div className="text-5xl mb-3">🎉</div>
                <p className="text-gray-500">لا توجد تذاكر دعم</p>
                <button onClick={() => setTab('new')} className="btn-primary mt-4 inline-block text-sm py-2 px-5">
                  إنشاء تذكرة جديدة
                </button>
              </div>
            ) : tickets.map((t: any) => (
              <div key={t._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-black text-royal-900">{t.subject}</h3>
                  <span className={`badge text-xs ${t.status==='open'?'bg-red-100 text-red-600':t.status==='in_progress'?'bg-yellow-100 text-yellow-700':'bg-green-100 text-green-700'}`}>
                    {t.status==='open'?'مفتوحة':t.status==='in_progress'?'قيد المعالجة':'محلولة'}
                  </span>
                </div>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {(t.messages || []).map((m: any, i: number) => (
                    <div key={i} className={`p-3 rounded-xl text-sm ${m.senderRole==='student'?'bg-gray-50':'bg-royal-50'}`}>
                      <div className="font-bold text-xs text-gray-400 mb-1">{m.senderName}</div>
                      {m.message}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
