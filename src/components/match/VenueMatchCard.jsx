import Link from 'next/link';
import { formatTime, formatCurrency } from '@/helpers/formatters';
import { formatMatchDay } from '@/helpers/dateHelpers';

export default function VenueMatchCard({ match, isReserved }) {
  const isFull = match.availableSlots <= 0;
  const dayLabel = formatMatchDay(match.date);

  return (
    <Link
      href={`/partido/${match._id}`}
      className={`block relative rounded-2xl border overflow-hidden transition-all hover:shadow-lg ${
        isReserved
          ? 'border-emerald-200 bg-white'
          : isFull
            ? 'border-gray-200 bg-gray-50 opacity-75'
            : 'border-gray-100 bg-white hover:border-accent-200'
      }`}
    >
      {isFull && <ConfirmedStamp />}

      {isReserved && (
        <div className="bg-emerald-50 px-5 py-2 flex items-center gap-1.5 border-b border-emerald-100">
          <svg className="w-3.5 h-3.5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-xs font-bold text-emerald-700">Ya tienes cupo reservado</span>
        </div>
      )}

      <div className="p-5 space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1.5">
            <h3
              className="text-lg text-brand-600"
              style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700 }}
            >
              {dayLabel}
            </h3>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {formatTime(match.time)}
              </span>
            </div>
          </div>
          {match.pricePerSlot > 0 && (
            <span className="text-lg font-bold text-accent-600">
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

      <div className={`px-5 py-3 text-center text-sm font-semibold border-t ${
        isReserved
          ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
          : isFull
            ? 'bg-gray-50 text-gray-400 border-gray-100'
            : 'gradient-accent text-white border-transparent'
      }`}>
        {isReserved ? 'Ver mi reserva' : isFull ? 'Partido confirmado' : 'Separar cupo'}
      </div>
    </Link>
  );
}

function ConfirmedStamp() {
  return (
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
  );
}
