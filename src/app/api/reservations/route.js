import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import { reserveSlot, cleanupExpired } from '@/helpers/reservationLogic';
import { validateName, validatePhone } from '@/helpers/validators';

export async function POST(request) {
  await dbConnect();

  // Limpiar expiradas antes de reservar
  await cleanupExpired();

  const { matchId, playerName, playerPhone } = await request.json();

  const nameErr = validateName(playerName);
  if (nameErr) return NextResponse.json({ error: nameErr }, { status: 400 });

  const phoneErr = validatePhone(playerPhone);
  if (phoneErr) return NextResponse.json({ error: phoneErr }, { status: 400 });

  const result = await reserveSlot(matchId, playerName, playerPhone);

  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 409 });
  }

  return NextResponse.json(result.reservation, { status: 201 });
}
