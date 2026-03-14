import User from '@/models/User';
import Transaction from '@/models/Transaction';

export async function requestRecharge(userId, amount, receiptUrl) {
  if (amount <= 0) {
    return { success: false, error: 'El monto debe ser mayor a 0' };
  }

  const transaction = await Transaction.create({
    userId,
    type: 'recharge',
    amount,
    description: `Recarga de $${amount.toLocaleString('es-CO')}`,
    receiptUrl,
    status: 'pending',
  });

  return { success: true, transaction };
}

export async function approveRecharge(transactionId) {
  const tx = await Transaction.findById(transactionId);
  if (!tx || tx.type !== 'recharge' || tx.status !== 'pending') {
    return { success: false, error: 'Transaccion no valida' };
  }

  tx.status = 'approved';
  await tx.save();

  await User.findByIdAndUpdate(tx.userId, {
    $inc: { balance: tx.amount },
  });

  return { success: true };
}

export async function rejectRecharge(transactionId) {
  const tx = await Transaction.findById(transactionId);
  if (!tx || tx.type !== 'recharge' || tx.status !== 'pending') {
    return { success: false, error: 'Transaccion no valida' };
  }

  tx.status = 'rejected';
  await tx.save();

  return { success: true };
}

export async function debitWallet(userId, amount, matchId, reservationId) {
  const user = await User.findById(userId);
  if (!user || user.balance < amount) {
    return { success: false, error: 'Saldo insuficiente' };
  }

  user.balance -= amount;
  await user.save();

  await Transaction.create({
    userId,
    type: 'debit',
    amount,
    matchId,
    reservationId,
    description: 'Pago de reserva con billetera',
    status: 'completed',
  });

  return { success: true, newBalance: user.balance };
}

export async function requestRefund(userId, amount, matchId, reservationId) {
  const tx = await Transaction.create({
    userId,
    type: 'refund_request',
    amount,
    matchId,
    reservationId,
    description: 'Solicitud de devolucion por cancelacion',
    status: 'pending',
  });

  return { success: true, transaction: tx };
}

export async function approveRefund(transactionId) {
  const tx = await Transaction.findById(transactionId);
  if (!tx || tx.type !== 'refund_request' || tx.status !== 'pending') {
    return { success: false, error: 'Transaccion no valida' };
  }

  tx.type = 'refund_approved';
  tx.status = 'approved';
  await tx.save();

  await User.findByIdAndUpdate(tx.userId, {
    $inc: { balance: tx.amount },
  });

  return { success: true };
}

export async function rejectRefund(transactionId) {
  const tx = await Transaction.findById(transactionId);
  if (!tx || tx.type !== 'refund_request' || tx.status !== 'pending') {
    return { success: false, error: 'Transaccion no valida' };
  }

  tx.type = 'refund_rejected';
  tx.status = 'rejected';
  await tx.save();

  return { success: true };
}
