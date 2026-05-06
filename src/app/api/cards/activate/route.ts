import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import { getAuth } from 'firebase-admin/auth'
import { initAdminApp } from '@/lib/firebase-admin'

initAdminApp()

async function verifyToken(req: NextRequest) {
  const auth = req.headers.get('Authorization')?.replace('Bearer ', '')
  if (!auth) return null
  try { return await getAuth().verifyIdToken(auth) } catch { return null }
}

export async function POST(req: NextRequest) {
  const decoded = await verifyToken(req)
  if (!decoded) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { db } = await connectDB()
    const { code } = await req.json()
    if (!code) return NextResponse.json({ error: 'الكود مطلوب' }, { status: 400 })

    const user = await db.collection('users').findOne({ firebaseUid: decoded.uid })
    if (!user) return NextResponse.json({ error: 'المستخدم غير موجود' }, { status: 404 })
    if (user.status !== 'active') return NextResponse.json({ error: 'الحساب غير مفعّل بعد' }, { status: 403 })

    const card = await db.collection('cards').findOne({ code: code.trim().toUpperCase() })
    if (!card) return NextResponse.json({ error: 'الكود غير صحيح' }, { status: 400 })
    if (card.status !== 'unused') return NextResponse.json({ error: 'الكود مستخدم أو منتهي الصلاحية' }, { status: 400 })
    if (card.expiresAt && new Date(card.expiresAt) < new Date()) {
      await db.collection('cards').updateOne({ _id: card._id }, { $set: { status: 'expired' } })
      return NextResponse.json({ error: 'انتهت صلاحية الكود' }, { status: 400 })
    }

    // Check if already enrolled
    const existing = await db.collection('enrollments').findOne({
      studentId: user._id.toString(), courseId: card.courseId
    })
    if (existing) return NextResponse.json({ error: 'أنت مسجّل في هذه الدورة بالفعل' }, { status: 400 })

    const now = new Date()
    const expiresAt = card.expiresAt ? new Date(card.expiresAt) : null

    // Create enrollment
    await db.collection('enrollments').insertOne({
      studentId: user._id.toString(),
      courseId: card.courseId,
      activatedByCardId: card._id.toString(),
      enrolledAt: now,
      expiresAt,
      status: 'active',
      progress: 0,
      createdAt: now,
      updatedAt: now,
    })

    // Mark card as used
    await db.collection('cards').updateOne({ _id: card._id }, {
      $set: { status: 'used', usedByStudentId: user._id.toString(), activatedAt: now, updatedAt: now }
    })

    // Increment students count
    await db.collection('courses').updateOne(
      { _id: card.courseId } as any,
      { $inc: { studentsCount: 1 } }
    )

    return NextResponse.json({ success: true, message: 'تم تفعيل الدورة بنجاح!' })
  } catch (e) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
