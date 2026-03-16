import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import { getMatch } from '@/helpers/matchLogic';
import Match from '@/models/Match';
import Reservation from '@/models/Reservation';
import QueueEntry from '@/models/QueueEntry';
import { isAdmin } from '@/helpers/auth';

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

export async function DELETE(request, { params }) {
  await dbConnect();
  if (!isAdmin(request)) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  await Reservation.deleteMany({ matchId: params.id });
  await QueueEntry.deleteMany({ matchId: params.id });
  await Match.findByIdAndDelete(params.id);

  return NextResponse.json({ message: 'Partido eliminado' });
}
