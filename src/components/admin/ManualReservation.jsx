'use client';
import { useState } from 'react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

export default function ManualReservation({ matchId, onCreated }) {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState('reserve');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [isGoalkeeper, setIsGoalkeeper] = useState(false);
  const [blockLabel, setBlockLabel] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const body = {
      matchId,
      isGoalkeeper,
      isBlocked: mode === 'block',
      playerName: mode === 'block' ? (blockLabel || 'Cupo bloqueado') : name,
      playerPhone: mode === 'block' ? '0000000000' : phone,
    };

    if (mode === 'reserve' && (!name || !phone)) {
      setError('Nombre y celular son obligatorios');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/admin/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      setName('');
      setPhone('');
      setBlockLabel('');
      setOpen(false);
      onCreated();
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  if (!open) {
    return (
      <div className="flex gap-2">
        <button
          onClick={() => { setMode('reserve'); setOpen(true); }}
          className="flex-1 py-2.5 bg-brand-600 text-white text-sm font-semibold rounded-xl hover:bg-brand-700 transition-colors flex items-center justify-center gap-1.5"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
          Reserva manual
        </button>
        <button
          onClick={() => { setMode('block'); setOpen(true); }}
          className="flex-1 py-2.5 bg-gray-600 text-white text-sm font-semibold rounded-xl hover:bg-gray-700 transition-colors flex items-center justify-center gap-1.5"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          Bloquear cupo
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-brand-600 text-sm">
          {mode === 'block' ? 'Bloquear cupo' : 'Reserva manual'}
        </h3>
        <button type="button" onClick={() => setOpen(false)} className="text-gray-400 hover:text-gray-600">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {mode === 'block' ? (
        <Input
          label="Etiqueta (opcional)"
          value={blockLabel}
          onChange={(e) => setBlockLabel(e.target.value)}
          placeholder="Ej: Reservado para Pedro"
        />
      ) : (
        <>
          <Input
            label="Nombre"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nombre del jugador"
          />
          <Input
            label="Celular"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="3001234567"
          />
        </>
      )}

      <label className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 cursor-pointer hover:bg-gray-50">
        <input
          type="checkbox"
          checked={isGoalkeeper}
          onChange={(e) => setIsGoalkeeper(e.target.checked)}
          className="w-4 h-4 rounded"
        />
        <span className="text-sm text-gray-700">Arquero</span>
      </label>

      {error && <p className="text-xs text-red-500">{error}</p>}

      <Button type="submit" variant="brand" loading={loading}>
        {mode === 'block' ? 'Bloquear cupo' : 'Crear reserva'}
      </Button>
    </form>
  );
}
