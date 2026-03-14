'use client';
import { useState } from 'react';
import Button from '@/components/ui/Button';

export default function CancelButton({ onCancel }) {
  const [confirming, setConfirming] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleCancel = async () => {
    setLoading(true);
    await onCancel();
    setLoading(false);
  };

  if (!confirming) {
    return (
      <button
        onClick={() => setConfirming(true)}
        className="text-sm text-red-400 underline hover:text-red-600 transition-colors"
      >
        Cancelar reserva
      </button>
    );
  }

  return (
    <div className="space-y-2 p-4 bg-red-50 rounded-xl border border-red-100">
      <p className="text-sm text-red-700">Seguro que quieres cancelar? Tu cupo se liberara.</p>
      <div className="flex gap-2">
        <Button variant="danger" onClick={handleCancel} loading={loading}>
          Si, cancelar
        </Button>
        <Button variant="secondary" onClick={() => setConfirming(false)}>
          No, volver
        </Button>
      </div>
    </div>
  );
}
