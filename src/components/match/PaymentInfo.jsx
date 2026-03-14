import { formatCurrency } from '@/helpers/formatters';

export default function PaymentInfo({ match }) {
  if (!match.pricePerSlot && !match.paymentInfo) return null;

  return (
    <div className="bg-brand-50 rounded-xl p-4 space-y-2 border border-brand-100">
      <h3 className="font-semibold text-brand-600 text-sm flex items-center gap-1.5">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
        Datos de pago
      </h3>
      {match.pricePerSlot > 0 && (
        <p className="text-brand-700 text-sm">
          Valor por cupo: <span className="font-bold text-accent-600">{formatCurrency(match.pricePerSlot)}</span>
        </p>
      )}
      {match.paymentInfo && (
        <p className="text-brand-600 text-sm whitespace-pre-line">{match.paymentInfo}</p>
      )}
    </div>
  );
}
