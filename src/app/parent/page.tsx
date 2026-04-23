'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import { Users, BookOpen, TrendingUp, Clock, Plus } from 'lucide-react';

export default function ParentDashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [children, setChildren] = useState<any[]>([]);
  const [childEmail, setChildEmail] = useState('');
  const [msg, setMsg] = useState('');

  useEffect(() => {
    if (!loading && !user) router.push('/auth/login');
  }, [user, loading, router]);

  const linkChild = async () => {
    if (!childEmail) return;
    try {
      const res = await fetch('/api/users/sync', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ parentUid: user?.uid, childEmail }),
      });
      const data = await res.json();
      if (data.success) {
        setMsg('تم ربط الطالب بنجاح ✅');
        setChildEmail('');
        fetchChildren();
      } else {
        setMsg(data.error || 'البريد غير موجود');
      }
    } catch { setMsg('حدث خطأ'); }
  };

  const fetchChildren = async () => {
    const res = await fetch(`/api/roles`);
    const data = await res.json();
    const myChildren = (data.users || []).filter((u: any) => u.parentId === user?.uid);
    setChildren(myChildren);
  };

  useEffect(() => { if (user) fetchChildren(); }, [user]);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-10 h-10 border-4 border-royal-200 border-t-royal-600 rounded-full animate-spin"/></div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">

        <div className="hero-gradient rounded-3xl p-8 text-white">
          <div className="flex items-center gap-3 mb-2">
            <Users className="w-8 h-8 text-gold-400" />
            <h1 className="text-3xl font-black">لوحة ولي الأمر</h1>
          </div>
          <p className="text-royal-200">تابع تقدم أبنائك الدراسي بكل سهولة</p>
        </div>

        {/* Link child */}
        <div className="card p-6 space-y-4">
          <h2 className="font-black text-royal-900 flex items-center gap-2">
            <Plus className="w-5 h-5 text-royal-600" /> ربط حساب طالب
          </h2>
          <p className="text-royal-500 text-sm">أدخل البريد الإلكتروني لحساب ابنك/ابنتك على المنصة</p>
          <div className="flex gap-3">
            <input
              type="email"
              value={childEmail}
              onChange={e => setChildEmail(e.target.value)}
              placeholder="بريد الطالب الإلكتروني"
              className="input-field flex-1 text-sm"
              dir="ltr"
            />
            <button onClick={linkChild} className="btn-primary text-sm py-3 px-6 shrink-0">ربط</button>
          </div>
          {msg && (
            <p className={`text-sm font-bold ${msg.includes('✅') ? 'text-green-600' : 'text-red-500'}`}>{msg}</p>
          )}
        </div>

        {/* Children list */}
        {children.length === 0 ? (
          <div className="card p-12 text-center">
            <Users className="w-16 h-16 text-royal-200 mx-auto mb-4" />
            <p className="text-royal-400 font-bold">لم تربط أي حساب طالب بعد</p>
            <p className="text-royal-300 text-sm">أضف بريد ابنك أو ابنتك لمتابعة تقدمهم</p>
          </div>
        ) : (
          <div className="space-y-6">
            <h2 className="text-xl font-black text-royal-950">أبنائي المسجّلون ({children.length})</h2>
            {children.map((child: any) => (
              <div key={child._id} className="card p-6 space-y-5">
                {/* Child header */}
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-royal-500 to-royal-700 rounded-2xl flex items-center justify-center text-white text-2xl font-black shadow-lg">
                    {child.displayName?.[0] || 'ط'}
                  </div>
                  <div>
                    <h3 className="font-black text-royal-900 text-lg">{child.displayName}</h3>
                    <p className="text-royal-400 text-sm">{child.email}</p>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-royal-50 rounded-xl p-3 text-center">
                    <BookOpen className="w-5 h-5 text-royal-600 mx-auto mb-1" />
                    <p className="text-lg font-black text-royal-700">{child.enrolledCourses?.length || 0}</p>
                    <p className="text-xs text-royal-400">دورات مسجّلة</p>
                  </div>
                  <div className="bg-green-50 rounded-xl p-3 text-center">
                    <TrendingUp className="w-5 h-5 text-green-600 mx-auto mb-1" />
                    <p className="text-lg font-black text-green-700">{child.completedCourses?.length || 0}</p>
                    <p className="text-xs text-green-400">دورات مكتملة</p>
                  </div>
                  <div className="bg-blue-50 rounded-xl p-3 text-center">
                    <Clock className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                    <p className="text-lg font-black text-blue-700">
                      {child.enrolledCourses?.length - child.completedCourses?.length || 0}
                    </p>
                    <p className="text-xs text-blue-400">دورات جارية</p>
                  </div>
                </div>

                {/* Progress bar */}
                {child.enrolledCourses?.length > 0 && (
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-royal-500">
                      <span>التقدم الإجمالي</span>
                      <span className="font-bold">
                        {Math.round((child.completedCourses?.length / child.enrolledCourses?.length) * 100)}%
                      </span>
                    </div>
                    <div className="w-full bg-royal-100 rounded-full h-2.5">
                      <div className="progress-bar h-2.5" style={{
                        width: `${Math.round((child.completedCourses?.length / child.enrolledCourses?.length) * 100)}%`
                      }} />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
