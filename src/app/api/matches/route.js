import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import { createMatch, listMatches } from '@/helpers/matchLogic';

export async function GET() {
  await dbConnect();
  const matches = await listMatches();
  return NextResponse.json(matches);
}

export async function POST(request) {
  await dbConnect();
  try {
    const data = await request.json();
    const match = await createMatch(data);
    return NextResponse.json(match, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { error: err.message || 'Error al crear partido' },
      { status: 400 }
    );
  }
}
