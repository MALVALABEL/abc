'use client';
import { useState, useEffect } from 'react';
import Spinner from '@/components/ui/Spinner';

export default function AccountingDetails({ type }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/admin/stats/details?type=${type}`)
      .then((r) => r.json())
      .then(setItems)
      .finally(() => setLoading(false));
  }, [type]);

  if (loading) return <Spinner size="sm" />;
  if (items.length === 0) return <p className="text-xs text-gray-400 py-2">Sin registros</p>;

  if (type === 'transfers') return <TransferList items={items} />;
  return <TransactionDetailList items={items} type={type} />;
}

function TransactionDetailList({ items, type }) {
  const [showReceipt, setShowReceipt] = useState(null);

  return (
    <div className="space-y-2 pt-1">
      {items.map((tx) => (
        <div key={tx._id} className="bg-gray-50 rounded-xl p-3 space-y-1.5">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-gray-900">{tx.userName}</p>
              <p className="text-[10px] text-gray-400">{tx.userPhone}</p>
              {tx.matchTitle && (
                <p className="text-[10px] text-brand-500">Partido: {tx.matchTitle}</p>
              )}
              {tx.cancelReason && (
                <p className="text-[10px] text-red-500">Motivo: {tx.cancelReason}</p>
              )}
            </div>
            <div className="text-right">
              <p className="text-xs font-bold text-gray-900">
                ${tx.amount?.toLocaleString('es-CO')}
              </p>
              <p className="text-[10px] text-gray-400">
                {new Date(tx.createdAt).toLocaleDateString('es-CO', {
                  day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
                })}
              </p>
              {type === 'refunds' && (
                <span className={`text-[10px] font-bold ${tx.type === 'refund_approved' ? 'text-emerald-600' : 'text-red-500'}`}>
                  {tx.type === 'refund_approved' ? 'Aprobada' : 'Rechazada'}
                </span>
              )}
            </div>
          </div>
          {tx.receiptUrl && (
            <div>
              <button
                onClick={() => setShowReceipt(showReceipt === tx._id ? null : tx._id)}
                className="text-[10px] text-brand-500 font-medium"
              >
                {showReceipt === tx._id ? 'Ocultar comprobante' : 'Ver comprobante'}
              </button>
              {showReceipt === tx._id && (
                <a href={tx.receiptUrl} target="_blank" rel="noopener noreferrer" className="block mt-1">
                  <img src={tx.receiptUrl} alt="Comprobante" className="max-h-32 rounded-lg border" />
                </a>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function TransferList({ items }) {
  const [showReceipt, setShowReceipt] = useState(null);

  return (
    <div className="space-y-2 pt-1">
      {items.map((r) => (
        <div key={r._id} className="bg-gray-50 rounded-xl p-3 space-y-1.5">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-gray-900">{r.playerName}</p>
              <p className="text-[10px] text-gray-400">{r.playerPhone}</p>
              {r.matchTitle && (
                <p className="text-[10px] text-brand-500">Partido: {r.matchTitle}</p>
              )}
            </div>
            <p className="text-[10px] text-gray-400">
              {new Date(r.createdAt).toLocaleDateString('es-CO', {
                day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
              })}
            </p>
          </div>
          {r.receiptUrl && (
            <div>
              <button
                onClick={() => setShowReceipt(showReceipt === r._id ? null : r._id)}
                className="text-[10px] text-brand-500 font-medium"
              >
                {showReceipt === r._id ? 'Ocultar comprobante' : 'Ver comprobante'}
              </button>
              {showReceipt === r._id && (
                <a href={r.receiptUrl} target="_blank" rel="noopener noreferrer" className="block mt-1">
                  <img src={r.receiptUrl} alt="Comprobante" className="max-h-32 rounded-lg border" />
                </a>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
