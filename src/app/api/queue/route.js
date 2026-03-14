import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import { joinQueue, getQueueForMatch, getQueueCount } from '@/helpers/queueLogic';
import { getUserIdFromRequest } from '@/helpers/userAuth';
import { validateName, validatePhone } from '@/helpers/validators';

export async function GET(request) {
  await dbConnect();
  const { searchParams } = new URL(request.url);
  const matchId = searchParams.get('matchId');

  if (!matchId) {
    return NextResponse.json({ error: 'matchId requerido' }, { status: 400 });
  }

  const queue = await getQueueForMatch(matchId);
  const count = await getQueueCount(matchId);

  return NextResponse.json({ queue, count });
}

export async function POST(request) {
  await dbConnect();
  const { matchId, playerName, playerPhone, isGoalkeeper } = await request.json();

  const nameErr = validateName(playerName);
  if (nameErr) return NextResponse.json({ error: nameErr }, { status: 400 });

  const phoneErr = validatePhone(playerPhone);
  if (phoneErr) return NextResponse.json({ error: phoneErr }, { status: 400 });

  const userId = getUserIdFromRequest(request);

  const result = await joinQueue(matchId, playerName, playerPhone, isGoalkeeper || false, userId);

  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 409 });
  }

  return NextResponse.json(result.entry, { status: 201 });
}
