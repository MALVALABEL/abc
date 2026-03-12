const colors = {
  pending_payment: 'bg-yellow-100 text-yellow-800',
  payment_uploaded: 'bg-blue-100 text-blue-800',
  confirmed: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
  expired: 'bg-gray-100 text-gray-600',
  cancelled: 'bg-gray-100 text-gray-600',
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
      className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${colors[status] || 'bg-gray-100'}`}
    >
      {labels[status] || status}
    </span>
  );
}
