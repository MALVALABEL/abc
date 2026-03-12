import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-gray-900">Partidos ABC</h1>
        <p className="text-gray-500">Sistema de reserva de cupos</p>
        <Link
          href="/admin"
          className="inline-block px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
        >
          Panel de administracion
        </Link>
      </div>
    </div>
  );
}
