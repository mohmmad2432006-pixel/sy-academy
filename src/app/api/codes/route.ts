import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import ActivationCode from '@/models/ActivationCode';

function generateCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 12; i++) {
    if (i > 0 && i % 4 === 0) result += '-';
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const salesId = searchParams.get('salesId');
    const query = salesId ? { createdBy: salesId } : {};
    const codes = await ActivationCode.find(query).sort({ createdAt: -1 }).lean();
    return NextResponse.json({ codes });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { courseId, courseName, createdBy, price, count = 1 } = await req.json();
    const codes = [];
    for (let i = 0; i < Math.min(count, 50); i++) {
      const code = await ActivationCode.create({ code: generateCode(), courseId, courseName, createdBy, price });
      codes.push(code);
    }
    return NextResponse.json({ success: true, codes }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
