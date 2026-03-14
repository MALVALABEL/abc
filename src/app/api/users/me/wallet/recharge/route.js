import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import { getUserIdFromRequest } from '@/helpers/userAuth';
import { requestRecharge } from '@/helpers/walletLogic';
import { uploadToR2 } from '@/lib/r2';

export async function POST(request) {
  await dbConnect();
  const userId = getUserIdFromRequest(request);
  if (!userId) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
  }

  const formData = await request.formData();
  const amount = parseInt(formData.get('amount'), 10);
  const file = formData.get('receipt');

  if (!amount || amount <= 0) {
    return NextResponse.json({ error: 'Monto invalido' }, { status: 400 });
  }

  if (!file) {
    return NextResponse.json({ error: 'Debes adjuntar comprobante' }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const ext = file.name.split('.').pop();
  const filename = `recharges/${userId}_${Date.now()}.${ext}`;
  const receiptUrl = await uploadToR2(buffer, filename, file.type);

  const result = await requestRecharge(userId, amount, receiptUrl);

  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  return NextResponse.json(result.transaction, { status: 201 });
}
