import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import { cleanupExpired } from '@/helpers/reservationLogic';

export async function GET(request) {
  const authHeader = request.headers.get('authorization');
  const secret = request.nextUrl.searchParams.get('secret');
  const cronSecret = process.env.CRON_SECRET;

  const isAuthorized =
    authHeader === `Bearer ${cronSecret}` || secret === cronSecret;

  if (!isAuthorized) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  await dbConnect();
  const result = await cleanupExpired();
  return NextResponse.json(result);
}
