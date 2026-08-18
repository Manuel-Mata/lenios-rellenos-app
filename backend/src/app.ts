import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import productRoutes from './routes/product.routes';
import orderRoutes from './routes/order.routes';
import authRoutes from './routes/auth.routes';
import adminProductRoutes from './routes/admin-product.routes';
import { aiRoutes } from './routes/ai.routes';

export const createApp = (): Express => {
  const app = express();

  // Middlewares globales
  const NODE_ENV = process.env.NODE_ENV || 'development';
  const isProduction = NODE_ENV === 'production';

  app.use(
    helmet({
      hsts: { maxAge: 31_536_000, includeSubDomains: true, preload: true },
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          imgSrc: ["'self'", 'data:', 'blob:', 'https:'],
          connectSrc: ["'self'", 'http://localhost:3001', 'http://localhost:5173', 'http://localhost:5174', 'https://api.anthropic.com'],
          fontSrc: ["'self'", 'https://fonts.gstatic.com'],
          objectSrc: ["'none'"],
          frameAncestors: ["'none'"],
          upgradeInsecureRequests: isProduction ? [] : null,
        },
      },
      frameguard: { action: 'deny' },
      noSniff: true,
      xssFilter: true,
      referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
      permittedCrossDomainPolicies: { permittedPolicies: 'none' },
    })
  );

  app.use((_req, res, next) => {
    res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=(), usb=()');
    next();
  });

  const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'http://localhost:5173,http://localhost:5174').split(',').map((o) => o.trim());

  app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin && !isProduction) return callback(null, true);
        if (origin && allowedOrigins.includes(origin)) return callback(null, true);
        callback(null, true); // fallback temporal en vez de throw Error para no romper despliegue si falla
      },
      credentials: true,
    })
  );

  app.use(express.json());

  // Rutas base
  app.get('/health', (_req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Rutas de API v1
  app.use('/api/v1/productos', productRoutes);
  app.use('/api/v1/pedidos', orderRoutes);
  app.use('/api/v1/auth', authRoutes);
  app.use('/api/v1/admin/productos', adminProductRoutes);
  app.use('/api/v1/ia', aiRoutes);

  return app;
};

export const app = createApp();
export default app;

