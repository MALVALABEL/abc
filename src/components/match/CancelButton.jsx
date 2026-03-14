'use client';
import { useState } from 'react';
import Button from '@/components/ui/Button';

const REASONS = [
  'No puedo asistir',
  'Cambio de planes',
  'Problema de salud',
  'No consigo transporte',
  'Otro',
];

export default function CancelButton({ onCancel, paidWithWallet, noRefundWarning }) {
  const [step, setStep] = useState('idle');
  const [reason, setReason] = useState('');
  const [customReason, setCustomReason] = useState('');
  const [loading, setLoading] = useState(false);

  const finalReason = reason === 'Otro' ? customReason : reason;

  const handleCancel = async () => {
    if (!finalReason) return;
    setLoading(true);
    await onCancel(finalReason, noRefundWarning);
    setLoading(false);
  };

  if (step === 'idle') {
    return (
      <button
        onClick={() => setStep('confirm')}
        className="text-sm text-red-400 underline hover:text-red-600 transition-colors"
      >
        Cancelar reserva
      </button>
    );
  }

  return (
    <div className="space-y-3 p-4 bg-red-50 rounded-xl border border-red-100">
      {noRefundWarning && paidWithWallet && (
        <div className="bg-red-100 rounded-lg p-3 border border-red-200">
          <p className="text-xs font-bold text-red-700">
            Advertencia: Has cancelado 3 o mas partidos este mes
          </p>
          <p className="text-xs text-red-600 mt-1">
            Si cancelas esta reserva NO se te devolvera el dinero.
          </p>
        </div>
      )}

      <p className="text-sm font-medium text-red-700">Motivo de cancelacion</p>
      <div className="space-y-1.5">
        {REASONS.map((r) => (
          <label key={r} className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="reason"
              value={r}
              checked={reason === r}
              onChange={() => setReason(r)}
              className="w-3.5 h-3.5 text-red-500"
            />
            <span className="text-sm text-gray-700">{r}</span>
          </label>
        ))}
      </div>

      {reason === 'Otro' && (
        <input
          type="text"
          value={customReason}
          onChange={(e) => setCustomReason(e.target.value)}
          placeholder="Describe el motivo..."
          className="w-full px-3 py-2 rounded-lg border border-red-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
        />
      )}

      <div className="flex gap-2">
        <Button
          variant="danger"
          onClick={handleCancel}
          loading={loading}
          disabled={!finalReason}
        >
          {noRefundWarning && paidWithWallet ? 'Cancelar sin devolucion' : 'Si, cancelar'}
        </Button>
        <Button variant="secondary" onClick={() => setStep('idle')}>
          No, volver
        </Button>
      </div>
    </div>
  );
}
