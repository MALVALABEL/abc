const styles = {
  pending_payment: 'bg-amber-50 text-amber-700 border-amber-200',
  payment_uploaded: 'bg-blue-50 text-blue-700 border-blue-200',
  confirmed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  rejected: 'bg-red-50 text-red-700 border-red-200',
  expired: 'bg-gray-50 text-gray-500 border-gray-200',
  cancelled: 'bg-gray-50 text-gray-500 border-gray-200',
};

const labels = {
  pending_payment: 'Pendiente de pago',
  payment_uploaded: 'Comprobante enviado',
  confirmed: 'Confirmado',
  rejected: 'Rechazado',
  expired: 'Expirado',
  cancelled: 'Cancelado',
};

export default function Badge({ status }) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold border ${
        styles[status] || 'bg-gray-50 border-gray-200'
      }`}
    >
      {labels[status] || status}
    </span>
  );
}
