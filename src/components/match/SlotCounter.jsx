export default function SlotCounter({ match }) {
  const available = match.availableSlots;
  const total = match.maxSlots;
  const taken = match.reservedSlots;
  const percentage = (taken / total) * 100;
  const isFull = available <= 0;

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
      <div className="flex justify-center gap-1.5">
        {Array.from({ length: total }, (_, i) => (
          <div
            key={i}
            className={`w-3 h-3 rounded-full transition-colors duration-300 ${
              i < taken ? 'bg-brand-400' : 'bg-gray-200'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
