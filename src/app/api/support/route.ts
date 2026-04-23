import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import SupportTicket from '@/models/SupportTicket';

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const userId = searchParams.get('userId');
    const query: Record<string, string> = {};
    if (status) query.status = status;
    if (userId) query.userId = userId;
    const tickets = await SupportTicket.find(query).sort({ createdAt: -1 }).lean();
    return NextResponse.json({ tickets });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const ticket = await SupportTicket.create(body);
    return NextResponse.json({ success: true, ticket }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    await connectDB();
    const { id, status, response, assignedTo } = await req.json();
    const update: Record<string, string> = {};
    if (status) update.status = status;
    if (response) update.response = response;
    if (assignedTo) update.assignedTo = assignedTo;
    const ticket = await SupportTicket.findByIdAndUpdate(id, update, { new: true });
    return NextResponse.json({ success: true, ticket });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
