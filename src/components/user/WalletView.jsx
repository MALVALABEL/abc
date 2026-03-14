'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import RechargeForm from './RechargeForm';
import TransactionList from './TransactionList';
import { getTransactions } from '@/services/walletService';

export default function WalletView({ user, onRecharge }) {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showRecharge, setShowRecharge] = useState(false);

  useEffect(() => {
    getTransactions()
      .then(setTransactions)
      .finally(() => setLoading(false));
  }, []);

  const handleRechargeComplete = () => {
    setShowRecharge(false);
    onRecharge();
    getTransactions().then(setTransactions);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-brand-600">Billetera</h2>
        <Link href="/cuenta" className="text-sm text-brand-500 hover:underline">Volver</Link>
      </div>

      <div className="gradient-brand text-white rounded-2xl p-6 space-y-2">
        <p className="text-sm text-white/60">Saldo disponible</p>
        <p className="text-3xl font-bold">${user.balance?.toLocaleString('es-CO')}</p>
        <button
          onClick={() => setShowRecharge(!showRecharge)}
          className="mt-3 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl text-sm font-medium transition-colors"
        >
          {showRecharge ? 'Cancelar' : 'Recargar saldo'}
        </button>
      </div>

      {showRecharge && <RechargeForm onComplete={handleRechargeComplete} />}

      <TransactionList transactions={transactions} loading={loading} />
    </div>
  );
}
