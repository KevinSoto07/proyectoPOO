import { useEffect, useState } from 'react';
import { fetchLecciones, type LeccionConActividades } from '../api/api';
import Header from '../components/Header';

// Estos componentes los harán los otros integrantes
// Los importamos ya para que el archivo compile cuando estén listos
 import LessonCard  from '../components/LessonCard';
// import ScoreModal  from '../components/ScoreModal';

const HomePage = () => {
  const [usuarioId, setUsuarioId]           = useState<number | null>(null);
  const [lecciones, setLecciones]           = useState<LeccionConActividades[]>([]);
  const [expandedId, setExpandedId]         = useState<number | null>(null);
  const [actividadesRespondidas, setActividadesRespondidas] = useState<Set<number>>(new Set());
  const [showModal, setShowModal]           = useState(false);
  const [loading, setLoading]               = useState(true);
  const [error, setError]                   = useState<string | null>(null);

  // ── Inicializar usuario ───────────────────────────────────────────
  useEffect(() => {
    const idGuardado = localStorage.getItem('usuario_id');
    if (idGuardado) {
      setUsuarioId(Number(idGuardado));
    } else {
      // crearUsuario() lo importará cuando el backend esté corriendo
      import('../api/api').then(({ crearUsuario }) => {
        crearUsuario()
          .then((id) => {
            localStorage.setItem('usuario_id', String(id));
            setUsuarioId(id);
          })
          .catch(() => setError('No se pudo crear el usuario'));
      });
    }
  }, []);

  // ── Cargar lecciones ──────────────────────────────────────────────
  useEffect(() => {
    fetchLecciones()
      .then((data) => {
        // El backend devuelve filas planas (una por actividad), hay que agrupar
        const agrupadas = agruparPorLeccion(data);
        setLecciones(agrupadas);
      })
      .catch(() => setError('No se pudieron cargar las lecciones'))
      .finally(() => setLoading(false));
  }, []);

  // ── Agrupar filas planas por lección ──────────────────────────────
  const agruparPorLeccion = (filas: any[]): LeccionConActividades[] => {
    const mapa = new Map<number, LeccionConActividades>();

    filas.forEach((fila) => {
      if (!mapa.has(fila.leccion_id)) {
        mapa.set(fila.leccion_id, {
          leccion_id:          fila.leccion_id,
          leccion_numero:      fila.leccion_numero,
          leccion_nombre:      fila.leccion_nombre,
          leccion_descripcion: fila.leccion_descripcion,
          actividades:         [],
        });
      }
      if (fila.actividad_id) {
        mapa.get(fila.leccion_id)!.actividades.push({
          actividad_id:          fila.actividad_id,
          actividad_nombre:      fila.actividad_nombre,
          actividad_descripcion: fila.actividad_descripcion,
          puntaje_maximo:        fila.puntaje_maximo,
          actividad_orden:       fila.actividad_orden,
        });
      }
    });

    return Array.from(mapa.values()).sort(
      (a, b) => a.leccion_numero - b.leccion_numero
    );
  };

  // ── Toggle de lección expandida ───────────────────────────────────
  const handleToggleLeccion = (id: number) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  // ── Callback que llaman los ActivityItem al guardar ───────────────
  const handleRespuestaGuardada = (actividadId: number) => {
    setActividadesRespondidas((prev) => new Set(prev).add(actividadId));
  };

  // ── Calcular si todas las actividades fueron respondidas ──────────
  const totalActividades = lecciones.reduce(
    (acc, l) => acc + l.actividades.length, 0
  );
  const todasRespondidas =
    totalActividades > 0 && actividadesRespondidas.size >= totalActividades;

  // ── Render ────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-bgBase flex items-center justify-center">
        <p className="text-textMuted text-sm animate-pulse">Cargando lecciones...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-bgBase flex items-center justify-center">
        <p className="text-red-400 text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bgBase">
      <Header />

      <main className="max-w-3xl mx-auto px-4 py-8 space-y-4">
        {lecciones.map((leccion) => (
          // Cuando LessonCard esté listo, reemplazar este div por el componente:
           <LessonCard
             key={leccion.leccion_id}
             leccion={leccion}
             isExpanded={expandedId === leccion.leccion_id}
             onToggle={() => handleToggleLeccion(leccion.leccion_id)}
             usuarioId={usuarioId!}
             actividadesRespondidas={actividadesRespondidas}
             onRespuestaGuardada={handleRespuestaGuardada}
          /> 

        ))}
      </main>

      {/* Botón Mostrar Calificación */}
      <div className="fixed bottom-6 left-0 right-0 flex justify-center">
        <button
          onClick={() => todasRespondidas && setShowModal(true)}
          className={`
            flex items-center gap-2 px-6 py-3 rounded-full font-medium
            transition-all duration-300 text-sm
            ${todasRespondidas
              ? 'bg-accentGreen text-bgBase cursor-pointer hover:brightness-110'
              : 'bg-accentGreenDark text-textMuted cursor-not-allowed opacity-70'
            }
          `}
        >
          {/* Ícono medalla */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="w-4 h-4"
          >
            <circle cx="12" cy="8" r="6" />
            <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" />
          </svg>
          Mostrar Calificación
        </button>
      </div>

      {/* Modal — cuando ScoreModal esté listo, descomentar:
      {showModal && usuarioId && (
        <ScoreModal
          usuarioId={usuarioId}
          isOpen={showModal}
          onClose={() => setShowModal(false)}
        />
      )} */}
    </div>
  );
};

export default HomePage;