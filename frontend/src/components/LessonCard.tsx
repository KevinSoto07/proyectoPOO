interface Actividad {
  actividad_id: number;
  actividad_nombre: string;
  actividad_descripcion: string;
  puntaje_maximo: number;
  actividad_orden: number;
}

interface LeccionConActividades {
  leccion_id: number;
  leccion_numero: number;
  leccion_nombre: string;
  leccion_descripcion: string | null;
  actividades: Actividad[];
}

interface Props {
  leccion: LeccionConActividades;
  isExpanded: boolean;
  onToggle: () => void;
  usuarioId: number;
  actividadesRespondidas: Set<number>;
  onRespuestaGuardada: (actividadId: number) => void;
}

export default function LessonCard({ leccion, isExpanded, onToggle }: Props) {
  return (
    <div
      className={`rounded-lg border transition-all duration-200 cursor-pointer
        ${isExpanded
          ? "border-[#58a6ff]"
          : "border-[#21262d] hover:border-[#58a6ff]"
        }`}
      style={{ backgroundColor: "#161b22" }}
    >
      <div
        className="flex items-center justify-between p-4"
        onClick={onToggle}
      >
        <div>
          <h3
            className={`font-semibold transition-all duration-200
              ${isExpanded ? "text-[#58a6ff]" : "text-white hover:text-[#58a6ff]"}`}
          >
            Lección {leccion.leccion_numero}: {leccion.leccion_nombre}
          </h3>

          {!isExpanded && leccion.actividades && (
            <div className="mt-2">
              <span className="text-xs text-gray-400 uppercase tracking-wide">
                Clases de esta lección
              </span>
              <ul className="mt-1 space-y-1">
                {leccion.actividades.map((act) => (
                  <li key={act.actividad_id} className="flex items-center gap-2 text-sm text-gray-300">
                    <span style={{ color: "#39d98a" }}>●</span>
                    {act.actividad_nombre}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <span className="text-gray-400 text-lg ml-4">
          {isExpanded ? "^" : "v"}
        </span>
      </div>

      <div className={`overflow-hidden transition-all duration-300 ${isExpanded ? "max-h-[1000px]" : "max-h-0"}`}>
        <div className="px-4 pb-4 border-t border-[#21262d]">

          {leccion.leccion_descripcion && (
            <div className="mt-3">
              <span className="text-xs text-gray-400 uppercase tracking-wide">Descripción</span>
              <p className="mt-1 text-sm text-gray-300">{leccion.leccion_descripcion}</p>
            </div>
          )}

          {leccion.actividades && leccion.actividades.length > 0 && (
            <div className="mt-4">
              <span className="text-xs text-gray-400 uppercase tracking-wide">Actividades</span>
              <ul className="mt-2 space-y-2">
                {leccion.actividades.map((act) => (
                  <li
                    key={act.actividad_id}
                    className="p-3 rounded-md border border-[#21262d] text-sm text-gray-300"
                    style={{ backgroundColor: "#0d1117" }}
                  >
                    <span className="font-medium text-white">{act.actividad_orden}. {act.actividad_nombre}</span>
                    {act.actividad_descripcion && (
                      <p className="mt-1 text-gray-400">{act.actividad_descripcion}</p>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}