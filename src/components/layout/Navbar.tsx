'use client'
import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'

export default function Navbar() {
  const { user, userData, logout } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const router = useRouter()

  const dashboardRoute = userData?.role === 'admin' ? '/admin'
    : userData?.role === 'teacher' ? '/teacher'
    : userData?.role === 'sales' ? '/sales'
    : userData?.role === 'support' ? '/support'
    : userData?.role === 'editor' ? '/editor'
    : '/student'

  return (
    <nav className="bg-white/95 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-hero-gradient flex items-center justify-center shadow-lg shadow-royal-500/30">
              <span className="text-white font-black text-lg">S</span>
            </div>
            <div className="hidden sm:block">
              <span className="font-black text-royal-800 text-xl">Sy</span>
              <span className="font-black text-royal-500 text-xl">Academy</span>
            </div>
          </Link>

          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-gray-600 hover:text-royal-600 font-medium transition-colors">الرئيسية</Link>
            <Link href="/courses" className="text-gray-600 hover:text-royal-600 font-medium transition-colors">الدورات</Link>
            <Link href="/#about" className="text-gray-600 hover:text-royal-600 font-medium transition-colors">عن المنصة</Link>
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <Link href={dashboardRoute} className="hidden md:flex items-center gap-2 bg-royal-50 text-royal-700 px-4 py-2 rounded-xl font-bold hover:bg-royal-100 transition-colors">
                  <span>لوحة التحكم</span>
                </Link>
                <div className="relative">
                  <button onClick={() => setMenuOpen(!menuOpen)} className="flex items-center gap-2">
                    {user.photoURL ? (
                      <img src={user.photoURL} alt="avatar" className="w-9 h-9 rounded-full border-2 border-royal-300" />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-royal-600 flex items-center justify-center text-white font-bold">
                        {user.displayName?.[0] || user.email?.[0] || 'م'}
                      </div>
                    )}
                  </button>
                  {menuOpen && (
                    <div className="absolute top-12 left-0 bg-white rounded-2xl shadow-xl border border-gray-100 p-2 w-48 z-50">
                      <p className="px-3 py-2 text-sm text-gray-500 font-medium border-b border-gray-100 mb-1">
                        {user.displayName || user.email}
                      </p>
                      <Link href={dashboardRoute} className="block px-3 py-2 text-gray-700 hover:bg-royal-50 hover:text-royal-700 rounded-xl font-medium" onClick={() => setMenuOpen(false)}>
                        لوحة التحكم
                      </Link>
                      <button onClick={() => { logout(); setMenuOpen(false) }} className="w-full text-right px-3 py-2 text-red-600 hover:bg-red-50 rounded-xl font-medium">
                        تسجيل الخروج
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <>
                <Link href="/auth/login" className="text-royal-700 font-bold hover:text-royal-900 transition-colors">دخول</Link>
                <Link href="/auth/register" className="btn-primary py-2 px-5 text-sm">
                  سجّل مجاناً
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
