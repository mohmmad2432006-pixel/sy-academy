import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import { ObjectId } from 'mongodb'
import { initAdminApp } from '@/lib/firebase-admin'

initAdminApp()

export async function PATCH(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const { db } = await connectDB()
    const { userId } = params
    const body = await req.json()

    const update: any = { updatedAt: new Date() }
    if (body.role) update.role = body.role
    if (body.status) update.status = body.status
    if (body.deviceBlocked !== undefined) update.deviceBlocked = body.deviceBlocked

    let filter: any
    try {
      filter = { _id: new ObjectId(userId) }
    } catch {
      filter = { _id: userId }
    }

    await db.collection('users').updateOne(filter, { $set: update })
    return NextResponse.json({ success: true })
  } catch (e: any) {
    return NextResponse.json({ error: 'Server error: ' + e.message }, { status: 500 })
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const { db } = await connectDB()
    const { userId } = params
    let filter: any
    try {
      filter = { _id: new ObjectId(userId) }
    } catch {
      filter = { _id: userId }
    }
    // Soft delete
    await db.collection('users').updateOne(filter, { $set: { status: 'deleted', updatedAt: new Date() } })
    return NextResponse.json({ success: true })
  } catch (e: any) {
    return NextResponse.json({ error: 'Server error: ' + e.message }, { status: 500 })
  }
}
