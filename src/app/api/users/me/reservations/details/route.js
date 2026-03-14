import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import Reservation from '@/models/Reservation';
import Match from '@/models/Match';
import { getUserIdFromRequest } from '@/helpers/userAuth';
import { formatDate, formatTime } from '@/helpers/formatters';

export async function GET(request) {
  await dbConnect();
  const userId = getUserIdFromRequest(request);
  if (!userId) {
    return NextResponse.json([], { status: 200 });
  }

  const reservations = await Reservation.find({
    userId,
    status: { $nin: ['cancelled', 'expired'] },
  }).sort({ createdAt: -1 });

  const matchIds = [...new Set(reservations.map((r) => r.matchId))];
  const matches = await Match.find({ _id: { $in: matchIds } }).lean();
  const matchMap = {};
  matches.forEach((m) => { matchMap[m._id.toString()] = m; });

  const result = reservations.map((r) => {
    const m = matchMap[r.matchId.toString()];
    return {
      _id: r._id.toString(),
      matchId: r.matchId.toString(),
      status: r.status,
      isGoalkeeper: r.isGoalkeeper,
      paidWithWallet: r.paidWithWallet,
      matchTitle: m?.title || 'Partido',
      matchDate: m ? formatDate(m.date) : '',
      matchTime: m ? formatTime(m.time) : '',
      matchLocation: m?.location || '',
    };
  });

  return NextResponse.json(result);
}
