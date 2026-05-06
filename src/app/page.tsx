import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

const SUBJECTS = [
  { name: 'الرياضيات', icon: '📐', color: 'from-blue-500 to-blue-700' },
  { name: 'الفيزياء', icon: '⚛️', color: 'from-purple-500 to-purple-700' },
  { name: 'الكيمياء', icon: '🧪', color: 'from-green-500 to-green-700' },
  { name: 'الأحياء', icon: '🧬', color: 'from-emerald-500 to-emerald-700' },
  { name: 'اللغة العربية', icon: '📖', color: 'from-red-500 to-red-700' },
  { name: 'اللغة الإنجليزية', icon: '🌐', color: 'from-cyan-500 to-cyan-700' },
  { name: 'التاريخ', icon: '🏛️', color: 'from-amber-500 to-amber-700' },
  { name: 'الجغرافيا', icon: '🗺️', color: 'from-teal-500 to-teal-700' },
]

const STATS = [
  { label: 'طالب مسجّل', value: '+٢٠٠٠', icon: '👨‍🎓' },
  { label: 'دورة متاحة', value: '+٥٠', icon: '📚' },
  { label: 'مدرّس متخصص', value: '+١٥', icon: '👨‍🏫' },
  { label: 'نجاح في البكالوريا', value: '٩٢٪', icon: '🏆' },
]

const FEATURES = [
  { title: 'شرح تفاعلي', desc: 'فيديوهات عالية الجودة مع إمكانية متابعة التقدم', icon: '🎥' },
  { title: 'اختبارات تدريبية', desc: 'امتحانات وواجبات تحاكي نمط البكالوريا الحقيقية', icon: '📝' },
  { title: 'دعم فني ٢٤/٧', desc: 'فريق دعم متخصص لحل مشاكلك في أي وقت', icon: '🎯' },
  { title: 'متابعة ولي الأمر', desc: 'تقارير دورية عن تقدم الطالب وإنجازاته', icon: '👨‍👩‍👧' },
]

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="hero-bg relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -right-20 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 -left-20 w-72 h-72 bg-gold-500/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-royal-400/5 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white px-5 py-2 rounded-full text-sm font-bold mb-8 border border-white/20">
              <span className="w-2 h-2 bg-gold-400 rounded-full animate-pulse" />
              منصة البكالوريا السورية رقم ١
            </div>

            <h1 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">
              تفوّق في البكالوريا مع
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-gold-300 to-gold-500 mt-2">
                Sy Academy
              </span>
            </h1>

            <p className="text-royal-200 text-lg md:text-xl mb-10 leading-relaxed max-w-2xl mx-auto">
              منصة تعليمية متكاملة تجمع أفضل المدرّسين السوريين — دروس تفاعلية، اختبارات، ومتابعة مستمرة لضمان نجاحك.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/register" className="btn-gold text-base py-4 px-8 shadow-2xl shadow-gold-500/40">
                🚀 ابدأ مجاناً الآن
              </Link>
              <Link href="/courses" className="glass text-white font-bold py-4 px-8 rounded-xl hover:bg-white/20 transition-all duration-300">
                📚 استعرض الدورات
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16">
            {STATS.map((stat) => (
              <div key={stat.label} className="glass rounded-2xl p-5 text-center">
                <div className="text-3xl mb-2">{stat.icon}</div>
                <div className="text-2xl font-black text-white">{stat.value}</div>
                <div className="text-royal-300 text-sm font-medium mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Subjects */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-royal-950 mb-4">
              جميع <span className="text-gradient">المواد الدراسية</span>
            </h2>
            <p className="text-gray-500 text-lg">تغطية شاملة لكل مواد البكالوريا العلمي والأدبي</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {SUBJECTS.map((subject) => (
              <Link
                key={subject.name}
                href={`/courses?subject=${subject.name}`}
                className="group card text-center hover:scale-[1.03] transition-transform duration-300 cursor-pointer"
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${subject.color} flex items-center justify-center text-2xl mx-auto mb-3 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  {subject.icon}
                </div>
                <h3 className="font-bold text-royal-900">{subject.name}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20" id="about">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-royal-950 mb-4">
              لماذا <span className="text-gradient">Sy Academy؟</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map((feat) => (
              <div key={feat.title} className="card text-center group hover:border-royal-200">
                <div className="text-4xl mb-4">{feat.icon}</div>
                <h3 className="font-black text-royal-800 text-lg mb-2">{feat.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 hero-bg relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-1/4 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
        </div>
        <div className="max-w-3xl mx-auto px-4 text-center relative">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
            جاهز تبدأ رحلتك نحو النجاح؟
          </h2>
          <p className="text-royal-200 text-lg mb-8">
            انضم لآلاف الطلاب الذين حققوا نتائج مميزة مع Sy Academy
          </p>
          <Link href="/auth/register" className="btn-gold text-lg py-4 px-10 shadow-2xl shadow-gold-500/30 inline-block">
            سجّل حسابك مجاناً 🎓
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  )
}
