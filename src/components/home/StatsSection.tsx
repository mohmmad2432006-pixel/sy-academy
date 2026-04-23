import { Users, BookOpen, GraduationCap, Star, Globe, Trophy } from 'lucide-react';

const stats = [
  { icon: Users, value: '12,000+', label: 'طالب مسجّل', color: 'text-royal-600', bg: 'bg-royal-50' },
  { icon: BookOpen, value: '500+', label: 'دورة تعليمية', color: 'text-gold-600', bg: 'bg-gold-50' },
  { icon: GraduationCap, value: '85+', label: 'مدرّس خبير', color: 'text-green-600', bg: 'bg-green-50' },
  { icon: Star, value: '4.9/5', label: 'متوسط التقييم', color: 'text-pink-600', bg: 'bg-pink-50' },
  { icon: Trophy, value: '8,500+', label: 'شهادة صدرت', color: 'text-purple-600', bg: 'bg-purple-50' },
  { icon: Globe, value: '25+', label: 'دولة عربية', color: 'text-teal-600', bg: 'bg-teal-50' },
];

export default function StatsSection() {
  return (
    <section className="py-16 bg-white border-b border-royal-100">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {stats.map(({ icon: Icon, value, label, color, bg }) => (
            <div key={label} className="text-center group">
              <div className={`${bg} w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300`}>
                <Icon className={`w-7 h-7 ${color}`} />
              </div>
              <p className={`text-2xl font-black ${color}`}>{value}</p>
              <p className="text-royal-500 text-sm font-medium mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
