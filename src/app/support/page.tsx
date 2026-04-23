'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import { HeadphonesIcon, MessageSquare, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

export default function SupportDashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [tickets, setTickets] = useState<any[]>([]);
  const [selected, setSelected] = useState<any | null>(null);
  const [response, setResponse] = useState('');
  const [filter, setFilter] = useState('open');

  useEffect(() => {
    if (!loading && !user) router.push('/auth/login');
  }, [user, loading, router]);

  useEffect(() => { fetchTickets(); }, [filter]);

  const fetchTickets = async () => {
    const res = await fetch(`/api/support?status=${filter}`);
    const data = await res.json();
    setTickets(data.tickets || []);
  };

  const updateTicket = async (id: string, status: string) => {
    await fetch('/api/support', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status, response, assignedTo: user?.uid }),
    });
    setSelected(null);
    setResponse('');
    fetchTickets();
  };

  const STATUS_COLORS: Record<string, string> = {
    open: 'bg-red-100 text-red-700',
    in_progress: 'bg-yellow-100 text-yellow-700',
    resolved: 'bg-green-100 text-green-700',
  };
  const STATUS_LABELS: Record<string, string> = { open: 'مفتوحة', in_progress: 'قيد المعالجة', resolved: 'محلولة' };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-10 h-10 border-4 border-royal-200 border-t-royal-600 rounded-full animate-spin"/></div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">

        <div className="hero-gradient rounded-3xl p-8 text-white">
          <div className="flex items-center gap-3 mb-2">
            <HeadphonesIcon className="w-8 h-8 text-gold-400" />
            <h1 className="text-3xl font-black">لوحة الدعم الفني</h1>
          </div>
          <p className="text-royal-200">إدارة تذاكر الدعم والرد على الطلاب</p>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 border-b border-royal-100">
          {[
            { id: 'open', label: 'مفتوحة', icon: AlertCircle },
            { id: 'in_progress', label: 'قيد المعالجة', icon: Clock },
            { id: 'resolved', label: 'محلولة', icon: CheckCircle2 },
          ].map(t => (
            <button key={t.id} onClick={() => setFilter(t.id)}
              className={`flex items-center gap-2 px-5 py-3 font-bold text-sm border-b-2 transition-colors ${filter === t.id ? 'border-royal-600 text-royal-700' : 'border-transparent text-royal-400'}`}>
              <t.icon className="w-4 h-4" />{t.label}
            </button>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Tickets list */}
          <div className="space-y-3">
            {tickets.length === 0 ? (
              <div className="card p-10 text-center">
                <MessageSquare className="w-12 h-12 text-royal-200 mx-auto mb-3" />
                <p className="text-royal-400 font-bold">لا توجد تذاكر</p>
              </div>
            ) : tickets.map((t: any) => (
              <div key={t._id}
                onClick={() => setSelected(t)}
                className={`card p-4 cursor-pointer transition-all ${selected?._id === t._id ? 'border-2 border-royal-400' : ''}`}>
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-bold text-royal-900 text-sm">{t.title}</p>
                    <p className="text-royal-400 text-xs">{t.userName} • {new Date(t.createdAt).toLocaleDateString('ar')}</p>
                  </div>
                  <span className={`badge text-xs ${STATUS_COLORS[t.status]}`}>{STATUS_LABELS[t.status]}</span>
                </div>
                <p className="text-royal-600 text-xs line-clamp-2">{t.message}</p>
              </div>
            ))}
          </div>

          {/* Ticket detail */}
          {selected ? (
            <div className="card p-6 space-y-4 h-fit">
              <div className="flex items-center justify-between">
                <h3 className="font-black text-royal-900">{selected.title}</h3>
                <span className={`badge text-xs ${STATUS_COLORS[selected.status]}`}>{STATUS_LABELS[selected.status]}</span>
              </div>

              <div className="bg-royal-50 rounded-xl p-4 space-y-1">
                <p className="text-xs font-bold text-royal-500">من: {selected.userName} ({selected.userEmail})</p>
                <p className="text-sm text-royal-700 leading-relaxed">{selected.message}</p>
              </div>

              {selected.response && (
                <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                  <p className="text-xs font-bold text-green-600 mb-1">الرد السابق:</p>
                  <p className="text-sm text-green-800">{selected.response}</p>
                </div>
              )}

              <div>
                <label className="text-sm font-bold text-royal-700 block mb-1.5">ردّك على الطالب</label>
                <textarea
                  value={response}
                  onChange={e => setResponse(e.target.value)}
                  placeholder="اكتب ردك هنا..."
                  className="input-field h-28 resize-none text-sm"
                />
              </div>

              <div className="flex gap-2">
                <button onClick={() => updateTicket(selected._id, 'in_progress')}
                  className="flex-1 bg-yellow-500 hover:bg-yellow-400 text-white font-bold py-2.5 rounded-xl text-sm transition-colors">
                  قيد المعالجة
                </button>
                <button onClick={() => updateTicket(selected._id, 'resolved')}
                  className="flex-1 bg-green-600 hover:bg-green-500 text-white font-bold py-2.5 rounded-xl text-sm transition-colors">
                  تم الحل ✓
                </button>
              </div>
            </div>
          ) : (
            <div className="card p-10 text-center">
              <MessageSquare className="w-12 h-12 text-royal-200 mx-auto mb-3" />
              <p className="text-royal-400 font-bold text-sm">اختر تذكرة لعرض تفاصيلها</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
