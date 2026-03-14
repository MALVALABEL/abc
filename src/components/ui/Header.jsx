'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getMe } from '@/services/userService';

const LOGO_URL = 'https://pub-5fc99daf15b74e3ba338baec2584b710.r2.dev/abc/logo.jpg';

export default function Header() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    getMe().then(setUser).catch(() => {});
  }, []);

  const handleLogout = () => {
    document.cookie = 'user_token=; path=/; max-age=0';
    setUser(null);
    window.location.reload();
  };

  return (
    <header className="gradient-brand text-white shadow-lg">
      <div className="w-full px-4 py-3 flex items-center justify-between">
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
        <div className="flex items-center gap-3">
          {user ? (
            <UserMenu user={user} onLogout={handleLogout} />
          ) : (
            <Link
              href="/login"
              className="text-xs bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-full transition-colors"
            >
              Ingresar
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

function UserMenu({ user, onLogout }) {
  const [open, setOpen] = useState(false);
  const days = user.preferredDays || [];

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-full transition-colors"
      >
        <div className="w-6 h-6 rounded-full bg-accent-500 flex items-center justify-center text-xs font-bold">
          {user.name.charAt(0).toUpperCase()}
        </div>
        <span className="text-xs font-medium max-w-[80px] truncate">{user.name}</span>
        <svg className={`w-3 h-3 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-xl border z-50 overflow-hidden">
            <div className="p-4 gradient-brand text-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-lg font-bold">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-sm">{user.name}</p>
                  <p className="text-xs text-white/60">{user.phone}</p>
                </div>
              </div>
              <div className="mt-3 p-2 bg-white/10 rounded-xl">
                <p className="text-[10px] text-white/50 uppercase tracking-wider">Saldo</p>
                <p className="text-lg font-bold">${user.balance?.toLocaleString('es-CO')}</p>
              </div>
            </div>

            <div className="p-3 border-b space-y-2">
              <div className="flex items-center gap-2">
                {user.isGoalkeeper && (
                  <span className="text-[10px] font-bold bg-violet-50 text-violet-600 px-2 py-0.5 rounded-full border border-violet-200">
                    ARQUERO
                  </span>
                )}
                {days.length > 0 && (
                  <span className="text-[10px] text-gray-400">
                    Juega: {days.join(', ')}
                  </span>
                )}
              </div>
              {user.preferredTime && (
                <p className="text-[10px] text-gray-400">
                  Hora preferida: {user.preferredTime}
                </p>
              )}
            </div>

            <div className="py-1">
              <Link href="/cuenta" className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setOpen(false)}>
                <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Mi cuenta
              </Link>
              <Link href="/cuenta/billetera" className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setOpen(false)}>
                <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                Billetera
              </Link>
            </div>

            <div className="border-t">
              <button onClick={onLogout} className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Cerrar sesion
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
