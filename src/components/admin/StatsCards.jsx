export default function StatsCards({ matches }) {
  const openMatches = matches.filter((m) => m.status === 'open');
  const totalSlots = openMatches.reduce((acc, m) => acc + m.maxSlots, 0);
  const reservedSlots = openMatches.reduce((acc, m) => acc + m.reservedSlots, 0);
  const occupancy = totalSlots > 0 ? Math.round((reservedSlots / totalSlots) * 100) : 0;

  const stats = [
    {
      label: 'Partidos activos',
      value: openMatches.length,
      color: 'text-brand-500',
      bg: 'bg-brand-50',
      icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
    },
    {
      label: 'Cupos reservados',
      value: reservedSlots,
      color: 'text-accent-600',
      bg: 'bg-accent-50',
      icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z',
    },
    {
      label: 'Cupos disponibles',
      value: totalSlots - reservedSlots,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
      icon: 'M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z',
    },
    {
      label: 'Ocupacion',
      value: `${occupancy}%`,
      color: 'text-violet-600',
      bg: 'bg-violet-50',
      icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {stats.map((s) => (
        <div key={s.label} className="bg-white rounded-xl border border-gray-100 p-4 space-y-2">
          <div className={`w-9 h-9 rounded-lg ${s.bg} flex items-center justify-center`}>
            <svg className={`w-5 h-5 ${s.color}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d={s.icon} />
            </svg>
          </div>
          <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
          <p className="text-xs text-gray-400">{s.label}</p>
        </div>
      ))}
    </div>
  );
}
