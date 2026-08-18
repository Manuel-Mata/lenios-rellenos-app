import { Router } from 'express';
import authController from '../controllers/auth.controller';
import rateLimit from 'express-rate-limit';

const router = Router();

// Configuramos el Rate Limiter para el endpoint de login
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // Máximo 100 peticiones por ventana por IP (500/s lo excederá inmediatamente)
  message: { error: 'Too many login attempts, please try again after 15 minutes' },
  standardHeaders: true, 
  legacyHeaders: false,
});

// POST /api/v1/auth/login (Añadimos el middleware loginLimiter)
router.post('/login', loginLimiter, (req, res) => authController.login(req, res));

export default router;
