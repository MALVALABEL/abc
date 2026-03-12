import useCountdown from '@/hooks/useCountdown';

export default function Timer({ expiresAt, onExpired }) {
  const { formatted, isExpired, remaining } = useCountdown(expiresAt);

  if (isExpired) {
    if (onExpired) onExpired();
    return (
      <div className="text-center p-4 bg-red-50 rounded-lg">
        <p className="text-red-600 font-semibold">Tiempo agotado</p>
        <p className="text-sm text-red-500">Tu reserva ha expirado</p>
      </div>
    );
  }

  const isUrgent = remaining < 120;

  return (
    <div className={`text-center p-4 rounded-lg ${isUrgent ? 'bg-red-50' : 'bg-yellow-50'}`}>
      <p className="text-xs text-gray-500 mb-1">Tiempo para subir comprobante</p>
      <p className={`text-3xl font-mono font-bold ${isUrgent ? 'text-red-600' : 'text-yellow-700'}`}>
        {formatted}
      </p>
    </div>
  );
}
