'use client';
import { useState, useEffect } from 'react';
import Spinner from '@/components/ui/Spinner';

function fmt(n) {
  return '$' + (n || 0).toLocaleString('es-CO');
}

export default function AdminAccounting() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/stats')
      .then((r) => r.json())
      .then(setStats)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;
  if (!stats) return <p className="text-center text-gray-400">Error cargando datos</p>;

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-brand-600">Contabilidad</h2>

      <Section title="Ingresos" color="emerald">
        <StatRow label="Recargas aprobadas" value={fmt(stats.ingresos.recargas)} sub={`${stats.ingresos.recargasCount} recargas`} />
        <StatRow label="Pagos por transferencia directa" value={`${stats.ingresos.transferencias} reservas`} />
      </Section>

      <Section title="Billeteras de usuarios" color="accent">
        <StatRow label="Saldo total acumulado" value={fmt(stats.billeteras.saldoTotal)} sub={`${stats.billeteras.usuariosConSaldo} usuarios con saldo`} />
        <StatRow label="Debitos por reservas" value={fmt(stats.billeteras.debitosPorReserva)} sub={`${stats.billeteras.debitosCount} pagos con billetera`} />
      </Section>

      <Section title="Devoluciones" color="violet">
        <StatRow label="Devoluciones aprobadas" value={fmt(stats.devoluciones.aprobadas)} sub={`${stats.devoluciones.aprobadasCount} devoluciones`} />
        <StatRow label="Devoluciones pendientes" value={fmt(stats.devoluciones.pendientes)} sub={`${stats.devoluciones.pendientesCount} por aprobar`} highlight />
      </Section>

      <Section title="Pendientes por aprobar" color="amber">
        <StatRow label="Recargas pendientes" value={fmt(stats.pendientes.recargasMonto)} sub={`${stats.pendientes.recargasCount} comprobantes`} highlight />
      </Section>

      <Section title="Resumen general" color="brand">
        <StatRow label="Total usuarios registrados" value={stats.general.totalUsuarios} />
        <StatRow label="Partidos activos" value={stats.general.partidosActivos} />
        <StatRow label="Reservas confirmadas" value={stats.general.reservasConfirmadas} />
        <div className="grid grid-cols-2 gap-2 pt-1">
          <MiniStat label="Pagaron con billetera" value={stats.general.pagosBilletera} color="accent" />
          <MiniStat label="Pagaron con transferencia" value={stats.general.pagosTransferencia} color="brand" />
        </div>
      </Section>

      <div className="bg-brand-50 rounded-2xl border border-brand-100 p-5">
        <p className="text-sm font-semibold text-brand-600 mb-2">Balance neto</p>
        <p className="text-2xl font-bold text-brand-700">
          {fmt(stats.ingresos.recargas - stats.devoluciones.aprobadas)}
        </p>
        <p className="text-xs text-brand-500 mt-1">
          Recargas aprobadas ({fmt(stats.ingresos.recargas)}) - Devoluciones ({fmt(stats.devoluciones.aprobadas)})
        </p>
      </div>
    </div>
  );
}

function Section({ title, color, children }) {
  const colors = {
    emerald: 'border-emerald-100',
    accent: 'border-accent-100',
    violet: 'border-violet-100',
    amber: 'border-amber-100',
    brand: 'border-brand-100',
  };
  const titleColors = {
    emerald: 'text-emerald-700',
    accent: 'text-accent-700',
    violet: 'text-violet-700',
    amber: 'text-amber-700',
    brand: 'text-brand-700',
  };

  return (
    <div className={`bg-white rounded-2xl border ${colors[color]} p-5 space-y-3`}>
      <h3 className={`font-semibold text-sm ${titleColors[color]}`}>{title}</h3>
      {children}
    </div>
  );
}

function StatRow({ label, value, sub, highlight }) {
  return (
    <div className="flex justify-between items-start py-1.5 border-b border-gray-50 last:border-0">
      <div>
        <p className="text-sm text-gray-700">{label}</p>
        {sub && <p className="text-[10px] text-gray-400">{sub}</p>}
      </div>
      <p className={`text-sm font-bold ${highlight ? 'text-amber-600' : 'text-gray-900'}`}>
        {value}
      </p>
    </div>
  );
}

function MiniStat({ label, value, color }) {
  const bg = color === 'accent' ? 'bg-accent-50' : 'bg-brand-50';
  const text = color === 'accent' ? 'text-accent-700' : 'text-brand-700';
  return (
    <div className={`${bg} rounded-xl p-3 text-center`}>
      <p className={`text-lg font-bold ${text}`}>{value}</p>
      <p className="text-[10px] text-gray-500">{label}</p>
    </div>
  );
}
