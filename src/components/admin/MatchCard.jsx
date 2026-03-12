import Link from 'next/link';
import { formatDate, formatTime } from '@/helpers/formatters';

export default function MatchCard({ match }) {
  const isFull = match.availableSlots <= 0;

  return (
    <Link
      href={`/admin/partido/${match._id}`}
      className="block bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow"
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-bold text-gray-900">{match.title}</h3>
          <p className="text-sm text-gray-500">{formatDate(match.date)}</p>
          <p className="text-sm text-gray-500">{formatTime(match.time)}</p>
        </div>
        <div className="text-right">
          <span className={`text-sm font-bold ${isFull ? 'text-red-600' : 'text-green-600'}`}>
            {match.reservedSlots}/{match.maxSlots}
          </span>
          <p className="text-xs text-gray-400">cupos</p>
        </div>
      </div>
    </Link>
  );
}
