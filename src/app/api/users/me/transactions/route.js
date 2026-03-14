import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import Transaction from '@/models/Transaction';
import { getUserIdFromRequest } from '@/helpers/userAuth';

export async function GET(request) {
  await dbConnect();
  const userId = getUserIdFromRequest(request);
  if (!userId) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
  }

  const transactions = await Transaction.find({ userId })
    .sort({ createdAt: -1 })
    .limit(50);

  return NextResponse.json(transactions);
}
