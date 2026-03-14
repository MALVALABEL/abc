'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/ui/Header';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { loginUser } from '@/services/userService';

export default function LoginPage() {
  const router = useRouter();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await loginUser(phone, password);
      router.push('/');
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-sm mx-auto px-4 py-10 space-y-6">
        <div className="text-center">
          <h2 className="text-xl font-bold text-brand-600">Ingresar</h2>
          <p className="text-sm text-gray-400 mt-1">Accede a tu cuenta de Partidos ABC</p>
        </div>
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
          <Input
            label="Celular"
            type="tel"
            placeholder="Ej: 3001234567"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <Input
            label="Contrasena"
            type="password"
            placeholder="Tu contrasena"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <p className="text-sm text-red-500">{error}</p>}
          <Button type="submit" variant="brand" loading={loading}>
            Ingresar
          </Button>
        </form>
        <p className="text-center text-sm text-gray-400">
          No tienes cuenta?{' '}
          <Link href="/registro" className="text-brand-500 font-medium hover:underline">
            Registrate
          </Link>
        </p>
      </div>
    </div>
  );
}
