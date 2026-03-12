import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';
import dbConnect from '@/lib/mongoose';
import { uploadReceipt } from '@/helpers/reservationLogic';

export async function POST(request, { params }) {
  await dbConnect();

  const formData = await request.formData();
  const file = formData.get('receipt');

  if (!file) {
    return NextResponse.json({ error: 'No se envio archivo' }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const ext = file.name.split('.').pop();
  const filename = `${params.id}_${Date.now()}.${ext}`;
  const uploadPath = path.join(process.cwd(), 'public', 'uploads', filename);

  await writeFile(uploadPath, buffer);

  const receiptUrl = `/uploads/${filename}`;
  const result = await uploadReceipt(params.id, receiptUrl);

  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  return NextResponse.json(result.reservation);
}
