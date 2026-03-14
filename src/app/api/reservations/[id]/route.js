import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import Reservation from '@/models/Reservation';
import Match from '@/models/Match';
import { cancelReservation } from '@/helpers/reservationLogic';
import { processQueue } from '@/helpers/queueLogic';
import { getMonthlyCancellations, isFrequentCanceller } from '@/helpers/cancellationLogic';
import { requestRefund } from '@/helpers/walletLogic';

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

  let cancelReason = null;
  let noRefund = false;
  try {
    const body = await request.json();
    cancelReason = body.cancelReason || null;
    noRefund = body.noRefund || false;
  } catch {}

  const reservation = await Reservation.findById(params.id);
  if (!reservation) {
    return NextResponse.json({ error: 'Reserva no encontrada' }, { status: 400 });
  }

  if (['cancelled', 'expired'].includes(reservation.status)) {
    return NextResponse.json({ error: 'Reserva ya cancelada' }, { status: 400 });
  }

  const wasConfirmed = reservation.status === 'confirmed';
  const shouldReleaseSlot = ['pending_payment', 'payment_uploaded'].includes(reservation.status);

  if (wasConfirmed && reservation.paidWithWallet && reservation.userId && !noRefund) {
    reservation.status = 'refund_requested';
    reservation.cancelReason = cancelReason;
    await reservation.save();

    const match = await Match.findById(reservation.matchId);
    await requestRefund(reservation.userId, match.pricePerSlot, reservation.matchId, reservation._id);
    return NextResponse.json({ message: 'Devolucion solicitada' });
  }

  reservation.status = 'cancelled';
  reservation.cancelReason = cancelReason;
  reservation.noRefund = noRefund;
  reservation.expiresAt = null;
  await reservation.save();

  if (shouldReleaseSlot || wasConfirmed) {
    await Match.findByIdAndUpdate(reservation.matchId, { $inc: { reservedSlots: -1 } });
    await processQueue(reservation.matchId);
  }

  return NextResponse.json({ message: 'Reserva cancelada' });
}
