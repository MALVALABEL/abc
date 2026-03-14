import Link from 'next/link';
import { formatDate, formatTime, formatCurrency } from '@/helpers/formatters';

export default function PublicMatchCard({ match }) {
  const isFull = match.availableSlots <= 0;
  const percentage = (match.reservedSlots / match.maxSlots) * 100;

  return (
    <Link
      href={`/partido/${match._id}`}
      className="block bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden card-hover"
    >
      <div className="p-5 space-y-3">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <h4 className="font-bold text-brand-600">{match.title}</h4>
            <div className="space-y-0.5">
              <p className="text-sm text-gray-500 flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {formatDate(match.date)}
              </p>
              <p className="text-sm text-gray-500 flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {formatTime(match.time)}
              </p>
            </div>
          </div>
          {match.pricePerSlot > 0 && (
            <span className="text-sm font-bold text-accent-600">
              {formatCurrency(match.pricePerSlot)}
            </span>
          )}
        </div>

        {match.location && (
          <p className="text-xs text-gray-400 flex items-center gap-1">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {match.location}
          </p>
        )}

        <div className="space-y-1.5">
          <div className="flex justify-between text-xs">
            <span className="text-gray-400">Cupos</span>
            <span className={`font-bold ${isFull ? 'text-red-500' : 'text-brand-500'}`}>
              {isFull ? 'LLENO' : `${match.availableSlots} disponibles`}
            </span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-500 ${
                isFull ? 'bg-red-400' : percentage > 70 ? 'bg-accent-500' : 'bg-brand-400'
              }`}
              style={{ width: `${Math.min(percentage, 100)}%` }}
            />
          </div>
        </div>
      </div>

      <div className={`px-5 py-2.5 text-center text-sm font-semibold ${
        isFull
          ? 'bg-gray-100 text-gray-400'
          : 'gradient-accent text-white'
      }`}>
        {isFull ? 'Sin cupos disponibles' : 'Reservar cupo'}
      </div>
    </Link>
  );
}
