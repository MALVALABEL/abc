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

  if (reservations.length === 0) {
    return <p className="text-center text-gray-500 py-8">Sin reservas aun</p>;
  }

  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-gray-700">
        Reservas ({reservations.length})
      </h3>
      {reservations.map((r) => (
        <ReservationRow key={r._id} reservation={r} onUpdate={fetchData} />
      ))}
    </div>
  );
}
