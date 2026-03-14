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
  noRefundWarning,
}) {
  if (reservation.status === 'confirmed') {
    return (
      <div className="space-y-4">
        <div className="text-center space-y-3 p-6 bg-emerald-50 rounded-2xl border border-emerald-100">
          <div className="w-14 h-14 mx-auto rounded-full bg-emerald-100 flex items-center justify-center">
            <svg className="w-8 h-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-emerald-800">Cupo confirmado</h2>
          <p className="text-emerald-600 text-sm">Tu pago fue aprobado. Nos vemos en la cancha!</p>
        </div>
        <div className="text-center pt-2">
          <CancelButton
            onCancel={onCancel}
            paidWithWallet={reservation.paidWithWallet}
            noRefundWarning={noRefundWarning}
          />
        </div>
      </div>
    );
  }

  if (reservation.status === 'refund_requested') {
    return (
      <div className="text-center space-y-3 p-6 bg-violet-50 rounded-2xl border border-violet-100">
        <div className="w-14 h-14 mx-auto rounded-full bg-violet-100 flex items-center justify-center">
          <svg className="w-8 h-8 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-lg font-bold text-violet-800">Devolucion solicitada</h2>
        <p className="text-violet-600 text-sm">Tu solicitud de devolucion esta siendo revisada.</p>
      </div>
    );
  }

  if (reservation.status === 'payment_uploaded') {
    return (
      <div className="text-center space-y-3 p-6 bg-blue-50 rounded-2xl border border-blue-100">
        <div className="w-14 h-14 mx-auto rounded-full bg-blue-100 flex items-center justify-center">
          <svg className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-lg font-bold text-blue-800">Comprobante enviado</h2>
        <p className="text-blue-600 text-sm">Estamos verificando tu pago. Te confirmaremos pronto.</p>
        <Badge status="payment_uploaded" />
      </div>
    );
  }

  if (reservation.status === 'rejected') {
    return (
      <div className="text-center space-y-3 p-6 bg-red-50 rounded-2xl border border-red-100">
        <div className="w-14 h-14 mx-auto rounded-full bg-red-100 flex items-center justify-center">
          <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-lg font-bold text-red-800">Pago rechazado</h2>
        <p className="text-red-600 text-sm">Tu comprobante no fue aprobado. Contacta al organizador.</p>
      </div>
    );
  }

  // pending_payment
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
      <div className="text-center">
        <h2 className="text-lg font-bold text-brand-600">Cupo reservado!</h2>
        <p className="text-sm text-gray-500">
          Tienes 10 minutos para transferir y subir el comprobante
        </p>
      </div>
      <Timer expiresAt={reservation.expiresAt} onExpired={onExpired} />
      <PaymentInfo match={match} />
      <UploadReceipt onUpload={onUpload} />
      <div className="text-center pt-2">
        <CancelButton onCancel={onCancel} paidWithWallet={false} noRefundWarning={false} />
      </div>
    </div>
  );
}
