import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { uid, email, displayName, photoURL } = await req.json();
    if (!uid || !email) return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    const user = await User.findOneAndUpdate(
      { uid },
      { $setOnInsert: { uid, email, displayName, photoURL, role: 'student', enrolledCourses: [], completedCourses: [], teachingCourses: [], childrenIds: [], isActive: true } },
      { upsert: true, new: true }
    );
    return NextResponse.json({ success: true, user });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    await connectDB();
    const { parentUid, childEmail } = await req.json();
    if (!parentUid || !childEmail) return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    const child = await User.findOne({ email: childEmail.toLowerCase() });
    if (!child) return NextResponse.json({ error: 'لم يتم العثور على الطالب' }, { status: 404 });
    await User.findOneAndUpdate({ uid: child.uid }, { parentId: parentUid });
    await User.findOneAndUpdate({ uid: parentUid }, { $addToSet: { childrenIds: child.uid } });
    return NextResponse.json({ success: true, child: { displayName: child.displayName, email: child.email } });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
