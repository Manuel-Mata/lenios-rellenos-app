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
      update: jest.fn(),
    },
    order: {
      create: jest.fn(),
    },
    $transaction: jest.fn(),
  },
  prisma: {
    product: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    order: {
      create: jest.fn(),
    },
    $transaction: jest.fn(),
  },
}));

describe('Order API Endpoints (/api/v1/pedidos)', () => {
  const mockProducts = [
    {
      id: 1,
      name: 'Leño de Carnitas',
      description: 'Delicioso leño tradicional de carnitas',
      price: 45.0,
      image: 'https://example.com/carnitas.jpg',
      stock: 10,
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
      stock: 5,
      active: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 3,
      name: 'Leño Inactivo',
      description: 'Leño fuera de temporada',
      price: 50.0,
      image: 'https://example.com/inactivo.jpg',
      stock: 10,
      active: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/v1/pedidos', () => {
    it('debe crear un pedido exitosamente (201) con total calculado, WhatsApp URL y descuento de stock', async () => {
      // Mock de productos encontrados
      (prisma.product.findMany as jest.Mock).mockResolvedValue([mockProducts[0], mockProducts[1]] as never);

      // Mock de $transaction
      const mockCreatedOrder = {
        id: 101,
        customerPhone: '3751837635',
        deliveryAddress: 'Av. Hidalgo 123, Centro',
        notes: 'Sin cebolla',
        total: 130.0, // (2 * 45) + (1 * 40)
        status: 'pendiente',
        createdAt: new Date(),
        updatedAt: new Date(),
        items: [
          { id: 1, productId: 1, orderId: 101, quantity: 2, price: 45.0, product: mockProducts[0] },
          { id: 2, productId: 2, orderId: 101, quantity: 1, price: 40.0, product: mockProducts[1] },
        ],
      };

      (prisma.$transaction as jest.Mock).mockImplementation(async (callback: any) => {
        const tx = {
          product: { update: jest.fn() },
          order: { create: jest.fn<any>().mockResolvedValue(mockCreatedOrder as never) },
        };
        return callback(tx);
      });

      const response = await request(app)
        .post('/api/v1/pedidos')
        .send({
          items: [
            { productId: 1, quantity: 2 },
            { productId: 2, quantity: 1 },
          ],
          customerPhone: '3751837635',
          deliveryAddress: 'Av. Hidalgo 123, Centro',
          notes: 'Sin cebolla',
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('order');
      expect(response.body.order.id).toBe(101);
      expect(response.body.order.total).toBe(130.0);
      expect(response.body).toHaveProperty('whatsappMessage');
      expect(response.body).toHaveProperty('whatsappUrl');
      expect(response.body.whatsappMessage).toContain('Leño de Carnitas');
      expect(response.body.whatsappMessage).toContain('130.00');
      expect(response.body.whatsappUrl).toContain('wa.me');
      expect(prisma.$transaction).toHaveBeenCalled();
    });

    it('debe retornar 400 si la lista de items está vacía', async () => {
      const response = await request(app)
        .post('/api/v1/pedidos')
        .send({
          items: [],
          customerPhone: '3751837635',
          deliveryAddress: 'Av. Hidalgo 123, Centro',
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('al menos un producto');
    });

    it('debe retornar 400 si el teléfono no tiene 10 dígitos', async () => {
      const response = await request(app)
        .post('/api/v1/pedidos')
        .send({
          items: [{ productId: 1, quantity: 1 }],
          customerPhone: '12345',
          deliveryAddress: 'Av. Hidalgo 123, Centro',
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('10 dígitos');
    });

    it('debe retornar 400 si la dirección de entrega es demasiado corta', async () => {
      const response = await request(app)
        .post('/api/v1/pedidos')
        .send({
          items: [{ productId: 1, quantity: 1 }],
          customerPhone: '3751837635',
          deliveryAddress: 'abc',
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('al menos 5 caracteres');
    });

    it('debe retornar 400 si un producto no existe', async () => {
      (prisma.product.findMany as jest.Mock).mockResolvedValue([] as never);

      const response = await request(app)
        .post('/api/v1/pedidos')
        .send({
          items: [{ productId: 999, quantity: 1 }],
          customerPhone: '3751837635',
          deliveryAddress: 'Av. Hidalgo 123, Centro',
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('no existe');
    });

    it('debe retornar 400 si un producto está inactivo', async () => {
      (prisma.product.findMany as jest.Mock).mockResolvedValue([mockProducts[2]] as never);

      const response = await request(app)
        .post('/api/v1/pedidos')
        .send({
          items: [{ productId: 3, quantity: 1 }],
          customerPhone: '3751837635',
          deliveryAddress: 'Av. Hidalgo 123, Centro',
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('no está disponible');
    });

    it('debe retornar 400 si el stock es insuficiente', async () => {
      (prisma.product.findMany as jest.Mock).mockResolvedValue([mockProducts[1]] as never); // stock: 5

      const response = await request(app)
        .post('/api/v1/pedidos')
        .send({
          items: [{ productId: 2, quantity: 10 }], // pide 10
          customerPhone: '3751837635',
          deliveryAddress: 'Av. Hidalgo 123, Centro',
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('Stock insuficiente');
    });

    it('debe retornar 500 si ocurre un error no controlado en la base de datos', async () => {
      (prisma.product.findMany as jest.Mock).mockRejectedValue(new Error('DB crash') as never);

      const response = await request(app)
        .post('/api/v1/pedidos')
        .send({
          items: [{ productId: 1, quantity: 1 }],
          customerPhone: '3751837635',
          deliveryAddress: 'Av. Hidalgo 123, Centro',
        });

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('error');
    });
  });
});
