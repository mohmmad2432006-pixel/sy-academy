import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import { getAuth } from 'firebase-admin/auth'
import { initAdminApp } from '@/lib/firebase-admin'

initAdminApp()

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('Authorization')
    let isAdmin = false

    if (authHeader?.startsWith('Bearer ')) {
      try {
        const decoded = await getAuth().verifyIdToken(authHeader.replace('Bearer ', ''))
        const { db } = await connectDB()
        const caller = await db.collection('users').findOne({ firebaseUid: decoded.uid })
        isAdmin = caller?.role === 'admin'
      } catch {}
    }

    const { db } = await connectDB()

    const url = new URL(req.url)
    const role = url.searchParams.get('role')
    const status = url.searchParams.get('status')
    const filter: any = {}
    if (role) filter.role = role
    if (status) filter.status = status

    const users = await db.collection('users').find(filter, {
      projection: { firebaseUid: 0, deviceFingerprints: 0 }
    }).sort({ createdAt: -1 }).toArray()

    const [total, students, courses, tickets] = await Promise.all([
      db.collection('users').countDocuments(),
      db.collection('users').countDocuments({ role: 'student' }),
      db.collection('courses').countDocuments(),
      db.collection('tickets').countDocuments({ status: 'open' }),
    ])

    return NextResponse.json({
      users,
      stats: { users: total, students, courses, tickets }
    })
  } catch (e: any) {
    return NextResponse.json({ error: 'Server error: ' + e.message }, { status: 500 })
  }
}
