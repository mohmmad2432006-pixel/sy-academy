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
    if (!user || !['admin', 'support', 'sales', 'editor'].includes(user.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const url = new URL(req.url)
    const role = url.searchParams.get('role')
    const status = url.searchParams.get('status')

    const filter: any = {}
    if (role) filter.role = role
    if (status) filter.status = status

    const users = await db.collection('users').find(filter, {
      projection: { firebaseUid: 0, deviceFingerprints: 0 }
    }).sort({ createdAt: -1 }).toArray()

    return NextResponse.json({ users })
  } catch (e) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  const decoded = await verifyToken(req)
  if (!decoded) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { db } = await connectDB()
    const admin = await db.collection('users').findOne({ firebaseUid: decoded.uid })
    if (!admin || admin.role !== 'admin') return NextResponse.json({ error: 'Admin only' }, { status: 403 })

    const { userId, role, status } = await req.json()
    if (!userId) return NextResponse.json({ error: 'userId required' }, { status: 400 })

    const update: any = { updatedAt: new Date() }
    if (role) update.role = role
    if (status) update.status = status

    await db.collection('users').updateOne({ _id: userId } as any, { $set: update })
    return NextResponse.json({ success: true })
  } catch (e) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
