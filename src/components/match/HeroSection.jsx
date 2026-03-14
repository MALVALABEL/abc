const LOGO_URL = 'https://pub-5fc99daf15b74e3ba338baec2584b710.r2.dev/abc/logo.jpg';

export default function HeroSection() {
  return (
    <section className="gradient-brand text-white py-12 px-4 -mt-px">
      <div className="max-w-4xl mx-auto text-center space-y-4">
        <img
          src={LOGO_URL}
          alt="Partidos ABC"
          className="w-24 h-24 mx-auto rounded-full object-cover border-4 border-white/20 shadow-lg"
        />
        <h2 className="text-3xl font-extrabold tracking-tight">
          Reserva tu cupo
        </h2>
        <p className="text-white/70 max-w-md mx-auto">
          Escoge tu partido, paga y asegura tu lugar en la cancha.
          Facil, rapido y sin complicaciones.
        </p>
        <div className="flex items-center justify-center gap-6 text-sm text-white/50 pt-2">
          <div className="flex items-center gap-1.5">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Reserva inmediata
          </div>
          <div className="flex items-center gap-1.5">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            Pago seguro
          </div>
          <div className="flex items-center gap-1.5">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            En tiempo real
          </div>
        </div>
      </div>
    </section>
  );
}
