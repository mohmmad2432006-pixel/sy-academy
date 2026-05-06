'use client'
import { useEffect, useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import DashboardLayout from '@/components/dashboard/DashboardLayout'
import { FiMessageSquare, FiClock, FiCheckCircle, FiSmartphone } from 'react-icons/fi'
import toast from 'react-hot-toast'

const SIDEBAR = [
  { label: 'التذاكر', href: '/support', icon: '🎫' },
  { label: 'طلبات الأجهزة', href: '/support/devices', icon: '📱' },
]

export default function SupportDashboard() {
  const { user, userData, loading } = useAuth()
  const router = useRouter()
  const [tickets, setTickets] = useState<any[]>([])
  const [selected, setSelected] = useState<any | null>(null)
  const [reply, setReply] = useState('')
  const [sending, setSending] = useState(false)
  const [filter, setFilter] = useState<'open' | 'all'>('open')

  useEffect(() => {
    if (!loading && !user) router.push('/auth/login')
    if (!loading && userData && !['support', 'admin'].includes(userData.role)) router.push('/student')
  }, [loading, user, userData, router])

  useEffect(() => {
    if (!user) return
    user.getIdToken().then(token => {
      fetch(`/api/tickets?status=${filter}`, { headers: { Authorization: `Bearer ${token}` } })
        .then(r => r.json()).then(d => setTickets(d.tickets || []))
    })
  }, [user, filter])

  const sendReply = async () => {
    if (!reply.trim() || !selected) return
    setSending(true)
    try {
      const token = await user!.getIdToken()
      const res = await fetch(`/api/tickets/${selected._id}/reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ message: reply }),
      })
      if (res.ok) {
        toast.success('تم إرسال الرد')
        setReply('')
        const data = await res.json()
        setSelected(data.ticket)
      } else toast.error('فشل الإرسال')
    } finally { setSending(false) }
  }

  const closeTicket = async (ticketId: string) => {
    const token = await user!.getIdToken()
    const res = await fetch(`/api/tickets/${ticketId}/close`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}` },
    })
    if (res.ok) {
      toast.success('تم إغلاق التذكرة')
      setTickets(prev => prev.filter(t => t._id !== ticketId))
      setSelected(null)
    }
  }

  if (loading) return <div className="min-h-screen hero-bg flex items-center justify-center"><div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"/></div>

  return (
    <DashboardLayout sidebarItems={SIDEBAR} role="support" title="الدعم الفني">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-royal-950">الدعم الفني 🎫</h1>
          <p className="text-gray-500 mt-1">إدارة تذاكر الطلاب</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setFilter('open')} className={`px-4 py-2 rounded-xl font-bold text-sm transition-colors ${filter==='open'?'bg-royal-600 text-white':'bg-gray-100 text-gray-600'}`}>مفتوحة</button>
          <button onClick={() => setFilter('all')} className={`px-4 py-2 rounded-xl font-bold text-sm transition-colors ${filter==='all'?'bg-royal-600 text-white':'bg-gray-100 text-gray-600'}`}>الكل</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tickets List */}
        <div className="lg:col-span-1 space-y-3 max-h-[70vh] overflow-y-auto">
          {tickets.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center">
              <div className="text-4xl mb-2">🎉</div>
              <p className="text-gray-500">لا توجد تذاكر مفتوحة</p>
            </div>
          ) : tickets.map((t: any) => (
            <div key={t._id} onClick={() => setSelected(t)}
              className={`bg-white rounded-2xl border p-4 cursor-pointer hover:border-royal-300 transition-colors ${selected?._id===t._id?'border-royal-500 shadow-sm':'border-gray-100'}`}>
              <div className="flex items-start justify-between mb-2">
                <span className={`badge ${t.status==='open'?'bg-red-100 text-red-600':t.status==='in_progress'?'bg-yellow-100 text-yellow-700':'bg-green-100 text-green-700'}`}>
                  {t.status==='open'?'مفتوحة':t.status==='in_progress'?'قيد المعالجة':'محلولة'}
                </span>
                <span className={`badge ${t.priority==='high'?'bg-red-100 text-red-600':t.priority==='medium'?'bg-yellow-100 text-yellow-700':'bg-gray-100 text-gray-500'}`}>
                  {t.priority==='high'?'عاجل':t.priority==='medium'?'متوسط':'منخفض'}
                </span>
              </div>
              <h3 className="font-bold text-royal-900 text-sm">{t.subject}</h3>
              <p className="text-gray-500 text-xs mt-1">{t.studentName}</p>
            </div>
          ))}
        </div>

        {/* Ticket Detail */}
        <div className="lg:col-span-2">
          {!selected ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center h-full flex items-center justify-center">
              <div>
                <FiMessageSquare className="text-5xl text-gray-200 mx-auto mb-3"/>
                <p className="text-gray-400">اختر تذكرة للرد عليها</p>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col" style={{maxHeight:'70vh'}}>
              <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
                <div>
                  <h2 className="font-black text-royal-900">{selected.subject}</h2>
                  <p className="text-gray-500 text-sm">الطالب: {selected.studentName}</p>
                </div>
                {selected.status !== 'closed' && (
                  <button onClick={() => closeTicket(selected._id)} className="bg-gray-100 text-gray-600 hover:bg-gray-200 px-4 py-2 rounded-xl font-bold text-sm transition-colors">
                    <FiCheckCircle className="inline ml-1"/> إغلاق
                  </button>
                )}
              </div>
              <div className="flex-1 overflow-y-auto space-y-3 mb-4">
                {(selected.messages || []).map((m: any, i: number) => (
                  <div key={i} className={`p-3 rounded-xl text-sm ${m.senderId===selected.studentId?'bg-gray-50 text-gray-700':'bg-royal-50 text-royal-800'}`}>
                    <div className="font-bold mb-1 text-xs text-gray-400">{m.senderName}</div>
                    {m.message}
                  </div>
                ))}
              </div>
              {selected.status !== 'closed' && (
                <div className="flex gap-3">
                  <textarea
                    value={reply}
                    onChange={e => setReply(e.target.value)}
                    placeholder="اكتب ردك هنا..."
                    className="input-field flex-1 resize-none h-20"
                  />
                  <button onClick={sendReply} disabled={sending} className="btn-primary px-6 self-end disabled:opacity-60">
                    {sending ? '...' : 'إرسال'}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
