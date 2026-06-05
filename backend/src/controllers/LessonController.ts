import { Request, Response, NextFunction } from 'express';
import Database from '../config/database';
import { Lesson } from '../models/Lesson';
import { AppError } from '../middleware/errorHandler';

export class LessonController {

    // GET /api/lecciones — listar todas las lecciones
    static async listarLecciones(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const pool = Database.getInstance();
            const [rows]: any = await pool.execute(
                'SELECT * FROM lecciones ORDER BY numero'
            );

            const lecciones = rows.map((fila: any) =>
                new Lesson(fila.id, fila.numero, fila.nombre, fila.descripcion)
            );

            res.json(lecciones);
        } catch (error) {
            next(new AppError('Error al listar lecciones', 500));
        }
    }

    // GET /api/lecciones/:id — obtener lección con sus actividades
    static async obtenerLeccion(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            const pool = Database.getInstance();

            // Trae la lección
            const [leccionRows]: any = await pool.execute(
                'SELECT * FROM lecciones WHERE id = ?',
                [id]
            );

            if (leccionRows.length === 0) {
                return next(new AppError('Lección no encontrada', 404));
            }

            // Trae las actividades de esa lección
            const [actividadRows]: any = await pool.execute(
                'SELECT * FROM actividades WHERE leccion_id = ? ORDER BY orden',
                [id]
            );

            const fila = leccionRows[0];
            const leccion = new Lesson(fila.id, fila.numero, fila.nombre, fila.descripcion);

            res.json({
                ...leccion,
                actividades: actividadRows
            });
        } catch (error) {
            next(new AppError('Error al obtener lección', 500));
        }
    }
}