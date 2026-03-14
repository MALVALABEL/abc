'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { formatDate, formatTime } from '@/helpers/formatters';
import { cancelReservation } from '@/services/reservationService';

export default function UserPanel({ user, onLogout }) {
  const [open, setOpen] = useState(false);
  const [reservations, setReservations] = useState([]);
  const [cancelling, setCancelling] = useState(null);

  useEffect(() => {
    if (open) {
      fetch('/api/users/me/reservations/details')
        .then((r) => r.ok ? r.json() : [])
        .then(setReservations)
        .catch(() => {});
    }
  }, [open]);

  const handleCancel = async (resId) => {
    if (!confirm('Seguro que quieres cancelar esta reserva?')) return;
    setCancelling(resId);
    try {
      await cancelReservation(resId);
      setReservations((prev) => prev.filter((r) => r._id !== resId));
    } catch {}
    setCancelling(null);
  };

  const days = user.preferredDays || [];
  const timeLabel = user.anyTime
    ? 'Cualquier hora'
    : `${user.preferredTimeFrom || '18:00'} - ${user.preferredTimeTo || '22:00'}`;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-full transition-colors"
      >
        <div className="w-6 h-6 rounded-full bg-accent-500 flex items-center justify-center text-xs font-bold">
          {user.name.charAt(0).toUpperCase()}
        </div>
        <svg className={`w-3 h-3 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-2xl shadow-xl border z-50 overflow-hidden max-h-[80vh] overflow-y-auto">
            <PanelHeader user={user} />
            <PanelInfo user={user} days={days} timeLabel={timeLabel} />
            <PanelReservations
              reservations={reservations}
              cancelling={cancelling}
              onCancel={handleCancel}
            />
            <PanelLinks onClose={() => setOpen(false)} />
            <PanelLogout onLogout={onLogout} />
          </div>
        </>
      )}
    </div>
  );
}

function PanelHeader({ user }) {
  return (
    <div className="p-4 gradient-brand text-white">
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-full bg-white/20 flex items-center justify-center text-lg font-bold">
          {user.name.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm truncate">{user.name}</p>
          <p className="text-xs text-white/60">{user.phone}</p>
        </div>
      </div>
      <div className="mt-3 flex gap-2">
        <div className="flex-1 p-2 bg-white/10 rounded-xl text-center">
          <p className="text-[10px] text-white/50">Saldo</p>
          <p className="text-sm font-bold">${user.balance?.toLocaleString('es-CO')}</p>
        </div>
        {user.isGoalkeeper && (
          <div className="p-2 bg-white/10 rounded-xl flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span className="text-[10px] font-bold">Arquero</span>
          </div>
        )}
      </div>
    </div>
  );
}

function PanelInfo({ days, timeLabel }) {
  if (days.length === 0) return null;

  return (
    <div className="px-4 py-3 border-b bg-gray-50">
      <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">Disponibilidad</p>
      <div className="flex flex-wrap gap-1">
        {days.map((d) => (
          <span key={d} className="text-[10px] bg-brand-50 text-brand-600 px-2 py-0.5 rounded-full font-medium">
            {d.substring(0, 3)}
          </span>
        ))}
      </div>
      <p className="text-[10px] text-gray-400 mt-1">{timeLabel}</p>
    </div>
  );
}

function PanelReservations({ reservations, cancelling, onCancel }) {
  if (reservations.length === 0) return null;

  const statusLabels = {
    pending_payment: 'Pendiente pago',
    payment_uploaded: 'Comprobante enviado',
    confirmed: 'Confirmado',
    refund_requested: 'Devolucion solicitada',
  };

  const statusColors = {
    pending_payment: 'text-amber-600',
    payment_uploaded: 'text-blue-600',
    confirmed: 'text-emerald-600',
    refund_requested: 'text-violet-600',
  };

  return (
    <div className="px-4 py-3 border-b">
      <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-2">Mis partidos</p>
      <div className="space-y-2">
        {reservations.map((r) => (
          <div key={r._id} className="flex items-center justify-between bg-gray-50 rounded-xl p-2.5">
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-gray-900 truncate">{r.matchTitle}</p>
              <p className="text-[10px] text-gray-400">{r.matchDate} - {r.matchTime}</p>
              <p className={`text-[10px] font-medium ${statusColors[r.status] || 'text-gray-500'}`}>
                {statusLabels[r.status] || r.status}
              </p>
            </div>
            {['pending_payment', 'payment_uploaded', 'confirmed'].includes(r.status) && (
              <button
                onClick={() => onCancel(r._id)}
                disabled={cancelling === r._id}
                className="ml-2 p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Cancelar reserva"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function PanelLinks({ onClose }) {
  return (
    <div className="py-1">
      <Link href="/cuenta" className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50" onClick={onClose}>
        <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
        Mi cuenta
      </Link>
      <Link href="/cuenta/billetera" className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50" onClick={onClose}>
        <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
        Billetera
      </Link>
    </div>
  );
}

function PanelLogout({ onLogout }) {
  return (
    <div className="border-t">
      <button onClick={onLogout} className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
        Cerrar sesion
      </button>
    </div>
  );
}
