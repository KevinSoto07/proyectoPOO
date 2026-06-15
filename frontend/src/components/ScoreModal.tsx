import { useEffect, useState } from 'react';
import { fetchNotaGlobal } from '../api/api';

interface ScoreModalProps {
  usuarioId: number;
  isOpen: boolean;
  onClose: () => void;
}

export default function ScoreModal({ usuarioId, isOpen, onClose }: ScoreModalProps) {
  const [nota, setNota] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      fetchNotaGlobal(usuarioId)
        .then((puntos) => {
          setNota(puntos);
        })
        .catch((err) => {
          console.error("Error al obtener nota:", err);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [isOpen, usuarioId]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm bg-black/60">
      {/* Tarjeta del Modal */}
      <div 
        className="w-full max-w-sm rounded-2xl p-8 flex flex-col items-center text-center shadow-2xl border border-[#21262d]"
        style={{ backgroundColor: '#161b22' }}
      >
        {/* Ícono de Medalla / Trofeo */}
        <div className="w-20 h-20 rounded-full bg-[#39d98a]/20 flex items-center justify-center mb-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#39d98a"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-10 h-10"
          >
            <circle cx="12" cy="8" r="6" />
            <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" />
          </svg>
        </div>

        {/* Títulos */}
        <h2 className="text-2xl font-bold text-white mb-2">¡Felicidades!</h2>
        <p className="text-[#8b949e] text-sm mb-8">
          Has completado todas las actividades con éxito. Este es tu resultado global:
        </p>

        {/* Puntaje */}
        <div className="flex items-baseline gap-1 mb-10">
          <span className="text-6xl font-bold" style={{ color: '#39d98a' }}>
            {loading ? "..." : nota}
          </span>
          <span className="text-xl text-[#8b949e]">/ 100</span>
        </div>

        {/* Botón de cierre */}
        <button
          onClick={onClose}
          className="w-full py-3 px-6 rounded-xl font-semibold transition-all duration-200 active:scale-95"
          style={{ 
            backgroundColor: '#39d98a',
            color: '#0d1117'
          }}
        >
          Entendido
        </button>
      </div>
    </div>
  );
}