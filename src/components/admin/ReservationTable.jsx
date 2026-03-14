'use client';
import { useState, useEffect } from 'react';
import ReservationRow from './ReservationRow';
import Spinner from '@/components/ui/Spinner';
import { getMatchReservations } from '@/services/adminService';

export default function ReservationTable({ matchId }) {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = () => {
    getMatchReservations(matchId)
      .then(setReservations)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, [matchId]);

  if (loading) return <Spinner />;

  const confirmed = reservations.filter((r) => r.status === 'confirmed').length;
  const pending = reservations.filter((r) =>
    ['pending_payment', 'payment_uploaded'].includes(r.status)
  ).length;

  if (reservations.length === 0) {
    return (
      <div className="text-center py-10 space-y-2">
        <div className="w-12 h-12 mx-auto rounded-full bg-gray-100 flex items-center justify-center">
          <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <p className="text-gray-400 font-medium">Sin reservas aun</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-brand-600">
          Reservas ({reservations.length})
        </h3>
        <div className="flex gap-2 text-xs">
          <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-medium">
            {confirmed} confirmadas
          </span>
          <span className="bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full font-medium">
            {pending} pendientes
          </span>
        </div>
      </div>
      <div className="space-y-3">
        {reservations.map((r) => (
          <ReservationRow key={r._id} reservation={r} onUpdate={fetchData} />
        ))}
      </div>
    </div>
  );
}
