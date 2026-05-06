import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import { ObjectId } from 'mongodb'
import { initAdminApp } from '@/lib/firebase-admin'

initAdminApp()

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { db } = await connectDB()
    const { id } = params

    let filter: any
    try { filter = { _id: new ObjectId(id) } } catch { filter = { _id: id } }

    const course = await db.collection('courses').findOne(filter)
    if (!course) return NextResponse.json({ error: 'Course not found' }, { status: 404 })

    return NextResponse.json({ course })
  } catch (e: any) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { db } = await connectDB()
    const { id } = params
    const body = await req.json()

    let filter: any
    try { filter = { _id: new ObjectId(id) } } catch { filter = { _id: id } }

    await db.collection('courses').updateOne(filter, { $set: { ...body, updatedAt: new Date() } })
    return NextResponse.json({ success: true })
  } catch (e: any) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
