import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import Reservation from '@/models/Reservation';
import { getUserIdFromRequest } from '@/helpers/userAuth';

export async function GET(request) {
  await dbConnect();
  const userId = getUserIdFromRequest(request);
  if (!userId) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
  }

  const reservations = await Reservation.find({
    userId,
    status: { $nin: ['cancelled', 'expired'] },
  }).select('matchId status');

  return NextResponse.json(reservations);
}
