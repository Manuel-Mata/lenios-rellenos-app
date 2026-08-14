import request from 'supertest';
import { describe, it, expect, jest, afterEach } from '@jest/globals';
import app from '../src/app';
import prisma from '../src/prisma';

// Mock de Prisma
jest.mock('../src/prisma', () => ({
  __esModule: true,
  default: {
    product: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
    },
  },
  prisma: {
    product: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
    },
  },
}));

describe('Product API Endpoints (/api/v1/productos)', () => {
  const mockProducts = [
    {
      id: 1,
      name: 'Leño de Carnitas',
      description: 'Delicioso leño tradicional de carnitas',
      price: 45.0,
      image: 'https://example.com/carnitas.jpg',
      stock: 15,
      active: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 2,
      name: 'Leño de Queso Oaxaca',
      description: 'Leño relleno de queso Oaxaca',
      price: 40.0,
      image: 'https://example.com/queso.jpg',
      stock: 0,
      active: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/v1/productos', () => {
    it('debe retornar 200 y la lista completa de todos los productos', async () => {
      (prisma.product.findMany as jest.Mock).mockResolvedValue(mockProducts as never);

      const response = await request(app).get('/api/v1/productos');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body).toHaveLength(2);
      expect(response.body[0].name).toBe('Leño de Carnitas');
      expect(prisma.product.findMany).toHaveBeenCalledWith({
        where: {},
        orderBy: { id: 'asc' },
      });
    });

    it('debe filtrar productos disponibles cuando ?available=true', async () => {
      const availableProducts = [mockProducts[0]];
      (prisma.product.findMany as jest.Mock).mockResolvedValue(availableProducts as never);

      const response = await request(app).get('/api/v1/productos?available=true');

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
      expect(response.body[0].stock).toBe(15);
      expect(prisma.product.findMany).toHaveBeenCalledWith({
        where: {
          active: true,
          stock: { gt: 0 },
        },
        orderBy: { id: 'asc' },
      });
    });

    it('debe retornar 500 si ocurre un error en la base de datos', async () => {
      (prisma.product.findMany as jest.Mock).mockRejectedValue(new Error('DB connection failed') as never);

      const response = await request(app).get('/api/v1/productos');

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('GET /api/v1/productos/:id', () => {
    it('debe retornar 200 y los detalles del producto si existe', async () => {
      const singleProduct = mockProducts[0];
      (prisma.product.findUnique as jest.Mock).mockResolvedValue(singleProduct as never);

      const response = await request(app).get('/api/v1/productos/1');

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(1);
      expect(response.body.name).toBe('Leño de Carnitas');
      expect(prisma.product.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it('debe retornar 404 si el producto no existe', async () => {
      (prisma.product.findUnique as jest.Mock).mockResolvedValue(null as never);

      const response = await request(app).get('/api/v1/productos/9999');

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Producto no encontrado');
    });

    it('debe retornar 400 si el ID no es un número entero válido', async () => {
      const response = await request(app).get('/api/v1/productos/abc');

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('El ID del producto debe ser un número entero válido');
      expect(prisma.product.findUnique).not.toHaveBeenCalled();
    });

    it('debe retornar 400 si el ID es un número menor o igual a 0', async () => {
      const response = await request(app).get('/api/v1/productos/-5');

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('El ID del producto debe ser un número entero válido');
      expect(prisma.product.findUnique).not.toHaveBeenCalled();
    });
  });
});
