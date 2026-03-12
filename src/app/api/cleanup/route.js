import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import { cleanupExpired } from '@/helpers/reservationLogic';

export async function GET(request) {
  const secret = request.nextUrl.searchParams.get('secret');
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  await dbConnect();
  const result = await cleanupExpired();
  return NextResponse.json(result);
}
