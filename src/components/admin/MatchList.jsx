'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import MatchCard from './MatchCard';
import Button from '@/components/ui/Button';
import Spinner from '@/components/ui/Spinner';
import { listMatches } from '@/services/matchService';

export default function MatchList() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listMatches()
      .then(setMatches)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold text-gray-900">Partidos</h2>
        <Link href="/admin/crear">
          <Button className="w-auto px-4">+ Nuevo partido</Button>
        </Link>
      </div>
      {matches.length === 0 ? (
        <p className="text-center text-gray-500 py-8">No hay partidos creados</p>
      ) : (
        <div className="space-y-3">
          {matches.map((m) => (
            <MatchCard key={m._id} match={m} />
          ))}
        </div>
      )}
    </div>
  );
}
