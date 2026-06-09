import { Request, Response, NextFunction } from 'express';
import Database from '../config/database';
import { Calificacion } from '../models/Calification';
import { AppError } from '../middleware/errorHandler';

export class CalificacionController {

    // 1. Guardar una calificación (Crear)
    static async guardarCalificacion(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { usuario_id, actividad_id, puntaje_obtenido } = req.body;
            const pool = Database.getInstance();

            // Insertar calificación usando los campos exactos de tu tabla
            const [result]: any = await pool.execute(
                'INSERT INTO calificaciones (usuario_id, actividad_id, puntaje_obtenido, fecha) VALUES (?, ?, ?, NOW())',
                [Number(usuario_id), Number(actividad_id), Number(puntaje_obtenido)]
            );

            const nuevaCalificacion = new Calificacion(result.insertId, usuario_id, actividad_id, puntaje_obtenido, new Date());

            res.status(201).json({
                calificacion: nuevaCalificacion,
                mensaje: 'Calificación guardada correctamente'
            });
        } catch (error: any) {
            // Manejo por si intentan guardar una calificación duplicada para el mismo usuario/actividad
            if (error.code === 'ER_DUP_ENTRY') {
                return next(new AppError('El usuario ya tiene una calificación registrada para esta actividad', 400));
            }
            next(new AppError('Error al guardar la calificación', 500));
        }
    }

    // 2. Actualizar una calificación existente
    static async actualizarCalificacion(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params; // ID de la calificación
            const { puntaje_obtenido } = req.body;
            const pool = Database.getInstance();

            const [result]: any = await pool.execute(
                'UPDATE calificaciones SET puntaje_obtenido = ? WHERE id = ?',
                [Number(puntaje_obtenido), Number(id)]
            );

            if (result.affectedRows === 0) {
                return next(new AppError('Calificación no encontrada', 404));
            }

            res.json({ mensaje: 'Calificación actualizada correctamente' });
        } catch (error) {
            next(new AppError('Error al actualizar la calificación', 500));
        }
    }

    // 3. Ver la nota (puntaje) de un usuario en una actividad específica
    static async verNota(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { usuario_id, actividad_id } = req.params;
            const pool = Database.getInstance();

            const [rows]: any = await pool.execute(
                'SELECT * FROM calificaciones WHERE usuario_id = ? AND actividad_id = ?',
                [Number(usuario_id), Number(actividad_id)]
            );
            
            if (rows.length === 0) {
                return next(new AppError('No se encontró ninguna calificación para este usuario en la actividad especificada', 404));
            }

            const fila = rows[0];
            const calificacion = new Calificacion(fila.id, fila.usuario_id, fila.actividad_id, fila.puntaje_obtenido, fila.fecha);

            res.json(calificacion);
        } catch (error) {
            next(new AppError('Error al obtener la nota', 500));
        }
    }

    // 4. Mostrar el historial completo de calificaciones de un usuario
    static async historialCalificaciones(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { usuario_id } = req.params;
            const pool = Database.getInstance();

            const [rows]: any = await pool.execute(`
                SELECT c.id, c.usuario_id, c.actividad_id, c.puntaje_obtenido, c.fecha, a.nombre AS actividad_nombre
                FROM calificaciones c
                INNER JOIN actividades a ON c.actividad_id = a.id
                WHERE c.usuario_id = ?
                ORDER BY c.fecha DESC
            `, [Number(usuario_id)]);

            res.json({
                usuario_id,
                historial: rows
            });
        } catch (error) { // <--- FALTABA ESTE CATCH
            next(new AppError('Error al obtener el historial de calificaciones', 500));
        }
    } // <--- Y FALTABA ESTA LLAVE DE CIERRE DEL MÉTODO

    // 5. Listar las lecciones y actividades de la plataforma de números
    static async listarLeccionesYActividades(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const pool = Database.getInstance();
            
            const [rows]: any = await pool.execute(`
                SELECT 
                    l.id AS leccion_id, 
                    l.numero AS leccion_numero, 
                    l.nombre AS leccion_nombre, 
                    l.descripcion AS leccion_descripcion,
                    a.id AS actividad_id, 
                    a.nombre AS actividad_nombre, 
                    a.descripcion AS actividad_descripcion, 
                    a.puntaje_maximo, 
                    a.orden AS actividad_orden
                FROM lecciones l
                LEFT JOIN actividades a ON l.id = a.leccion_id
                ORDER BY l.numero ASC, a.orden ASC
            `);

            res.json({
                estructura_curso: rows,
                mensaje: 'Contenido de la plataforma educativa obtenido correctamente'
            });
        } catch (error) {
            next(new AppError('Error al listar las lecciones y actividades', 500));
        }
    }
}