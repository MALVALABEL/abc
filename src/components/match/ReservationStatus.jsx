'use client';
import Timer from '@/components/ui/Timer';
import Badge from '@/components/ui/Badge';
import UploadReceipt from './UploadReceipt';
import CancelButton from './CancelButton';
import PaymentInfo from './PaymentInfo';

export default function ReservationStatus({
  reservation,
  match,
  onUpload,
  onCancel,
  onExpired,
}) {
  if (reservation.status === 'confirmed') {
    return (
      <div className="text-center space-y-3 p-6 bg-green-50 rounded-lg">
        <svg className="w-12 h-12 mx-auto text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h2 className="text-xl font-bold text-green-800">Cupo confirmado</h2>
        <p className="text-green-700">Tu pago fue aprobado. Nos vemos en la cancha!</p>
      </div>
    );
  }

  if (reservation.status === 'payment_uploaded') {
    return (
      <div className="text-center space-y-3 p-6 bg-blue-50 rounded-lg">
        <svg className="w-12 h-12 mx-auto text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h2 className="text-lg font-bold text-blue-800">Comprobante enviado</h2>
        <p className="text-blue-700 text-sm">Estamos verificando tu pago. Te confirmaremos pronto.</p>
        <Badge status="payment_uploaded" />
      </div>
    );
  }

  if (reservation.status === 'rejected') {
    return (
      <div className="text-center space-y-3 p-6 bg-red-50 rounded-lg">
        <h2 className="text-lg font-bold text-red-800">Pago rechazado</h2>
        <p className="text-red-700 text-sm">Tu comprobante no fue aprobado. Contacta al organizador.</p>
      </div>
    );
  }

  // pending_payment
  return (
    <div className="space-y-4">
      <div className="text-center">
        <h2 className="text-lg font-bold text-gray-900">Cupo reservado!</h2>
        <p className="text-sm text-gray-600">
          Tienes 10 minutos para transferir y subir el comprobante
        </p>
      </div>
      <Timer expiresAt={reservation.expiresAt} onExpired={onExpired} />
      <PaymentInfo match={match} />
      <UploadReceipt onUpload={onUpload} />
      <div className="text-center pt-2">
        <CancelButton onCancel={onCancel} />
      </div>
    </div>
  );
}
