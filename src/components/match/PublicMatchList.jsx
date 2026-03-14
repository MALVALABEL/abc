'use client';
import { useState, useEffect } from 'react';
import PublicMatchCard from './PublicMatchCard';
import Spinner from '@/components/ui/Spinner';
import { listMatches } from '@/services/matchService';

export default function PublicMatchList() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listMatches()
      .then((data) => {
        const open = data.filter((m) => m.status === 'open');
        setMatches(open);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;

  return (
    <section className="max-w-4xl mx-auto px-4 py-8">
      <h3 className="text-lg font-bold text-brand-600 mb-4">
        Proximos partidos
      </h3>
      {matches.length === 0 ? (
        <div className="text-center py-16 space-y-3">
          <div className="w-16 h-16 mx-auto rounded-full bg-gray-100 flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-gray-500 font-medium">No hay partidos programados</p>
          <p className="text-sm text-gray-400">Vuelve pronto para ver los proximos partidos</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {matches.map((m) => (
            <PublicMatchCard key={m._id} match={m} />
          ))}
        </div>
      )}
    </section>
  );
}
