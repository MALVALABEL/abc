'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/ui/Header';
import useUser from '@/hooks/useUser';
import UserDashboard from '@/components/user/UserDashboard';
import Spinner from '@/components/ui/Spinner';

export default function CuentaPage() {
  const router = useRouter();
  const { user, loading } = useUser();

  useEffect(() => {
    if (!loading && !user) router.push('/login');
  }, [loading, user, router]);

  if (loading) return <Spinner />;
  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-lg mx-auto px-4 py-6">
        <UserDashboard user={user} />
      </div>
    </div>
  );
}
