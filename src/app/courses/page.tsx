import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CourseCard from "@/components/courses/CourseCard";
import { Search, SlidersHorizontal, Filter } from "lucide-react";

const ALL_COURSES = [
  { id: '1', title: 'تطوير تطبيقات الويب الكاملة بـ Next.js 14 و TypeScript', instructor: 'م. أحمد الحسن', thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600&h=340&fit=crop', rating: 4.9, reviewsCount: 1240, enrolled: 4820, duration: 1800, lessonsCount: 92, price: 45000, originalPrice: 90000, level: 'متوسط', category: 'programming', isFeatured: true },
  { id: '2', title: 'تصميم واجهات المستخدم بـ Figma من الصفر', instructor: 'م. سارة العلي', thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&h=340&fit=crop', rating: 4.8, reviewsCount: 876, enrolled: 3210, duration: 960, lessonsCount: 54, price: 35000, originalPrice: 70000, level: 'مبتدئ', category: 'design', isFeatured: false },
  { id: '3', title: 'Python للذكاء الاصطناعي وتعلم الآلة', instructor: 'د. خالد النمر', thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&h=340&fit=crop', rating: 4.9, reviewsCount: 2100, enrolled: 7840, duration: 2400, lessonsCount: 120, price: 0, level: 'متقدم', category: 'ai', isFeatured: true },
  { id: '4', title: 'ريادة الأعمال وإدارة الشركات الناشئة', instructor: 'أ. رنا الزين', thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=340&fit=crop', rating: 4.7, reviewsCount: 543, enrolled: 1980, duration: 720, lessonsCount: 40, price: 25000, originalPrice: 50000, level: 'مبتدئ', category: 'business', isFeatured: false },
  { id: '5', title: 'التسويق الرقمي المتكامل', instructor: 'م. يوسف الخطيب', thumbnail: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=600&h=340&fit=crop', rating: 4.8, reviewsCount: 789, enrolled: 2650, duration: 840, lessonsCount: 47, price: 30000, level: 'متوسط', category: 'marketing', isFeatured: false },
  { id: '6', title: 'اللغة الإنجليزية من الصفر إلى B2', instructor: 'أ. منى فارس', thumbnail: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=600&h=340&fit=crop', rating: 4.9, reviewsCount: 3200, enrolled: 12400, duration: 3000, lessonsCount: 180, price: 0, level: 'مبتدئ', category: 'language', isFeatured: true },
  { id: '7', title: 'Adobe Photoshop الاحترافي', instructor: 'م. كريم سعيد', thumbnail: 'https://images.unsplash.com/photo-1572044162444-ad60f128bdea?w=600&h=340&fit=crop', rating: 4.7, reviewsCount: 654, enrolled: 2890, duration: 1200, lessonsCount: 65, price: 28000, originalPrice: 55000, level: 'متوسط', category: 'design', isFeatured: false },
  { id: '8', title: 'قواعد البيانات SQL و MongoDB', instructor: 'م. نور الدين', thumbnail: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=600&h=340&fit=crop', rating: 4.8, reviewsCount: 432, enrolled: 1540, duration: 900, lessonsCount: 50, price: 20000, level: 'مبتدئ', category: 'programming', isFeatured: false },
  { id: '9', title: 'الرياضيات للجامعة والتحصيل العلمي', instructor: 'د. سامي عيد', thumbnail: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600&h=340&fit=crop', rating: 4.9, reviewsCount: 1870, enrolled: 9230, duration: 2100, lessonsCount: 110, price: 0, level: 'متوسط', category: 'math', isFeatured: false },
];

const categories = [
  { id: 'all', label: 'الكل' },
  { id: 'programming', label: 'البرمجة' },
  { id: 'design', label: 'التصميم' },
  { id: 'business', label: 'الأعمال' },
  { id: 'math', label: 'الرياضيات' },
  { id: 'language', label: 'اللغات' },
  { id: 'ai', label: 'الذكاء الاصطناعي' },
  { id: 'marketing', label: 'التسويق' },
];

export default function CoursesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Header */}
      <div className="hero-gradient py-14 px-4">
        <div className="max-w-7xl mx-auto text-white text-center space-y-4">
          <h1 className="text-4xl font-black">جميع الدورات التعليمية</h1>
          <p className="text-royal-200 text-lg">اكتشف أكثر من 500 دورة تعليمية باللغة العربية</p>
          <div className="max-w-xl mx-auto relative mt-6">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-royal-400" />
            <input type="text" placeholder="ابحث عن دورة أو مدرّس..."
              className="w-full pr-12 pl-4 py-4 rounded-2xl text-royal-900 font-medium focus:outline-none text-sm shadow-lg" />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar filters */}
          <aside className="lg:w-64 shrink-0 space-y-6">
            <div className="card p-5 space-y-4">
              <h3 className="font-black text-royal-900 flex items-center gap-2">
                <Filter className="w-4 h-4 text-royal-600" /> التصفية
              </h3>

              {/* Category */}
              <div>
                <p className="font-bold text-royal-700 text-sm mb-2">التخصص</p>
                <div className="space-y-1.5">
                  {categories.map((cat) => (
                    <label key={cat.id} className="flex items-center gap-2 cursor-pointer group">
                      <input type="checkbox" className="w-4 h-4 accent-royal-600" />
                      <span className="text-sm text-royal-600 group-hover:text-royal-900 transition-colors">{cat.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Level */}
              <div className="border-t border-royal-100 pt-4">
                <p className="font-bold text-royal-700 text-sm mb-2">المستوى</p>
                <div className="space-y-1.5">
                  {['مبتدئ', 'متوسط', 'متقدم'].map((level) => (
                    <label key={level} className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="w-4 h-4 accent-royal-600" />
                      <span className="text-sm text-royal-600">{level}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price */}
              <div className="border-t border-royal-100 pt-4">
                <p className="font-bold text-royal-700 text-sm mb-2">السعر</p>
                <div className="space-y-1.5">
                  {['مجاني', 'مدفوع'].map((p) => (
                    <label key={p} className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="w-4 h-4 accent-royal-600" />
                      <span className="text-sm text-royal-600">{p}</span>
                    </label>
                  ))}
                </div>
              </div>

              <button className="w-full bg-gradient-to-l from-royal-600 to-royal-800 text-white font-bold py-2.5 rounded-xl text-sm transition-all">
                تطبيق الفلتر
              </button>
            </div>
          </aside>

          {/* Main content */}
          <main className="flex-1">
            {/* Sort bar */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-royal-500 text-sm">
                عرض <strong className="text-royal-900">{ALL_COURSES.length}</strong> دورة
              </p>
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-royal-400" />
                <select className="text-sm border border-royal-200 rounded-xl px-3 py-2 text-royal-700 focus:outline-none focus:border-royal-500 bg-white">
                  <option>الأكثر شعبية</option>
                  <option>الأعلى تقييماً</option>
                  <option>الأحدث</option>
                  <option>السعر: الأقل أولاً</option>
                </select>
              </div>
            </div>

            {/* Courses grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {ALL_COURSES.map((course) => (
                <CourseCard key={course.id} {...course} />
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center mt-10 gap-2">
              {[1,2,3,4,5].map((page) => (
                <button key={page}
                  className={`w-10 h-10 rounded-xl font-bold text-sm transition-all ${
                    page === 1
                      ? 'bg-royal-600 text-white shadow-md'
                      : 'bg-white border border-royal-200 text-royal-600 hover:bg-royal-50'
                  }`}>
                  {page}
                </button>
              ))}
            </div>
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
}
