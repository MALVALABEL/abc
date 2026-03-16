'use client';
import { useState } from 'react';
import Badge from '@/components/ui/Badge';
import { approveReservation, rejectReservation } from '@/services/adminService';

export default function ReservationRow({ reservation, onUpdate }) {
  const [loading, setLoading] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);

  const handleApprove = async () => {
    setLoading(true);
    await approveReservation(reservation._id);
    onUpdate();
    setLoading(false);
  };

  const handleReject = async () => {
    setLoading(true);
    await rejectReservation(reservation._id);
    onUpdate();
    setLoading(false);
  };

  const handleUnblock = async () => {
    if (!confirm('Desbloquear este cupo? Se liberara.')) return;
    setLoading(true);
    await fetch(`/api/reservations/${reservation._id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cancelReason: 'Desbloqueado por admin' }),
    });
    onUpdate();
    setLoading(false);
  };

  const isBlocked = reservation.playerPhone === '0000000000';

  return (
    <div className={`bg-white rounded-xl border overflow-hidden ${isBlocked ? 'border-gray-300 bg-gray-50' : 'border-gray-100'}`}>
      <div className="p-4 space-y-3">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-full flex items-center justify-center ${isBlocked ? 'bg-gray-200' : 'bg-brand-50'}`}>
              {isBlocked ? (
                <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              ) : (
                <span className="text-sm font-bold text-brand-500">
                  {reservation.playerName.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p className="font-semibold text-gray-900 text-sm">{reservation.playerName}</p>
                {isBlocked && (
                  <span className="text-[10px] font-bold bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded-full">
                    BLOQUEADO
                  </span>
                )}
                {reservation.isGoalkeeper && (
                  <span className="text-[10px] font-bold bg-violet-50 text-violet-600 px-1.5 py-0.5 rounded-full border border-violet-200">
                    ARQUERO
                  </span>
                )}
                {reservation.paidWithWallet && !isBlocked && (
                  <span className="text-[10px] font-bold bg-accent-50 text-accent-600 px-1.5 py-0.5 rounded-full border border-accent-200">
                    BILLETERA
                  </span>
                )}
              </div>
              {!isBlocked && <p className="text-xs text-gray-400">{reservation.playerPhone}</p>}
            </div>
          </div>
          <Badge status={reservation.status} />
        </div>

        {reservation.receiptUrl && (
          <div>
            <button
              onClick={() => setShowReceipt(!showReceipt)}
              className="text-xs text-brand-500 hover:text-brand-600 font-medium flex items-center gap-1"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {showReceipt ? 'Ocultar comprobante' : 'Ver comprobante'}
            </button>
            {showReceipt && (
              <a href={reservation.receiptUrl} target="_blank" rel="noopener noreferrer" className="block mt-2">
                <img src={reservation.receiptUrl} alt="Comprobante" className="w-full max-h-48 object-contain rounded-lg border border-gray-100" />
              </a>
            )}
          </div>
        )}

        {reservation.status === 'payment_uploaded' && (
          <div className="flex gap-2 pt-1">
            <button onClick={handleApprove} disabled={loading} className="flex-1 py-2 bg-emerald-500 text-white text-sm font-semibold rounded-xl hover:bg-emerald-600 disabled:opacity-50 transition-colors">
              Aprobar
            </button>
            <button onClick={handleReject} disabled={loading} className="flex-1 py-2 bg-red-500 text-white text-sm font-semibold rounded-xl hover:bg-red-600 disabled:opacity-50 transition-colors">
              Rechazar
            </button>
          </div>
        )}

        {!['cancelled', 'expired', 'rejected'].includes(reservation.status) && (
          <button
            onClick={handleUnblock}
            disabled={loading}
            className="w-full py-2 bg-gray-100 text-gray-600 text-xs font-medium rounded-xl hover:bg-gray-200 disabled:opacity-50 transition-colors"
          >
            {isBlocked ? 'Desbloquear cupo' : 'Eliminar / Cancelar reserva'}
          </button>
        )}
      </div>
    </div>
  );
}
