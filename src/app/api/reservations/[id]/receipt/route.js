import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import { uploadReceipt } from '@/helpers/reservationLogic';
import { uploadToR2 } from '@/lib/r2';

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
  const filename = `receipts/${params.id}_${Date.now()}.${ext}`;

  const receiptUrl = await uploadToR2(buffer, filename, file.type);
  const result = await uploadReceipt(params.id, receiptUrl);

  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  return NextResponse.json(result.reservation);
}
