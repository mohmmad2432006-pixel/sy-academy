'use client'
import { useEffect, useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { FiArrowRight, FiUser, FiMail, FiCalendar, FiSmartphone } from 'react-icons/fi'

export default function StudentProfilePage() {
  const { user, userData, loading, logout } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) router.push('/auth/login')
  }, [loading, user, router])

  if (loading || !userData) return null

  const joinDate = userData.createdAt
    ? new Date(userData.createdAt).toLocaleDateString('ar-SY', { year: 'numeric', month: 'long', day: 'numeric' })
    : '—'

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="hero-bg py-8">
        <div className="max-w-2xl mx-auto px-4">
          <div className="flex items-center gap-3 mb-2">
            <Link href="/student" className="text-white/70 hover:text-white transition-colors">
              <FiArrowRight />
            </Link>
            <h1 className="text-2xl font-black text-white">ملفي الشخصي</h1>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
          {/* Avatar */}
          <div className="flex items-center gap-5 mb-8 pb-8 border-b border-gray-100">
            {user?.photoURL ? (
              <img src={user.photoURL} alt="" className="w-20 h-20 rounded-2xl object-cover" />
            ) : (
              <div className="w-20 h-20 rounded-2xl bg-royal-100 flex items-center justify-center">
                <FiUser className="text-royal-600 text-3xl" />
              </div>
            )}
            <div>
              <h2 className="text-2xl font-black text-royal-950">{userData.name}</h2>
              <span className="badge bg-royal-100 text-royal-700 mt-2">طالب</span>
            </div>
          </div>

          {/* Info */}
          <div className="space-y-5">
            <InfoRow icon={<FiUser className="text-royal-500"/>} label="الاسم الكامل" value={userData.name} />
            <InfoRow icon={<FiMail className="text-royal-500"/>} label="البريد الإلكتروني" value={userData.email} />
            <InfoRow icon={<FiCalendar className="text-royal-500"/>} label="تاريخ الانضمام" value={joinDate} />
            <InfoRow
              icon={<FiSmartphone className="text-royal-500"/>}
              label="حالة الجهاز"
              value={userData.deviceBlocked ? '⚠️ مقيّد — تواصل مع الدعم' : '✅ طبيعي'}
              valueClass={userData.deviceBlocked ? 'text-red-600' : 'text-green-600'}
            />
          </div>

          <div className="mt-8 pt-6 border-t border-gray-100">
            <button
              onClick={logout}
              className="w-full py-3 rounded-xl border-2 border-red-200 text-red-600 font-bold hover:bg-red-50 transition-colors"
            >
              🚪 تسجيل الخروج
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function InfoRow({ icon, label, value, valueClass = '' }: any) {
  return (
    <div className="flex items-center gap-4">
      <div className="w-10 h-10 bg-royal-50 rounded-xl flex items-center justify-center flex-shrink-0">
        {icon}
      </div>
      <div>
        <div className="text-xs text-gray-400 font-medium">{label}</div>
        <div className={`font-bold text-gray-800 mt-0.5 ${valueClass}`}>{value || '—'}</div>
      </div>
    </div>
  )
}
