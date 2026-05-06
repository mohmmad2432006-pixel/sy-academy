import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import { getAuth } from 'firebase-admin/auth'
import { initAdminApp } from '@/lib/firebase-admin'

initAdminApp()

export async function GET(req: NextRequest) {
  const token = req.headers.get('Authorization')?.replace('Bearer ', '')
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const decoded = await getAuth().verifyIdToken(token)
    const { db } = await connectDB()
    const user = await db.collection('users').findOne({ firebaseUid: decoded.uid })
    if (!user) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    const enrollments = await db.collection('enrollments').find({
      studentId: user._id.toString(), status: 'active'
    }).toArray()

    // Enrich with course data
    const enriched = await Promise.all(enrollments.map(async (en) => {
      const course = await db.collection('courses').findOne({ _id: en.courseId } as any)
      return { ...en, courseTitle: course?.title || 'دورة', subject: course?.subject }
    }))

    return NextResponse.json({ enrollments: enriched })
  } catch (e) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
