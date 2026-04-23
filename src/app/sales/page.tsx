'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import { Key, CreditCard, Plus, Copy, Check, Users } from 'lucide-react';

export default function SalesDashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [tab, setTab] = useState('codes');
  const [codes, setCodes] = useState<any[]>([]);
  const [subs, setSubs] = useState<any[]>([]);
  const [copied, setCopied] = useState<string | null>(null);
  const [showNewCode, setShowNewCode] = useState(false);
  const [showNewSub, setShowNewSub] = useState(false);
  const [codeForm, setCodeForm] = useState({ courseId: '', courseName: '', price: '', count: '1' });
  const [subForm, setSubForm] = useState({ studentName: '', studentEmail: '', studentId: '', courseIds: '', totalPrice: '', totalMonths: '3' });

  useEffect(() => {
    if (!loading && !user) router.push('/auth/login');
  }, [user, loading, router]);

  useEffect(() => {
    if (user) { fetchCodes(); fetchSubs(); }
  }, [user]);

  const fetchCodes = async () => {
    const res = await fetch(`/api/codes?salesId=${user?.uid}`);
    const data = await res.json();
    setCodes(data.codes || []);
  };

  const fetchSubs = async () => {
    const res = await fetch(`/api/subscriptions?salesId=${user?.uid}`);
    const data = await res.json();
    setSubs(data.subscriptions || []);
  };

  const createCodes = async () => {
    await fetch('/api/codes', { method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...codeForm, createdBy: user?.uid, price: Number(codeForm.price), count: Number(codeForm.count) }) });
    setShowNewCode(false);
    fetchCodes();
  };

  const createSub = async () => {
    await fetch('/api/subscriptions', { method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...subForm, salesId: user?.uid, salesName: user?.displayName, courseIds: subForm.courseIds.split(','), totalPrice: Number(subForm.totalPrice), totalMonths: Number(subForm.totalMonths) }) });
    setShowNewSub(false);
    fetchSubs();
  };

  const payInstallment = async (id: string) => {
    await fetch('/api/subscriptions', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, action: 'pay' }) });
    fetchSubs();
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(code);
    setTimeout(() => setCopied(null), 2000);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-10 h-10 border-4 border-royal-200 border-t-royal-600 rounded-full animate-spin"/></div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        <div className="hero-gradient rounded-3xl p-8 text-white flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black mb-1">لوحة المبيعات</h1>
            <p className="text-royal-200">إدارة الأكواد والاشتراكات والأقساط</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white/10 rounded-2xl p-3 text-center border border-white/20">
              <p className="text-2xl font-black">{codes.length}</p>
              <p className="text-royal-200 text-xs">كود</p>
            </div>
            <div className="bg-white/10 rounded-2xl p-3 text-center border border-white/20">
              <p className="text-2xl font-black">{subs.length}</p>
              <p className="text-royal-200 text-xs">اشتراك</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-royal-100">
          {[{ id: 'codes', label: 'أكواد التفعيل', icon: Key }, { id: 'subs', label: 'الاشتراكات والأقساط', icon: CreditCard }].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-5 py-3 font-bold text-sm border-b-2 transition-colors ${tab === t.id ? 'border-royal-600 text-royal-700' : 'border-transparent text-royal-400'}`}>
              <t.icon className="w-4 h-4" />{t.label}
            </button>
          ))}
        </div>

        {tab === 'codes' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="font-black text-royal-900">أكواد التفعيل ({codes.filter(c => !c.isUsed).length} متاح)</h2>
              <button onClick={() => setShowNewCode(true)} className="btn-primary flex items-center gap-2 text-sm py-2">
                <Plus className="w-4 h-4" /> إنشاء أكواد
              </button>
            </div>

            {showNewCode && (
              <div className="card p-6 space-y-4 border-2 border-royal-200">
                <h3 className="font-black text-royal-900">إنشاء أكواد تفعيل جديدة</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-bold text-royal-700 block mb-1">اسم الدورة</label>
                    <input className="input-field text-sm" placeholder="مثال: رياضيات الصف الثاني عشر" value={codeForm.courseName} onChange={e => setCodeForm({...codeForm, courseName: e.target.value})} />
                  </div>
                  <div>
                    <label className="text-sm font-bold text-royal-700 block mb-1">معرّف الدورة</label>
                    <input className="input-field text-sm" placeholder="Course ID" value={codeForm.courseId} onChange={e => setCodeForm({...codeForm, courseId: e.target.value})} dir="ltr" />
                  </div>
                  <div>
                    <label className="text-sm font-bold text-royal-700 block mb-1">السعر (ل.س)</label>
                    <input type="number" className="input-field text-sm" placeholder="50000" value={codeForm.price} onChange={e => setCodeForm({...codeForm, price: e.target.value})} />
                  </div>
                  <div>
                    <label className="text-sm font-bold text-royal-700 block mb-1">عدد الأكواد</label>
                    <input type="number" min="1" max="50" className="input-field text-sm" value={codeForm.count} onChange={e => setCodeForm({...codeForm, count: e.target.value})} />
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={createCodes} className="btn-primary text-sm py-2">إنشاء</button>
                  <button onClick={() => setShowNewCode(false)} className="btn-secondary text-sm py-2">إلغاء</button>
                </div>
              </div>
            )}

            <div className="card overflow-hidden">
              <table className="w-full">
                <thead className="bg-royal-50">
                  <tr>{['الكود', 'الدورة', 'السعر', 'الحالة', 'نسخ'].map(h => <th key={h} className="text-right px-4 py-3 text-xs font-bold text-royal-600">{h}</th>)}</tr>
                </thead>
                <tbody className="divide-y divide-royal-50">
                  {codes.map((c: any) => (
                    <tr key={c._id} className="hover:bg-royal-50/50">
                      <td className="px-4 py-3 font-mono text-sm font-bold text-royal-800" dir="ltr">{c.code}</td>
                      <td className="px-4 py-3 text-sm text-royal-600">{c.courseName}</td>
                      <td className="px-4 py-3 text-sm font-bold text-royal-900">{c.price?.toLocaleString('ar')} ل.س</td>
                      <td className="px-4 py-3">
                        <span className={`badge text-xs ${c.isUsed ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                          {c.isUsed ? 'مستخدم' : 'متاح'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {!c.isUsed && (
                          <button onClick={() => copyCode(c.code)} className="p-1.5 bg-royal-50 text-royal-600 rounded-lg hover:bg-royal-100 transition-colors">
                            {copied === c.code ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === 'subs' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="font-black text-royal-900">الاشتراكات والأقساط ({subs.length})</h2>
              <button onClick={() => setShowNewSub(true)} className="btn-primary flex items-center gap-2 text-sm py-2">
                <Plus className="w-4 h-4" /> اشتراك جديد
              </button>
            </div>

            {showNewSub && (
              <div className="card p-6 space-y-4 border-2 border-royal-200">
                <h3 className="font-black text-royal-900">إنشاء اشتراك بالأقساط</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-bold text-royal-700 block mb-1">اسم الطالب</label>
                    <input className="input-field text-sm" value={subForm.studentName} onChange={e => setSubForm({...subForm, studentName: e.target.value})} />
                  </div>
                  <div>
                    <label className="text-sm font-bold text-royal-700 block mb-1">بريد الطالب</label>
                    <input className="input-field text-sm" dir="ltr" value={subForm.studentEmail} onChange={e => setSubForm({...subForm, studentEmail: e.target.value})} />
                  </div>
                  <div>
                    <label className="text-sm font-bold text-royal-700 block mb-1">السعر الإجمالي (ل.س)</label>
                    <input type="number" className="input-field text-sm" value={subForm.totalPrice} onChange={e => setSubForm({...subForm, totalPrice: e.target.value})} />
                  </div>
                  <div>
                    <label className="text-sm font-bold text-royal-700 block mb-1">عدد الأشهر</label>
                    <select className="input-field text-sm" value={subForm.totalMonths} onChange={e => setSubForm({...subForm, totalMonths: e.target.value})}>
                      {[2,3,4,6,12].map(m => <option key={m} value={m}>{m} أشهر</option>)}
                    </select>
                  </div>
                </div>
                <div className="bg-royal-50 rounded-xl p-3 text-sm text-royal-700">
                  القسط الشهري: <strong>{subForm.totalPrice && subForm.totalMonths ? Math.ceil(Number(subForm.totalPrice) / Number(subForm.totalMonths)).toLocaleString('ar') : '0'} ل.س</strong>
                </div>
                <div className="flex gap-2">
                  <button onClick={createSub} className="btn-primary text-sm py-2">إنشاء الاشتراك</button>
                  <button onClick={() => setShowNewSub(false)} className="btn-secondary text-sm py-2">إلغاء</button>
                </div>
              </div>
            )}

            <div className="grid gap-4">
              {subs.map((s: any) => (
                <div key={s._id} className="card p-5 space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <div className="w-9 h-9 bg-royal-100 rounded-xl flex items-center justify-center"><Users className="w-4 h-4 text-royal-600" /></div>
                        <div>
                          <p className="font-bold text-royal-900">{s.studentName}</p>
                          <p className="text-xs text-royal-400">{s.studentEmail}</p>
                        </div>
                      </div>
                    </div>
                    <span className={`badge text-xs ${s.status === 'active' ? 'bg-green-100 text-green-700' : s.status === 'completed' ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'}`}>
                      {s.status === 'active' ? 'نشط' : s.status === 'completed' ? 'مكتمل' : 'متأخر'}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="bg-royal-50 rounded-xl p-3">
                      <p className="text-lg font-black text-royal-900">{s.paidMonths}/{s.totalMonths}</p>
                      <p className="text-xs text-royal-400">أشهر مدفوعة</p>
                    </div>
                    <div className="bg-royal-50 rounded-xl p-3">
                      <p className="text-lg font-black text-royal-900">{s.monthlyAmount?.toLocaleString('ar')}</p>
                      <p className="text-xs text-royal-400">القسط الشهري</p>
                    </div>
                    <div className="bg-royal-50 rounded-xl p-3">
                      <p className="text-lg font-black text-royal-900">{s.totalPrice?.toLocaleString('ar')}</p>
                      <p className="text-xs text-royal-400">المجموع</p>
                    </div>
                  </div>
                  <div className="w-full bg-royal-100 rounded-full h-2">
                    <div className="progress-bar h-2" style={{ width: `${(s.paidMonths / s.totalMonths) * 100}%` }} />
                  </div>
                  {s.status !== 'completed' && (
                    <button onClick={() => payInstallment(s._id)} className="btn-primary text-sm py-2 w-full">
                      تسجيل دفعة الشهر {s.paidMonths + 1}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
