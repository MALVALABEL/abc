import Match from '@/models/Match';
import Reservation from '@/models/Reservation';

const RESERVATION_TTL_MS = 10 * 60 * 1000;

export async function reserveSlot(matchId, playerName, playerPhone) {
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
    return { success: false, error: 'No hay cupos disponibles' };
  }

  const reservation = await Reservation.create({
    matchId,
    playerName: playerName.trim(),
    playerPhone: playerPhone.trim(),
    status: 'pending_payment',
    expiresAt: new Date(Date.now() + RESERVATION_TTL_MS),
  });

  return { success: true, reservation };
}

export async function cancelReservation(reservationId) {
  const reservation = await Reservation.findById(reservationId);
  if (!reservation) return { success: false, error: 'Reserva no encontrada' };

  if (['cancelled', 'expired'].includes(reservation.status)) {
    return { success: false, error: 'Reserva ya fue cancelada o expirada' };
  }

  const shouldReleaseSlot = ['pending_payment', 'payment_uploaded'].includes(
    reservation.status
  );

  reservation.status = 'cancelled';
  reservation.expiresAt = null;
  await reservation.save();

  if (shouldReleaseSlot) {
    await Match.findByIdAndUpdate(reservation.matchId, {
      $inc: { reservedSlots: -1 },
    });
  }

  return { success: true };
}

export async function cleanupExpired() {
  const expired = await Reservation.find({
    status: 'pending_payment',
    expiresAt: { $lte: new Date() },
  });

  let cleaned = 0;

  for (const res of expired) {
    res.status = 'expired';
    res.expiresAt = null;
    await res.save();

    await Match.findByIdAndUpdate(res.matchId, {
      $inc: { reservedSlots: -1 },
    });
    cleaned++;
  }

  return { cleaned };
}

export async function uploadReceipt(reservationId, receiptUrl) {
  const reservation = await Reservation.findById(reservationId);
  if (!reservation) return { success: false, error: 'Reserva no encontrada' };

  if (reservation.status !== 'pending_payment') {
    return { success: false, error: 'Reserva no esta pendiente de pago' };
  }

  reservation.status = 'payment_uploaded';
  reservation.receiptUrl = receiptUrl;
  reservation.expiresAt = null;
  await reservation.save();

  return { success: true, reservation };
}

export async function approveReservation(reservationId) {
  const reservation = await Reservation.findByIdAndUpdate(
    reservationId,
    { status: 'confirmed' },
    { new: true }
  );
  return reservation
    ? { success: true, reservation }
    : { success: false, error: 'Reserva no encontrada' };
}

export async function rejectReservation(reservationId) {
  const reservation = await Reservation.findById(reservationId);
  if (!reservation) return { success: false, error: 'Reserva no encontrada' };

  reservation.status = 'rejected';
  await reservation.save();

  await Match.findByIdAndUpdate(reservation.matchId, {
    $inc: { reservedSlots: -1 },
  });

  return { success: true };
}
