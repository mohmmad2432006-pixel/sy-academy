import Link from 'next/link';
import { GraduationCap, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-royal-950 text-white">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-royal-400 to-royal-600 rounded-xl flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-black">
                Sy<span className="text-royal-400">-Academy</span>
              </span>
            </Link>
            <p className="text-royal-300 text-sm leading-relaxed mb-6">
              منصة التعليم الإلكتروني الأولى في سوريا. نقدم دورات تعليمية عالية الجودة بالعربية لمساعدتك على تطوير مهاراتك وبناء مستقبلك.
            </p>
            <div className="flex gap-3">
              {[
                { label: 'ف', href: '#' },
                { label: 'ت', href: '#' },
                { label: 'ي', href: '#' },
                { label: 'إن', href: '#' },
              ].map(({ label, href }, i) => (
                <a key={i} href={href}
                  className="w-9 h-9 bg-royal-800 hover:bg-royal-600 rounded-xl flex items-center justify-center transition-colors text-white text-xs font-bold">
                  {label}
                </a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-royal-300">الروابط السريعة</h3>
            <ul className="space-y-2">
              {[
                { href: '/courses', label: 'جميع الدورات' },
                { href: '/instructors', label: 'المدرسون' },
                { href: '/about', label: 'عن المنصة' },
                { href: '/blog', label: 'المدونة' },
                { href: '/faq', label: 'الأسئلة الشائعة' },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href}
                    className="text-royal-300 hover:text-white transition-colors text-sm flex items-center gap-2">
                    <span className="w-1 h-1 bg-royal-500 rounded-full"></span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-royal-300">التخصصات</h3>
            <ul className="space-y-2">
              {['البرمجة وتطوير الويب', 'التصميم الجرافيكي', 'الأعمال والإدارة', 'الرياضيات والعلوم', 'اللغات الأجنبية', 'التسويق الرقمي'].map((cat) => (
                <li key={cat}>
                  <a href="#" className="text-royal-300 hover:text-white transition-colors text-sm flex items-center gap-2">
                    <span className="w-1 h-1 bg-royal-500 rounded-full"></span>
                    {cat}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-royal-300">تواصل معنا</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-royal-300 text-sm">
                <Mail className="w-4 h-4 text-royal-400 shrink-0" />
                info@sy-academy.com
              </li>
              <li className="flex items-center gap-3 text-royal-300 text-sm">
                <Phone className="w-4 h-4 text-royal-400 shrink-0" />
                +963 11 000 0000
              </li>
              <li className="flex items-center gap-3 text-royal-300 text-sm">
                <MapPin className="w-4 h-4 text-royal-400 shrink-0" />
                دمشق، سوريا
              </li>
            </ul>

            {/* Newsletter */}
            <div className="mt-6">
              <p className="text-royal-300 text-sm mb-3">اشترك في النشرة الإخبارية</p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="بريدك الإلكتروني"
                  className="flex-1 px-3 py-2 text-sm bg-royal-800 border border-royal-700 rounded-lg text-white placeholder-royal-500 focus:outline-none focus:border-royal-500"
                />
                <button className="px-3 py-2 bg-royal-600 hover:bg-royal-500 rounded-lg text-sm font-bold transition-colors">
                  اشترك
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-royal-800 py-4 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-royal-400 text-sm">
          <p>© {new Date().getFullYear()} Sy-Academy. جميع الحقوق محفوظة.</p>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-white transition-colors">سياسة الخصوصية</Link>
            <Link href="/terms" className="hover:text-white transition-colors">شروط الاستخدام</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
