import { formatCurrency } from '@/helpers/formatters';

export default function PaymentInfo({ match }) {
  if (!match.pricePerSlot && !match.paymentInfo) return null;

  return (
    <div className="bg-blue-50 rounded-lg p-4 space-y-2">
      <h3 className="font-semibold text-blue-900 text-sm">Datos de pago</h3>
      {match.pricePerSlot > 0 && (
        <p className="text-blue-800 text-sm">
          Valor por cupo: <span className="font-bold">{formatCurrency(match.pricePerSlot)}</span>
        </p>
      )}
      {match.paymentInfo && (
        <p className="text-blue-700 text-sm whitespace-pre-line">{match.paymentInfo}</p>
      )}
    </div>
  );
}
