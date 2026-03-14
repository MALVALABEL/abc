'use client';
import { useState } from 'react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { validateName, validatePhone } from '@/helpers/validators';

export default function ReservationForm({ onReserve, disabled, user, matchPrice }) {
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [isGoalkeeper, setIsGoalkeeper] = useState(false);
  const [payWithWallet, setPayWithWallet] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const canPayWithWallet = user && matchPrice > 0 && user.balance >= matchPrice;

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
    await onReserve(name, phone, isGoalkeeper, payWithWallet);
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

      <label className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors">
        <input
          type="checkbox"
          checked={isGoalkeeper}
          onChange={(e) => setIsGoalkeeper(e.target.checked)}
          className="w-4 h-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500"
        />
        <div>
          <p className="text-sm font-medium text-gray-700">Soy arquero</p>
          <p className="text-xs text-gray-400">Marca si vas a jugar de arquero</p>
        </div>
      </label>

      {canPayWithWallet && (
        <label className="flex items-center gap-3 p-3 rounded-xl border border-accent-200 bg-accent-50 cursor-pointer hover:bg-accent-100 transition-colors">
          <input
            type="checkbox"
            checked={payWithWallet}
            onChange={(e) => setPayWithWallet(e.target.checked)}
            className="w-4 h-4 rounded border-accent-300 text-accent-600 focus:ring-accent-500"
          />
          <div>
            <p className="text-sm font-medium text-accent-700">Pagar con billetera</p>
            <p className="text-xs text-accent-500">
              Saldo: ${user.balance.toLocaleString('es-CO')} - Se debitan ${matchPrice.toLocaleString('es-CO')}
            </p>
          </div>
        </label>
      )}

      <Button type="submit" loading={loading} disabled={disabled}>
        {payWithWallet ? 'Reservar y pagar con billetera' : 'Reservar mi cupo'}
      </Button>
    </form>
  );
}
