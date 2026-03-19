'use client';
import { useState, useEffect } from 'react';
import PublicMatchCard from './PublicMatchCard';
import Spinner from '@/components/ui/Spinner';
import { listMatches } from '@/services/matchService';
import { filterUpcomingMatches } from '@/helpers/dateHelpers';

const DAY_NAMES = ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'];

function groupByDay(matches) {
  const groups = {};
  matches.forEach((m) => {
    const d = new Date(m.date);
    const dayNum = d.getDate();
    const month = d.toLocaleDateString('es-CO', { month: 'long' });
    const dayName = DAY_NAMES[d.getDay()];
    const key = `${dayName} ${dayNum} de ${month}`;
    if (!groups[key]) groups[key] = [];
    groups[key].push(m);
  });
  return groups;
}

export default function PublicMatchList() {
  const [matches, setMatches] = useState([]);
  const [userMatchIds, setUserMatchIds] = useState(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listMatches()
      .then((data) => {
        const open = filterUpcomingMatches(data);
        open.sort((a, b) => new Date(a.date) - new Date(b.date));
        setMatches(open);
      })
      .finally(() => setLoading(false));

    fetch('/api/users/me/reservations')
      .then((r) => r.ok ? r.json() : [])
      .then((reservations) => {
        const ids = new Set(reservations.map((r) => r.matchId));
        setUserMatchIds(ids);
      })
      .catch(() => {});
  }, []);

  if (loading) return <Spinner />;

  if (matches.length === 0) {
    return (
      <section className="max-w-4xl mx-auto px-4 py-8">
        <h3 className="text-lg font-bold text-brand-600 mb-4">Proximos partidos</h3>
        <div className="text-center py-16 space-y-3">
          <div className="w-16 h-16 mx-auto rounded-full bg-gray-100 flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-gray-500 font-medium">No hay partidos programados</p>
          <p className="text-sm text-gray-400">Vuelve pronto para ver los proximos partidos</p>
        </div>
      </section>
    );
  }

  const grouped = groupByDay(matches);

  return (
    <section className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <h3 className="text-lg font-bold text-brand-600">Proximos partidos</h3>
      {Object.entries(grouped).map(([dayLabel, dayMatches]) => (
        <div key={dayLabel} className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-brand-50 flex items-center justify-center">
              <svg className="w-4 h-4 text-brand-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h4 className="font-semibold text-gray-700 text-sm">{dayLabel}</h4>
            <span className="text-[10px] bg-gray-100 text-gray-400 px-2 py-0.5 rounded-full">
              {dayMatches.length} {dayMatches.length === 1 ? 'partido' : 'partidos'}
            </span>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 pl-11">
            {dayMatches.map((m) => (
              <PublicMatchCard
                key={m._id}
                match={m}
                isReserved={userMatchIds.has(m._id)}
              />
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}
