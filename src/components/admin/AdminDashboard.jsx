'use client';
import { useState, useEffect } from 'react';
import StatsCards from './StatsCards';
import MatchList from './MatchList';
import Spinner from '@/components/ui/Spinner';
import { listMatches } from '@/services/matchService';

export default function AdminDashboard() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listMatches()
      .then(setMatches)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;

  return (
    <div className="space-y-6">
      <StatsCards matches={matches} />
      <MatchList matches={matches} />
    </div>
  );
}
