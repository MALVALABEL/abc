export default function SlotCounter({ match }) {
  const available = match.availableSlots;
  const total = match.maxSlots;
  const taken = match.reservedSlots;
  const percentage = (taken / total) * 100;
  const isFull = available <= 0;

  const reservations = match.reservations || [];
  const confirmed = reservations.filter((r) => r.status === 'confirmed').length;
  const pending = reservations.filter((r) =>
    ['pending_payment', 'payment_uploaded'].includes(r.status)
  ).length;
  const empty = total - confirmed - pending;

  return (
    <div className="space-y-3">
      <div className="flex justify-between text-sm">
        <span className="text-gray-500">Cupos</span>
        <span className={`font-bold ${isFull ? 'text-red-500' : 'text-brand-500'}`}>
          {isFull ? 'LLENO' : `${available} de ${total} disponibles`}
        </span>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-2.5">
        <div
          className={`h-2.5 rounded-full transition-all duration-700 ease-out ${
            isFull ? 'bg-red-400' : percentage > 70 ? 'bg-accent-500' : 'bg-brand-400'
          }`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
      <div className="flex justify-center gap-1.5 flex-wrap">
        {Array.from({ length: confirmed }, (_, i) => (
          <div key={`c-${i}`} className="w-3 h-3 rounded-full bg-emerald-500" title="Confirmado" />
        ))}
        {Array.from({ length: pending }, (_, i) => (
          <div key={`p-${i}`} className="w-3 h-3 rounded-full bg-amber-400" title="Pendiente de pago" />
        ))}
        {Array.from({ length: Math.max(empty, 0) }, (_, i) => (
          <div key={`e-${i}`} className="w-3 h-3 rounded-full bg-gray-200" title="Disponible" />
        ))}
      </div>
      {(confirmed > 0 || pending > 0) && (
        <div className="flex justify-center gap-4 text-[10px] text-gray-400">
          {confirmed > 0 && (
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500" /> {confirmed} confirmados
            </span>
          )}
          {pending > 0 && (
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-amber-400" /> {pending} pendientes
            </span>
          )}
        </div>
      )}
    </div>
  );
}
