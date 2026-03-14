'use client';
import { useState, useEffect } from 'react';
import Spinner from '@/components/ui/Spinner';

export default function AdminTransactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending');

  const fetchData = async () => {
    const res = await fetch(`/api/admin/transactions?status=${filter}`);
    const data = await res.json();
    setTransactions(data);
    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);
    fetchData();
  }, [filter]);

  const handleAction = async (id, action) => {
    await fetch(`/api/admin/transactions/${id}/${action}`, { method: 'POST' });
    fetchData();
  };

  if (loading) return <Spinner />;

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-brand-600">Transacciones de billeteras</h2>
      <div className="flex gap-2">
        {['pending', 'approved', 'rejected'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              filter === f ? 'bg-brand-600 text-white' : 'bg-gray-100 text-gray-500'
            }`}
          >
            {f === 'pending' ? 'Pendientes' : f === 'approved' ? 'Aprobadas' : 'Rechazadas'}
          </button>
        ))}
      </div>
      {transactions.length === 0 ? (
        <p className="text-center text-gray-400 py-8">Sin transacciones</p>
      ) : (
        <div className="space-y-3">
          {transactions.map((tx) => (
            <TransactionCard key={tx._id} tx={tx} onAction={handleAction} />
          ))}
        </div>
      )}
    </div>
  );
}

function TransactionCard({ tx, onAction }) {
  const isRefund = tx.type === 'refund_request';
  const typeLabel = isRefund ? 'Devolucion' : 'Recarga';

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4 space-y-3">
      <div className="flex justify-between items-start">
        <div>
          <p className="font-semibold text-gray-900 text-sm">
            {tx.userId?.name || 'Usuario'} - {tx.userId?.phone}
          </p>
          <p className="text-xs text-gray-400">
            {typeLabel} - {new Date(tx.createdAt).toLocaleDateString('es-CO')}
          </p>
        </div>
        <p className="font-bold text-accent-600">${tx.amount?.toLocaleString('es-CO')}</p>
      </div>

      {isRefund && (
        <div className="bg-gray-50 rounded-lg p-3 space-y-1.5">
          {tx.matchTitle && (
            <p className="text-xs text-gray-700">
              Partido: <span className="font-semibold">{tx.matchTitle}</span>
            </p>
          )}
          {tx.hoursUntilMatch !== undefined && (
            <p className="text-xs text-gray-500">
              Tiempo para el partido:{' '}
              <span className={`font-semibold ${tx.hoursUntilMatch < 24 ? 'text-red-600' : 'text-gray-700'}`}>
                {tx.hoursUntilMatch > 0 ? `${tx.hoursUntilMatch}h` : 'Ya paso'}
              </span>
            </p>
          )}
          {tx.cancelReason && (
            <p className="text-xs text-gray-500">
              Motivo: <span className="text-gray-700">{tx.cancelReason}</span>
            </p>
          )}
          <p className="text-xs text-gray-500">
            Cancelaciones este mes:{' '}
            <span className={`font-bold ${tx.userCancelCount >= 3 ? 'text-red-600' : 'text-gray-700'}`}>
              {tx.userCancelCount || 0}
              {tx.userCancelCount >= 3 && ' - REINCIDENTE'}
            </span>
          </p>
        </div>
      )}

      {tx.receiptUrl && (
        <a href={tx.receiptUrl} target="_blank" rel="noopener noreferrer">
          <img src={tx.receiptUrl} alt="Comprobante" className="max-h-32 rounded-lg border" />
        </a>
      )}

      {tx.status === 'pending' && (
        <div className="flex gap-2">
          <button
            onClick={() => onAction(tx._id, 'approve')}
            className="flex-1 py-2 bg-emerald-500 text-white text-sm font-semibold rounded-xl hover:bg-emerald-600 transition-colors"
          >
            Aprobar
          </button>
          <button
            onClick={() => onAction(tx._id, 'reject')}
            className="flex-1 py-2 bg-red-500 text-white text-sm font-semibold rounded-xl hover:bg-red-600 transition-colors"
          >
            Rechazar
          </button>
        </div>
      )}
    </div>
  );
}
