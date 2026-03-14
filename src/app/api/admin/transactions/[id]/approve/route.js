import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import { isAdmin } from '@/helpers/auth';
import { approveRecharge, approveRefund } from '@/helpers/walletLogic';
import Transaction from '@/models/Transaction';

export async function POST(request, { params }) {
  await dbConnect();
  if (!isAdmin(request)) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const tx = await Transaction.findById(params.id);
  if (!tx) {
    return NextResponse.json({ error: 'Transaccion no encontrada' }, { status: 404 });
  }

  let result;
  if (tx.type === 'recharge') {
    result = await approveRecharge(params.id);
  } else if (tx.type === 'refund_request') {
    result = await approveRefund(params.id);
  } else {
    return NextResponse.json({ error: 'Tipo de transaccion no valido' }, { status: 400 });
  }

  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}
