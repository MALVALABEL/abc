export default function SlotCounter({ match }) {
  const available = match.availableSlots;
  const total = match.maxSlots;
  const taken = match.reservedSlots;
  const percentage = (taken / total) * 100;
  const isFull = available <= 0;

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-gray-600">Cupos</span>
        <span className={`font-bold ${isFull ? 'text-red-600' : 'text-green-600'}`}>
          {isFull ? 'LLENO' : `${available} de ${total} disponibles`}
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-3">
        <div
          className={`h-3 rounded-full transition-all duration-500 ${
            isFull ? 'bg-red-500' : percentage > 70 ? 'bg-yellow-500' : 'bg-green-500'
          }`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
      <div className="flex justify-center gap-1">
        {Array.from({ length: total }, (_, i) => (
          <div
            key={i}
            className={`w-3 h-3 rounded-full ${
              i < taken ? 'bg-green-500' : 'bg-gray-200'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
