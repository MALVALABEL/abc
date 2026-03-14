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
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border z-50 overflow-hidden">
            <div className="p-3 border-b">
              <p className="text-sm font-semibold text-gray-900">{user.name}</p>
              <p className="text-xs text-gray-400">{user.phone}</p>
              <p className="text-xs font-bold text-accent-600 mt-1">
                Saldo: ${user.balance?.toLocaleString('es-CO')}
              </p>
            </div>
            <Link href="/cuenta" className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setOpen(false)}>
              Mi cuenta
            </Link>
            <Link href="/cuenta/billetera" className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setOpen(false)}>
              Billetera
            </Link>
            <button onClick={onLogout} className="w-full text-left px-3 py-2 text-sm text-red-500 hover:bg-red-50">
              Cerrar sesion
            </button>
          </div>
        </>
      )}
    </div>
  );
}
