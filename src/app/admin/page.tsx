'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import { Users, BookOpen, Key, CreditCard, HeadphonesIcon, BarChart2, Shield, Edit2, Check, X } from 'lucide-react';

const ROLES = ['student','teacher','sales','support','editor','parent','admin'];
const ROLE_LABELS: Record<string,string> = { student:'طالب', teacher:'معلم', sales:'مبيعات', support:'دعم فني', editor:'تحرير', parent:'ولي أمر', admin:'أدمن' };
const ROLE_COLORS: Record<string,string> = { student:'bg-blue-100 text-blue-700', teacher:'bg-green-100 text-green-700', sales:'bg-yellow-100 text-yellow-700', support:'bg-purple-100 text-purple-700', editor:'bg-pink-100 text-pink-700', parent:'bg-orange-100 text-orange-700', admin:'bg-red-100 text-red-700' };

export default function AdminDashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<any[]>([]);
  const [stats, setStats] = useState({ users: 0, courses: 0, codes: 0, subs: 0, tickets: 0 });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newRole, setNewRole] = useState('');
  const [tab, setTab] = useState('users');
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (!loading && !user) router.push('/auth/login');
  }, [user, loading, router]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/roles');
      const data = await res.json();
      setUsers(data.users || []);
      setStats(s => ({ ...s, users: data.users?.length || 0 }));
    } catch {}
  };

  const updateRole = async (uid: string) => {
    await fetch('/api/roles', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ uid, role: newRole }) });
    setEditingId(null);
    fetchUsers();
  };

  const toggleActive = async (uid: string, isActive: boolean) => {
    await fetch('/api/roles', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ uid, isActive: !isActive }) });
    fetchUsers();
  };

  const filtered = users.filter(u => u.displayName?.includes(search) || u.email?.includes(search));

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-10 h-10 border-4 border-royal-200 border-t-royal-600 rounded-full animate-spin"/></div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">

        {/* Header */}
        <div className="hero-gradient rounded-3xl p-8 text-white">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="w-8 h-8 text-gold-400" />
            <h1 className="text-3xl font-black">لوحة تحكم الأدمن</h1>
          </div>
          <p className="text-royal-200">تحكم كامل بجميع أقسام المنصة</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { label: 'المستخدمون', value: stats.users, icon: Users, color: 'text-royal-600', bg: 'bg-royal-50' },
            { label: 'الدورات', value: stats.courses, icon: BookOpen, color: 'text-green-600', bg: 'bg-green-50' },
            { label: 'الأكواد', value: stats.codes, icon: Key, color: 'text-yellow-600', bg: 'bg-yellow-50' },
            { label: 'الاشتراكات', value: stats.subs, icon: CreditCard, color: 'text-blue-600', bg: 'bg-blue-50' },
            { label: 'التذاكر', value: stats.tickets, icon: HeadphonesIcon, color: 'text-red-600', bg: 'bg-red-50' },
          ].map(({ label, value, icon: Icon, color, bg }) => (
            <div key={label} className="card p-4 flex items-center gap-3">
              <div className={`${bg} w-11 h-11 rounded-xl flex items-center justify-center shrink-0`}>
                <Icon className={`w-5 h-5 ${color}`} />
              </div>
              <div>
                <p className={`text-xl font-black ${color}`}>{value}</p>
                <p className="text-xs text-royal-400">{label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-royal-100 pb-0">
          {[
            { id: 'users', label: 'إدارة المستخدمين', icon: Users },
            { id: 'stats', label: 'الإحصائيات', icon: BarChart2 },
          ].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-5 py-3 font-bold text-sm border-b-2 transition-colors ${tab === t.id ? 'border-royal-600 text-royal-700' : 'border-transparent text-royal-400 hover:text-royal-600'}`}>
              <t.icon className="w-4 h-4" />{t.label}
            </button>
          ))}
        </div>

        {tab === 'users' && (
          <div className="card overflow-hidden">
            {/* Search */}
            <div className="p-4 border-b border-royal-100">
              <input type="text" placeholder="ابحث باسم المستخدم أو البريد..." value={search}
                onChange={e => setSearch(e.target.value)} className="input-field max-w-sm text-sm" />
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-royal-50">
                  <tr>
                    {['المستخدم', 'البريد', 'الدور', 'الحالة', 'الإجراءات'].map(h => (
                      <th key={h} className="text-right px-4 py-3 text-xs font-bold text-royal-600">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-royal-50">
                  {filtered.map((u: any) => (
                    <tr key={u._id} className="hover:bg-royal-50/50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-gradient-to-br from-royal-500 to-royal-700 rounded-lg flex items-center justify-center text-white text-xs font-bold">
                            {u.displayName?.[0] || '؟'}
                          </div>
                          <span className="text-sm font-bold text-royal-900">{u.displayName}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs text-royal-500" dir="ltr">{u.email}</td>
                      <td className="px-4 py-3">
                        {editingId === u.uid ? (
                          <select value={newRole} onChange={e => setNewRole(e.target.value)}
                            className="text-xs border border-royal-300 rounded-lg px-2 py-1 focus:outline-none focus:border-royal-500">
                            {ROLES.map(r => <option key={r} value={r}>{ROLE_LABELS[r]}</option>)}
                          </select>
                        ) : (
                          <span className={`badge text-xs ${ROLE_COLORS[u.role] || 'bg-gray-100 text-gray-600'}`}>
                            {ROLE_LABELS[u.role] || u.role}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`badge text-xs ${u.isActive !== false ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {u.isActive !== false ? 'نشط' : 'موقوف'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          {editingId === u.uid ? (
                            <>
                              <button onClick={() => updateRole(u.uid)} className="p-1.5 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors"><Check className="w-3 h-3" /></button>
                              <button onClick={() => setEditingId(null)} className="p-1.5 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"><X className="w-3 h-3" /></button>
                            </>
                          ) : (
                            <>
                              <button onClick={() => { setEditingId(u.uid); setNewRole(u.role); }}
                                className="p-1.5 bg-royal-50 text-royal-600 rounded-lg hover:bg-royal-100 transition-colors">
                                <Edit2 className="w-3 h-3" />
                              </button>
                              <button onClick={() => toggleActive(u.uid, u.isActive !== false)}
                                className={`p-1.5 rounded-lg transition-colors text-xs font-bold px-2 ${u.isActive !== false ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-green-50 text-green-600 hover:bg-green-100'}`}>
                                {u.isActive !== false ? 'وقف' : 'فعّل'}
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === 'stats' && (
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { title: 'إحصائيات الأدوار', items: ROLES.map(r => ({ label: ROLE_LABELS[r], value: users.filter(u => u.role === r).length, color: ROLE_COLORS[r] })) },
            ].map((section) => (
              <div key={section.title} className="card p-6">
                <h3 className="font-black text-royal-900 mb-4">{section.title}</h3>
                <div className="space-y-3">
                  {section.items.map(item => (
                    <div key={item.label} className="flex items-center justify-between">
                      <span className={`badge text-xs ${item.color}`}>{item.label}</span>
                      <span className="font-bold text-royal-900">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
