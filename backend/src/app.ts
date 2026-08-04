import express, { Express } from 'express';
import cors from 'cors';
import productRoutes from './routes/product.routes';

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

  return app;
};

export const app = createApp();
export default app;
