'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import { BookOpen, Key, Trophy, Clock, Play, MessageSquare, CheckCircle2, AlertCircle } from 'lucide-react';

export default function StudentPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [courses, setCourses] = useState<any[]>([]);
  const [code, setCode] = useState('');
  const [codeMsg, setCodeMsg] = useState({ text: '', type: '' });
  const [activating, setActivating] = useState(false);
  const [tab, setTab] = useState('courses');
  const [ticketForm, setTicketForm] = useState({ title: '', message: '' });
  const [ticketSent, setTicketSent] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.push('/auth/login');
  }, [user, loading, router]);

  useEffect(() => {
    if (user) fetchMyCourses();
  }, [user]);

  const fetchMyCourses = async () => {
    const res = await fetch('/api/courses');
    const data = await res.json();
    setCourses(data.courses || []);
  };

  const activateCode = async () => {
    if (!code.trim()) return;
    setActivating(true);
    setCodeMsg({ text: '', type: '' });
    try {
      const res = await fetch('/api/codes/activate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: code.trim(), userId: user?.uid }),
      });
      const data = await res.json();
      if (data.success) {
        setCodeMsg({ text: `تم التفعيل بنجاح! دورة "${data.courseName}" أضيفت لحسابك ✅`, type: 'success' });
        setCode('');
        fetchMyCourses();
      } else {
        setCodeMsg({ text: data.error || 'الكود غير صحيح', type: 'error' });
      }
    } catch {
      setCodeMsg({ text: 'حدث خطأ، حاول مجدداً', type: 'error' });
    } finally { setActivating(false); }
  };

  const sendTicket = async () => {
    if (!ticketForm.title || !ticketForm.message) return;
    await fetch('/api/support', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: user?.uid, userName: user?.displayName, userEmail: user?.email, ...ticketForm }),
    });
    setTicketSent(true);
    setTicketForm({ title: '', message: '' });
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-10 h-10 border-4 border-royal-200 border-t-royal-600 rounded-full animate-spin"/></div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">

        <div className="hero-gradient rounded-3xl p-8 text-white">
          <p className="text-royal-200 text-sm mb-1">مرحباً 👋</p>
          <h1 className="text-3xl font-black mb-1">{user?.displayName}</h1>
          <p className="text-royal-200">واصل رحلتك نحو البكالوريا</p>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'دوراتي', value: courses.length, icon: BookOpen, color: 'text-royal-600', bg: 'bg-royal-50' },
            { label: 'مكتملة', value: 0, icon: Trophy, color: 'text-gold-600', bg: 'bg-yellow-50' },
            { label: 'ساعات التعلم', value: '0', icon: Clock, color: 'text-blue-600', bg: 'bg-blue-50' },
          ].map(({ label, value, icon: Icon, color, bg }) => (
            <div key={label} className="card p-4 flex items-center gap-3">
              <div className={`${bg} w-11 h-11 rounded-xl flex items-center justify-center shrink-0`}><Icon className={`w-5 h-5 ${color}`} /></div>
              <div><p className={`text-xl font-black ${color}`}>{value}</p><p className="text-xs text-royal-400">{label}</p></div>
            </div>
          ))}
        </div>

        {/* Code activation */}
        <div className="card p-6 space-y-4">
          <h2 className="font-black text-royal-900 flex items-center gap-2"><Key className="w-5 h-5 text-royal-600" /> تفعيل كود الاشتراك</h2>
          <p className="text-royal-500 text-sm">أدخل الكود الذي حصلت عليه من قسم المبيعات</p>
          <div className="flex gap-3">
            <input type="text" value={code} onChange={e => setCode(e.target.value.toUpperCase())}
              placeholder="XXXX-XXXX-XXXX" className="input-field flex-1 font-mono text-center text-lg tracking-widest" dir="ltr" maxLength={14} />
            <button onClick={activateCode} disabled={activating} className="btn-primary text-sm py-3 px-6 shrink-0 disabled:opacity-60">
              {activating ? 'جارٍ...' : 'تفعيل'}
            </button>
          </div>
          {codeMsg.text && (
            <div className={`flex items-center gap-2 p-3 rounded-xl text-sm font-medium ${codeMsg.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
              {codeMsg.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
              {codeMsg.text}
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-royal-100">
          {[{ id: 'courses', label: 'دوراتي', icon: BookOpen }, { id: 'support', label: 'الدعم الفني', icon: MessageSquare }].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-5 py-3 font-bold text-sm border-b-2 transition-colors ${tab === t.id ? 'border-royal-600 text-royal-700' : 'border-transparent text-royal-400'}`}>
              <t.icon className="w-4 h-4" />{t.label}
            </button>
          ))}
        </div>

        {tab === 'courses' && (
          courses.length === 0 ? (
            <div className="card p-12 text-center">
              <BookOpen className="w-16 h-16 text-royal-200 mx-auto mb-4" />
              <p className="text-royal-400 font-bold">لا توجد دورات بعد</p>
              <p className="text-royal-300 text-sm">فعّل كودك للوصول إلى دوراتك</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {courses.map((course: any) => (
                <div key={course._id} className="card-hover overflow-hidden">
                  <div className="h-28 bg-gradient-to-br from-royal-600 to-royal-900 flex items-center justify-center">
                    <BookOpen className="w-10 h-10 text-white/50" />
                  </div>
                  <div className="p-4 space-y-2">
                    <h3 className="font-bold text-royal-900 text-sm line-clamp-2">{course.title}</h3>
                    <p className="text-royal-400 text-xs">{course.subject} • {course.grade}</p>
                    <button className="w-full bg-royal-600 hover:bg-royal-700 text-white font-bold py-2 rounded-xl text-sm transition-colors flex items-center justify-center gap-2">
                      <Play className="w-3.5 h-3.5" /> متابعة الدراسة
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )
        )}

        {tab === 'support' && (
          <div className="card p-6 space-y-4 max-w-xl">
            <h2 className="font-black text-royal-900">إرسال طلب دعم فني</h2>
            {ticketSent ? (
              <div className="text-center py-8 space-y-3">
                <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto" />
                <p className="font-bold text-green-700">تم إرسال طلبك بنجاح!</p>
                <p className="text-royal-400 text-sm">سيرد عليك فريق الدعم قريباً</p>
                <button onClick={() => setTicketSent(false)} className="btn-secondary text-sm py-2">إرسال طلب آخر</button>
              </div>
            ) : (
              <>
                <div>
                  <label className="text-sm font-bold text-royal-700 block mb-1.5">موضوع المشكلة</label>
                  <input className="input-field text-sm" placeholder="مثال: مشكلة في تشغيل الفيديو" value={ticketForm.title} onChange={e => setTicketForm({ ...ticketForm, title: e.target.value })} />
                </div>
                <div>
                  <label className="text-sm font-bold text-royal-700 block mb-1.5">تفاصيل المشكلة</label>
                  <textarea className="input-field h-28 resize-none text-sm" placeholder="اشرح مشكلتك بالتفصيل..." value={ticketForm.message} onChange={e => setTicketForm({ ...ticketForm, message: e.target.value })} />
                </div>
                <button onClick={sendTicket} className="btn-primary text-sm py-3 w-full">إرسال الطلب</button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
