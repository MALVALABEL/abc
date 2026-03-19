'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/ui/Header';
import Spinner from '@/components/ui/Spinner';
import Footer from '@/components/ui/Footer';
import VenueMatchCard from '@/components/match/VenueMatchCard';
import { listMatches } from '@/services/matchService';
import { filterUpcomingMatches } from '@/helpers/dateHelpers';

export default function VenueDetail({ venueId }) {
  const [venue, setVenue] = useState(null);
  const [matches, setMatches] = useState([]);
  const [userMatchIds, setUserMatchIds] = useState(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(`/api/venues/${venueId}`).then((r) => r.json()),
      listMatches(),
    ])
      .then(([venueData, matchData]) => {
        setVenue(venueData);
        const upcoming = filterUpcomingMatches(matchData);
        upcoming.sort((a, b) => new Date(a.date) - new Date(b.date));
        const venueMatches = upcoming.filter(
          (m) =>
            m.location?.toLowerCase().includes(venueData.name?.toLowerCase()) ||
            venueData.name?.toLowerCase().includes(m.location?.toLowerCase())
        );
        setMatches(venueMatches);
      })
      .finally(() => setLoading(false));

    fetch('/api/users/me/reservations')
      .then((r) => (r.ok ? r.json() : []))
      .then((res) => setUserMatchIds(new Set(res.map((r) => r.matchId))))
      .catch(() => {});
  }, [venueId]);

  if (loading) return <div className="min-h-screen bg-gray-50"><Header /><Spinner /></div>;
  if (!venue) return <div className="min-h-screen bg-gray-50"><Header /><p className="text-center py-20 text-gray-400">Cancha no encontrada</p></div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <VenueHero venue={venue} />
      <section className="max-w-5xl mx-auto px-4 py-8 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-brand-600">Fechas de partidos</h2>
          <span className="text-xs text-gray-400">
            {matches.length} {matches.length === 1 ? 'disponible' : 'disponibles'}
          </span>
        </div>

        {matches.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {matches.map((match) => (
              <VenueMatchCard
                key={match._id}
                match={match}
                isReserved={userMatchIds.has(match._id)}
              />
            ))}
          </div>
        )}

        <BackButton />
      </section>
      <Footer />
    </div>
  );
}

function VenueHero({ venue }) {
  return (
    <div className="relative h-56 sm:h-72">
      <img
        src={venue.imageUrl}
        alt={venue.name}
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black/50" />
      <div className="absolute bottom-0 left-0 right-0 p-6">
        <div className="max-w-5xl mx-auto">
          <h1
            className="text-3xl sm:text-4xl text-white drop-shadow-lg"
            style={{ fontFamily: "'Playfair Display', serif", fontWeight: 800 }}
          >
            {venue.name}
          </h1>
          {venue.schedule && (
            <p className="text-white/80 mt-2 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {venue.schedule}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="text-center py-12 space-y-3">
      <div className="w-16 h-16 mx-auto rounded-full bg-gray-100 flex items-center justify-center">
        <svg className="w-8 h-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
      <p className="text-gray-400 font-medium">No hay partidos programados</p>
      <p className="text-sm text-gray-300">Vuelve pronto para ver nuevas fechas</p>
    </div>
  );
}

function BackButton() {
  return (
    <div className="pt-4">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm font-medium text-brand-500 hover:text-brand-600 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Ver otras canchas
      </Link>
    </div>
  );
}
