import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import { getUserIdFromRequest } from '@/helpers/userAuth';
import { requestRecharge } from '@/helpers/walletLogic';
import { uploadToR2 } from '@/lib/r2';

export async function POST(request) {
  try {
    await dbConnect();
    const userId = getUserIdFromRequest(request);
    if (!userId) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    const formData = await request.formData();
    const amountStr = formData.get('amount');
    const file = formData.get('receipt');

    const amount = parseInt(String(amountStr), 10);
    if (!amount || amount <= 0 || isNaN(amount)) {
      return NextResponse.json({ error: 'Monto invalido' }, { status: 400 });
    }

    if (!file || typeof file === 'string') {
      return NextResponse.json({ error: 'Debes adjuntar comprobante' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const ext = file.name.split('.').pop();
    const filename = `recharges/${userId}_${Date.now()}.${ext}`;

    let receiptUrl;
    try {
      receiptUrl = await uploadToR2(buffer, filename, file.type);
    } catch (uploadErr) {
      console.error('R2 upload error:', uploadErr);
      return NextResponse.json({ error: 'Error al subir imagen: ' + uploadErr.message }, { status: 500 });
    }

    const result = await requestRecharge(userId, amount, receiptUrl);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json(result.transaction, { status: 201 });
  } catch (err) {
    console.error('Recharge error:', err);
    return NextResponse.json({ error: 'Error interno: ' + err.message }, { status: 500 });
  }
}
