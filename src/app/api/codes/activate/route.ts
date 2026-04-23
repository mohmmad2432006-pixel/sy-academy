import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import ActivationCode from '@/models/ActivationCode';
import User from '@/models/User';
import Course from '@/models/Course';

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { code, userId } = await req.json();
    if (!code || !userId) return NextResponse.json({ error: 'بيانات ناقصة' }, { status: 400 });

    const activation = await ActivationCode.findOne({ code: code.toUpperCase().trim(), isUsed: false });
    if (!activation) return NextResponse.json({ error: 'الكود غير صحيح أو مستخدم مسبقاً' }, { status: 400 });

    const user = await User.findOne({ uid: userId });
    if (!user) return NextResponse.json({ error: 'المستخدم غير موجود' }, { status: 404 });
    if (user.enrolledCourses.includes(activation.courseId)) {
      return NextResponse.json({ error: 'أنت مسجّل في هذه الدورة مسبقاً' }, { status: 400 });
    }

    await ActivationCode.findByIdAndUpdate(activation._id, { isUsed: true, usedBy: userId, usedAt: new Date() });
    await User.findOneAndUpdate({ uid: userId }, { $addToSet: { enrolledCourses: activation.courseId } });
    await Course.findByIdAndUpdate(activation.courseId, { $inc: { enrolled: 1 } });

    return NextResponse.json({ success: true, courseId: activation.courseId, courseName: activation.courseName });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
