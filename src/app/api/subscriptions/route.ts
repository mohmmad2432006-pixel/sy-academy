import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Subscription from '@/models/Subscription';

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const salesId = searchParams.get('salesId');
    const studentId = searchParams.get('studentId');
    const query: Record<string, string> = {};
    if (salesId) query.salesId = salesId;
    if (studentId) query.studentId = studentId;
    const subs = await Subscription.find(query).sort({ createdAt: -1 }).lean();
    return NextResponse.json({ subscriptions: subs });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const { totalPrice, totalMonths } = body;
    const monthlyAmount = Math.ceil(totalPrice / totalMonths);
    const sub = await Subscription.create({ ...body, monthlyAmount, paidMonths: 0, status: 'active' });
    return NextResponse.json({ success: true, subscription: sub }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    await connectDB();
    const { id, action } = await req.json();
    if (action === 'pay') {
      const sub = await Subscription.findById(id);
      if (!sub) return NextResponse.json({ error: 'Not found' }, { status: 404 });
      const newPaid = sub.paidMonths + 1;
      const status = newPaid >= sub.totalMonths ? 'completed' : 'active';
      const payment = { month: newPaid, amount: sub.monthlyAmount, paidAt: new Date() };
      await Subscription.findByIdAndUpdate(id, { paidMonths: newPaid, status, $push: { payments: payment } });
      return NextResponse.json({ success: true });
    }
    return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
