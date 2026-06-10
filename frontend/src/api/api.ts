import axios from 'axios';

const BASE = 'http://localhost:3000/api';

// Crea un usuario random y devuelve su id
export const crearUsuario = async (): Promise<number> => {
  const res = await axios.post(`${BASE}/users`);
  return res.data.id;
};

// Trae todas las lecciones con sus actividades
export const fetchLecciones = async () => {
  const res = await axios.get(`${BASE}/lessons`);
  // El endpoint devuelve { estructura_curso: [...] }
  return res.data.estructura_curso as LeccionConActividades[];
};

// Guarda o actualiza la calificación de una actividad
export const guardarCalificacion = async (
  usuario_id: number,
  actividad_id: number,
  puntaje_obtenido: number
) => {
  const res = await axios.post(`${BASE}/grades`, {
    usuario_id,
    actividad_id,
    puntaje_obtenido,
  });
  return res.data;
};

// Obtiene la nota global del usuario
export const fetchNotaGlobal = async (usuario_id: number): Promise<number> => {
  const res = await axios.get(`${BASE}/users/${usuario_id}/nota`);
  return res.data.nota_global as number;
};

// Tipos compartidos que usarán todos los integrantes
export interface Actividad {
  actividad_id:          number;
  actividad_nombre:      string;
  actividad_descripcion: string;
  puntaje_maximo:        number;
  actividad_orden:       number;
}

export interface LeccionConActividades {
  leccion_id:          number;
  leccion_numero:      number;
  leccion_nombre:      string;
  leccion_descripcion: string;
  actividades:         Actividad[];
}