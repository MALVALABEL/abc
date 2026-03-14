import Link from 'next/link';

const LOGO_URL = 'https://pub-5fc99daf15b74e3ba338baec2584b710.r2.dev/abc/logo.jpg';

export default function Header({ showAdmin = false }) {
  return (
    <header className="gradient-brand text-white shadow-lg">
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <img
            src={LOGO_URL}
            alt="Partidos ABC"
            className="w-10 h-10 rounded-full object-cover border-2 border-white/30"
          />
          <div>
            <h1 className="font-bold text-lg leading-tight">Partidos ABC</h1>
            <p className="text-xs text-white/60">Sports Center</p>
          </div>
        </Link>
        {showAdmin && (
          <Link
            href="/admin"
            className="text-xs bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-full transition-colors"
          >
            Admin
          </Link>
        )}
      </div>
    </header>
  );
}
