import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import { isAdmin } from '@/helpers/auth';
import Transaction from '@/models/Transaction';
import Reservation from '@/models/Reservation';
import Match from '@/models/Match';

export async function GET(request) {
  await dbConnect();
  if (!isAdmin(request)) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');

  if (type === 'recharges') {
    const txs = await Transaction.find({ type: 'recharge', status: 'approved' })
      .populate('userId', 'name phone')
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();
    return NextResponse.json(txs.map(serializeTx));
  }

  if (type === 'debits') {
    const txs = await Transaction.find({ type: 'debit', status: 'completed' })
      .populate('userId', 'name phone')
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();
    const enriched = await Promise.all(txs.map(async (tx) => {
      const s = serializeTx(tx);
      if (tx.matchId) {
        const m = await Match.findById(tx.matchId).select('title').lean();
        s.matchTitle = m?.title || '';
      }
      return s;
    }));
    return NextResponse.json(enriched);
  }

  if (type === 'refunds') {
    const txs = await Transaction.find({ type: { $in: ['refund_approved', 'refund_rejected'] } })
      .populate('userId', 'name phone')
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();
    const enriched = await Promise.all(txs.map(async (tx) => {
      const s = serializeTx(tx);
      if (tx.reservationId) {
        const r = await Reservation.findById(tx.reservationId).select('cancelReason').lean();
        s.cancelReason = r?.cancelReason || '';
      }
      if (tx.matchId) {
        const m = await Match.findById(tx.matchId).select('title').lean();
        s.matchTitle = m?.title || '';
      }
      return s;
    }));
    return NextResponse.json(enriched);
  }

  if (type === 'transfers') {
    const reservations = await Reservation.find({
      status: 'confirmed',
      paidWithWallet: { $ne: true },
      receiptUrl: { $ne: null },
    })
      .populate('matchId', 'title')
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();
    return NextResponse.json(reservations.map((r) => ({
      _id: r._id.toString(),
      playerName: r.playerName,
      playerPhone: r.playerPhone,
      matchTitle: r.matchId?.title || '',
      receiptUrl: r.receiptUrl,
      createdAt: r.createdAt,
    })));
  }

  return NextResponse.json([]);
}

function serializeTx(tx) {
  return {
    _id: tx._id.toString(),
    type: tx.type,
    amount: tx.amount,
    status: tx.status,
    description: tx.description,
    receiptUrl: tx.receiptUrl,
    createdAt: tx.createdAt,
    userName: tx.userId?.name || '',
    userPhone: tx.userId?.phone || '',
  };
}
