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

  const { preferredDays, preferredTime, isGoalkeeper } = await request.json();

  const update = {};
  if (preferredDays) update.preferredDays = preferredDays;
  if (preferredTime !== undefined) update.preferredTime = preferredTime;
  if (isGoalkeeper !== undefined) update.isGoalkeeper = isGoalkeeper;

  const user = await User.findByIdAndUpdate(userId, update, { new: true }).select('-password');

  return NextResponse.json(user);
}
