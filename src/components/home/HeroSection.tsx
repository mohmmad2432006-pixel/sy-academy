'use client';

import Link from 'next/link';
import { Play, Star, Users, Award, ArrowLeft, CheckCircle2 } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden hero-gradient min-h-[92vh] flex items-center">
      {/* Decorative orbs */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-royal-400/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-royal-300/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-royal-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 py-20 w-full">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Text content */}
          <div className="text-white space-y-8 animate-fade-in">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2">
              <span className="w-2 h-2 bg-gold-400 rounded-full animate-pulse-slow" />
              <span className="text-sm font-bold text-gold-300">🎓 المنصة التعليمية الأولى في سوريا</span>
            </div>

            {/* Heading */}
            <div className="space-y-3">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight">
                تعلَّم بلا حدود
                <br />
                <span className="text-gold-400">وابنِ مستقبلك</span>
              </h1>
              <p className="text-lg text-royal-200 leading-relaxed max-w-lg">
                أكثر من <strong className="text-white">500 دورة تعليمية</strong> باللغة العربية في البرمجة والتصميم والأعمال والعلوم، يُدرِّسها خبراء متخصصون.
              </p>
            </div>

            {/* Features list */}
            <ul className="space-y-2">
              {[
                'محتوى عربي أصيل عالي الجودة',
                'شهادات معتمدة قابلة للمشاركة',
                'تعلّم في أي وقت ومن أي مكان',
                'دعم فني متواصل على مدار الساعة',
              ].map((item) => (
                <li key={item} className="flex items-center gap-3 text-royal-100 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-gold-400 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>

            {/* CTA buttons */}
            <div className="flex flex-wrap gap-4">
              <Link href="/courses"
                className="flex items-center gap-2 bg-gold-500 hover:bg-gold-400 text-white font-black px-7 py-4 rounded-2xl transition-all duration-300 shadow-xl hover:shadow-gold-500/30 hover:-translate-y-0.5 text-lg">
                ابدأ التعلم الآن
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <Link href="/courses?free=true"
                className="flex items-center gap-2 bg-white/15 hover:bg-white/25 border border-white/30 text-white font-bold px-7 py-4 rounded-2xl transition-all duration-300 backdrop-blur-sm">
                <Play className="w-4 h-4" />
                دورات مجانية
              </Link>
            </div>

            {/* Social proof */}
            <div className="flex items-center gap-4 pt-2">
              <div className="flex -space-x-2 space-x-reverse">
                {['م', 'أ', 'س', 'ف', 'ن'].map((letter, i) => (
                  <div key={i}
                    className="w-9 h-9 rounded-full border-2 border-royal-700 flex items-center justify-center text-xs font-bold text-white"
                    style={{ background: `hsl(${240 + i * 15}, 60%, ${45 + i * 5}%)` }}>
                    {letter}
                  </div>
                ))}
              </div>
              <div>
                <div className="flex items-center gap-1">
                  {[1,2,3,4,5].map(i => <Star key={i} className="w-3.5 h-3.5 fill-gold-400 text-gold-400" />)}
                  <span className="text-white font-bold text-sm mr-1">4.9</span>
                </div>
                <p className="text-royal-300 text-xs">من +12,000 طالب راضٍ</p>
              </div>
            </div>
          </div>

          {/* Visual card */}
          <div className="hidden lg:block animate-slide-up">
            <div className="relative">
              {/* Main card */}
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 space-y-5 shadow-2xl">
                <div className="flex items-center justify-between">
                  <h3 className="text-white font-bold text-lg">دوراتك الحالية</h3>
                  <span className="badge bg-gold-500/20 text-gold-300 text-xs">3 دورات نشطة</span>
                </div>

                {[
                  { title: 'تطوير تطبيقات React', progress: 72, color: 'from-blue-400 to-royal-400', icon: '⚛️' },
                  { title: 'تصميم واجهات UI/UX', progress: 45, color: 'from-pink-400 to-purple-400', icon: '🎨' },
                  { title: 'قواعد البيانات MongoDB', progress: 90, color: 'from-green-400 to-teal-400', icon: '🗄️' },
                ].map((course) => (
                  <div key={course.title} className="bg-white/10 rounded-2xl p-4 space-y-3">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{course.icon}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-bold text-sm truncate">{course.title}</p>
                        <p className="text-royal-300 text-xs">{course.progress}% مكتمل</p>
                      </div>
                      <span className="text-white font-black text-sm">{course.progress}%</span>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-2">
                      <div
                        className={`bg-gradient-to-l ${course.color} h-2 rounded-full transition-all`}
                        style={{ width: `${course.progress}%` }}
                      />
                    </div>
                  </div>
                ))}

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="bg-white/10 rounded-2xl p-4 text-center">
                    <p className="text-2xl font-black text-white">24</p>
                    <p className="text-royal-300 text-xs">ساعة تعلّم</p>
                  </div>
                  <div className="bg-white/10 rounded-2xl p-4 text-center">
                    <p className="text-2xl font-black text-gold-400">3</p>
                    <p className="text-royal-300 text-xs">شهادات</p>
                  </div>
                </div>
              </div>

              {/* Floating badges */}
              <div className="absolute -top-6 -right-6 bg-white rounded-2xl shadow-xl p-3 flex items-center gap-2 animate-float">
                <div className="w-9 h-9 bg-green-100 rounded-xl flex items-center justify-center">
                  <Award className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">شهادة جديدة!</p>
                  <p className="text-xs font-bold text-gray-800">React Developer</p>
                </div>
              </div>

              <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl p-3 flex items-center gap-3">
                <div className="w-9 h-9 bg-royal-100 rounded-xl flex items-center justify-center">
                  <Users className="w-5 h-5 text-royal-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">انضم للتو</p>
                  <p className="text-xs font-bold text-royal-800">+15 طالب جديد</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
