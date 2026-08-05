import request from 'supertest';
import { describe, it, expect, jest, afterEach } from '@jest/globals';
import app from '../src/app';
import prisma from '../src/prisma';
import { generateToken } from '../src/utils/jwt.utils';

// Mock de Prisma
jest.mock('../src/prisma', () => ({
  __esModule: true,
  default: {
    product: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  },
  prisma: {
    product: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  },
}));

describe('Admin Product Endpoints (/api/v1/admin/productos)', () => {
  const validToken = generateToken({ id: 1, email: 'admin@lenios.com' });

  const mockProduct = {
    id: 1,
    name: 'Leño de Chicharrón',
    description: 'Relleno de chicharrón prensado',
    price: 45.0,
    image: 'https://example.com/chicharron.jpg',
    stock: 10,
    active: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('PUT /api/v1/admin/productos/:id/stock', () => {
    it('debe actualizar el stock exitosamente (200) cuando se proporciona token válido', async () => {
      (prisma.product.findUnique as jest.Mock).mockResolvedValue(mockProduct as never);
      (prisma.product.update as jest.Mock).mockResolvedValue({
        ...mockProduct,
        stock: 25,
      } as never);

      const response = await request(app)
        .put('/api/v1/admin/productos/1/stock')
        .set('Authorization', `Bearer ${validToken}`)
        .send({ stock: 25 });

      expect(response.status).toBe(200);
      expect(response.body.stock).toBe(25);
      expect(prisma.product.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { stock: 25 },
      });
    });

    it('debe retornar 401 si no se envía el header Authorization', async () => {
      const response = await request(app)
        .put('/api/v1/admin/productos/1/stock')
        .send({ stock: 25 });

      expect(response.status).toBe(401);
      expect(response.body.error).toContain('Acceso no autorizado');
    });

    it('debe retornar 401 si el token es inválido', async () => {
      const response = await request(app)
        .put('/api/v1/admin/productos/1/stock')
        .set('Authorization', 'Bearer token_invalido_123')
        .send({ stock: 25 });

      expect(response.status).toBe(401);
      expect(response.body.error).toContain('Token inválido');
    });

    it('debe retornar 400 si el stock es negativo', async () => {
      const response = await request(app)
        .put('/api/v1/admin/productos/1/stock')
        .set('Authorization', `Bearer ${validToken}`)
        .send({ stock: -5 });

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('no puede ser negativo');
    });

    it('debe retornar 400 si el ID del producto no es un número válido', async () => {
      const response = await request(app)
        .put('/api/v1/admin/productos/abc/stock')
        .set('Authorization', `Bearer ${validToken}`)
        .send({ stock: 15 });

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('entero positivo');
    });

    it('debe retornar 404 si el producto no existe', async () => {
      (prisma.product.findUnique as jest.Mock).mockResolvedValue(null as never);

      const response = await request(app)
        .put('/api/v1/admin/productos/999/stock')
        .set('Authorization', `Bearer ${validToken}`)
        .send({ stock: 15 });

      expect(response.status).toBe(404);
      expect(response.body.error).toContain('no encontrado');
    });
  });

  describe('GET /api/v1/admin/productos', () => {
    it('debe retornar todos los productos cuando está autenticado', async () => {
      (prisma.product.findMany as jest.Mock).mockResolvedValue([mockProduct] as never);

      const response = await request(app)
        .get('/api/v1/admin/productos')
        .set('Authorization', `Bearer ${validToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(1);
    });
  });

  describe('POST /api/v1/admin/productos', () => {
    it('debe crear un nuevo producto (201)', async () => {
      (prisma.product.create as jest.Mock).mockResolvedValue(mockProduct as never);

      const response = await request(app)
        .post('/api/v1/admin/productos')
        .set('Authorization', `Bearer ${validToken}`)
        .send({
          name: 'Leño de Chicharrón',
          description: 'Relleno de chicharrón prensado',
          price: 45.0,
          stock: 10,
          active: true,
        });

      expect(response.status).toBe(201);
      expect(response.body.name).toBe('Leño de Chicharrón');
    });
  });

  describe('PATCH /api/v1/admin/productos/:id/toggle', () => {
    it('debe alternar el estado activo/inactivo', async () => {
      (prisma.product.findUnique as jest.Mock).mockResolvedValue(mockProduct as never);
      (prisma.product.update as jest.Mock).mockResolvedValue({
        ...mockProduct,
        active: false,
      } as never);

      const response = await request(app)
        .patch('/api/v1/admin/productos/1/toggle')
        .set('Authorization', `Bearer ${validToken}`);

      expect(response.status).toBe(200);
      expect(response.body.active).toBe(false);
    });
  });

  describe('DELETE /api/v1/admin/productos/:id', () => {
    it('debe eliminar un producto', async () => {
      (prisma.product.findUnique as jest.Mock).mockResolvedValue(mockProduct as never);
      (prisma.product.delete as jest.Mock).mockResolvedValue(mockProduct as never);

      const response = await request(app)
        .delete('/api/v1/admin/productos/1')
        .set('Authorization', `Bearer ${validToken}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toContain('eliminado exitosamente');
    });
  });
});
