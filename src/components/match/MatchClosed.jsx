export default function MatchClosed() {
  return (
    <div className="text-center space-y-3 p-6 bg-gray-50 rounded-lg">
      <svg className="w-12 h-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
      </svg>
      <h2 className="text-xl font-bold text-gray-700">Cupos agotados</h2>
      <p className="text-gray-500 text-sm">
        Todos los cupos para este partido ya fueron reservados.
      </p>
    </div>
  );
}
