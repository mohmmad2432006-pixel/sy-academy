import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import { ObjectId } from 'mongodb'
import { getAuth } from 'firebase-admin/auth'
import { initAdminApp } from '@/lib/firebase-admin'

initAdminApp()

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const token = req.headers.get('Authorization')?.replace('Bearer ', '')
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    await getAuth().verifyIdToken(token)
    const { db } = await connectDB()
    const { id } = params

    let filter: any
    try { filter = { _id: new ObjectId(id) } } catch { filter = { _id: id } }

    await db.collection('tickets').updateOne(filter, {
      $set: { status: 'closed', closedAt: new Date(), updatedAt: new Date() }
    })

    return NextResponse.json({ success: true })
  } catch (e: any) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
