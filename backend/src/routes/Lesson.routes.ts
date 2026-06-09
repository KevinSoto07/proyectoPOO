import { Router } from 'express';
import { CalificacionController } from '../controllers/CalificationController';

const router: Router = Router();

// Ruta base: /api/lecciones

// Listar todas las lecciones y sus actividades (GET /api/lecciones)
router.get('/', CalificacionController.listarLeccionesYActividades);

export default router;