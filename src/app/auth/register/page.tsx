'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'

export default function RegisterPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const { registerWithEmail, signInWithGoogle } = useAuth()
  const router = useRouter()

  const strength = password.length === 0 ? 0 : password.length < 6 ? 1 : password.length < 10 ? 2 : 3
  const strengthColors = ['', 'bg-red-400', 'bg-yellow-400', 'bg-green-500']
  const strengthLabels = ['', 'ضعيفة', 'متوسطة', 'قوية']

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirm) {
      return alert('كلمتا المرور غير متطابقتين')
    }
    if (password.length < 6) return alert('كلمة المرور قصيرة جداً')
    setLoading(true)
    try {
      await registerWithEmail(name, email, password)
      router.push('/student')
    } catch {
      // handled in context
    } finally {
      setLoading(false)
    }
  }

  const handleGoogle = async () => {
    setGoogleLoading(true)
    try {
      await signInWithGoogle()
      setTimeout(() => router.push('/student'), 1500)
    } catch {
      // handled
    } finally {
      setGoogleLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex" dir="rtl">
      {/* Hero Panel */}
      <div className="hidden lg:flex lg:w-1/2 hero-bg items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 right-20 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-10 w-48 h-48 bg-gold-500/10 rounded-full blur-3xl" />
        </div>
        <div className="relative text-center">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center mx-auto mb-6 shadow-2xl">
            <span className="text-white font-black text-4xl">S</span>
          </div>
          <h1 className="text-4xl font-black text-white mb-3">
            <span>Sy</span><span className="text-gold-400">Academy</span>
          </h1>
          <p className="text-royal-200 text-lg mb-8">انضم لآلاف الطلاب المتفوقين</p>
          <div className="space-y-3 text-right max-w-xs mx-auto">
            {['✅ دروس تفاعلية بجودة عالية', '✅ اختبارات وواجبات تدريبية', '✅ دعم فني متخصص', '✅ متابعة ولي الأمر'].map(f => (
              <div key={f} className="glass rounded-xl px-4 py-2 text-white font-medium text-sm">{f}</div>
            ))}
          </div>
        </div>
      </div>

      {/* Form Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-white">
        <div className="w-full max-w-md">
          <div className="lg:hidden text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-hero-gradient flex items-center justify-center mx-auto mb-3">
              <span className="text-white font-black text-2xl">S</span>
            </div>
          </div>

          <h2 className="text-2xl font-black text-royal-950 mb-2">أنشئ حسابك 🎓</h2>
          <p className="text-gray-500 mb-8">مجاناً — ابدأ رحلتك نحو التفوق</p>

          <button
            onClick={handleGoogle}
            disabled={googleLoading}
            className="w-full flex items-center justify-center gap-3 border-2 border-gray-200 hover:border-royal-300 hover:bg-royal-50 text-gray-700 font-bold py-3 px-6 rounded-xl transition-all duration-300 mb-6 disabled:opacity-60"
          >
            {googleLoading ? (
              <div className="w-5 h-5 border-2 border-gray-400 border-t-royal-600 rounded-full animate-spin" />
            ) : (
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            )}
            {googleLoading ? 'جاري التسجيل...' : 'التسجيل بحساب Google'}
          </button>

          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-gray-400 text-sm font-medium">أو بالبريد الإلكتروني</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">الاسم الكامل</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="input-field" placeholder="محمد أحمد" required />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">البريد الإلكتروني</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input-field" placeholder="example@gmail.com" required />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">كلمة المرور</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="input-field" placeholder="٦ أحرف على الأقل" required />
              {password && (
                <div className="mt-2">
                  <div className="flex gap-1">
                    {[1,2,3].map(i => (
                      <div key={i} className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${i <= strength ? strengthColors[strength] : 'bg-gray-200'}`} />
                    ))}
                  </div>
                  <p className={`text-xs mt-1 font-medium ${strength === 1 ? 'text-red-500' : strength === 2 ? 'text-yellow-600' : 'text-green-600'}`}>
                    قوة كلمة المرور: {strengthLabels[strength]}
                  </p>
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">تأكيد كلمة المرور</label>
              <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} className="input-field" placeholder="أعد كتابة كلمة المرور" required />
              {confirm && password !== confirm && <p className="text-red-500 text-xs mt-1">كلمتا المرور غير متطابقتين</p>}
            </div>

            <button type="submit" disabled={loading} className="w-full btn-primary py-3 mt-2 disabled:opacity-60">
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>جاري التسجيل...</span>
                </div>
              ) : 'إنشاء الحساب مجاناً 🎓'}
            </button>
          </form>

          <p className="text-center text-gray-500 mt-6">
            لديك حساب؟{' '}
            <Link href="/auth/login" className="text-royal-600 font-bold hover:text-royal-800">سجّل دخولك</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
