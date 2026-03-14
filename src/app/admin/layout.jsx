'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import AdminLogin from '@/components/admin/AdminLogin';

const LOGO_URL = 'https://pub-5fc99daf15b74e3ba338baec2584b710.r2.dev/abc/logo.jpg';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
  { href: '/admin/crear', label: 'Nuevo partido', icon: 'M12 4v16m8-8H4' },
  { href: '/admin/transacciones', label: 'Billeteras', icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z' },
  { href: '/admin/contabilidad', label: 'Contabilidad', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
];

export default function AdminLayout({ children }) {
  const [authed, setAuthed] = useState(false);
  const [checking, setChecking] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    const hasToken = document.cookie.includes('admin_token');
    setAuthed(hasToken);
    setChecking(false);
  }, []);

  if (checking) return null;
  if (!authed) return <AdminLogin onSuccess={() => setAuthed(true)} />;

  const handleLogout = () => {
    document.cookie = 'admin_token=; path=/; max-age=0';
    setAuthed(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="gradient-brand text-white shadow-lg">
        <div className="w-full px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img
              src={LOGO_URL}
              alt="Partidos ABC"
              className="w-8 h-8 rounded-full object-cover border-2 border-white/30"
            />
            <div>
              <h1 className="font-bold text-sm leading-tight">Partidos ABC</h1>
              <p className="text-[10px] text-white/50">Panel de administracion</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="text-xs text-white/60 hover:text-white transition-colors"
          >
            Cerrar sesion
          </button>
        </div>
      </header>

      <nav className="bg-white border-b shadow-sm">
        <div className="w-full px-4 flex gap-1 overflow-x-auto">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  active
                    ? 'border-accent-500 text-brand-600'
                    : 'border-transparent text-gray-400 hover:text-gray-600'
                }`}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                </svg>
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 py-6">{children}</main>
    </div>
  );
}
