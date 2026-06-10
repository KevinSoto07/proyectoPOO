const Header = () => {
  return (
    <header className="w-full py-6 px-4 border-b border-borderNormal">
      <div className="max-w-3xl mx-auto flex items-center gap-4">
        {/* Ícono libro */}
        <div className="w-12 h-12 rounded-lg bg-accentBlue/20 flex items-center justify-center flex-shrink-0">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#58a6ff"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-6 h-6"
          >
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
          </svg>
        </div>

        {/* Textos */}
        <div>
          <h1 className="text-xl font-semibold text-textPrimary">
            Matemáticas Esenciales: Números y Formas
          </h1>
          <p className="text-sm text-textMuted mt-0.5">
            Avanza a tu propio ritmo. Respira, lee y resuelve.
          </p>
        </div>
      </div>
    </header>
  );
};

export default Header;