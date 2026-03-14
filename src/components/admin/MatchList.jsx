'use client';
import Link from 'next/link';
import MatchCard from './MatchCard';

export default function MatchList({ matches }) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold text-brand-600">Partidos</h2>
        <Link
          href="/admin/crear"
          className="inline-flex items-center gap-1.5 px-4 py-2 gradient-accent text-white text-sm font-semibold rounded-xl hover:opacity-90 transition-opacity"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Nuevo partido
        </Link>
      </div>
      {matches.length === 0 ? (
        <div className="text-center py-12 space-y-3">
          <div className="w-14 h-14 mx-auto rounded-full bg-gray-100 flex items-center justify-center">
            <svg className="w-7 h-7 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-gray-400 font-medium">No hay partidos creados</p>
          <p className="text-sm text-gray-300">Crea tu primer partido para empezar</p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {matches.map((m) => (
            <MatchCard key={m._id} match={m} />
          ))}
        </div>
      )}
    </div>
  );
}
