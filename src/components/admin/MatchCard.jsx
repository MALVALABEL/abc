import Link from 'next/link';
import { formatDate, formatTime } from '@/helpers/formatters';

const statusColors = {
  open: 'bg-emerald-50 text-emerald-700',
  closed: 'bg-red-50 text-red-700',
  completed: 'bg-gray-50 text-gray-500',
};

const statusLabels = {
  open: 'Abierto',
  closed: 'Cerrado',
  completed: 'Completado',
};

export default function MatchCard({ match }) {
  const isFull = match.availableSlots <= 0;
  const percentage = (match.reservedSlots / match.maxSlots) * 100;

  return (
    <Link
      href={`/admin/partido/${match._id}`}
      className="block bg-white rounded-xl border border-gray-100 overflow-hidden card-hover"
    >
      <div className="p-4 space-y-3">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <h3 className="font-bold text-brand-600">{match.title}</h3>
            <p className="text-xs text-gray-400">
              {formatDate(match.date)} - {formatTime(match.time)}
            </p>
          </div>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${statusColors[match.status]}`}>
            {statusLabels[match.status]}
          </span>
        </div>

        <div className="space-y-1.5">
          <div className="flex justify-between text-xs">
            <span className="text-gray-400">
              {match.reservedSlots}/{match.maxSlots} cupos
            </span>
            <span className={`font-bold ${isFull ? 'text-red-500' : 'text-brand-500'}`}>
              {isFull ? 'Cupos finalizados' : `${match.availableSlots} libres`}
            </span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-1.5">
            <div
              className={`h-1.5 rounded-full transition-all duration-500 ${
                isFull ? 'bg-red-400' : percentage > 70 ? 'bg-accent-500' : 'bg-brand-400'
              }`}
              style={{ width: `${Math.min(percentage, 100)}%` }}
            />
          </div>
        </div>
      </div>
    </Link>
  );
}
