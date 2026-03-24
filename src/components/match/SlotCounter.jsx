export default function SlotCounter({ match }) {
  const isFull = match.availableSlots <= 0;

  return (
    <div className="flex items-center gap-2">
      <span className={`w-2.5 h-2.5 rounded-full ${isFull ? 'bg-gray-300' : 'bg-emerald-500'}`} />
      <span className={`text-sm font-semibold ${isFull ? 'text-accent-600' : 'text-emerald-600'}`}>
        {isFull ? 'Partido completo' : 'Disponible'}
      </span>
    </div>
  );
}
