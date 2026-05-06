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

export async function GET(req: NextRequest) {
  try {
    const { db } = await connectDB()
    const url = new URL(req.url)
    const subject = url.searchParams.get('subject')
    const grade = url.searchParams.get('grade')
    const teacherId = url.searchParams.get('teacherId')

    const filter: any = { isActive: true }
    if (subject) filter.subject = subject
    if (grade) filter.grade = grade
    if (teacherId) filter.teacherId = teacherId

    const courses = await db.collection('courses').find(filter).sort({ createdAt: -1 }).toArray()
    return NextResponse.json({ courses })
  } catch (e) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const decoded = await verifyToken(req)
  if (!decoded) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { db } = await connectDB()
    const user = await db.collection('users').findOne({ firebaseUid: decoded.uid })
    if (!user || !['editor', 'admin'].includes(user.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await req.json()
    const now = new Date()
    
    // Find teacher info
    let teacherName = 'غير محدد'
    if (body.teacherId) {
      const teacher = await db.collection('users').findOne({ _id: body.teacherId } as any)
      teacherName = teacher?.name || 'غير محدد'
    }

    const course = {
      title: body.title,
      subject: body.subject,
      grade: body.grade,
      teacherId: body.teacherId || '',
      teacherName,
      description: body.description || '',
      thumbnail: body.thumbnail || '',
      price: body.price || 0,
      isActive: true,
      lessonsCount: 0,
      studentsCount: 0,
      viewsCount: 0,
      createdBy: user._id.toString(),
      createdAt: now,
      updatedAt: now,
    }

    const result = await db.collection('courses').insertOne(course)
    return NextResponse.json({ course: { ...course, _id: result.insertedId } })
  } catch (e) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
