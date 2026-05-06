'use client'
import { useEffect, useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import DashboardLayout from '@/components/dashboard/DashboardLayout'
import { FiUpload, FiLink, FiPlus, FiVideo } from 'react-icons/fi'
import toast from 'react-hot-toast'

const SIDEBAR = [
  { label: 'إضافة دورة', href: '/editor', icon: '📚' },
  { label: 'إضافة درس', href: '/editor/lesson', icon: '🎬' },
]

export default function EditorDashboard() {
  const { user, userData, loading } = useAuth()
  const router = useRouter()
  const [courses, setCourses] = useState<any[]>([])
  const [tab, setTab] = useState<'course' | 'lesson'>('course')
  const [courseForm, setCourseForm] = useState({ title: '', subject: '', grade: '', teacherId: '', description: '', price: 0 })
  const [lessonForm, setLessonForm] = useState({ courseId: '', title: '', description: '', videoSource: 'bunny' as 'bunny' | 'upload', bunnyVideoId: '', bunnyLibraryId: '', order: 1 })
  const [teachers, setTeachers] = useState<any[]>([])
  const [saving, setSaving] = useState(false)

  const SUBJECTS = ['الرياضيات','الفيزياء','الكيمياء','الأحياء','اللغة العربية','اللغة الإنجليزية','التاريخ','الجغرافيا']
  const GRADES = ['الصف التاسع','الصف العاشر','الصف الحادي عشر','الصف الثاني عشر']

  useEffect(() => {
    if (!loading && !user) router.push('/auth/login')
    if (!loading && userData && !['editor', 'admin'].includes(userData.role)) router.push('/student')
  }, [loading, user, userData, router])

  useEffect(() => {
    if (!user) return
    user.getIdToken().then(token => {
      const h = { Authorization: `Bearer ${token}` }
      Promise.all([
        fetch('/api/courses', { headers: h }).then(r => r.json()),
        fetch('/api/users?role=teacher', { headers: h }).then(r => r.json()),
      ]).then(([cd, ud]) => {
        setCourses(cd.courses || [])
        setTeachers(ud.users || [])
      }).catch(() => {})
    })
  }, [user])

  const saveCourse = async () => {
    if (!courseForm.title || !courseForm.subject || !courseForm.grade) return toast.error('أكمل البيانات المطلوبة')
    setSaving(true)
    try {
      const token = await user!.getIdToken()
      const res = await fetch('/api/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(courseForm),
      })
      const data = await res.json()
      if (res.ok) {
        toast.success('تم إنشاء الدورة بنجاح! 🎉')
        setCourses(prev => [data.course, ...prev])
        setCourseForm({ title: '', subject: '', grade: '', teacherId: '', description: '', price: 0 })
      } else toast.error(data.error || 'فشل الإنشاء')
    } finally { setSaving(false) }
  }

  const saveLesson = async () => {
    if (!lessonForm.courseId || !lessonForm.title) return toast.error('أكمل البيانات المطلوبة')
    if (lessonForm.videoSource === 'bunny' && !lessonForm.bunnyVideoId) return toast.error('أدخل معرف الفيديو من Bunny.net')
    setSaving(true)
    try {
      const token = await user!.getIdToken()
      const res = await fetch('/api/lessons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(lessonForm),
      })
      const data = await res.json()
      if (res.ok) {
        toast.success('تم إضافة الدرس بنجاح! 🎉')
        setLessonForm({ courseId: '', title: '', description: '', videoSource: 'bunny', bunnyVideoId: '', bunnyLibraryId: '', order: 1 })
      } else toast.error(data.error || 'فشل الإضافة')
    } finally { setSaving(false) }
  }

  if (loading) return <div className="min-h-screen hero-bg flex items-center justify-center"><div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"/></div>

  return (
    <DashboardLayout sidebarItems={SIDEBAR} role="editor" title="فريق التحرير">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-royal-950">فريق التحرير 🎬</h1>
        <p className="text-gray-500 mt-1">إضافة الدورات والدروس ورفع الفيديوهات</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-3 mb-6">
        <button onClick={() => setTab('course')} className={`px-5 py-2 rounded-xl font-bold text-sm transition-colors ${tab==='course'?'bg-royal-600 text-white':'bg-gray-100 text-gray-600'}`}>
          <FiPlus className="inline ml-1"/> دورة جديدة
        </button>
        <button onClick={() => setTab('lesson')} className={`px-5 py-2 rounded-xl font-bold text-sm transition-colors ${tab==='lesson'?'bg-royal-600 text-white':'bg-gray-100 text-gray-600'}`}>
          <FiVideo className="inline ml-1"/> درس جديد
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          {tab === 'course' ? (
            <>
              <h2 className="font-black text-royal-900 text-lg mb-4">إضافة دورة جديدة</h2>
              <div className="space-y-4">
                <input placeholder="عنوان الدورة *" value={courseForm.title} onChange={e=>setCourseForm({...courseForm,title:e.target.value})} className="input-field"/>
                <div className="grid grid-cols-2 gap-4">
                  <select value={courseForm.subject} onChange={e=>setCourseForm({...courseForm,subject:e.target.value})} className="input-field">
                    <option value="">-- المادة *</option>
                    {SUBJECTS.map(s=><option key={s}>{s}</option>)}
                  </select>
                  <select value={courseForm.grade} onChange={e=>setCourseForm({...courseForm,grade:e.target.value})} className="input-field">
                    <option value="">-- الصف *</option>
                    {GRADES.map(g=><option key={g}>{g}</option>)}
                  </select>
                </div>
                <select value={courseForm.teacherId} onChange={e=>setCourseForm({...courseForm,teacherId:e.target.value})} className="input-field">
                  <option value="">-- اختر المدرّس</option>
                  {teachers.map((t:any)=><option key={t._id} value={t._id}>{t.name}</option>)}
                </select>
                <textarea placeholder="وصف الدورة" value={courseForm.description} onChange={e=>setCourseForm({...courseForm,description:e.target.value})} className="input-field resize-none h-24"/>
                <input type="number" placeholder="السعر (ل.س) — 0 للمجاني" value={courseForm.price} onChange={e=>setCourseForm({...courseForm,price:+e.target.value})} className="input-field"/>
                <button onClick={saveCourse} disabled={saving} className="btn-primary w-full text-center disabled:opacity-60">
                  {saving ? 'جاري الحفظ...' : '💾 حفظ الدورة'}
                </button>
              </div>
            </>
          ) : (
            <>
              <h2 className="font-black text-royal-900 text-lg mb-4">إضافة درس جديد</h2>
              <div className="space-y-4">
                <select value={lessonForm.courseId} onChange={e=>setLessonForm({...lessonForm,courseId:e.target.value})} className="input-field">
                  <option value="">-- اختر الدورة *</option>
                  {courses.map((c:any)=><option key={c._id} value={c._id}>{c.title}</option>)}
                </select>
                <input placeholder="عنوان الدرس *" value={lessonForm.title} onChange={e=>setLessonForm({...lessonForm,title:e.target.value})} className="input-field"/>
                <textarea placeholder="وصف الدرس" value={lessonForm.description} onChange={e=>setLessonForm({...lessonForm,description:e.target.value})} className="input-field resize-none h-20"/>
                <input type="number" placeholder="ترتيب الدرس" value={lessonForm.order} onChange={e=>setLessonForm({...lessonForm,order:+e.target.value})} className="input-field" min={1}/>

                {/* Video Source */}
                <div>
                  <label className="text-sm font-bold text-gray-700 mb-2 block">مصدر الفيديو</label>
                  <div className="flex gap-3">
                    <button onClick={()=>setLessonForm({...lessonForm,videoSource:'bunny'})} className={`flex-1 py-2 rounded-xl font-bold text-sm border-2 transition-colors ${lessonForm.videoSource==='bunny'?'border-royal-500 bg-royal-50 text-royal-700':'border-gray-200 text-gray-500'}`}>
                      <FiLink className="inline ml-1"/> Bunny.net
                    </button>
                    <button onClick={()=>setLessonForm({...lessonForm,videoSource:'upload'})} className={`flex-1 py-2 rounded-xl font-bold text-sm border-2 transition-colors ${lessonForm.videoSource==='upload'?'border-royal-500 bg-royal-50 text-royal-700':'border-gray-200 text-gray-500'}`}>
                      <FiUpload className="inline ml-1"/> رفع مباشر
                    </button>
                  </div>
                </div>

                {lessonForm.videoSource === 'bunny' ? (
                  <div className="space-y-3 p-4 bg-blue-50 rounded-xl">
                    <p className="text-xs text-blue-600 font-bold">📌 أدخل معلومات الفيديو من Bunny.net</p>
                    <input placeholder="Library ID (من Bunny.net)" value={lessonForm.bunnyLibraryId} onChange={e=>setLessonForm({...lessonForm,bunnyLibraryId:e.target.value})} className="input-field"/>
                    <input placeholder="Video ID (من Bunny.net)" value={lessonForm.bunnyVideoId} onChange={e=>setLessonForm({...lessonForm,bunnyVideoId:e.target.value})} className="input-field"/>
                  </div>
                ) : (
                  <div className="p-4 bg-amber-50 rounded-xl">
                    <p className="text-xs text-amber-700 font-bold mb-2">📌 رابط الفيديو المرفوع</p>
                    <input placeholder="رابط الفيديو (MP4)" className="input-field"/>
                  </div>
                )}

                <button onClick={saveLesson} disabled={saving} className="btn-primary w-full text-center disabled:opacity-60">
                  {saving ? 'جاري الحفظ...' : '🎬 حفظ الدرس'}
                </button>
              </div>
            </>
          )}
        </div>

        {/* Recent Courses */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-black text-royal-900 text-lg mb-4">الدورات المضافة</h2>
          {courses.length === 0 ? (
            <div className="text-center py-10"><div className="text-4xl mb-2">📚</div><p className="text-gray-500">لا توجد دورات بعد</p></div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {courses.map((c:any)=>(
                <div key={c._id} className="flex items-center justify-between p-3 border border-gray-100 rounded-xl hover:border-royal-200 transition-colors">
                  <div>
                    <div className="font-bold text-royal-900 text-sm">{c.title}</div>
                    <div className="text-gray-500 text-xs mt-0.5">{c.subject} — {c.grade}</div>
                  </div>
                  <span className={`badge ${c.isActive?'bg-green-100 text-green-700':'bg-gray-100 text-gray-500'}`}>
                    {c.isActive?'نشطة':'معلّقة'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
