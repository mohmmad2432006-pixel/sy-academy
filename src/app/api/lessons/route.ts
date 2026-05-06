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
    const courseId = url.searchParams.get('courseId')
    if (!courseId) return NextResponse.json({ error: 'courseId required' }, { status: 400 })

    const lessons = await db.collection('lessons').find({ courseId, isPublished: true }).sort({ order: 1 }).toArray()
    return NextResponse.json({ lessons })
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

    // Build video URL for Bunny
    let videoUrl = body.uploadedVideoUrl || ''
    if (body.videoSource === 'bunny' && body.bunnyLibraryId && body.bunnyVideoId) {
      videoUrl = `https://iframe.mediadelivery.net/embed/${body.bunnyLibraryId}/${body.bunnyVideoId}`
    }

    const lesson = {
      courseId: body.courseId,
      title: body.title,
      description: body.description || '',
      order: body.order || 1,
      videoSource: body.videoSource || 'bunny',
      bunnyVideoId: body.bunnyVideoId || '',
      bunnyLibraryId: body.bunnyLibraryId || '',
      uploadedVideoUrl: videoUrl,
      duration: 0,
      viewsCount: 0,
      isPublished: true,
      createdBy: user._id.toString(),
      createdAt: now,
      updatedAt: now,
    }

    const result = await db.collection('lessons').insertOne(lesson)
    // Update lessons count
    await db.collection('courses').updateOne({ _id: body.courseId } as any, { $inc: { lessonsCount: 1 } })

    return NextResponse.json({ lesson: { ...lesson, _id: result.insertedId } })
  } catch (e) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
