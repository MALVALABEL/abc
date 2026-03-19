export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white mt-8">
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-3 text-center">
        <p className="text-xs text-gray-400">
          Dudas e inquietudes: <a href="https://wa.me/573105774577" className="text-accent-500 font-medium hover:underline">310 577 4577</a>
        </p>
        <div className="w-12 h-px bg-gray-200 mx-auto" />
        <p className="text-[11px] text-gray-300">
          ABC Sports Center. Todos los derechos reservados.
        </p>
        <p className="text-[10px] text-gray-300">
          Hecho por <a href="https://valhora.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-brand-500 transition-colors">Valhora</a>
        </p>
      </div>
    </footer>
  );
}
