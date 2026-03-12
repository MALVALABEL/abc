export default function Input({ label, error, ...props }) {
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <input
        className={`
          w-full px-3 py-3 rounded-lg border text-sm
          focus:outline-none focus:ring-2 focus:ring-green-500
          ${error ? 'border-red-400 bg-red-50' : 'border-gray-300'}
        `}
        {...props}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
