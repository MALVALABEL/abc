import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import { isAdmin } from '@/helpers/auth';
import Match from '@/models/Match';
import Reservation from '@/models/Reservation';

export async function POST(request) {
  await dbConnect();
  if (!isAdmin(request)) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const { matchId, playerName, playerPhone, isGoalkeeper, isBlocked } = await request.json();

  const match = await Match.findOneAndUpdate(
    {
      _id: matchId,
      status: 'open',
      $expr: { $lt: ['$reservedSlots', '$maxSlots'] },
    },
    { $inc: { reservedSlots: 1 } },
    { new: true }
  );

  if (!match) {
    return NextResponse.json({ error: 'No hay cupos disponibles' }, { status: 409 });
  }

  const reservation = await Reservation.create({
    matchId,
    playerName: isBlocked ? (playerName || 'Cupo bloqueado') : playerName.trim(),
    playerPhone: isBlocked ? '0000000000' : playerPhone.trim(),
    isGoalkeeper: isGoalkeeper || false,
    status: 'confirmed',
    paidWithWallet: false,
  });

  return NextResponse.json(reservation, { status: 201 });
}
