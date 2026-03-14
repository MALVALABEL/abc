'use client';
import { useState } from 'react';
import Link from 'next/link';
import { updatePreferences } from '@/services/userService';

const DAYS = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado', 'Domingo'];

export default function UserDashboard({ user }) {
  const [preferredDays, setPreferredDays] = useState(user.preferredDays || []);
  const [anyTime, setAnyTime] = useState(user.anyTime !== false);
  const [timeFrom, setTimeFrom] = useState(user.preferredTimeFrom || '18:00');
  const [timeTo, setTimeTo] = useState(user.preferredTimeTo || '22:00');
  const [isGoalkeeper, setIsGoalkeeper] = useState(user.isGoalkeeper || false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const toggleDay = (day) => {
    setPreferredDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const handleSave = async () => {
    setSaving(true);
    await updatePreferences({
      preferredDays,
      anyTime,
      preferredTimeFrom: timeFrom,
      preferredTimeTo: timeTo,
      isGoalkeeper,
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-brand-600">Mi cuenta</h2>
        <Link href="/" className="text-sm text-brand-500 hover:underline">Volver</Link>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-2">
        <p className="text-sm text-gray-400">Nombre</p>
        <p className="font-semibold text-gray-900">{user.name}</p>
        <p className="text-sm text-gray-400 mt-2">Celular</p>
        <p className="font-semibold text-gray-900">{user.phone}</p>
      </div>

      <Link href="/cuenta/billetera" className="block bg-white rounded-2xl border border-gray-100 p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-400">Saldo disponible</p>
            <p className="text-2xl font-bold text-accent-600">
              ${user.balance?.toLocaleString('es-CO')}
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-accent-50 flex items-center justify-center">
            <svg className="w-5 h-5 text-accent-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
          </div>
        </div>
      </Link>

      <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4">
        <h3 className="font-semibold text-brand-600 text-sm">Preferencias de juego</h3>
        <p className="text-xs text-gray-400">
          Selecciona tus dias y horario. Cuando se programe un partido que coincida,
          se te reservara automaticamente si tienes saldo.
        </p>

        <div>
          <p className="text-xs text-gray-500 font-medium mb-2">Dias disponibles</p>
          <div className="flex flex-wrap gap-2">
            {DAYS.map((day) => (
              <button
                key={day}
                onClick={() => toggleDay(day)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  preferredDays.includes(day)
                    ? 'bg-brand-600 text-white'
                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}
              >
                {day}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs text-gray-500 font-medium mb-2">Horario</p>
          <label className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 cursor-pointer hover:bg-gray-50 mb-2">
            <input
              type="checkbox"
              checked={anyTime}
              onChange={(e) => setAnyTime(e.target.checked)}
              className="w-4 h-4 rounded"
            />
            <div>
              <p className="text-sm font-medium text-gray-700">Cualquier hora</p>
              <p className="text-xs text-gray-400">Reservar sin importar la hora del partido</p>
            </div>
          </label>
          {!anyTime && (
            <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl">
              <div className="flex-1">
                <label className="block text-[10px] text-gray-400 mb-1">Desde</label>
                <input
                  type="time"
                  value={timeFrom}
                  onChange={(e) => setTimeFrom(e.target.value)}
                  className="w-full px-2 py-1.5 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-brand-400 focus:outline-none"
                />
              </div>
              <span className="text-gray-300 mt-4">-</span>
              <div className="flex-1">
                <label className="block text-[10px] text-gray-400 mb-1">Hasta</label>
                <input
                  type="time"
                  value={timeTo}
                  onChange={(e) => setTimeTo(e.target.value)}
                  className="w-full px-2 py-1.5 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-brand-400 focus:outline-none"
                />
              </div>
            </div>
          )}
        </div>

        <label className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 cursor-pointer hover:bg-gray-50">
          <input
            type="checkbox"
            checked={isGoalkeeper}
            onChange={(e) => setIsGoalkeeper(e.target.checked)}
            className="w-4 h-4 rounded"
          />
          <div>
            <p className="text-sm font-medium text-gray-700">Soy arquero</p>
            <p className="text-xs text-gray-400">Marcar si normalmente juegas de arquero</p>
          </div>
        </label>

        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full py-2.5 bg-brand-600 text-white text-sm font-semibold rounded-xl hover:bg-brand-700 disabled:opacity-50 transition-colors"
        >
          {saving ? 'Guardando...' : saved ? 'Guardado!' : 'Guardar preferencias'}
        </button>
      </div>
    </div>
  );
}
