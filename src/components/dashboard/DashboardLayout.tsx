'use client'
import { ReactNode, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'

interface SidebarItem {
  label: string
  href: string
  icon: string
}

interface DashboardLayoutProps {
  children: ReactNode
  title: string
  role: string
  roleColor: string
  sidebarItems: SidebarItem[]
}

const ROLE_LABELS: Record<string, string> = {
  admin: 'المدير العام',
  teacher: 'المدرّس',
  sales: 'قسم المبيعات',
  support: 'الدعم الفني',
  editor: 'فريق التحرير',
  student: 'الطالب',
}

const ROLE_COLORS: Record<string, string> = {
  admin: 'from-red-600 to-red-800',
  teacher: 'from-blue-600 to-blue-800',
  sales: 'from-green-600 to-green-800',
  support: 'from-yellow-600 to-yellow-800',
  editor: 'from-purple-600 to-purple-800',
  student: 'from-royal-600 to-royal-800',
}

export default function DashboardLayout({ children, title, role, sidebarItems }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()
  const { user, userData, logout } = useAuth()

  const roleColor = ROLE_COLORS[role] || 'from-royal-600 to-royal-800'

  return (
    <div className="min-h-screen bg-gray-50 flex" dir="rtl">
      {/* Sidebar Overlay (Mobile) */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed right-0 top-0 h-full w-64 bg-white border-l border-gray-200 z-50 transform transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : 'translate-x-full'} lg:translate-x-0 lg:static lg:z-auto flex flex-col`}>
        {/* Sidebar Header */}
        <div className={`bg-gradient-to-b ${roleColor} p-5`}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <span className="text-white font-black text-lg">S</span>
            </div>
            <div>
              <div className="text-white font-black">SyAcademy</div>
              <div className="text-white/70 text-xs">{ROLE_LABELS[role]}</div>
            </div>
          </div>

          {/* User info */}
          <div className="flex items-center gap-3 bg-white/10 rounded-xl p-3">
            {user?.photoURL ? (
              <img src={user.photoURL} alt="avatar" className="w-9 h-9 rounded-full border-2 border-white/30" />
            ) : (
              <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-white font-bold">
                {user?.displayName?.[0] || '؟'}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-white font-bold text-sm truncate">{user?.displayName || user?.email}</p>
              <p className="text-white/60 text-xs">{ROLE_LABELS[role]}</p>
            </div>
          </div>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <ul className="space-y-1">
            {sidebarItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                      isActive
                        ? `bg-gradient-to-l ${roleColor} text-white shadow-md`
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    <span className="text-lg">{item.icon}</span>
                    <span>{item.label}</span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-gray-100">
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 font-medium transition-colors"
          >
            <span>🚪</span>
            <span>تسجيل الخروج</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl hover:bg-gray-100 text-gray-600"
            >
              ☰
            </button>
            <h1 className="font-black text-royal-950 text-xl">{title}</h1>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/" className="text-gray-500 hover:text-royal-600 text-sm font-medium">
              🏠 الرئيسية
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
