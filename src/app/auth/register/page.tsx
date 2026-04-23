'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { GraduationCap, Eye, EyeOff, Mail, Lock, User, AlertCircle, Loader2, CheckCircle2 } from 'lucide-react';

export default function RegisterPage() {
  const { register, loginWithGoogle } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');

  const strength = (() => {
    const p = form.password;
    if (!p) return 0;
    let s = 0;
    if (p.length >= 8) s++;
    if (/[A-Z]/.test(p)) s++;
    if (/[0-9]/.test(p)) s++;
    if (/[^A-Za-z0-9]/.test(p)) s++;
    return s;
  })();

  const strengthLabels = ['', 'ضعيفة', 'مقبولة', 'جيدة', 'قوية'];
  const strengthColors = ['', 'bg-red-400', 'bg-yellow-400', 'bg-blue-400', 'bg-green-400'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) { setError('يرجى ملء جميع الحقول'); return; }
    if (form.password !== form.confirm) { setError('كلمتا المرور غير متطابقتين'); return; }
    if (form.password.length < 8) { setError('كلمة المرور يجب أن تكون 8 أحرف على الأقل'); return; }
    setLoading(true);
    setError('');
    try {
      await register(form.email, form.password, form.name);
      router.push('/dashboard');
    } catch (err: unknown) {
      const code = (err as { code?: string })?.code;
      if (code === 'auth/email-already-in-use') {
        setError('هذا البريد الإلكتروني مسجّل مسبقاً. هل تريد تسجيل الدخول؟');
      } else {
        setError('حدث خطأ في إنشاء الحساب. حاول مرة أخرى.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setGoogleLoading(true);
    try {
      await loginWithGoogle();
      router.push('/dashboard');
    } catch {
      setError('فشل التسجيل بـ Google.');
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left visual */}
      <div className="hidden lg:flex flex-1 hero-gradient items-center justify-center p-12">
        <div className="text-white text-center space-y-6 max-w-sm">
          <div className="w-24 h-24 bg-white/15 rounded-3xl flex items-center justify-center mx-auto border border-white/20">
            <GraduationCap className="w-12 h-12 text-gold-400" />
          </div>
          <h2 className="text-3xl font-black">ابدأ مجاناً اليوم</h2>
          <p className="text-royal-200 leading-relaxed">
            انضم لأكثر من 12,000 طالب يتعلمون يومياً على Sy-Academy. سجّل مجاناً واحصل على وصول فوري لمئات الدورات.
          </p>
          <ul className="space-y-3 text-sm text-right">
            {['تسجيل مجاني بدون بطاقة ائتمانية', 'وصول فوري لدورات مجانية', 'شهادات معتمدة قابلة للمشاركة', 'دعم مستمر من المدرّسين'].map((item) => (
              <li key={item} className="flex items-center gap-2 bg-white/10 rounded-xl px-4 py-2.5 border border-white/10">
                <CheckCircle2 className="w-4 h-4 text-gold-400 shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Right: Form */}
      <div className="flex-1 flex items-center justify-center px-4 py-12 bg-white overflow-y-auto">
        <div className="w-full max-w-md space-y-7">
          <div className="text-center">
            <Link href="/" className="inline-flex items-center gap-2 mb-4">
              <div className="w-11 h-11 bg-gradient-to-br from-royal-600 to-royal-800 rounded-2xl flex items-center justify-center shadow-xl">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-black text-royal-900">Sy<span className="text-royal-500">-Academy</span></span>
            </Link>
            <h1 className="text-3xl font-black text-royal-950">إنشاء حساب جديد</h1>
            <p className="text-royal-400 mt-1 text-sm">ابدأ رحلتك التعليمية مجاناً</p>
          </div>

          <button onClick={handleGoogle} disabled={googleLoading}
            className="w-full flex items-center justify-center gap-3 border-2 border-royal-200 hover:border-royal-400 hover:bg-royal-50 py-3.5 rounded-2xl font-bold text-royal-700 transition-all duration-200 disabled:opacity-50">
            {googleLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            )}
            {googleLoading ? 'جارٍ التسجيل...' : 'التسجيل بحساب Google'}
          </button>

          <div className="relative">
            <hr className="border-royal-100" />
            <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-3 text-royal-300 text-sm">أو بالبريد الإلكتروني</span>
          </div>

          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-royal-700 mb-1.5">الاسم الكامل</label>
              <div className="relative">
                <User className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-royal-400" />
                <input type="text" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})}
                  placeholder="محمد أحمد" className="input-field pr-11" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-royal-700 mb-1.5">البريد الإلكتروني</label>
              <div className="relative">
                <Mail className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-royal-400" />
                <input type="email" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})}
                  placeholder="example@email.com" className="input-field pr-11" dir="ltr" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-royal-700 mb-1.5">كلمة المرور</label>
              <div className="relative">
                <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-royal-400" />
                <input type={showPwd ? 'text' : 'password'} value={form.password}
                  onChange={(e) => setForm({...form, password: e.target.value})}
                  placeholder="8 أحرف على الأقل" className="input-field pr-11 pl-11" dir="ltr" />
                <button type="button" onClick={() => setShowPwd(!showPwd)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-royal-400 hover:text-royal-700">
                  {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {form.password && (
                <div className="mt-2 space-y-1">
                  <div className="flex gap-1">
                    {[1,2,3,4].map((i) => (
                      <div key={i} className={`h-1.5 flex-1 rounded-full transition-all ${i <= strength ? strengthColors[strength] : 'bg-gray-200'}`} />
                    ))}
                  </div>
                  <p className="text-xs text-royal-400">قوة كلمة المرور: <span className="font-bold">{strengthLabels[strength]}</span></p>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-bold text-royal-700 mb-1.5">تأكيد كلمة المرور</label>
              <div className="relative">
                <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-royal-400" />
                <input type="password" value={form.confirm} onChange={(e) => setForm({...form, confirm: e.target.value})}
                  placeholder="أعد كتابة كلمة المرور" className="input-field pr-11" dir="ltr" />
                {form.confirm && (
                  <div className="absolute left-4 top-1/2 -translate-y-1/2">
                    {form.password === form.confirm
                      ? <CheckCircle2 className="w-4 h-4 text-green-500" />
                      : <AlertCircle className="w-4 h-4 text-red-400" />
                    }
                  </div>
                )}
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full btn-primary flex items-center justify-center gap-2 text-base py-4 disabled:opacity-60">
              {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> جارٍ إنشاء الحساب...</> : 'إنشاء الحساب مجاناً'}
            </button>

            <p className="text-xs text-center text-royal-400">
              بالتسجيل، أنت توافق على{' '}
              <Link href="/terms" className="text-royal-600 font-bold">شروط الاستخدام</Link>
              {' '}و{' '}
              <Link href="/privacy" className="text-royal-600 font-bold">سياسة الخصوصية</Link>
            </p>
          </form>

          <p className="text-center text-royal-500 text-sm">
            لديك حساب بالفعل؟{' '}
            <Link href="/auth/login" className="text-royal-600 font-bold hover:text-royal-800">تسجيل الدخول</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
