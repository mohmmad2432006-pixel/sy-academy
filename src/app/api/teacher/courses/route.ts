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
    if (!user || !['teacher', 'admin'].includes(user.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
    const filter = user.role === 'teacher' ? { teacherId: user._id.toString() } : {}
    const courses = await db.collection('courses').find(filter).sort({ createdAt: -1 }).toArray()
    return NextResponse.json({ courses })
  } catch (e) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
