import { Router } from 'express';
import { CalificacionController } from '../controllers/CalificationController';

const router: Router = Router();

// Ruta base: /api/calificaciones

router.post('/', CalificacionController.guardarCalificacion);
router.put('/:id', CalificacionController.actualizarCalificacion);
router.get('/nota/:usuario_id/:actividad_id', CalificacionController.verNota);
router.get('/historial/:usuario_id', CalificacionController.historialCalificaciones);

export default router;