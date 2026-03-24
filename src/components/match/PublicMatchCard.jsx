import Link from 'next/link';
import { formatTime, formatCurrency } from '@/helpers/formatters';

export default function PublicMatchCard({ match, isReserved }) {
  const isFull = match.availableSlots <= 0;

  return (
    <Link
      href={`/partido/${match._id}`}
      className={`block relative bg-white rounded-xl shadow-sm border overflow-hidden card-hover ${
        isReserved ? 'border-emerald-200 ring-1 ring-emerald-100' : isFull ? 'border-gray-200 opacity-75' : 'border-gray-100'
      }`}
    >
      {isFull && !isReserved && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-[-18deg] pointer-events-none z-10">
          <div className="border border-black/50 rounded px-4 py-1.5 bg-white/70 backdrop-blur-sm">
            <span
              className="text-black/60 text-xs tracking-[0.15em] uppercase whitespace-nowrap block text-center"
              style={{ fontFamily: "'Playfair Display', serif", fontWeight: 800 }}
            >
              Partido Confirmado
            </span>
          </div>
        </div>
      )}

      {isReserved && (
        <div className="bg-emerald-50 px-4 py-1.5 flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-xs font-bold text-emerald-700">Reservado</span>
        </div>
      )}

      <div className="p-5 space-y-3">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <h4 className="font-bold text-brand-600">{match.title}</h4>
            <div className="flex items-center gap-3 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {formatTime(match.time)}
              </span>
              {match.location && (
                <span className="flex items-center gap-1">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {match.location}
                </span>
              )}
            </div>
          </div>
          {match.pricePerSlot > 0 && (
            <span className="text-sm font-bold text-accent-600">
              {formatCurrency(match.pricePerSlot)}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          <span className={`w-2 h-2 rounded-full ${isFull ? 'bg-gray-300' : 'bg-emerald-500'}`} />
          <span className={`text-xs font-semibold ${isFull ? 'text-gray-400' : 'text-emerald-600'}`}>
            {isFull ? 'Partido completo' : 'Disponible'}
          </span>
        </div>
      </div>

      <div className={`px-5 py-2.5 text-center text-sm font-semibold ${
        isReserved
          ? 'bg-emerald-50 text-emerald-600'
          : isFull
            ? 'bg-accent-50 text-accent-600'
            : 'gradient-accent text-white'
      }`}>
        {isReserved ? 'Ver mi reserva' : isFull ? 'Partido confirmado' : 'Reservar cupo'}
      </div>
    </Link>
  );
}
