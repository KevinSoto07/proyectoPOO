import { useState } from 'react';
import ActivityItem from './ActivityItem';

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

const explicaciones: Record<number, { titulo: string; contenido: string }> = {
  1: {
    titulo: 'La tabla de valores C-D-U',
    contenido: `La tabla C-D-U organiza los números según la posición de cada cifra:
- C (Centenas): grupos de 100 unidades. Ejemplo: 3 centenas = 300.
- D (Decenas): grupos de 10 unidades. Ejemplo: 4 decenas = 40.
- U (Unidades): unidades sueltas. Ejemplo: 7 unidades = 7.

Entonces el número 347 se lee así en la tabla:
  C = 3 | D = 4 | U = 7

Una centena se forma cuando tienes 100 unidades juntas, o 10 decenas.`,
  },
  2: {
    titulo: 'Componer y descomponer números',
    contenido: `Componer un número significa unir sus partes para formarlo:
- 200 + 30 + 5 = 235

Descomponer es separarlo en sus partes según la tabla C-D-U:
- 235 = 2 centenas + 3 decenas + 5 unidades
- 235 = 200 + 30 + 5

La unidad de millar es el número 1,000. Se forma cuando juntas 10 centenas:
- 10 centenas = 1,000`,
  },
  3: {
    titulo: 'Series numéricas y patrones',
    contenido: `Una serie numérica es una secuencia de números que sigue un patrón fijo.

Tipos de series:
- De 1 en 1:     194, 195, 196, 197, 198...
- De 10 en 10:   100, 110, 120, 130, 140...
- De 100 en 100: 100, 200, 300, 400...

Para completar una serie:
1. Observa dos o tres números seguidos.
2. Calcula la diferencia entre ellos.
3. Esa diferencia es el patrón. Súmala al último número para continuar.`,
  },
  4: {
    titulo: 'La recta numérica',
    contenido: `La recta numérica es una línea donde los números se colocan en orden:
- Los números más pequeños están a la izquierda.
- Los números más grandes están a la derecha.

Para ubicar un número en la recta:
1. Identifica el número de inicio que ya conoces.
2. Cuenta los saltos hacia la derecha según el patrón (de 1, de 10 o de 100).
3. Escribe el número que corresponde en el espacio vacío.

Ejemplo con saltos de 1:
  194 — 195 — 196 — 197 — [198]`,
  },
  5: {
    titulo: 'Comparar números y ordinales',
    contenido: `Para comparar dos números de tres cifras, sigue estos pasos:
1. Compara las centenas primero.
   Si son diferentes: el mayor número tiene más centenas.
2. Si las centenas son iguales, compara las decenas.
3. Si las decenas también son iguales, compara las unidades.

Signos de comparación:
- < significa "menor que":  239 < 245
- > significa "mayor que":  245 > 239

Números ordinales (indican posición):
- 10.° décimo  •  11.° décimo primero  •  12.° décimo segundo
- 13.° décimo tercero  ...  hasta  20.° vigésimo`,
  },
};

export default function LessonCard({ leccion, isExpanded, onToggle, usuarioId, onRespuestaGuardada }: Props) {
  const [explicacionAbierta, setExplicacionAbierta] = useState(false);
  const explicacion = explicaciones[leccion.leccion_numero];

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

      <div className={`overflow-hidden transition-all duration-300 ${isExpanded ? "max-h-[2000px]" : "max-h-0"}`}>
        <div className="px-4 pb-4 border-t border-[#21262d]">

          {leccion.leccion_descripcion && (
            <div className="mt-3">
              <span className="text-xs text-gray-400 uppercase tracking-wide">Descripción</span>
              <p className="mt-1 text-sm text-gray-300">{leccion.leccion_descripcion}</p>
            </div>
          )}

          {/* ── Concepto clave (solo visible al expandir) ── */}
          {explicacion && (
            <div className="mt-4 rounded-lg border border-[#21262d] overflow-hidden">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setExplicacionAbierta((prev) => !prev);
                }}
                className="w-full flex items-center justify-between px-4 py-3 text-left transition-colors duration-150"
                style={{ backgroundColor: "#0d1117" }}
              >
                <div className="flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#39d98a"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-4 h-4 flex-shrink-0"
                  >
                    <line x1="9" y1="18" x2="15" y2="18" />
                    <line x1="10" y1="22" x2="14" y2="22" />
                    <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14" />
                  </svg>
                  <span className="text-sm font-semibold" style={{ color: "#39d98a" }}>
                    Concepto Clave: {explicacion.titulo}
                  </span>
                </div>
                <span className="text-gray-400 text-sm ml-4">
                  {explicacionAbierta ? "^" : "v"}
                </span>
              </button>

              {explicacionAbierta && (
                <div
                  className="px-4 py-4 border-t border-[#21262d]"
                  style={{ backgroundColor: "#0d1117" }}
                >
                  <pre className="text-sm text-gray-300 whitespace-pre-wrap leading-relaxed font-sans">
                    {explicacion.contenido}
                  </pre>
                </div>
              )}
            </div>
          )}

          {leccion.actividades && leccion.actividades.length > 0 && (
            <div className="mt-4">
              <span className="text-xs text-gray-400 uppercase tracking-wide">Actividades</span>
              <div className="mt-2 space-y-2">
                {leccion.actividades.map((act) => (
                  <ActivityItem
                    key={act.actividad_id}
                    actividad={{
                      id: act.actividad_id,
                      nombre: act.actividad_nombre,
                      descripcion: act.actividad_descripcion,
                      puntaje_maximo: act.puntaje_maximo,
                      orden: act.actividad_orden,
                    }}
                    usuarioId={usuarioId}
                    onRespuestaGuardada={onRespuestaGuardada}
                    />
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
/*<li
  key={act.actividad_id}
  className="p-3 rounded-md border border-[#21262d] text-sm text-gray-300"
  style={{ backgroundColor: "#0d1117" }}
>
  <span className="font-medium text-white">{act.actividad_orden}. {act.actividad_nombre}</span>
  {act.actividad_descripcion && (
    <p className="mt-1 text-gray-400">{act.actividad_descripcion}</p>
  )}
</li>*/