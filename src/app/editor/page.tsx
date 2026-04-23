'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import { Video, Plus, Upload, BookOpen, Check, Loader2 } from 'lucide-react';
import { GRADES, SUBJECTS } from '@/types';

export default function EditorDashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [courses, setCourses] = useState<any[]>([]);
  const [showNewCourse, setShowNewCourse] = useState(false);
  const [showAddLesson, setShowAddLesson] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [courseForm, setCourseForm] = useState({ title: '', description: '', subject: '', grade: '', price: '', teacherId: '', teacherName: '' });
  const [lessonForm, setLessonForm] = useState({ title: '', bunnyVideoId: '', duration: '', order: '1', isFree: false });

  useEffect(() => {
    if (!loading && !user) router.push('/auth/login');
  }, [user, loading, router]);

  useEffect(() => { fetchCourses(); }, []);

  const fetchCourses = async () => {
    const res = await fetch('/api/courses');
    const data = await res.json();
    setCourses(data.courses || []);
  };

  const createCourse = async () => {
    setUploading(true);
    await fetch('/api/courses', { method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...courseForm, price: Number(courseForm.price), lessons: [], enrolled: 0, rating: 0, reviewsCount: 0, isPublished: false }) });
    setShowNewCourse(false);
    setUploading(false);
    fetchCourses();
  };

  const addLesson = async (courseId: string) => {
    setUploading(true);
    const course = courses.find(c => c._id === courseId);
    const updatedLessons = [...(course?.lessons || []), { ...lessonForm, duration: Number(lessonForm.duration), order: Number(lessonForm.order), viewCount: 0 }];
    await fetch(`/api/courses/${courseId}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lessons: updatedLessons }) });
    setShowAddLesson(null);
    setUploading(false);
    fetchCourses();
  };

  const togglePublish = async (courseId: string, current: boolean) => {
    await fetch(`/api/courses/${courseId}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isPublished: !current }) });
    fetchCourses();
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-10 h-10 border-4 border-royal-200 border-t-royal-600 rounded-full animate-spin"/></div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">

        <div className="hero-gradient rounded-3xl p-8 text-white flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black mb-1">لوحة فريق التحرير</h1>
            <p className="text-royal-200">رفع الدورات وإدارة الفيديوهات عبر Bunny.net</p>
          </div>
          <button onClick={() => setShowNewCourse(true)} className="flex items-center gap-2 bg-gold-500 hover:bg-gold-400 text-white font-bold px-5 py-3 rounded-2xl transition-all">
            <Plus className="w-5 h-5" /> دورة جديدة
          </button>
        </div>

        {/* Bunny.net info */}
        <div className="card p-4 flex items-center gap-3 border-2 border-blue-200 bg-blue-50">
          <Video className="w-6 h-6 text-blue-600 shrink-0" />
          <div>
            <p className="font-bold text-blue-800 text-sm">استضافة الفيديوهات عبر Bunny.net</p>
            <p className="text-blue-600 text-xs">أضف معرّف الفيديو (Video ID) من لوحة Bunny.net مباشرة لكل درس</p>
          </div>
        </div>

        {/* New course form */}
        {showNewCourse && (
          <div className="card p-6 space-y-4 border-2 border-royal-200">
            <h3 className="font-black text-royal-900 text-lg">إضافة دورة جديدة</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="text-sm font-bold text-royal-700 block mb-1">عنوان الدورة</label>
                <input className="input-field" placeholder="مثال: رياضيات الصف الثاني عشر - الوحدة الأولى" value={courseForm.title} onChange={e => setCourseForm({...courseForm, title: e.target.value})} />
              </div>
              <div>
                <label className="text-sm font-bold text-royal-700 block mb-1">المادة</label>
                <select className="input-field" value={courseForm.subject} onChange={e => setCourseForm({...courseForm, subject: e.target.value})}>
                  <option value="">اختر المادة</option>
                  {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm font-bold text-royal-700 block mb-1">الصف الدراسي</label>
                <select className="input-field" value={courseForm.grade} onChange={e => setCourseForm({...courseForm, grade: e.target.value})}>
                  <option value="">اختر الصف</option>
                  {GRADES.map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm font-bold text-royal-700 block mb-1">اسم المعلم</label>
                <input className="input-field" value={courseForm.teacherName} onChange={e => setCourseForm({...courseForm, teacherName: e.target.value})} />
              </div>
              <div>
                <label className="text-sm font-bold text-royal-700 block mb-1">السعر (ل.س)</label>
                <input type="number" className="input-field" value={courseForm.price} onChange={e => setCourseForm({...courseForm, price: e.target.value})} />
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-bold text-royal-700 block mb-1">وصف الدورة</label>
                <textarea className="input-field h-20 resize-none" value={courseForm.description} onChange={e => setCourseForm({...courseForm, description: e.target.value})} />
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={createCourse} disabled={uploading} className="btn-primary text-sm py-2 flex items-center gap-2">
                {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />} حفظ الدورة
              </button>
              <button onClick={() => setShowNewCourse(false)} className="btn-secondary text-sm py-2">إلغاء</button>
            </div>
          </div>
        )}

        {/* Courses list */}
        <div className="space-y-4">
          <h2 className="text-xl font-black text-royal-950">جميع الدورات ({courses.length})</h2>
          {courses.map((course: any) => (
            <div key={course._id} className="card p-5 space-y-4">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <h3 className="font-black text-royal-900">{course.title}</h3>
                  <div className="flex gap-2 text-xs text-royal-400">
                    <span>{course.subject}</span><span>•</span><span>{course.grade}</span>
                    <span>•</span><span>المعلم: {course.teacherName}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`badge text-xs ${course.isPublished ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {course.isPublished ? 'منشورة' : 'مسودة'}
                  </span>
                  <button onClick={() => togglePublish(course._id, course.isPublished)}
                    className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors ${course.isPublished ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-green-50 text-green-600 hover:bg-green-100'}`}>
                    {course.isPublished ? 'إلغاء النشر' : 'نشر'}
                  </button>
                </div>
              </div>

              {/* Lessons */}
              <div className="border border-royal-100 rounded-xl overflow-hidden">
                <div className="bg-royal-50 px-4 py-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-3.5 h-3.5 text-royal-600" />
                    <span className="text-xs font-bold text-royal-600">الدروس ({course.lessons?.length || 0})</span>
                  </div>
                  <button onClick={() => setShowAddLesson(course._id)}
                    className="flex items-center gap-1 text-xs font-bold text-royal-600 hover:text-royal-800 transition-colors">
                    <Plus className="w-3 h-3" /> إضافة درس
                  </button>
                </div>

                {showAddLesson === course._id && (
                  <div className="p-4 border-b border-royal-100 bg-royal-50/50 space-y-3">
                    <div className="grid md:grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-bold text-royal-700 block mb-1">عنوان الدرس</label>
                        <input className="input-field text-sm py-2" value={lessonForm.title} onChange={e => setLessonForm({...lessonForm, title: e.target.value})} />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-royal-700 block mb-1">Bunny Video ID</label>
                        <input className="input-field text-sm py-2" dir="ltr" placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx" value={lessonForm.bunnyVideoId} onChange={e => setLessonForm({...lessonForm, bunnyVideoId: e.target.value})} />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-royal-700 block mb-1">المدة (بالثواني)</label>
                        <input type="number" className="input-field text-sm py-2" value={lessonForm.duration} onChange={e => setLessonForm({...lessonForm, duration: e.target.value})} />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-royal-700 block mb-1">الترتيب</label>
                        <input type="number" className="input-field text-sm py-2" value={lessonForm.order} onChange={e => setLessonForm({...lessonForm, order: e.target.value})} />
                      </div>
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={lessonForm.isFree} onChange={e => setLessonForm({...lessonForm, isFree: e.target.checked})} className="w-4 h-4 accent-royal-600" />
                      <span className="text-sm text-royal-700 font-medium">درس مجاني (متاح بدون كود)</span>
                    </label>
                    <div className="flex gap-2">
                      <button onClick={() => addLesson(course._id)} disabled={uploading} className="btn-primary text-xs py-1.5 flex items-center gap-1">
                        {uploading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Upload className="w-3 h-3" />} إضافة
                      </button>
                      <button onClick={() => setShowAddLesson(null)} className="btn-secondary text-xs py-1.5">إلغاء</button>
                    </div>
                  </div>
                )}

                <div className="divide-y divide-royal-50">
                  {course.lessons?.sort((a: any, b: any) => a.order - b.order).map((lesson: any, i: number) => (
                    <div key={i} className="flex items-center justify-between px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-royal-100 rounded-lg flex items-center justify-center text-xs font-bold text-royal-600">{lesson.order}</div>
                        <span className="text-sm text-royal-700 font-medium">{lesson.title}</span>
                        {lesson.isFree && <span className="badge bg-green-100 text-green-700 text-xs">مجاني</span>}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-royal-400">
                        <Video className="w-3 h-3" />
                        <span dir="ltr" className="font-mono">{lesson.bunnyVideoId?.slice(0, 8)}...</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
