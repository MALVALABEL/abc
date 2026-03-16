'use client';
import { useState, useEffect } from 'react';
import Spinner from '@/components/ui/Spinner';

function formatDate(dateStr) {
  if (!dateStr) return '-';
  return new Date(dateStr).toLocaleDateString('es-CO', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function formatMoney(amount) {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
  }).format(amount || 0);
}

const dayLabels = {
  monday: 'Lun',
  tuesday: 'Mar',
  wednesday: 'Mie',
  thursday: 'Jue',
  friday: 'Vie',
  saturday: 'Sab',
  sunday: 'Dom',
};

export default function UsersList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch('/api/admin/registered-users')
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setUsers(data);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;

  const filtered = users.filter((u) => {
    const q = search.toLowerCase();
    return (
      u.name?.toLowerCase().includes(q) ||
      u.phone?.includes(q)
    );
  });

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-brand-600">
          Usuarios registrados ({users.length})
        </h2>
      </div>

      <input
        type="text"
        placeholder="Buscar por nombre o telefono..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
      />

      {filtered.length === 0 && (
        <p className="text-sm text-gray-400 text-center py-8">
          No se encontraron usuarios
        </p>
      )}

      <div className="space-y-3">
        {filtered.map((user) => (
          <UserCard key={user._id} user={user} />
        ))}
      </div>
    </div>
  );
}

function UserCard({ user }) {
  const days = (user.preferredDays || [])
    .map((d) => dayLabels[d] || d)
    .join(', ');

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-brand-50 text-brand-500 flex items-center justify-center text-sm font-bold">
            {user.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="font-semibold text-gray-900 text-sm">
                {user.name}
              </p>
              {user.isGoalkeeper && (
                <span className="text-[10px] font-bold bg-amber-50 text-amber-600 border border-amber-200 px-1.5 py-0.5 rounded-full">
                  PORTERO
                </span>
              )}
            </div>
            <p className="text-xs text-gray-400">{user.phone}</p>
          </div>
        </div>
        <p className="text-sm font-bold text-brand-600">
          {formatMoney(user.balance)}
        </p>
      </div>

      <div className="mt-3 flex flex-wrap gap-3 text-xs text-gray-500">
        <span>
          Partidos: <b className="text-gray-700">{user.partidosJugados}</b>
        </span>
        <span>
          Cancelaciones: <b className="text-gray-700">{user.cancelaciones}</b>
        </span>
        {days && <span>Dias: {days}</span>}
        <span>Registro: {formatDate(user.createdAt)}</span>
      </div>
    </div>
  );
}
