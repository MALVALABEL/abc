'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { createMatch } from '@/services/matchService';

export default function CreateMatchForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({
    title: '',
    date: '',
    time: '',
    location: '',
    maxSlots: '',
    pricePerSlot: '',
    paymentInfo: '',
  });

  const update = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const match = await createMatch(form);
      router.push(`/admin/partido/${match._id}`);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input label="Titulo del partido" value={form.title} onChange={update('title')} placeholder="Ej: Partido Viernes" required />
      <div className="grid grid-cols-2 gap-3">
        <Input label="Fecha" type="date" value={form.date} onChange={update('date')} required />
        <Input label="Hora" type="time" value={form.time} onChange={update('time')} required />
      </div>
      <Input label="Ubicacion" value={form.location} onChange={update('location')} placeholder="Ej: Cancha El Estadio" />
      <div className="grid grid-cols-2 gap-3">
        <Input label="Cupos maximos" type="number" min="2" value={form.maxSlots} onChange={update('maxSlots')} required />
        <Input label="Precio por cupo (COP)" type="number" min="0" value={form.pricePerSlot} onChange={update('pricePerSlot')} />
      </div>
      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">Datos de pago (cuenta, Nequi, etc.)</label>
        <textarea
          className="w-full px-3 py-3 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          rows={3}
          value={form.paymentInfo}
          onChange={update('paymentInfo')}
          placeholder="Ej: Nequi 300-123-4567 a nombre de Juan"
        />
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
      <Button type="submit" loading={loading}>Crear partido</Button>
    </form>
  );
}
