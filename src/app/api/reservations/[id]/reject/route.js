import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import { rejectReservation } from '@/helpers/reservationLogic';
import { processQueue } from '@/helpers/queueLogic';

export async function POST(request, { params }) {
  await dbConnect();
  const result = await rejectReservation(params.id);
  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  if (result.matchId) {
    await processQueue(result.matchId);
  }

  return NextResponse.json({ message: 'Reserva rechazada' });
}
