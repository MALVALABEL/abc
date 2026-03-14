import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import { cleanupExpired } from '@/helpers/reservationLogic';
import { processQueue } from '@/helpers/queueLogic';

export async function GET(request) {
  const authHeader = request.headers.get('authorization');
  const secret = request.nextUrl.searchParams.get('secret');
  const cronSecret = (process.env.CRON_SECRET || '').trim();

  const isAuthorized =
    authHeader === `Bearer ${cronSecret}` || secret === cronSecret;

  if (!isAuthorized) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  try {
    await dbConnect();
    const result = await cleanupExpired();

    for (const matchId of result.affectedMatches) {
      await processQueue(matchId);
    }

    return NextResponse.json(result);
  } catch (err) {
    console.error('Cleanup error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
