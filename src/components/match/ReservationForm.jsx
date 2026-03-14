'use client';
import { useState } from 'react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { validateName, validatePhone } from '@/helpers/validators';

export default function ReservationForm({ onReserve, disabled }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const nameErr = validateName(name);
    const phoneErr = validatePhone(phone);

    if (nameErr || phoneErr) {
      setErrors({ name: nameErr, phone: phoneErr });
      return;
    }

    setErrors({});
    setLoading(true);
    await onReserve(name, phone);
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="font-semibold text-brand-600 text-sm">Reserva tu cupo</h3>
      <Input
        label="Tu nombre"
        placeholder="Ej: Juan Perez"
        value={name}
        onChange={(e) => setName(e.target.value)}
        error={errors.name}
      />
      <Input
        label="Tu celular"
        placeholder="Ej: 3001234567"
        type="tel"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        error={errors.phone}
      />
      <Button type="submit" loading={loading} disabled={disabled}>
        Reservar mi cupo
      </Button>
    </form>
  );
}
