import Spinner from '@/components/ui/Spinner';

const typeLabels = {
  recharge: 'Recarga',
  debit: 'Pago reserva',
  refund_request: 'Devolucion solicitada',
  refund_approved: 'Devolucion aprobada',
  refund_rejected: 'Devolucion rechazada',
};

const typeColors = {
  recharge: 'text-emerald-600',
  debit: 'text-red-500',
  refund_request: 'text-amber-600',
  refund_approved: 'text-emerald-600',
  refund_rejected: 'text-red-500',
};

const statusBadges = {
  pending: 'bg-amber-50 text-amber-700',
  approved: 'bg-emerald-50 text-emerald-700',
  rejected: 'bg-red-50 text-red-700',
  completed: 'bg-gray-50 text-gray-500',
};

export default function TransactionList({ transactions, loading }) {
  if (loading) return <Spinner size="sm" />;

  if (transactions.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-400 text-sm">Sin movimientos aun</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-brand-600 text-sm">Historial de movimientos</h3>
      {transactions.map((tx) => (
        <div key={tx._id} className="bg-white rounded-xl border border-gray-100 p-4">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-900">
                {typeLabels[tx.type] || tx.type}
              </p>
              <p className="text-xs text-gray-400">
                {new Date(tx.createdAt).toLocaleDateString('es-CO', {
                  day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
                })}
              </p>
              {tx.description && (
                <p className="text-xs text-gray-400 mt-0.5">{tx.description}</p>
              )}
            </div>
            <div className="text-right">
              <p className={`font-bold text-sm ${typeColors[tx.type] || 'text-gray-600'}`}>
                {tx.type === 'debit' ? '-' : '+'}${tx.amount?.toLocaleString('es-CO')}
              </p>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${statusBadges[tx.status]}`}>
                {tx.status === 'pending' ? 'Pendiente' : tx.status === 'approved' ? 'Aprobado' : tx.status === 'rejected' ? 'Rechazado' : 'Completado'}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
