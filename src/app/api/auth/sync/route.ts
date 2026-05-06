import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import { getAuth } from 'firebase-admin/auth'
import { initAdminApp } from '@/lib/firebase-admin'

initAdminApp()

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('Authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'No token' }, { status: 401 })
    }

    const token = authHeader.replace('Bearer ', '')
    let decoded
    try {
      decoded = await getAuth().verifyIdToken(token)
    } catch (e) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const body = await req.json()
    const { name, email, photoURL, fingerprint } = body
    const { db } = await connectDB()

    let user = await db.collection('users').findOne({ firebaseUid: decoded.uid })

    if (!user) {
      const now = new Date()
      const newUser = {
        firebaseUid: decoded.uid,
        name: name || decoded.name || 'مستخدم',
        email: email || decoded.email || '',
        photoURL: photoURL || decoded.picture || '',
        role: 'student',
        status: 'active',
        deviceFingerprints: fingerprint ? [fingerprint] : [],
        currentDeviceId: fingerprint || null,
        deviceBlocked: false,
        createdAt: now,
        updatedAt: now,
      }
      const result = await db.collection('users').insertOne(newUser)
      user = { ...newUser, _id: result.insertedId }
    } else {
      const updates: any = { updatedAt: new Date() }
      if (fingerprint) {
        updates.currentDeviceId = fingerprint
        const fps = user.deviceFingerprints || []
        if (!fps.includes(fingerprint)) {
          const limit = user.role === 'student' ? 1 : 2
          if (fps.length < limit) {
            await db.collection('users').updateOne(
              { _id: user._id },
              { $addToSet: { deviceFingerprints: fingerprint }, $set: { ...updates, deviceBlocked: false } }
            )
          } else {
            updates.deviceBlocked = true
          }
        }
      }
      await db.collection('users').updateOne({ _id: user._id }, { $set: updates })
      user = await db.collection('users').findOne({ _id: user._id })
    }

    const { deviceFingerprints: _, ...safeUser } = user as any
    return NextResponse.json({ user: safeUser })
  } catch (e: any) {
    console.error('Sync error:', e)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
