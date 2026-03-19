'use client';
import { useState, useEffect } from 'react';
import VenueSection from './VenueSection';
import Spinner from '@/components/ui/Spinner';
import { listMatches } from '@/services/matchService';
import { listVenues } from '@/services/venueService';
import { filterUpcomingMatches, groupMatchesByVenue } from '@/helpers/dateHelpers';

const MAX_MATCHES_PER_VENUE = 3;

export default function VenueMatchList() {
  const [venues, setVenues] = useState([]);
  const [grouped, setGrouped] = useState({});
  const [userMatchIds, setUserMatchIds] = useState(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([listVenues(), listMatches()])
      .then(([venueData, matchData]) => {
        setVenues(venueData);
        const upcoming = filterUpcomingMatches(matchData);
        upcoming.sort((a, b) => new Date(a.date) - new Date(b.date));
        const byVenue = groupMatchesByVenue(upcoming, venueData);
        Object.keys(byVenue).forEach((key) => {
          byVenue[key] = byVenue[key].slice(0, MAX_MATCHES_PER_VENUE);
        });
        setGrouped(byVenue);
      })
      .finally(() => setLoading(false));

    fetch('/api/users/me/reservations')
      .then((r) => (r.ok ? r.json() : []))
      .then((reservations) => {
        const ids = new Set(reservations.map((r) => r.matchId));
        setUserMatchIds(ids);
      })
      .catch(() => {});
  }, []);

  if (loading) return <Spinner />;

  if (venues.length === 0) {
    return (
      <section className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center py-16 space-y-3">
          <p className="text-gray-500 font-medium">No hay canchas configuradas</p>
        </div>
      </section>
    );
  }

  return (
    <section className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <h3 className="text-lg font-bold text-brand-600">Nuestras canchas</h3>
      {venues.map((venue) => (
        <VenueSection
          key={venue._id}
          venue={venue}
          matches={grouped[venue.name] || []}
          userMatchIds={userMatchIds}
        />
      ))}
    </section>
  );
}
