'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import MatchHeader from '@/components/match/MatchHeader';
import SlotCounter from '@/components/match/SlotCounter';
import ReservationTable from '@/components/admin/ReservationTable';
import Spinner from '@/components/ui/Spinner';
import Button from '@/components/ui/Button';
import { getMatch } from '@/services/matchService';

export default function AdminMatchDetail({ matchId }) {
  const [match, setMatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    getMatch(matchId)
      .then(setMatch)
      .finally(() => setLoading(false));
  }, [matchId]);

  if (loading) return <Spinner />;
  if (!match) return <p className="text-center text-gray-500">Partido no encontrado</p>;

  const publicUrl = `${window.location.origin}/partido/${matchId}`;

  const copyLink = () => {
    navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <Link href="/admin" className="text-sm text-green-600 hover:underline">
        ← Volver a partidos
      </Link>
      <MatchHeader match={match} />
      <SlotCounter match={match} />

      <div className="bg-white rounded-lg shadow p-4 space-y-2">
        <p className="text-sm font-medium text-gray-700">Link para compartir</p>
        <div className="flex gap-2">
          <input
            readOnly
            value={publicUrl}
            className="flex-1 text-xs bg-gray-50 border rounded px-2 py-2 truncate"
          />
          <button
            onClick={copyLink}
            className="px-3 py-2 bg-green-600 text-white text-xs rounded font-medium hover:bg-green-700"
          >
            {copied ? 'Copiado!' : 'Copiar'}
          </button>
        </div>
      </div>

      <ReservationTable matchId={matchId} />
    </div>
  );
}
