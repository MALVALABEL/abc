'use client';
import { useState } from 'react';
import Badge from '@/components/ui/Badge';
import { approveReservation, rejectReservation } from '@/services/adminService';

export default function ReservationRow({ reservation, onUpdate }) {
  const [loading, setLoading] = useState(false);

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

  return (
    <div className="bg-white rounded-lg shadow p-4 space-y-3">
      <div className="flex justify-between items-start">
        <div>
          <p className="font-semibold text-gray-900">{reservation.playerName}</p>
          <p className="text-sm text-gray-500">{reservation.playerPhone}</p>
        </div>
        <Badge status={reservation.status} />
      </div>
      {reservation.receiptUrl && (
        <a
          href={reservation.receiptUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block"
        >
          <img
            src={reservation.receiptUrl}
            alt="Comprobante"
            className="w-full max-h-40 object-contain rounded border"
          />
        </a>
      )}
      {reservation.status === 'payment_uploaded' && (
        <div className="flex gap-2">
          <button
            onClick={handleApprove}
            disabled={loading}
            className="flex-1 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            Aprobar
          </button>
          <button
            onClick={handleReject}
            disabled={loading}
            className="flex-1 py-2 bg-red-500 text-white text-sm font-medium rounded-lg hover:bg-red-600 disabled:opacity-50"
          >
            Rechazar
          </button>
        </div>
      )}
    </div>
  );
}
