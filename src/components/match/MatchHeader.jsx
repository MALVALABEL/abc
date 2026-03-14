import { formatDate, formatTime } from '@/helpers/formatters';

export default function MatchHeader({ match }) {
  return (
    <div className="text-center space-y-3">
      <h1 className="text-xl font-bold text-brand-600">{match.title}</h1>
      <div className="flex flex-wrap items-center justify-center gap-3 text-sm text-gray-500">
        <span className="flex items-center gap-1.5">
          <svg className="w-4 h-4 text-accent-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          {formatDate(match.date)}
        </span>
        <span className="flex items-center gap-1.5">
          <svg className="w-4 h-4 text-accent-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {formatTime(match.time)}
        </span>
        {match.location && (
          <span className="flex items-center gap-1.5">
            <svg className="w-4 h-4 text-accent-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {match.location}
          </span>
        )}
      </div>
    </div>
  );
}
