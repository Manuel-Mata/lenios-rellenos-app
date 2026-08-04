import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { recommendProducts } from '../controllers/ai.controller';

const router = Router();

// Limitar a 5 recomendaciones por minuto por IP para evitar abuso
const aiLimiter = rateLimit({
  windowMs: 60 * 1000, 
  max: 5, 
  message: { error: 'Demasiadas solicitudes. Por favor, intenta de nuevo en un minuto.' },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post('/recomendar', aiLimiter, recommendProducts);

export { router as aiRoutes };
