import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import Reservation from '@/models/Reservation';
import { cancelReservation } from '@/helpers/reservationLogic';

export async function GET(request, { params }) {
  await dbConnect();
  const reservation = await Reservation.findById(params.id);
  if (!reservation) {
    return NextResponse.json({ error: 'Reserva no encontrada' }, { status: 404 });
  }
  return NextResponse.json(reservation);
}

export async function DELETE(request, { params }) {
  await dbConnect();
  const result = await cancelReservation(params.id);
  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }
  return NextResponse.json({ message: 'Reserva cancelada' });
}
