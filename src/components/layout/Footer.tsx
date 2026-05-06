import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-royal-950 text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-12 border-b border-royal-800">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center shadow-lg">
                <span className="text-white font-black text-xl">S</span>
              </div>
              <div>
                <span className="font-black text-2xl text-white">Sy</span>
                <span className="font-black text-2xl text-gold-400">Academy</span>
              </div>
            </div>
            <p className="text-royal-300 leading-relaxed max-w-xs">
              منصة تعليمية متخصصة لطلاب البكالوريا في سوريا — دروس تفاعلية عالية الجودة في جميع المواد الدراسية.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-bold text-gold-400 mb-4">روابط سريعة</h4>
            <ul className="space-y-3">
              {[['الرئيسية', '/'], ['الدورات', '/courses'], ['عن المنصة', '/#about']].map(([label, href]) => (
                <li key={href}>
                  <Link href={href} className="text-royal-300 hover:text-white transition-colors font-medium">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-gold-400 mb-4">التواصل</h4>
            <ul className="space-y-3 text-royal-300 font-medium">
              <li>📧 info@sy-academy.com</li>
              <li>📱 واتساب: +963 xxx xxx xxx</li>
              <li>🕐 الدعم: 9 صباحاً - 9 مساءً</li>
            </ul>
          </div>
        </div>

        <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-royal-400 text-sm">
            © {new Date().getFullYear()} Sy Academy — جميع الحقوق محفوظة
          </p>
          <div className="flex gap-6">
            <Link href="/privacy" className="text-royal-400 hover:text-white text-sm transition-colors">سياسة الخصوصية</Link>
            <Link href="/terms" className="text-royal-400 hover:text-white text-sm transition-colors">شروط الاستخدام</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
