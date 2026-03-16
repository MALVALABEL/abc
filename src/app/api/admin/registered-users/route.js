import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import User from '@/models/User';
import Reservation from '@/models/Reservation';
import { isAdmin } from '@/helpers/auth';

export async function GET(request) {
  await dbConnect();
  if (!isAdmin(request)) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
  }

  const users = await User.find()
    .select('-password')
    .sort({ createdAt: -1 })
    .lean();

  const userIds = users.map((u) => u._id);

  const [confirmed, cancelled] = await Promise.all([
    Reservation.aggregate([
      { $match: { userId: { $in: userIds }, status: 'confirmed' } },
      { $group: { _id: '$userId', count: { $sum: 1 } } },
    ]),
    Reservation.aggregate([
      { $match: { userId: { $in: userIds }, status: 'cancelled' } },
      { $group: { _id: '$userId', count: { $sum: 1 } } },
    ]),
  ]);

  const confirmedMap = Object.fromEntries(
    confirmed.map((r) => [r._id.toString(), r.count])
  );
  const cancelledMap = Object.fromEntries(
    cancelled.map((r) => [r._id.toString(), r.count])
  );

  const result = users.map((u) => ({
    ...u,
    partidosJugados: confirmedMap[u._id.toString()] || 0,
    cancelaciones: cancelledMap[u._id.toString()] || 0,
  }));

  return NextResponse.json(result);
}
