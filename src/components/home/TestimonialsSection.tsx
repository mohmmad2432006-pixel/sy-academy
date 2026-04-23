import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'محمد الأحمد',
    role: 'مطوّر ويب | دمشق',
    avatar: 'م',
    color: 'from-royal-500 to-royal-700',
    rating: 5,
    text: 'بفضل Sy-Academy تمكّنت من الانتقال من مبرمج مبتدئ إلى مطوّر Full-Stack في أقل من سنة. المحتوى عربي وشامل ومرتّب بطريقة احترافية جداً.',
    course: 'تطوير الويب الكامل',
  },
  {
    name: 'سارة المحمود',
    role: 'مصمّمة جرافيك | حلب',
    avatar: 'س',
    color: 'from-pink-500 to-rose-600',
    rating: 5,
    text: 'الدورات هنا تختلف تماماً عن غيرها. المدرّسون يشرحون بأسلوب بسيط وعملي. حصلت على وظيفتي الأولى في التصميم بعد إنهاء دورة UI/UX.',
    course: 'تصميم UI/UX',
  },
  {
    name: 'أحمد العمر',
    role: 'رائد أعمال | اللاذقية',
    avatar: 'أ',
    color: 'from-green-500 to-teal-600',
    rating: 5,
    text: 'استثمرت في نفسي من خلال دورة إدارة الأعمال، وأسّست شركتي الصغيرة بعد ثلاثة أشهر. المعلومات عملية ومناسبة للواقع العربي.',
    course: 'إدارة الأعمال',
  },
  {
    name: 'ريم الزيد',
    role: 'طالبة جامعية | دير الزور',
    avatar: 'ر',
    color: 'from-purple-500 to-violet-600',
    rating: 5,
    text: 'كنت أبحث عن محتوى عربي جيد لتعلم Python، فوجدت Sy-Academy. الدورات مجانية الجودة عالية جداً والمدرّسون متجاوبون في التعليقات.',
    course: 'Python للمبتدئين',
  },
];

export default function TestimonialsSection() {
  return (
    <section className="py-20 bg-gradient-to-b from-royal-50 to-white">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-block bg-gold-100 text-gold-700 font-bold text-sm px-4 py-1.5 rounded-full mb-3">
            💬 قالوا عنّا
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-royal-950 mb-2">
            آراء طلابنا الحقيقيين
          </h2>
          <p className="text-royal-500 text-lg">
            أكثر من 12,000 طالب وثّقوا تجربتهم معنا
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {testimonials.map((t, i) => (
            <div key={i} className="card p-6 space-y-4 group hover:-translate-y-1">
              {/* Quote icon */}
              <div className="flex items-start justify-between">
                <Quote className="w-10 h-10 text-royal-200 fill-royal-100" />
                <div className="flex">
                  {[1,2,3,4,5].map((s) => (
                    <Star key={s} className={`w-4 h-4 ${s <= t.rating ? 'fill-gold-400 text-gold-400' : 'text-gray-200'}`} />
                  ))}
                </div>
              </div>

              {/* Text */}
              <p className="text-royal-700 leading-relaxed text-sm font-medium">
                &ldquo;{t.text}&rdquo;
              </p>

              {/* Course tag */}
              <span className="inline-block bg-royal-50 text-royal-600 text-xs font-bold px-3 py-1 rounded-full">
                📚 {t.course}
              </span>

              {/* Author */}
              <div className="flex items-center gap-3 pt-2 border-t border-royal-50">
                <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${t.color} flex items-center justify-center text-white font-black text-lg shadow-md`}>
                  {t.avatar}
                </div>
                <div>
                  <p className="font-bold text-royal-900 text-sm">{t.name}</p>
                  <p className="text-royal-400 text-xs">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
