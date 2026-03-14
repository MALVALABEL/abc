import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import User from '@/models/User';
import { getUserIdFromRequest } from '@/helpers/userAuth';

export async function GET(request) {
  await dbConnect();
  const userId = getUserIdFromRequest(request);
  if (!userId) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
  }

  const user = await User.findById(userId).select('-password');
  if (!user) {
    return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
  }

  return NextResponse.json(user);
}

export async function PUT(request) {
  await dbConnect();
  const userId = getUserIdFromRequest(request);
  if (!userId) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
  }

  const data = await request.json();
  const update = {};

  if (data.preferredDays) update.preferredDays = data.preferredDays;
  if (data.anyTime !== undefined) update.anyTime = data.anyTime;
  if (data.preferredTimeFrom !== undefined) update.preferredTimeFrom = data.preferredTimeFrom;
  if (data.preferredTimeTo !== undefined) update.preferredTimeTo = data.preferredTimeTo;
  if (data.isGoalkeeper !== undefined) update.isGoalkeeper = data.isGoalkeeper;

  const user = await User.findByIdAndUpdate(userId, update, { new: true }).select('-password');

  return NextResponse.json(user);
}
