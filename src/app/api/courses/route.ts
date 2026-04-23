import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Course from '@/models/Course';

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const level = searchParams.get('level');
    const search = searchParams.get('search');
    const free = searchParams.get('free');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');

    const query: Record<string, unknown> = { isPublished: true };
    if (category && category !== 'all') query.category = category;
    if (level) query.level = level;
    if (free === 'true') query.price = 0;
    if (search) query.$text = { $search: search };

    const skip = (page - 1) * limit;
    const [courses, total] = await Promise.all([
      Course.find(query).sort({ enrolled: -1, rating: -1 }).skip(skip).limit(limit).lean(),
      Course.countDocuments(query),
    ]);

    return NextResponse.json({
      courses,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error('Courses GET error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const course = await Course.create(body);
    return NextResponse.json({ success: true, course }, { status: 201 });
  } catch (error) {
    console.error('Course POST error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
