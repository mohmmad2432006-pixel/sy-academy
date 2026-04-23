import Link from 'next/link';
import { ArrowLeft, GraduationCap, Zap } from 'lucide-react';

export default function CTASection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-5xl mx-auto px-4">
        <div className="relative overflow-hidden hero-gradient rounded-3xl p-10 sm:p-16 text-center text-white">
          {/* Decorative circles */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

          <div className="relative space-y-6">
            {/* Icon */}
            <div className="w-20 h-20 bg-white/15 backdrop-blur-sm rounded-3xl flex items-center justify-center mx-auto border border-white/20">
              <GraduationCap className="w-10 h-10 text-gold-400" />
            </div>

            {/* Heading */}
            <div>
              <h2 className="text-3xl sm:text-5xl font-black mb-3">
                جاهز لتبدأ رحلتك؟
              </h2>
              <p className="text-royal-200 text-lg max-w-xl mx-auto leading-relaxed">
                انضم لأكثر من 12,000 طالب يتعلمون يومياً على Sy-Academy وحوّل أهدافك إلى إنجازات حقيقية
              </p>
            </div>

            {/* Bullets */}
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              {['التسجيل مجاني 100%', 'بدون بطاقة ائتمانية', 'وصول فوري للمحتوى', 'ضمان الرضا 30 يوم'].map((item) => (
                <div key={item} className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full border border-white/20">
                  <Zap className="w-3.5 h-3.5 text-gold-400" />
                  <span className="font-medium">{item}</span>
                </div>
              ))}
            </div>

            {/* Buttons */}
            <div className="flex flex-wrap justify-center gap-4 pt-2">
              <Link href="/auth/register"
                className="flex items-center gap-2 bg-gold-500 hover:bg-gold-400 text-white font-black px-8 py-4 rounded-2xl transition-all duration-300 shadow-xl hover:shadow-gold-500/30 hover:-translate-y-0.5 text-lg">
                سجّل مجاناً الآن
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <Link href="/courses"
                className="flex items-center gap-2 bg-white/15 hover:bg-white/25 border border-white/30 text-white font-bold px-8 py-4 rounded-2xl transition-all duration-300 backdrop-blur-sm">
                استعرض الدورات
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
