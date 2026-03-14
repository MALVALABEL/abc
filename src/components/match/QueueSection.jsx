'use client';
import { useState, useEffect } from 'react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { getQueue, joinQueue } from '@/services/queueService';
import { validateName, validatePhone } from '@/helpers/validators';

export default function QueueSection({ matchId, user }) {
  const [queue, setQueue] = useState({ queue: [], count: 0 });
  const [joined, setJoined] = useState(false);
  const [position, setPosition] = useState(null);
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [isGoalkeeper, setIsGoalkeeper] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    getQueue(matchId).then(setQueue).catch(() => {});
    const interval = setInterval(() => {
      getQueue(matchId).then(setQueue).catch(() => {});
    }, 10000);
    return () => clearInterval(interval);
  }, [matchId]);

  useEffect(() => {
    if (user && queue.queue.length > 0) {
      const myEntry = queue.queue.find((e) => e.playerPhone === user.phone);
      if (myEntry) {
        setJoined(true);
        setPosition(myEntry.position);
      }
    }
  }, [queue, user]);

  const handleJoin = async (e) => {
    e.preventDefault();
    const nameErr = validateName(name);
    const phoneErr = validatePhone(phone);
    if (nameErr || phoneErr) {
      setErrors({ name: nameErr, phone: phoneErr });
      return;
    }

    setErrors({});
    setError(null);
    setLoading(true);
    try {
      const entry = await joinQueue(matchId, {
        playerName: name,
        playerPhone: phone,
        isGoalkeeper,
      });
      setJoined(true);
      setPosition(entry.position);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <div className="bg-amber-50 rounded-2xl border border-amber-200 p-5 space-y-4">
      <div className="text-center space-y-1">
        <h3 className="font-bold text-amber-800">Cola de espera</h3>
        <p className="text-sm text-amber-600">
          Los cupos estan llenos, pero hay reservas pendientes de pago.
          Si alguna expira, el siguiente en cola entra automaticamente.
        </p>
        {queue.count > 0 && (
          <p className="text-xs text-amber-500 font-medium">
            {queue.count} {queue.count === 1 ? 'persona' : 'personas'} en cola
          </p>
        )}
      </div>

      {joined ? (
        <div className="text-center p-4 bg-white rounded-xl border border-amber-200">
          <p className="text-sm font-semibold text-amber-800">
            Estas en la posicion #{position} de la cola
          </p>
          <p className="text-xs text-amber-600 mt-1">
            Te asignaremos un cupo automaticamente si se libera uno
          </p>
        </div>
      ) : (
        <form onSubmit={handleJoin} className="space-y-3">
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
          <label className="flex items-center gap-3 p-3 rounded-xl border border-amber-200 bg-white cursor-pointer">
            <input
              type="checkbox"
              checked={isGoalkeeper}
              onChange={(e) => setIsGoalkeeper(e.target.checked)}
              className="w-4 h-4 rounded"
            />
            <span className="text-sm text-gray-700">Soy arquero</span>
          </label>
          {error && <p className="text-xs text-red-500">{error}</p>}
          <Button type="submit" variant="brand" loading={loading}>
            Unirme a la cola
          </Button>
        </form>
      )}
    </div>
  );
}
