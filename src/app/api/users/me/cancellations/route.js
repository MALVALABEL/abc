import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import { getUserIdFromRequest } from '@/helpers/userAuth';
import { getMonthlyCancellations, CANCEL_THRESHOLD } from '@/helpers/cancellationLogic';

export async function GET(request) {
  await dbConnect();
  const userId = getUserIdFromRequest(request);
  if (!userId) {
    return NextResponse.json({ count: 0, threshold: CANCEL_THRESHOLD });
  }

  const count = await getMonthlyCancellations(userId);

  return NextResponse.json({
    count,
    threshold: CANCEL_THRESHOLD,
    isFrequent: count >= CANCEL_THRESHOLD,
  });
}
