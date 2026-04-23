'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import { Users, Eye, BookOpen, TrendingUp, Play } from 'lucide-react';

export default function TeacherDashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [courses, setCourses] = useState<any[]>([]);

  useEffect(() => {
    if (!loading && !user) router.push('/auth/login');
  }, [user, loading, router]);

  useEffect(() => {
    if (user) fetchCourses();
  }, [user]);

  const fetchCourses = async () => {
    const res = await fetch(`/api/courses?teacherId=${user?.uid}`);
    const data = await res.json();
    setCourses(data.courses || []);
  };

  const totalStudents = courses.reduce((sum, c) => sum + (c.enrolled || 0), 0);
  const totalViews = courses.reduce((sum, c) => sum + c.lessons?.reduce((s: number, l: any) => s + (l.viewCount || 0), 0), 0);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-10 h-10 border-4 border-royal-200 border-t-royal-600 rounded-full animate-spin"/></div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">

        <div className="hero-gradient rounded-3xl p-8 text-white">
          <h1 className="text-3xl font-black mb-1">لوحة المعلم</h1>
          <p className="text-royal-200">مرحباً {user?.displayName} — تابع طلابك وإحصائيات دروسك</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'دوراتي', value: courses.length, icon: BookOpen, color: 'text-royal-600', bg: 'bg-royal-50' },
            { label: 'إجمالي الطلاب', value: totalStudents, icon: Users, color: 'text-green-600', bg: 'bg-green-50' },
            { label: 'مشاهدات الفيديوهات', value: totalViews, icon: Eye, color: 'text-blue-600', bg: 'bg-blue-50' },
            { label: 'التقييم العام', value: courses.length ? (courses.reduce((s, c) => s + (c.rating || 0), 0) / courses.length).toFixed(1) : '0', icon: TrendingUp, color: 'text-gold-600', bg: 'bg-yellow-50' },
          ].map(({ label, value, icon: Icon, color, bg }) => (
            <div key={label} className="card p-5 flex items-center gap-3">
              <div className={`${bg} w-12 h-12 rounded-2xl flex items-center justify-center shrink-0`}>
                <Icon className={`w-6 h-6 ${color}`} />
              </div>
              <div>
                <p className={`text-2xl font-black ${color}`}>{value}</p>
                <p className="text-xs text-royal-400">{label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Courses */}
        <div className="space-y-4">
          <h2 className="text-xl font-black text-royal-950">دوراتي التعليمية</h2>
          {courses.length === 0 ? (
            <div className="card p-12 text-center">
              <BookOpen className="w-16 h-16 text-royal-200 mx-auto mb-4" />
              <p className="text-royal-400 font-bold">لا توجد دورات بعد</p>
              <p className="text-royal-300 text-sm">سيضيف فريق التحرير دوراتك قريباً</p>
            </div>
          ) : (
            courses.map((course: any) => (
              <div key={course._id} className="card p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <h3 className="font-black text-royal-900 text-lg">{course.title}</h3>
                    <div className="flex gap-3 text-sm text-royal-400">
                      <span className="flex items-center gap-1"><BookOpen className="w-3.5 h-3.5" />{course.subject}</span>
                      <span>{course.grade}</span>
                    </div>
                  </div>
                  <span className={`badge text-xs ${course.isPublished ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {course.isPublished ? 'منشورة' : 'مسودة'}
                  </span>
                </div>

                {/* Stats row */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-royal-50 rounded-xl p-3 text-center">
                    <p className="text-xl font-black text-royal-700">{course.enrolled || 0}</p>
                    <p className="text-xs text-royal-400">طالب مسجّل</p>
                  </div>
                  <div className="bg-royal-50 rounded-xl p-3 text-center">
                    <p className="text-xl font-black text-royal-700">{course.lessons?.length || 0}</p>
                    <p className="text-xs text-royal-400">درس</p>
                  </div>
                  <div className="bg-royal-50 rounded-xl p-3 text-center">
                    <p className="text-xl font-black text-royal-700">
                      {course.lessons?.reduce((s: number, l: any) => s + (l.viewCount || 0), 0) || 0}
                    </p>
                    <p className="text-xs text-royal-400">مشاهدة</p>
                  </div>
                </div>

                {/* Lessons table */}
                {course.lessons?.length > 0 && (
                  <div className="border border-royal-100 rounded-xl overflow-hidden">
                    <div className="bg-royal-50 px-4 py-2 flex items-center gap-2">
                      <Play className="w-3.5 h-3.5 text-royal-600" />
                      <span className="text-xs font-bold text-royal-600">الدروس ومشاهداتها</span>
                    </div>
                    <div className="divide-y divide-royal-50">
                      {course.lessons.sort((a: any, b: any) => a.order - b.order).map((lesson: any, i: number) => (
                        <div key={i} className="flex items-center justify-between px-4 py-2.5">
                          <div className="flex items-center gap-2">
                            <div className="w-5 h-5 bg-royal-100 rounded flex items-center justify-center text-xs font-bold text-royal-600">{lesson.order}</div>
                            <span className="text-sm text-royal-700">{lesson.title}</span>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-royal-400">
                            <Eye className="w-3 h-3" />
                            <span className="font-bold">{lesson.viewCount || 0}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
