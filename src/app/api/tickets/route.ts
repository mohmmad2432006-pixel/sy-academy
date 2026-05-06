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
  const decoded = await verifyToken(req)
  if (!decoded) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { db } = await connectDB()
    const user = await db.collection('users').findOne({ firebaseUid: decoded.uid })
    if (!user) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    const url = new URL(req.url)
    const status = url.searchParams.get('status')

    let filter: any = {}
    if (user.role === 'student') {
      filter.studentId = user._id.toString()
    } else if (!['support', 'admin'].includes(user.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
    if (status && status !== 'all') filter.status = status

    const tickets = await db.collection('tickets').find(filter).sort({ createdAt: -1 }).toArray()
    return NextResponse.json({ tickets })
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
    if (!user || user.role !== 'student') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const { subject, description, priority = 'medium' } = await req.json()
    const now = new Date()

    const ticket = {
      studentId: user._id.toString(),
      studentName: user.name,
      subject,
      description,
      status: 'open',
      priority,
      messages: [{ senderId: user._id.toString(), senderName: user.name, message: description, sentAt: now }],
      createdAt: now,
      updatedAt: now,
    }

    const result = await db.collection('tickets').insertOne(ticket)
    return NextResponse.json({ ticket: { ...ticket, _id: result.insertedId } })
  } catch (e) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
