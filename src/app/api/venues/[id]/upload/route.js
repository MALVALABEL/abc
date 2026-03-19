import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import { updateVenue } from '@/helpers/venueLogic';
import { uploadToR2 } from '@/lib/r2';

export async function POST(request, { params }) {
  await dbConnect();
  try {
    const formData = await request.formData();
    const file = formData.get('image');
    if (!file) {
      return NextResponse.json({ error: 'No se envio imagen' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const ext = file.name.split('.').pop();
    const filename = `venues/${params.id}_${Date.now()}.${ext}`;
    const imageUrl = await uploadToR2(buffer, filename, file.type);

    const venue = await updateVenue(params.id, { imageUrl });
    return NextResponse.json(venue);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
