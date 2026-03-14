'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getMe } from '@/services/userService';
import UserPanel from './UserPanel';

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
        <div className="flex items-center gap-2">
          {user ? (
            <>
              <Link href="/cuenta/billetera" className="text-xs bg-white/10 px-2.5 py-1 rounded-full">
                ${user.balance?.toLocaleString('es-CO')}
              </Link>
              <UserPanel user={user} onLogout={handleLogout} />
            </>
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
