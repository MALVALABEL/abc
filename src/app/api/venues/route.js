import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import { listVenues, createVenue, seedDefaultVenues } from '@/helpers/venueLogic';

export async function GET() {
  await dbConnect();
  await seedDefaultVenues();
  const venues = await listVenues();
  return NextResponse.json(venues);
}

export async function POST(request) {
  await dbConnect();
  try {
    const data = await request.json();
    const venue = await createVenue(data);
    return NextResponse.json(venue, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { error: err.message || 'Error al crear cancha' },
      { status: 400 }
    );
  }
}
