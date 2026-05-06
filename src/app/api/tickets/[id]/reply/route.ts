import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import { ObjectId } from 'mongodb'
import { getAuth } from 'firebase-admin/auth'
import { initAdminApp } from '@/lib/firebase-admin'

initAdminApp()

async function verifyToken(req: NextRequest) {
  const auth = req.headers.get('Authorization')?.replace('Bearer ', '')
  if (!auth) return null
  try { return await getAuth().verifyIdToken(auth) } catch { return null }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const decoded = await verifyToken(req)
  if (!decoded) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { db } = await connectDB()
    const user = await db.collection('users').findOne({ firebaseUid: decoded.uid })
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    const { message } = await req.json()
    if (!message?.trim()) return NextResponse.json({ error: 'Message required' }, { status: 400 })

    const { id } = params
    let filter: any
    try { filter = { _id: new ObjectId(id) } } catch { filter = { _id: id } }

    const newMsg = {
      senderId: user._id.toString(),
      senderName: user.name,
      senderRole: user.role,
      message: message.trim(),
      sentAt: new Date(),
    }

    await db.collection('tickets').updateOne(filter, {
      $push: { messages: newMsg } as any,
      $set: { status: 'in_progress', updatedAt: new Date() }
    })

    const ticket = await db.collection('tickets').findOne(filter)
    return NextResponse.json({ ticket })
  } catch (e: any) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
