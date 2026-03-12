const variants = {
  primary: 'bg-green-600 hover:bg-green-700 text-white',
  danger: 'bg-red-500 hover:bg-red-600 text-white',
  secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800',
  outline: 'border-2 border-green-600 text-green-600 hover:bg-green-50',
};

export default function Button({
  children,
  variant = 'primary',
  disabled = false,
  loading = false,
  className = '',
  ...props
}) {
  return (
    <button
      className={`
        px-4 py-3 rounded-lg font-semibold text-sm
        transition-colors duration-200
        disabled:opacity-50 disabled:cursor-not-allowed
        w-full ${variants[variant]} ${className}
      `}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="flex items-center justify-center gap-2">
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Cargando...
        </span>
      ) : children}
    </button>
  );
}
