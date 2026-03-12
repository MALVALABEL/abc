import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import Reservation from '@/models/Reservation';

export async function GET(request, { params }) {
  await dbConnect();
  const reservations = await Reservation.find({ matchId: params.id })
    .sort({ createdAt: -1 });
  return NextResponse.json(reservations);
}
