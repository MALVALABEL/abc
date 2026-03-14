import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import { reserveSlot, reserveWithWallet, cleanupExpired } from '@/helpers/reservationLogic';
import { validateName, validatePhone } from '@/helpers/validators';
import { getUserIdFromRequest } from '@/helpers/userAuth';

export async function POST(request) {
  await dbConnect();
  await cleanupExpired();

  const { matchId, playerName, playerPhone, isGoalkeeper, payWithWallet } = await request.json();

  const nameErr = validateName(playerName);
  if (nameErr) return NextResponse.json({ error: nameErr }, { status: 400 });

  const phoneErr = validatePhone(playerPhone);
  if (phoneErr) return NextResponse.json({ error: phoneErr }, { status: 400 });

  const userId = getUserIdFromRequest(request);

  if (payWithWallet && userId) {
    const result = await reserveWithWallet(matchId, userId, playerName, playerPhone, isGoalkeeper || false);
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 409 });
    }
    return NextResponse.json(result.reservation, { status: 201 });
  }

  const result = await reserveSlot(matchId, playerName, playerPhone, isGoalkeeper || false, userId);

  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 409 });
  }

  return NextResponse.json(result.reservation, { status: 201 });
}
