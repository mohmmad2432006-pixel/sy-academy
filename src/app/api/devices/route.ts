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

// Student requests device unlock
export async function POST(req: NextRequest) {
  const decoded = await verifyToken(req)
  if (!decoded) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { db } = await connectDB()
    const user = await db.collection('users').findOne({ firebaseUid: decoded.uid })
    if (!user) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    const { reason } = await req.json()
    const now = new Date()

    // Create support ticket for device unlock
    await db.collection('tickets').insertOne({
      studentId: user._id.toString(),
      studentName: user.name,
      subject: 'طلب فك قيد الجهاز',
      description: reason || 'طلب فك قيد الأجهزة من الطالب',
      type: 'device_unlock',
      status: 'open',
      priority: 'high',
      messages: [{
        senderId: user._id.toString(),
        senderName: user.name,
        senderRole: 'student',
        message: reason || 'أطلب فك قيد الجهاز',
        sentAt: now,
      }],
      createdAt: now,
      updatedAt: now,
    })

    return NextResponse.json({ success: true, message: 'تم إرسال الطلب لفريق الدعم' })
  } catch (e: any) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

// Support unlocks a student's device
export async function DELETE(req: NextRequest) {
  const decoded = await verifyToken(req)
  if (!decoded) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { db } = await connectDB()
    const caller = await db.collection('users').findOne({ firebaseUid: decoded.uid })
    if (!caller || !['support', 'admin'].includes(caller.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { studentId } = await req.json()
    if (!studentId) return NextResponse.json({ error: 'studentId required' }, { status: 400 })

    await db.collection('users').updateOne(
      { _id: studentId } as any,
      { $set: { deviceFingerprints: [], currentDeviceId: null, deviceBlocked: false, updatedAt: new Date() } }
    )

    return NextResponse.json({ success: true, message: 'تم فك قيد الجهاز' })
  } catch (e: any) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
