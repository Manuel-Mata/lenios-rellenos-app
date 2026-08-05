import 'dotenv/config';
import app from './app';

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`🚀 Servidor ejecutándose en http://localhost:${PORT}`);
    console.log(`📡 Catálogo de productos: http://localhost:${PORT}/api/v1/productos`);
    console.log(`🤖 Asistente IA: http://localhost:${PORT}/api/v1/ia/recomendar`);
  });
}

export default app;

