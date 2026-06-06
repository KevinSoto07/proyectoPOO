import { Request, Response, NextFunction } from 'express';
import Database from '../config/database';
import { User } from '../models/User';
import { AppError } from '../middleware/errorHandler';

export class UserController {

    static async crearUsuario(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const pool = Database.getInstance();
            const [result]: any = await pool.execute(
                'INSERT INTO usuarios (fecha_creacion) VALUES (NOW())'
            );

            const nuevoUsuario = new User(result.insertId, new Date());
            const codigoVisual = User.generarCodigoVisual();

            res.status(201).json({
                id: nuevoUsuario.id,
                codigo: codigoVisual,
                fecha_creacion: nuevoUsuario.fecha_creacion,
                mensaje: 'Usuario creado correctamente'
            });
        } catch (error) {
            next(new AppError('Error al crear usuario', 500));
        }
    }

    static async obtenerUsuario(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            const pool = Database.getInstance();

            const [rows]: any = await pool.execute(
                'SELECT * FROM usuarios WHERE id = ?',
                [id]
            );

            if (rows.length === 0) {
                return next(new AppError('Usuario no encontrado', 404));
            }

            const fila = rows[0];
            const usuario = new User(fila.id, fila.fecha_creacion);

            res.json(usuario);
        } catch (error) {
            next(new AppError('Error al obtener usuario', 500));
        }
    }
}