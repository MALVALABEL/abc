'use client';
import { useState, useEffect, useCallback } from 'react';
import { getMatch } from '@/services/matchService';

const POLL_INTERVAL = 15000;

export default function useMatchData(matchId, initialData) {
  const [match, setMatch] = useState(initialData);
  const [loading, setLoading] = useState(!initialData);

  const refresh = useCallback(async () => {
    try {
      const data = await getMatch(matchId);
      setMatch(data);
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }, [matchId]);

  useEffect(() => {
    if (!initialData) refresh();
    const interval = setInterval(refresh, POLL_INTERVAL);
    return () => clearInterval(interval);
  }, [refresh, initialData]);

  return { match, loading, refresh };
}
