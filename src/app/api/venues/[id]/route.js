import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import { getVenue, updateVenue, deleteVenue } from '@/helpers/venueLogic';

export async function GET(request, { params }) {
  await dbConnect();
  const venue = await getVenue(params.id);
  if (!venue) return NextResponse.json({ error: 'No encontrada' }, { status: 404 });
  return NextResponse.json(venue);
}

export async function PUT(request, { params }) {
  await dbConnect();
  try {
    const data = await request.json();
    const venue = await updateVenue(params.id, data);
    if (!venue) return NextResponse.json({ error: 'No encontrada' }, { status: 404 });
    return NextResponse.json(venue);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

export async function DELETE(request, { params }) {
  await dbConnect();
  await deleteVenue(params.id);
  return NextResponse.json({ ok: true });
}
