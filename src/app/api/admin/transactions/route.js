import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import Transaction from '@/models/Transaction';
import Reservation from '@/models/Reservation';
import Match from '@/models/Match';
import { isAdmin } from '@/helpers/auth';

export async function GET(request) {
  await dbConnect();
  if (!isAdmin(request)) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status') || 'pending';

  const transactions = await Transaction.find({ status })
    .populate('userId', 'name phone')
    .sort({ createdAt: -1 })
    .limit(100)
    .lean();

  const enriched = await Promise.all(
    transactions.map(async (tx) => {
      const result = { ...tx, _id: tx._id.toString() };

      if (tx.userId) {
        result.userId = {
          ...tx.userId,
          _id: tx.userId._id.toString(),
        };
      }

      if (tx.matchId) {
        const match = await Match.findById(tx.matchId).lean();
        if (match) {
          result.matchTitle = match.title;
          result.matchDate = match.date;
          result.matchTime = match.time;
          const matchDateTime = new Date(match.date);
          const [h, m] = (match.time || '0:0').split(':');
          matchDateTime.setHours(parseInt(h), parseInt(m));
          const diff = matchDateTime - new Date();
          result.minutesUntilMatch = Math.max(0, Math.round(diff / 60000));
        }
      }

      if (tx.reservationId) {
        const res = await Reservation.findById(tx.reservationId).lean();
        if (res) {
          result.cancelReason = res.cancelReason;
        }
      }

      if (tx.userId?._id) {
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);
        const cancelCount = await Reservation.countDocuments({
          userId: tx.userId._id,
          status: 'cancelled',
          cancelReason: { $ne: null },
          updatedAt: { $gte: startOfMonth },
        });
        result.userCancelCount = cancelCount;
      }

      return result;
    })
  );

  return NextResponse.json(enriched);
}
