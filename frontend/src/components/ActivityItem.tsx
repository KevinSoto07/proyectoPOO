import { useState } from "react";
import { guardarCalificacion } from "../api/api";

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

export default function ActivityItem({
  actividad,
  usuarioId,
  onRespuestaGuardada,
}: ActivityItemProps) {
  const [respuesta, setRespuesta] = useState("");
  const [guardado, setGuardado] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [esCorrecto, setEsCorrecto] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);

  const tieneTexto = respuesta.trim().length > 0;

  // 👇 LÓGICA DE PISTAS DINÁMICAS (PLACEHOLDERS)
  const getPlaceholderText = () => {
    const nombreAct = actividad.nombre.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    if (nombreAct.includes("analicemos el numero 100")) 
      return "Ejemplo: 100 unidades forman 1... 💯";
    if (nombreAct.includes("contemos, escribamos y leamos")) 
      return "Sigue la cuenta: 100, 200, 300... 🚀";
    if (nombreAct.includes("leamos y escribamos numeros")) 
      return "Escribe el número con palabras (ej. ciento cinco) ✍️";
    if (nombreAct.includes("unidad de millar")) 
      return "Recuerda: 10 centenas forman el número... 🌟";
    if (nombreAct.includes("formemos") || nombreAct.includes("compongamos")) 
      return "Usa centenas, decenas y unidades (Ej: 2 centenas, 4 decenas...) 🧩";
    if (nombreAct.includes("descompongamos numeros de tres cifras de otra forma")) 
      return "Suma los valores, por ejemplo: 100 + 20 + 5 ➕";
    if (nombreAct.includes("series numericas") || nombreAct.includes("recta")) 
      return "Escribe los números que faltan dando saltos 🐸";
    if (nombreAct.includes("comparemos")) 
      return "Usa palabras como 'mayor', 'menor' o los signos < y > 🐊";
    if (nombreAct.includes("ordinales")) 
      return "Ejemplo: décimo, undécimo... hasta el vigésimo 🥇";
    if (nombreAct.includes("practiquemos")) 
      return "¡Tú puedes! Escribe con detalle lo que aprendiste 🧠";

    return "¡Escribe aquí tu respuesta! ✏️";
  };

  // 👇 LÓGICA DE EVALUACIÓN Y GUARDADO
  async function handleGuardar() {
    if (!tieneTexto || guardado || guardando) return;
    setGuardando(true);
    setError(null);
    
    try {
      let puntosGanados = 0;
      
      const texto = respuesta.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      const nombreAct = actividad.nombre.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

      // Evaluamos según la actividad
      if (nombreAct.includes("analicemos el numero 100")) {
        if (texto.includes("centena") || texto.includes("100") || texto.includes("c")) puntosGanados = actividad.puntaje_maximo;
      }
      else if (nombreAct.includes("contemos, escribamos y leamos")) {
        if (texto.includes("200") || texto.includes("300") || texto.includes("900") || texto.includes("100")) puntosGanados = actividad.puntaje_maximo;
      }
      else if (nombreAct.includes("leamos y escribamos numeros")) {
        if (texto.includes("cien") || texto.includes("ciento") || texto.includes("doscientos")) puntosGanados = actividad.puntaje_maximo;
      }
      else if (nombreAct.includes("unidad de millar")) {
        if (texto.includes("1000") || texto.includes("1,000") || texto.includes("mil") || texto.includes("10")) puntosGanados = actividad.puntaje_maximo;
      }
      else if (nombreAct.includes("formemos numeros de tres cifras") || nombreAct.includes("compongamos y descompongamos")) {
        if (texto.includes("centena") || texto.includes("decena") || texto.includes("unidad") || texto.includes("c") || texto.includes("d") || texto.includes("u")) puntosGanados = actividad.puntaje_maximo;
      }
      else if (nombreAct.includes("descompongamos numeros de tres cifras de otra forma")) {
        if (texto.includes("+") || texto.includes("suma") || texto.includes("valor")) puntosGanados = actividad.puntaje_maximo;
      }
      else if (nombreAct.includes("formemos numeros de dos cifras")) {
        if (texto.includes("decena") || texto.includes("unidad") || texto.includes("d") || texto.includes("u")) puntosGanados = actividad.puntaje_maximo;
      }
      else if (nombreAct.includes("completemos series numericas")) {
        if (texto.includes("1") || texto.includes("10") || texto.includes("100") || texto.includes("patron")) puntosGanados = actividad.puntaje_maximo;
      }
      else if (nombreAct.includes("ubiquemos los numeros en la recta")) {
        if (texto.includes("1") || texto.includes("uno") || texto.includes("salto")) puntosGanados = actividad.puntaje_maximo;
      }
      else if (nombreAct.includes("saltos de 10") && !nombreAct.includes("100")) {
        if (texto.includes("10") || texto.includes("diez")) puntosGanados = actividad.puntaje_maximo;
      }
      else if (nombreAct.includes("saltos de 100")) {
        if (texto.includes("100") || texto.includes("cien")) puntosGanados = actividad.puntaje_maximo;
      }
      else if (nombreAct.includes("comparemos numeros usando la recta")) {
        if (texto.includes("mayor") || texto.includes("menor") || texto.includes("derecha") || texto.includes("izquierda")) puntosGanados = actividad.puntaje_maximo;
      }
      else if (nombreAct.includes("comparemos numeros con la tabla de valores")) {
        if (texto.includes("<") || texto.includes(">") || texto.includes("mayor") || texto.includes("menor") || texto.includes("igual") || texto.includes("centena")) puntosGanados = actividad.puntaje_maximo;
      }
      else if (nombreAct.includes("numeros ordinales")) {
        if (texto.includes("decimo") || texto.includes("vigesimo") || texto.includes("10") || texto.includes("20")) puntosGanados = actividad.puntaje_maximo;
      }
      else if (nombreAct.includes("practiquemos lo aprendido")) {
        if (texto.length > 15 && !texto.includes("asdf") && !texto.includes("qwer")) puntosGanados = actividad.puntaje_maximo;
      }
      else {
        if (texto.length > 5 && !texto.includes("asdf")) puntosGanados = actividad.puntaje_maximo;
      }

      // Verificamos si la respuesta fue correcta
      const respuestaFueCorrecta = puntosGanados === actividad.puntaje_maximo;
      setEsCorrecto(respuestaFueCorrecta);

      // Enviamos al backend
      await guardarCalificacion(usuarioId, actividad.id, puntosGanados);
      
      setGuardado(true);
      onRespuestaGuardada(actividad.id);
    } catch (err) {
      console.error(err);
      setError("No se pudo guardar. Intenta de nuevo.");
      setEsCorrecto(null);
    } finally {
      setGuardando(false);
    }
  }

  // 👇 LÓGICA DE COLORES DINÁMICOS
  const getBorderColor = () => {
    if (guardado) {
      return esCorrecto ? "#22c55e" : "#f85149"; // Verde / Rojo
    }
    return tieneTexto ? "#58a6ff" : "#374151"; // Azul / Gris
  };

  const getButtonBgColor = () => {
    if (guardado) {
      return esCorrecto ? "#16a34a" : "#da3633"; 
    }
    return tieneTexto ? "#1f6feb" : "#374151"; 
  };

  const getButtonText = () => {
    if (guardando) return "Evaluando...";
    if (guardado) {
      return esCorrecto ? "✓ Respuesta correcta" : "✗ Respuesta incorrecta";
    }
    return "Guardar respuesta";
  };

  return (
    <div style={styles.card}>
      <h3 style={styles.titulo}>{actividad.nombre}</h3>
      {actividad.descripcion && (
        <p style={styles.descripcion}>{actividad.descripcion}</p>
      )}

      <textarea
        style={{
          ...styles.textarea,
          borderColor: getBorderColor(),
          outline: "none",
        }}
        placeholder={getPlaceholderText()}
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
          backgroundColor: getButtonBgColor(),
          cursor: guardado || !tieneTexto ? "not-allowed" : "pointer",
          opacity: guardando ? 0.7 : 1,
        }}
        onClick={handleGuardar}
        disabled={guardado || !tieneTexto || guardando}
      >
        {getButtonText()}
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