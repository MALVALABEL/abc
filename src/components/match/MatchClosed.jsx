import Link from 'next/link';

export default function MatchClosed() {
  return (
    <div className="text-center space-y-4 p-6 bg-gray-50 rounded-2xl border border-gray-100">
      <div className="w-14 h-14 mx-auto rounded-full bg-gray-100 flex items-center justify-center">
        <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
        </svg>
      </div>
      <h2 className="text-xl font-bold text-gray-700">Cupos agotados</h2>
      <p className="text-gray-400 text-sm">
        Elige otra fecha para jugar.
      </p>
      <Link
        href="/"
        className="inline-block gradient-accent text-white text-sm font-semibold px-6 py-2.5 rounded-xl hover:shadow-md transition-all"
      >
        Partidos disponibles
      </Link>
    </div>
  );
}
