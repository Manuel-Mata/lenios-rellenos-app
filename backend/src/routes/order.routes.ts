import { Router } from 'express';
import orderController from '../controllers/order.controller';

const router = Router();

// POST /api/v1/pedidos
router.post('/', (req, res) => orderController.createOrder(req, res));

export default router;
