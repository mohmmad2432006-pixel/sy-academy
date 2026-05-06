import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import { getAuth } from 'firebase-admin/auth'
import { initAdminApp } from '@/lib/firebase-admin'

initAdminApp()

function generateCode(length = 13) {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
}

async function verifyToken(req: NextRequest) {
  const auth = req.headers.get('Authorization')?.replace('Bearer ', '')
  if (!auth) return null
  try { return await getAuth().verifyIdToken(auth) } catch { return null }
}

export async function GET(req: NextRequest) {
  const decoded = await verifyToken(req)
  if (!decoded) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { db } = await connectDB()
    const url = new URL(req.url)
    const limit = parseInt(url.searchParams.get('limit') || '50')
    const status = url.searchParams.get('status')

    const user = await db.collection('users').findOne({ firebaseUid: decoded.uid })
    if (!user || !['sales', 'admin'].includes(user.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const filter: any = user.role === 'admin' ? {} : { createdBySalesId: user._id.toString() }
    if (status) filter.status = status

    const cards = await db.collection('cards').find(filter).sort({ createdAt: -1 }).limit(limit).toArray()
    return NextResponse.json({ cards })
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
    if (!user || !['sales', 'admin'].includes(user.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { courseId, count = 1, expiryDays = 365 } = await req.json()
    if (!courseId) return NextResponse.json({ error: 'courseId required' }, { status: 400 })

    const course = await db.collection('courses').findOne({ _id: courseId } as any)
    const courseName = course?.title || 'دورة'
    const expiresAt = new Date(Date.now() + expiryDays * 86400000)
    const now = new Date()

    const cards = Array.from({ length: Math.min(count, 100) }, () => ({
      code: generateCode(),
      courseId,
      courseName,
      createdBySalesId: user._id.toString(),
      status: 'unused',
      price: course?.price || 0,
      expiresAt,
      createdAt: now,
      updatedAt: now,
    }))

    await db.collection('cards').insertMany(cards)
    return NextResponse.json({ cards, message: `تم إنشاء ${cards.length} كود` })
  } catch (e) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
