export default function Input({ label, error, ...props }) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <input
        className={`
          w-full px-4 py-3 rounded-xl border text-sm
          focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-transparent
          transition-all duration-200
          ${error ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-white'}
        `}
        {...props}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
