import { Router } from 'express';
import authController from '../controllers/auth.controller';

const router = Router();

// POST /api/v1/auth/login
router.post('/login', (req, res) => authController.login(req, res));

export default router;
