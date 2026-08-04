import express, { Express } from 'express';
import cors from 'cors';
import productRoutes from './routes/product.routes';
import orderRoutes from './routes/order.routes';
import authRoutes from './routes/auth.routes';
import adminProductRoutes from './routes/admin-product.routes';

export const createApp = (): Express => {
  const app = express();

  // Middlewares globales
  app.use(cors());
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

  return app;
};

export const app = createApp();
export default app;
