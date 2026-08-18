import { Router } from 'express';
import adminProductController from '../controllers/admin-product.controller';
import { authenticateAdmin } from '../middlewares/auth.middleware';

const router = Router();

// Todas las rutas de administración requieren token JWT de Admin
router.use(authenticateAdmin);

// GET /api/v1/admin/productos - Lista completa de productos
router.get('/', (req, res) => adminProductController.getAll(req, res));

// POST /api/v1/admin/productos - Crear producto
router.post('/', (req, res) => adminProductController.create(req, res));

// PUT /api/v1/admin/productos/:id/stock - Actualizar stock de un producto
router.put('/:id/stock', (req, res) => adminProductController.updateStock(req, res));

// PUT /api/v1/admin/productos/:id - Actualizar datos de un producto
router.put('/:id', (req, res) => adminProductController.update(req, res));

// PATCH /api/v1/admin/productos/:id/toggle - Alternar estado activo/inactivo
router.patch('/:id/toggle', (req, res) => adminProductController.toggleStatus(req, res));

// DELETE /api/v1/admin/productos/:id - Eliminar un producto
router.delete('/:id', (req, res) => adminProductController.delete(req, res));

export default router;
