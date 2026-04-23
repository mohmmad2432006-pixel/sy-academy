import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

const categories = [
  { id: 'programming', name: 'البرمجة وتطوير الويب', icon: '💻', count: 145, color: 'from-blue-500 to-royal-600', bg: 'bg-blue-50', border: 'border-blue-200' },
  { id: 'design', name: 'التصميم الجرافيكي', icon: '🎨', count: 82, color: 'from-pink-500 to-rose-600', bg: 'bg-pink-50', border: 'border-pink-200' },
  { id: 'business', name: 'الأعمال والإدارة', icon: '📊', count: 67, color: 'from-green-500 to-emerald-600', bg: 'bg-green-50', border: 'border-green-200' },
  { id: 'math', name: 'الرياضيات والإحصاء', icon: '📐', count: 43, color: 'from-purple-500 to-violet-600', bg: 'bg-purple-50', border: 'border-purple-200' },
  { id: 'language', name: 'تعلّم اللغات', icon: '🌍', count: 58, color: 'from-yellow-500 to-amber-600', bg: 'bg-yellow-50', border: 'border-yellow-200' },
  { id: 'science', name: 'العلوم التطبيقية', icon: '🔬', count: 39, color: 'from-red-500 to-orange-600', bg: 'bg-red-50', border: 'border-red-200' },
  { id: 'marketing', name: 'التسويق الرقمي', icon: '📱', count: 51, color: 'from-teal-500 to-cyan-600', bg: 'bg-teal-50', border: 'border-teal-200' },
  { id: 'ai', name: 'الذكاء الاصطناعي', icon: '🤖', count: 29, color: 'from-indigo-500 to-royal-600', bg: 'bg-indigo-50', border: 'border-indigo-200' },
];

export default function CategoriesSection() {
  return (
    <section className="py-20 bg-gradient-to-b from-white to-royal-50/50">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-block bg-royal-100 text-royal-700 font-bold text-sm px-4 py-1.5 rounded-full mb-3">
            🏷️ استكشف التخصصات
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-royal-950 mb-3">
            تعلَّم ما يشغف قلبك
          </h2>
          <p className="text-royal-500 text-lg max-w-xl mx-auto">
            اختر من بين أكثر من 8 تخصصات رئيسية تغطي كل ما تحتاجه لبناء مسيرتك المهنية
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/courses?category=${cat.id}`}
              className={`group ${cat.bg} border ${cat.border} rounded-2xl p-5 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer`}
            >
              <div className="space-y-3">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center text-2xl shadow-md group-hover:scale-110 transition-transform duration-300`}>
                  {cat.icon}
                </div>
                <div>
                  <h3 className="font-bold text-royal-900 text-sm leading-snug">{cat.name}</h3>
                  <p className="text-royal-400 text-xs mt-1">{cat.count} دورة</p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* View all */}
        <div className="text-center mt-10">
          <Link href="/courses"
            className="inline-flex items-center gap-2 border-2 border-royal-600 text-royal-700 hover:bg-royal-600 hover:text-white font-bold px-8 py-3 rounded-2xl transition-all duration-300">
            عرض جميع التخصصات
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
