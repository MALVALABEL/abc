export default function ABCFooterSeal() {
  return (
    <footer className="py-10 px-4">
      <div className="max-w-4xl mx-auto flex flex-col items-center">
        <div className="relative flex flex-col items-center">
          {/* Lineas decorativas superiores */}
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-px bg-brand-300" />
            <div className="w-2 h-2 rounded-full border border-brand-300" />
            <div className="w-20 h-px bg-brand-300" />
            <div className="w-2 h-2 rounded-full border border-brand-300" />
            <div className="w-12 h-px bg-brand-300" />
          </div>

          {/* Sello circular */}
          <div className="relative w-28 h-28 rounded-full border-2 border-brand-400/40 flex items-center justify-center">
            <div className="absolute inset-1 rounded-full border border-brand-300/30" />
            <div className="text-center">
              <span
                className="text-2xl text-brand-600 block leading-none"
                style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900 }}
              >
                ABC
              </span>
              <div className="flex items-center gap-1.5 mt-1">
                <div className="w-3 h-px bg-brand-400" />
                <span
                  className="text-[8px] text-brand-400 tracking-[0.2em] uppercase"
                  style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700 }}
                >
                  Sports
                </span>
                <div className="w-3 h-px bg-brand-400" />
              </div>
              <span
                className="text-[7px] text-brand-300 tracking-[0.25em] uppercase mt-0.5 block"
                style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700 }}
              >
                Center
              </span>
            </div>
          </div>

          {/* Lineas decorativas inferiores */}
          <div className="flex items-center gap-3 mt-3">
            <div className="w-8 h-px bg-brand-200" />
            <div className="w-1.5 h-1.5 rotate-45 border border-brand-200" />
            <div className="w-16 h-px bg-brand-200" />
            <div className="w-1.5 h-1.5 rotate-45 border border-brand-200" />
            <div className="w-8 h-px bg-brand-200" />
          </div>
        </div>

        <p
          className="text-[10px] text-brand-300 tracking-[0.3em] uppercase mt-4"
          style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700 }}
        >
          Parche Futbolero
        </p>
      </div>
    </footer>
  );
}
