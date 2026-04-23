import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import CourseCard from '@/components/courses/CourseCard';

const FEATURED_COURSES = [
  {
    id: '1',
    title: 'تطوير تطبيقات الويب الكاملة بـ Next.js 14 و TypeScript',
    instructor: 'م. أحمد الحسن',
    thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600&h=340&fit=crop',
    rating: 4.9,
    reviewsCount: 1240,
    enrolled: 4820,
    duration: 1800,
    lessonsCount: 92,
    price: 45000,
    originalPrice: 90000,
    level: 'متوسط',
    category: 'programming',
    isFeatured: true,
  },
  {
    id: '2',
    title: 'تصميم واجهات المستخدم المحترفة بـ Figma من الصفر',
    instructor: 'م. سارة العلي',
    thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&h=340&fit=crop',
    rating: 4.8,
    reviewsCount: 876,
    enrolled: 3210,
    duration: 960,
    lessonsCount: 54,
    price: 35000,
    originalPrice: 70000,
    level: 'مبتدئ',
    category: 'design',
    isFeatured: false,
  },
  {
    id: '3',
    title: 'إتقان Python للذكاء الاصطناعي وتعلم الآلة',
    instructor: 'د. خالد النمر',
    thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&h=340&fit=crop',
    rating: 4.9,
    reviewsCount: 2100,
    enrolled: 7840,
    duration: 2400,
    lessonsCount: 120,
    price: 0,
    level: 'متقدم',
    category: 'ai',
    isFeatured: true,
  },
  {
    id: '4',
    title: 'إدارة الأعمال وريادة الشركات الناشئة - دليلك الشامل',
    instructor: 'أ. رنا الزين',
    thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=340&fit=crop',
    rating: 4.7,
    reviewsCount: 543,
    enrolled: 1980,
    duration: 720,
    lessonsCount: 40,
    price: 25000,
    originalPrice: 50000,
    level: 'مبتدئ',
    category: 'business',
    isFeatured: false,
  },
  {
    id: '5',
    title: 'تسويق رقمي احترافي: إنستجرام وفيسبوك وإعلانات Google',
    instructor: 'م. يوسف الخطيب',
    thumbnail: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=600&h=340&fit=crop',
    rating: 4.8,
    reviewsCount: 789,
    enrolled: 2650,
    duration: 840,
    lessonsCount: 47,
    price: 30000,
    level: 'متوسط',
    category: 'marketing',
    isFeatured: false,
  },
  {
    id: '6',
    title: 'اللغة الإنجليزية من الصفر حتى الاحترافية B2',
    instructor: 'أ. منى فارس',
    thumbnail: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=600&h=340&fit=crop',
    rating: 4.9,
    reviewsCount: 3200,
    enrolled: 12400,
    duration: 3000,
    lessonsCount: 180,
    price: 0,
    level: 'مبتدئ',
    category: 'language',
    isFeatured: true,
  },
];

export default function FeaturedCourses() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <span className="inline-block bg-royal-100 text-royal-700 font-bold text-sm px-4 py-1.5 rounded-full mb-3">
              🔥 الأكثر شعبية
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-royal-950">
              الدورات المميزة
            </h2>
            <p className="text-royal-500 mt-1">اختارها آلاف الطلاب لجودتها العالية</p>
          </div>
          <Link href="/courses"
            className="flex items-center gap-2 text-royal-600 hover:text-royal-800 font-bold transition-colors shrink-0">
            عرض الكل
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURED_COURSES.map((course) => (
            <CourseCard key={course.id} {...course} />
          ))}
        </div>
      </div>
    </section>
  );
}
