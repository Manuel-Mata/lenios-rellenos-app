import { Router } from 'express';
import productController from '../controllers/product.controller';

const router = Router();

// GET /api/v1/productos
router.get('/', (req, res) => productController.getProducts(req, res));

// GET /api/v1/productos/:id
router.get('/:id', (req, res) => productController.getProductById(req, res));

export default router;
