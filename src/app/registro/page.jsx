'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/ui/Header';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { registerUser } from '@/services/userService';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await registerUser(name, phone, password);
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
          <h2 className="text-xl font-bold text-brand-600">Crear cuenta</h2>
          <p className="text-sm text-gray-400 mt-1">Registrate en Partidos ABC</p>
        </div>
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
          <Input
            label="Nombre completo"
            placeholder="Ej: Juan Perez"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
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
            placeholder="Minimo 4 caracteres"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <p className="text-sm text-red-500">{error}</p>}
          <Button type="submit" variant="brand" loading={loading}>
            Crear cuenta
          </Button>
        </form>
        <p className="text-center text-sm text-gray-400">
          Ya tienes cuenta?{' '}
          <Link href="/login" className="text-brand-500 font-medium hover:underline">
            Ingresar
          </Link>
        </p>
      </div>
    </div>
  );
}
