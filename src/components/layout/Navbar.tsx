'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Menu, X, BookOpen, Search, Bell, ChevronDown, GraduationCap, LogOut, User, LayoutDashboard } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const navLinks = [
    { href: '/courses', label: 'الدورات' },
    { href: '/instructors', label: 'المدرسون' },
    { href: '/about', label: 'عن المنصة' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-royal-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="w-9 h-9 bg-gradient-to-br from-royal-600 to-royal-800 rounded-xl flex items-center justify-center shadow-lg shadow-royal-300/50">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-black text-royal-900">
              Sy<span className="text-royal-500">-Academy</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}
                className="text-royal-700 hover:text-royal-500 font-semibold transition-colors duration-200 text-sm">
                {link.label}
              </Link>
            ))}
          </div>

          {/* Search bar */}
          <div className="hidden lg:flex flex-1 max-w-xs relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-royal-400" />
            <input
              type="text"
              placeholder="ابحث عن دورة..."
              className="w-full pr-10 pl-4 py-2 text-sm rounded-xl border-2 border-royal-100 focus:border-royal-400 focus:outline-none bg-royal-50/50 text-royal-900 placeholder-royal-300"
            />
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2 shrink-0">
            {user ? (
              <>
                <button className="p-2 text-royal-500 hover:bg-royal-50 rounded-xl transition-colors relative">
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 p-1 pr-3 bg-royal-50 hover:bg-royal-100 rounded-xl transition-colors"
                  >
                    <span className="text-sm font-bold text-royal-700 hidden sm:block">
                      {user.displayName?.split(' ')[0] || 'مستخدم'}
                    </span>
                    <div className="w-8 h-8 bg-gradient-to-br from-royal-500 to-royal-700 rounded-lg flex items-center justify-center text-white text-sm font-bold">
                      {user.displayName?.[0] || user.email?.[0] || 'م'}
                    </div>
                    <ChevronDown className="w-3 h-3 text-royal-500" />
                  </button>
                  {showUserMenu && (
                    <div className="absolute left-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-royal-100 overflow-hidden z-50">
                      <div className="p-3 border-b border-royal-50">
                        <p className="text-xs text-royal-400">مرحباً</p>
                        <p className="font-bold text-royal-900 text-sm">{user.displayName || user.email}</p>
                      </div>
                      <div className="p-1">
                        <Link href="/dashboard" onClick={() => setShowUserMenu(false)}
                          className="flex items-center gap-3 px-3 py-2 text-royal-700 hover:bg-royal-50 rounded-xl text-sm font-medium transition-colors">
                          <LayoutDashboard className="w-4 h-4" /> لوحة التحكم
                        </Link>
                        <Link href="/profile" onClick={() => setShowUserMenu(false)}
                          className="flex items-center gap-3 px-3 py-2 text-royal-700 hover:bg-royal-50 rounded-xl text-sm font-medium transition-colors">
                          <User className="w-4 h-4" /> الملف الشخصي
                        </Link>
                        <Link href="/my-courses" onClick={() => setShowUserMenu(false)}
                          className="flex items-center gap-3 px-3 py-2 text-royal-700 hover:bg-royal-50 rounded-xl text-sm font-medium transition-colors">
                          <BookOpen className="w-4 h-4" /> دوراتي
                        </Link>
                        <hr className="my-1 border-royal-100" />
                        <button onClick={() => { logout(); setShowUserMenu(false); }}
                          className="flex items-center gap-3 px-3 py-2 text-red-600 hover:bg-red-50 rounded-xl text-sm font-medium transition-colors w-full text-right">
                          <LogOut className="w-4 h-4" /> تسجيل الخروج
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link href="/auth/login"
                  className="text-royal-700 font-bold text-sm hover:text-royal-500 transition-colors hidden sm:block">
                  تسجيل الدخول
                </Link>
                <Link href="/auth/register"
                  className="bg-gradient-to-l from-royal-600 to-royal-800 text-white font-bold text-sm px-4 py-2 rounded-xl shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5">
                  انضم الآن
                </Link>
              </>
            )}

            {/* Mobile menu */}
            <button onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 text-royal-700 hover:bg-royal-50 rounded-xl">
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-royal-100 px-4 py-4 space-y-2">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href}
              onClick={() => setIsOpen(false)}
              className="block py-2 px-3 text-royal-700 font-semibold hover:bg-royal-50 rounded-xl transition-colors">
              {link.label}
            </Link>
          ))}
          <div className="pt-2 flex gap-2">
            <Link href="/auth/login" onClick={() => setIsOpen(false)}
              className="flex-1 text-center py-2 border-2 border-royal-600 text-royal-700 font-bold rounded-xl text-sm">
              دخول
            </Link>
            <Link href="/auth/register" onClick={() => setIsOpen(false)}
              className="flex-1 text-center py-2 bg-royal-600 text-white font-bold rounded-xl text-sm">
              سجّل
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
