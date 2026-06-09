import { Router } from 'express';
import { UserController } from '../controllers/UserController';

const router: Router = Router();

// Ruta base: /api/usuarios

// Crear un nuevo usuario (POST /api/usuarios)
router.post('/', UserController.crearUsuario);

// Obtener un usuario por ID (GET /api/usuarios/:id)
router.get('/:id', UserController.obtenerUsuario);

// Obtener la nota global del usuario GET /api/:id/nota
router.get('/:id/nota', UserController.obtenerNotaGlobal);

export default router;