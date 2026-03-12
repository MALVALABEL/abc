import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import { approveReservation } from '@/helpers/reservationLogic';

export async function POST(request, { params }) {
  await dbConnect();
  const result = await approveReservation(params.id);
  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }
  return NextResponse.json(result.reservation);
}
