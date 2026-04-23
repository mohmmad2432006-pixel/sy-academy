import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Star, Users, Clock, BookOpen, CheckCircle2, Play, Globe, Award, ChevronDown } from "lucide-react";

// Mock data for the course detail
const COURSE = {
  id: '1',
  title: 'تطوير تطبيقات الويب الكاملة بـ Next.js 14 و TypeScript',
  description: 'دورة شاملة تأخذك من الصفر إلى مستوى احترافي في تطوير تطبيقات الويب الحديثة باستخدام Next.js 14، TypeScript، Tailwind CSS، وPrisma.',
  instructor: 'م. أحمد الحسن',
  instructorBio: 'مهندس برمجيات بخبرة 10 سنوات في تطوير الويب. عمل مع كبرى الشركات التقنية العربية.',
  thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=900&h=500&fit=crop',
  rating: 4.9,
  reviewsCount: 1240,
  enrolled: 4820,
  duration: 1800,
  lessonsCount: 92,
  price: 45000,
  originalPrice: 90000,
  level: 'متوسط',
  language: 'العربية',
  lastUpdated: 'مارس 2024',
  outcomes: [
    'بناء تطبيقات Next.js 14 كاملة من الصفر',
    'إتقان TypeScript وأنواع البيانات المتقدمة',
    'تصميم قواعد بيانات مع Prisma و PostgreSQL',
    'نشر التطبيقات على Vercel وخدمات السحابة',
    'المصادقة وإدارة الجلسات بـ NextAuth.js',
    'أفضل ممارسات الأداء و SEO',
  ],
  requirements: [
    'معرفة أساسية بـ HTML وCSS وJavaScript',
    'حاسوب متصل بالإنترنت',
    'حماس للتعلم والتطبيق العملي',
  ],
  sections: [
    { title: 'مقدمة وإعداد البيئة', lessonsCount: 8, duration: 120, lessons: ['مقدمة الدورة', 'تثبيت Node.js ومحرر الكود', 'إنشاء مشروع Next.js 14', 'هيكل المشروع وملفات الإعداد'] },
    { title: 'أساسيات Next.js 14', lessonsCount: 15, duration: 280, lessons: ['نظام App Router', 'Server vs Client Components', 'التوجيه والصفحات', 'التخطيطات المتداخلة'] },
    { title: 'TypeScript المتقدم', lessonsCount: 12, duration: 220, lessons: ['أنواع البيانات الأساسية', 'الواجهات والأنواع المعقدة', 'الجنيريكس والأنواع المشروطة', 'TypeScript مع React'] },
    { title: 'قاعدة البيانات مع Prisma', lessonsCount: 14, duration: 260, lessons: ['تثبيت Prisma وإعداده', 'تصميم المخطط', 'عمليات CRUD', 'العلاقات والاستعلامات المتقدمة'] },
  ],
};

export default function CourseDetailPage() {
  const discount = Math.round(((COURSE.originalPrice - COURSE.price) / COURSE.originalPrice) * 100);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero */}
      <div className="hero-gradient py-14 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 text-white space-y-5">
              <div className="flex flex-wrap gap-2">
                <span className="badge bg-white/20 text-white text-xs">البرمجة</span>
                <span className="badge bg-white/20 text-white text-xs">{COURSE.level}</span>
                <span className="badge bg-gold-500/30 text-gold-300 text-xs">⭐ الأعلى تقييماً</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black leading-snug">{COURSE.title}</h1>
              <p className="text-royal-200 leading-relaxed">{COURSE.description}</p>
              <div className="flex flex-wrap items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <div className="flex">
                    {[1,2,3,4,5].map(i => <Star key={i} className={`w-4 h-4 ${i <= Math.round(COURSE.rating) ? 'fill-gold-400 text-gold-400' : 'text-gray-400'}`} />)}
                  </div>
                  <span className="text-gold-400 font-bold">{COURSE.rating}</span>
                  <span className="text-royal-300">({COURSE.reviewsCount.toLocaleString('ar')} تقييم)</span>
                </div>
                <span className="flex items-center gap-1 text-royal-200"><Users className="w-4 h-4" />{COURSE.enrolled.toLocaleString('ar')} طالب</span>
                <span className="flex items-center gap-1 text-royal-200"><Clock className="w-4 h-4" />{Math.floor(COURSE.duration / 60)} ساعة</span>
                <span className="flex items-center gap-1 text-royal-200"><Globe className="w-4 h-4" />{COURSE.language}</span>
              </div>
              <p className="text-royal-200 text-sm">بقلم: <strong className="text-white">{COURSE.instructor}</strong> · آخر تحديث: {COURSE.lastUpdated}</p>
            </div>

            {/* Price card - Desktop */}
            <div className="hidden lg:block">
              <div className="card overflow-hidden sticky top-20">
                <div className="relative aspect-video overflow-hidden">
                  <img src={COURSE.thumbnail} alt={COURSE.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-xl cursor-pointer hover:scale-105 transition-transform">
                      <Play className="w-7 h-7 text-royal-600 mr-[-2px]" />
                    </div>
                  </div>
                </div>
                <div className="p-5 space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl font-black text-royal-900">{COURSE.price.toLocaleString('ar')} ل.س</span>
                    <span className="text-royal-300 text-lg line-through">{COURSE.originalPrice.toLocaleString('ar')}</span>
                    <span className="badge bg-red-100 text-red-600 font-black">-{discount}%</span>
                  </div>
                  <p className="text-xs text-red-500 font-bold">⏰ العرض ينتهي قريباً!</p>
                  <button className="w-full btn-primary text-center py-4 text-base">التسجيل الآن</button>
                  <button className="w-full btn-secondary text-center py-3 text-sm">أضف للمفضلة</button>
                  <p className="text-xs text-center text-royal-400">ضمان استرداد المال خلال 30 يوماً</p>
                  <div className="space-y-2 pt-2 border-t border-royal-100">
                    {[
                      { icon: Clock, text: `${Math.floor(COURSE.duration / 60)} ساعة من المحتوى` },
                      { icon: BookOpen, text: `${COURSE.lessonsCount} درس تعليمي` },
                      { icon: Award, text: 'شهادة إتمام معتمدة' },
                      { icon: Globe, text: 'وصول مدى الحياة' },
                    ].map(({ icon: Icon, text }) => (
                      <div key={text} className="flex items-center gap-2 text-sm text-royal-600">
                        <Icon className="w-4 h-4 text-royal-400 shrink-0" />
                        {text}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="grid lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-8">
            {/* Outcomes */}
            <div className="card p-6 space-y-4">
              <h2 className="text-xl font-black text-royal-950">ماذا ستتعلم؟</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {COURSE.outcomes.map((item) => (
                  <div key={item} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                    <span className="text-royal-700 text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Requirements */}
            <div className="card p-6 space-y-4">
              <h2 className="text-xl font-black text-royal-950">المتطلبات المسبقة</h2>
              <ul className="space-y-2">
                {COURSE.requirements.map((req) => (
                  <li key={req} className="flex items-center gap-2 text-royal-700 text-sm">
                    <span className="w-1.5 h-1.5 bg-royal-500 rounded-full shrink-0" />
                    {req}
                  </li>
                ))}
              </ul>
            </div>

            {/* Curriculum */}
            <div className="card p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-black text-royal-950">محتوى الدورة</h2>
                <span className="text-sm text-royal-400">{COURSE.lessonsCount} درس · {Math.floor(COURSE.duration / 60)} ساعة</span>
              </div>
              <div className="space-y-3">
                {COURSE.sections.map((section, i) => (
                  <details key={i} className="border border-royal-100 rounded-2xl overflow-hidden group">
                    <summary className="flex items-center justify-between p-4 cursor-pointer hover:bg-royal-50 transition-colors list-none">
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 bg-royal-100 rounded-lg flex items-center justify-center text-sm font-black text-royal-600">{i+1}</div>
                        <div>
                          <p className="font-bold text-royal-900 text-sm">{section.title}</p>
                          <p className="text-royal-400 text-xs">{section.lessonsCount} درس · {Math.floor(section.duration / 60)}س {section.duration % 60}د</p>
                        </div>
                      </div>
                      <ChevronDown className="w-4 h-4 text-royal-400 group-open:rotate-180 transition-transform" />
                    </summary>
                    <div className="border-t border-royal-100">
                      {section.lessons.map((lesson, j) => (
                        <div key={j} className="flex items-center gap-3 px-4 py-3 hover:bg-royal-50 transition-colors">
                          <Play className="w-4 h-4 text-royal-400 shrink-0" />
                          <span className="text-royal-700 text-sm">{lesson}</span>
                          {j === 0 && <span className="badge bg-green-100 text-green-600 text-xs mr-auto">مجاني</span>}
                        </div>
                      ))}
                    </div>
                  </details>
                ))}
              </div>
            </div>

            {/* Instructor */}
            <div className="card p-6 space-y-4">
              <h2 className="text-xl font-black text-royal-950">عن المدرّس</h2>
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-royal-500 to-royal-700 rounded-2xl flex items-center justify-center text-white text-2xl font-black shrink-0">
                  أ
                </div>
                <div className="space-y-1">
                  <h3 className="font-black text-royal-900">{COURSE.instructor}</h3>
                  <p className="text-royal-500 text-sm">مطوّر Full-Stack ومدرّب معتمد</p>
                  <div className="flex gap-4 text-xs text-royal-400">
                    <span className="flex items-center gap-1"><Star className="w-3.5 h-3.5 text-gold-400" />4.9 تقييم</span>
                    <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" />12,000 طالب</span>
                    <span className="flex items-center gap-1"><BookOpen className="w-3.5 h-3.5" />8 دورات</span>
                  </div>
                  <p className="text-royal-600 text-sm leading-relaxed">{COURSE.instructorBio}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile price card */}
          <div className="lg:hidden">
            <div className="card p-5 space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl font-black text-royal-900">{COURSE.price.toLocaleString('ar')} ل.س</span>
                <span className="badge bg-red-100 text-red-600 font-black">-{discount}%</span>
              </div>
              <button className="w-full btn-primary py-4">التسجيل الآن</button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
