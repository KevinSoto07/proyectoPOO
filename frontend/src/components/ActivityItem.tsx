import { useState } from "react";

interface Actividad {
  id: number;
  nombre: string;
  descripcion?: string;
  puntaje_maximo: number;
  orden: number;
}

interface ActivityItemProps {
  actividad: Actividad;
  usuarioId: number;
  onRespuestaGuardada: (actividadId: number) => void;
}

async function guardarCalificacion(
  usuarioId: number,
  actividadId: number,
  puntajeObtenido: number
): Promise<void> {
  const res = await fetch("/api/calificaciones", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      usuario_id: usuarioId,
      actividad_id: actividadId,
      puntaje_obtenido: puntajeObtenido,
    }),
  });
  if (!res.ok) throw new Error("Error al guardar calificación");
}

export default function ActivityItem({
  actividad,
  usuarioId,
  onRespuestaGuardada,
}: ActivityItemProps) {
  const [respuesta, setRespuesta] = useState("");
  const [guardado, setGuardado] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const tieneTexto = respuesta.trim().length > 0;

  async function handleGuardar() {
    if (!tieneTexto || guardado || guardando) return;
    setGuardando(true);
    setError(null);
    try {
      await guardarCalificacion(usuarioId, actividad.id, actividad.puntaje_maximo);
      setGuardado(true);
      onRespuestaGuardada(actividad.id);
    } catch (err) {
      setError("No se pudo guardar. Intenta de nuevo.");
    } finally {
      setGuardando(false);
    }
  }

  return (
    <div style={styles.card}>
      <h3 style={styles.titulo}>{actividad.nombre}</h3>
      {actividad.descripcion && (
        <p style={styles.descripcion}>{actividad.descripcion}</p>
      )}

      <textarea
        style={{
          ...styles.textarea,
          borderColor: guardado ? "#22c55e" : tieneTexto ? "#58a6ff" : "#374151",
          outline: "none",
        }}
        placeholder="Escribe tu respuesta aquí. Tómate tu tiempo..."
        value={respuesta}
        onChange={(e) => setRespuesta(e.target.value)}
        disabled={guardado}
        rows={4}
        onFocus={(e) => {
          if (!guardado) e.target.style.borderColor = "#58a6ff";
        }}
        onBlur={(e) => {
          if (!guardado && !tieneTexto) e.target.style.borderColor = "#374151";
        }}
      />

      {error && <p style={styles.error}>{error}</p>}

      <button
        style={{
          ...styles.boton,
          backgroundColor: guardado ? "#16a34a" : tieneTexto ? "#1f6feb" : "#374151",
          cursor: guardado || !tieneTexto ? "not-allowed" : "pointer",
          opacity: guardando ? 0.7 : 1,
        }}
        onClick={handleGuardar}
        disabled={guardado || !tieneTexto || guardando}
      >
        {guardado ? "✓ Respuesta guardada" : guardando ? "Guardando..." : "Guardar respuesta"}
      </button>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  card: {
    backgroundColor: "#0d1117",
    border: "1px solid #21262d",
    borderRadius: "10px",
    padding: "20px",
    marginTop: "12px",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  titulo: {
    color: "#ffffff",
    margin: 0,
    fontSize: "1rem",
    fontWeight: 600,
  },
  descripcion: {
    color: "#8b949e",
    margin: 0,
    fontSize: "0.875rem",
    lineHeight: 1.5,
  },
  textarea: {
    width: "100%",
    backgroundColor: "#161b22",
    color: "#e6edf3",
    border: "1px solid #374151",
    borderRadius: "6px",
    padding: "10px 12px",
    fontSize: "0.875rem",
    resize: "vertical",
    fontFamily: "inherit",
    lineHeight: 1.6,
    transition: "border-color 0.15s ease",
    boxSizing: "border-box",
  },
  boton: {
    alignSelf: "flex-end",
    padding: "8px 18px",
    border: "none",
    borderRadius: "6px",
    color: "#ffffff",
    fontSize: "0.875rem",
    fontWeight: 500,
    transition: "background-color 0.2s ease, opacity 0.2s ease",
  },
  error: {
    color: "#f85149",
    margin: 0,
    fontSize: "0.8rem",
  },
};