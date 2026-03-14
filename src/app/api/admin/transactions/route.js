import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import Transaction from '@/models/Transaction';
import { isAdmin } from '@/helpers/auth';

export async function GET(request) {
  await dbConnect();
  if (!isAdmin(request)) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status') || 'pending';

  const transactions = await Transaction.find({ status })
    .populate('userId', 'name phone')
    .sort({ createdAt: -1 })
    .limit(100);

  return NextResponse.json(transactions);
}
