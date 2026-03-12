import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import { getMatch } from '@/helpers/matchLogic';
import Reservation from '@/models/Reservation';

export async function GET(request, { params }) {
  await dbConnect();
  const match = await getMatch(params.id);
  if (!match) {
    return NextResponse.json({ error: 'Partido no encontrado' }, { status: 404 });
  }

  const reservations = await Reservation.find({
    matchId: params.id,
    status: { $nin: ['cancelled', 'expired'] },
  }).select('playerName status createdAt');

  return NextResponse.json({ ...match.toJSON(), reservations });
}
