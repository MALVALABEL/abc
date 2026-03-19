'use client';
import Link from 'next/link';
import { formatTime, formatCurrency } from '@/helpers/formatters';
import { formatMatchDay } from '@/helpers/dateHelpers';

export default function VenueSection({ venue, matches, userMatchIds }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="relative h-48 sm:h-56">
        <img
          src={venue.imageUrl}
          alt={venue.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <h3 className="text-xl font-extrabold text-white">{venue.name}</h3>
          {venue.schedule && (
            <p className="text-sm text-white/70 mt-1 flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {venue.schedule}
            </p>
          )}
        </div>
      </div>

      <div className="p-4 space-y-3">
        {matches.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-4">
            No hay partidos programados en esta cancha
          </p>
        ) : (
          matches.map((match) => (
            <VenueMatchRow
              key={match._id}
              match={match}
              isReserved={userMatchIds.has(match._id)}
            />
          ))
        )}
      </div>
    </div>
  );
}

function VenueMatchRow({ match, isReserved }) {
  const isFull = match.availableSlots <= 0;
  const percentage = (match.reservedSlots / match.maxSlots) * 100;
  const dayLabel = formatMatchDay(match.date);

  return (
    <Link
      href={`/partido/${match._id}`}
      className={`block relative rounded-xl border p-4 transition-all hover:shadow-md ${
        isReserved
          ? 'border-emerald-200 bg-emerald-50/50'
          : isFull
            ? 'border-accent-200 bg-accent-50/30'
            : 'border-gray-100 hover:border-brand-200'
      }`}
    >
      {isFull && <ConfirmedStamp />}

      <div className="flex items-center justify-between gap-3">
        <div className="space-y-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-brand-600 truncate">
              {dayLabel}
            </span>
            {isReserved && (
              <span className="shrink-0 text-[10px] font-bold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full">
                Reservado
              </span>
            )}
          </div>
          <div className="flex items-center gap-3 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {formatTime(match.time)}
            </span>
            <span className="text-gray-300">|</span>
            <span>
              {isFull
                ? `${match.maxSlots}/${match.maxSlots} cupos`
                : `${match.availableSlots} cupos libres`
              }
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {match.pricePerSlot > 0 && (
            <span className="text-xs font-bold text-accent-600">
              {formatCurrency(match.pricePerSlot)}
            </span>
          )}
          <div className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
            isReserved
              ? 'bg-emerald-500 text-white'
              : isFull
                ? 'bg-gray-100 text-gray-400'
                : 'gradient-accent text-white'
          }`}>
            {isReserved ? 'Ver reserva' : isFull ? 'Lleno' : 'Separar cupo'}
          </div>
        </div>
      </div>

      {!isFull && (
        <div className="mt-2 w-full bg-gray-100 rounded-full h-1.5">
          <div
            className={`h-1.5 rounded-full transition-all duration-500 ${
              percentage > 70 ? 'bg-accent-500' : 'bg-brand-400'
            }`}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>
      )}
    </Link>
  );
}

function ConfirmedStamp() {
  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-[-12deg] pointer-events-none z-10">
      <div className="border-[3px] border-accent-500 rounded-lg px-4 py-1.5 bg-white/80 backdrop-blur-sm">
        <span className="text-accent-600 font-extrabold text-sm tracking-wider uppercase whitespace-nowrap">
          Partido Confirmado
        </span>
      </div>
    </div>
  );
}
