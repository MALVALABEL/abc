'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { createMatch } from '@/services/matchService';
import { listVenues } from '@/services/venueService';

export default function CreateMatchForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [venues, setVenues] = useState([]);
  const [form, setForm] = useState({
    title: '',
    date: '',
    time: '',
    location: '',
    maxSlots: '',
    pricePerSlot: '',
    paymentInfo: '',
  });

  useEffect(() => {
    listVenues().then(setVenues).catch(() => {});
  }, []);

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
    <div className="max-w-lg mx-auto">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="text-lg font-bold text-brand-600 mb-5">Crear nuevo partido</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Titulo del partido"
            value={form.title}
            onChange={update('title')}
            placeholder="Ej: Partido Viernes"
            required
          />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Fecha" type="date" value={form.date} onChange={update('date')} required />
            <Input label="Hora" type="time" value={form.time} onChange={update('time')} required />
          </div>
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700">Cancha</label>
            <select
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-transparent transition-all duration-200 bg-white"
              value={form.location}
              onChange={update('location')}
              required
            >
              <option value="">Seleccionar cancha</option>
              {venues.map((v) => (
                <option key={v._id} value={v.name}>{v.name}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Cupos maximos"
              type="number"
              min="2"
              value={form.maxSlots}
              onChange={update('maxSlots')}
              required
            />
            <Input
              label="Precio por cupo (COP)"
              type="number"
              min="0"
              value={form.pricePerSlot}
              onChange={update('pricePerSlot')}
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700">
              Datos de pago (cuenta, Nequi, etc.)
            </label>
            <textarea
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-transparent transition-all duration-200"
              rows={3}
              value={form.paymentInfo}
              onChange={update('paymentInfo')}
              placeholder="Ej: Nequi 300-123-4567 a nombre de Juan"
            />
          </div>
          {error && (
            <p className="text-sm text-red-500 bg-red-50 p-3 rounded-xl">{error}</p>
          )}
          <Button type="submit" variant="brand" loading={loading}>
            Crear partido
          </Button>
        </form>
      </div>
    </div>
  );
}
