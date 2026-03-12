'use client';
import { useState, useEffect } from 'react';
import AdminLogin from '@/components/admin/AdminLogin';

export default function AdminLayout({ children }) {
  const [authed, setAuthed] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    // Si hay cookie de admin, ya esta autenticado
    const hasToken = document.cookie.includes('admin_token');
    setAuthed(hasToken);
    setChecking(false);
  }, []);

  if (checking) return null;

  if (!authed) {
    return <AdminLogin onSuccess={() => setAuthed(true)} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-lg mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="font-bold text-gray-900">Partidos ABC</h1>
          <span className="text-xs text-gray-400">Admin</span>
        </div>
      </header>
      <main className="max-w-lg mx-auto px-4 py-6">{children}</main>
    </div>
  );
}
