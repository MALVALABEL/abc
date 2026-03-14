import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import { isAdmin } from '@/helpers/auth';
import Transaction from '@/models/Transaction';
import User from '@/models/User';
import Reservation from '@/models/Reservation';
import Match from '@/models/Match';

export async function GET(request) {
  await dbConnect();
  if (!isAdmin(request)) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const [
    approvedRecharges,
    totalUsersWithBalance,
    usersBalanceAgg,
    totalUsers,
    confirmedRes,
    confirmedWallet,
    confirmedTransfer,
    pendingRecharges,
    pendingRefunds,
    activeMatches,
  ] = await Promise.all([
    Transaction.aggregate([
      { $match: { type: 'recharge', status: 'approved' } },
      { $group: { _id: null, total: { $sum: '$amount' }, count: { $sum: 1 } } },
    ]),
    User.countDocuments({ balance: { $gt: 0 } }),
    User.aggregate([
      { $match: { balance: { $gt: 0 } } },
      { $group: { _id: null, total: { $sum: '$balance' } } },
    ]),
    User.countDocuments(),
    Reservation.countDocuments({ status: 'confirmed' }),
    Reservation.countDocuments({ status: 'confirmed', paidWithWallet: true }),
    Reservation.countDocuments({ status: 'confirmed', paidWithWallet: { $ne: true } }),
    Transaction.aggregate([
      { $match: { type: 'recharge', status: 'pending' } },
      { $group: { _id: null, total: { $sum: '$amount' }, count: { $sum: 1 } } },
    ]),
    Transaction.aggregate([
      { $match: { type: 'refund_request', status: 'pending' } },
      { $group: { _id: null, total: { $sum: '$amount' }, count: { $sum: 1 } } },
    ]),
    Match.countDocuments({ status: 'open' }),
  ]);

  const walletDebits = await Transaction.aggregate([
    { $match: { type: 'debit', status: 'completed' } },
    { $group: { _id: null, total: { $sum: '$amount' }, count: { $sum: 1 } } },
  ]);

  const refundsApproved = await Transaction.aggregate([
    { $match: { type: 'refund_approved', status: 'approved' } },
    { $group: { _id: null, total: { $sum: '$amount' }, count: { $sum: 1 } } },
  ]);

  return NextResponse.json({
    ingresos: {
      recargas: approvedRecharges[0]?.total || 0,
      recargasCount: approvedRecharges[0]?.count || 0,
      transferencias: confirmedTransfer,
    },
    billeteras: {
      saldoTotal: usersBalanceAgg[0]?.total || 0,
      usuariosConSaldo: totalUsersWithBalance,
      debitosPorReserva: walletDebits[0]?.total || 0,
      debitosCount: walletDebits[0]?.count || 0,
    },
    devoluciones: {
      aprobadas: refundsApproved[0]?.total || 0,
      aprobadasCount: refundsApproved[0]?.count || 0,
      pendientes: pendingRefunds[0]?.total || 0,
      pendientesCount: pendingRefunds[0]?.count || 0,
    },
    pendientes: {
      recargasMonto: pendingRecharges[0]?.total || 0,
      recargasCount: pendingRecharges[0]?.count || 0,
    },
    general: {
      totalUsuarios: totalUsers,
      partidosActivos: activeMatches,
      reservasConfirmadas: confirmedRes,
      pagosBilletera: confirmedWallet,
      pagosTransferencia: confirmedTransfer,
    },
  });
}
