'use client'
import { useState, useEffect } from 'react'
import DashboardLayout from '@/components/dashboard/DashboardLayout'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'

const SIDEBAR = [
  { label: 'الرئيسية', href: '/admin', icon: '🏠' },
  { label: 'إدارة المستخدمين', href: '/admin/users', icon: '👥' },
  { label: 'الدورات', href: '/admin/courses', icon: '📚' },
  { label: 'تقارير المبيعات', href: '/admin/sales', icon: '💰' },
  { label: 'الدعم الفني', href: '/admin/tickets', icon: '🎯' },
  { label: 'الإعدادات', href: '/admin/settings', icon: '⚙️' },
]

const ROLE_BADGES: Record<string, { label: string; color: string }> = {
  admin: { label: 'أدمن', color: 'bg-red-100 text-red-700' },
  teacher: { label: 'مدرّس', color: 'bg-blue-100 text-blue-700' },
  sales: { label: 'مبيعات', color: 'bg-green-100 text-green-700' },
  support: { label: 'دعم', color: 'bg-yellow-100 text-yellow-700' },
  editor: { label: 'تحرير', color: 'bg-purple-100 text-purple-700' },
  student: { label: 'طالب', color: 'bg-gray-100 text-gray-700' },
}

export default function AdminDashboard() {
  const { userData, loading } = useAuth()
  const router = useRouter()
  const [users, setUsers] = useState<any[]>([])
  const [stats, setStats] = useState({ users: 0, students: 0, courses: 0, tickets: 0 })
  const [fetchLoading, setFetchLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')

  useEffect(() => {
    if (!loading && userData?.role !== 'admin') router.push('/')
  }, [loading, userData])

  useEffect(() => {
    if (userData?.role === 'admin') {
      fetchUsers()
    }
  }, [userData])

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/admin/users')
      const data = await res.json()
      setUsers(data.users || [])
      setStats(data.stats || {})
    } catch (e) {
      console.error(e)
    } finally {
      setFetchLoading(false)
    }
  }

  const changeRole = async (userId: string, newRole: string) => {
    if (!confirm(`تأكيد تغيير الدور إلى: ${ROLE_BADGES[newRole]?.label}?`)) return
    try {
      await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole }),
      })
      fetchUsers()
    } catch (e) {
      console.error(e)
    }
  }

  const filteredUsers = users.filter(u => {
    const matchSearch = u.name?.includes(search) || u.email?.includes(search)
    const matchRole = roleFilter === 'all' || u.role === roleFilter
    return matchSearch && matchRole
  })

  if (loading || fetchLoading) return (
    <DashboardLayout title="لوحة الأدمن" role="admin" roleColor="" sidebarItems={SIDEBAR}>
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-4 border-royal-500 border-t-transparent rounded-full animate-spin" />
      </div>
    </DashboardLayout>
  )

  return (
    <DashboardLayout title="لوحة المدير العام" role="admin" roleColor="" sidebarItems={SIDEBAR}>
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'إجمالي المستخدمين', value: stats.users, icon: '👥', color: 'from-blue-500 to-blue-700' },
          { label: 'الطلاب', value: stats.students, icon: '👨‍🎓', color: 'from-green-500 to-green-700' },
          { label: 'الدورات', value: stats.courses, icon: '📚', color: 'from-purple-500 to-purple-700' },
          { label: 'تذاكر الدعم', value: stats.tickets, icon: '🎯', color: 'from-red-500 to-red-700' },
        ].map(s => (
          <div key={s.label} className={`bg-gradient-to-br ${s.color} rounded-2xl p-5 text-white shadow-lg`}>
            <div className="text-3xl mb-2">{s.icon}</div>
            <div className="text-2xl font-black">{s.value}</div>
            <div className="text-white/80 text-sm">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Users Management */}
      <div className="card">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <h2 className="text-lg font-black text-royal-950 flex-1">إدارة المستخدمين</h2>
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="بحث بالاسم أو البريد..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="input-field text-sm py-2"
            />
            <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)} className="input-field text-sm py-2 w-32">
              <option value="all">الكل</option>
              <option value="student">طلاب</option>
              <option value="teacher">مدرّسون</option>
              <option value="sales">مبيعات</option>
              <option value="support">دعم</option>
              <option value="editor">تحرير</option>
              <option value="admin">أدمن</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-right py-3 px-4 text-sm font-bold text-gray-500">المستخدم</th>
                <th className="text-right py-3 px-4 text-sm font-bold text-gray-500">البريد</th>
                <th className="text-right py-3 px-4 text-sm font-bold text-gray-500">الدور</th>
                <th className="text-right py-3 px-4 text-sm font-bold text-gray-500">الحالة</th>
                <th className="text-right py-3 px-4 text-sm font-bold text-gray-500">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(u => (
                <tr key={u._id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      {u.photoURL ? (
                        <img src={u.photoURL} alt="" className="w-8 h-8 rounded-full" />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-royal-100 flex items-center justify-center text-royal-700 font-bold text-sm">
                          {u.name?.[0] || '؟'}
                        </div>
                      )}
                      <span className="font-medium text-gray-900">{u.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-600 text-sm">{u.email}</td>
                  <td className="py-3 px-4">
                    <span className={`badge ${ROLE_BADGES[u.role]?.color}`}>
                      {ROLE_BADGES[u.role]?.label}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`badge ${u.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {u.status === 'active' ? 'نشط' : u.status === 'suspended' ? 'موقوف' : 'معلق'}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <select
                      value={u.role}
                      onChange={e => changeRole(u._id, e.target.value)}
                      className="text-xs border border-gray-200 rounded-lg px-2 py-1 focus:outline-none focus:border-royal-400"
                    >
                      <option value="student">طالب</option>
                      <option value="teacher">مدرّس</option>
                      <option value="sales">مبيعات</option>
                      <option value="support">دعم</option>
                      <option value="editor">تحرير</option>
                      <option value="admin">أدمن</option>
                    </select>
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-gray-400">
                    لا يوجد مستخدمون
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  )
}
