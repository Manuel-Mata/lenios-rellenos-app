import request from 'supertest';
import { describe, it, expect, jest, afterEach } from '@jest/globals';
import bcrypt from 'bcryptjs';
import app from '../src/app';
import prisma from '../src/prisma';

// Mock de Prisma
jest.mock('../src/prisma', () => ({
  __esModule: true,
  default: {
    admin: {
      findUnique: jest.fn(),
    },
  },
  prisma: {
    admin: {
      findUnique: jest.fn(),
    },
  },
}));

// Mock de bcrypt
jest.mock('bcryptjs', () => ({
  __esModule: true,
  default: {
    compare: jest.fn(),
    hash: jest.fn(),
  },
}));

describe('Auth API Endpoints (/api/v1/auth)', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/v1/auth/login', () => {
    it('debe autenticar al administrador con credenciales válidas y retornar 200 con JWT', async () => {
      const mockAdmin = {
        id: 1,
        email: 'admin@lenios.com',
        passwordHash: '$2b$10$hashedpassword',
        createdAt: new Date(),
      };

      (prisma.admin.findUnique as jest.Mock).mockResolvedValue(mockAdmin as never);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true as never);

      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'admin@lenios.com',
          password: 'adminPassword123',
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
      expect(typeof response.body.token).toBe('string');
      expect(response.body).toHaveProperty('admin');
      expect(response.body.admin.email).toBe('admin@lenios.com');
      expect(response.body.admin).not.toHaveProperty('passwordHash');
    });

    it('debe retornar 401 si la contraseña es incorrecta', async () => {
      const mockAdmin = {
        id: 1,
        email: 'admin@lenios.com',
        passwordHash: '$2b$10$hashedpassword',
        createdAt: new Date(),
      };

      (prisma.admin.findUnique as jest.Mock).mockResolvedValue(mockAdmin as never);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false as never);

      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'admin@lenios.com',
          password: 'wrongPassword',
        });

      expect(response.status).toBe(401);
      expect(response.body.error).toContain('incorrectos');
    });

    it('debe retornar 401 si el usuario no existe', async () => {
      (prisma.admin.findUnique as jest.Mock).mockResolvedValue(null as never);

      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'noexiste@lenios.com',
          password: 'adminPassword123',
        });

      expect(response.status).toBe(401);
      expect(response.body.error).toContain('incorrectos');
    });

    it('debe retornar 400 si el email no es válido', async () => {
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'no-es-email',
          password: 'adminPassword123',
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('correo electrónico no es válido');
    });

    it('debe retornar 400 si el password tiene menos de 6 caracteres', async () => {
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'admin@lenios.com',
          password: '123',
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('al menos 6 caracteres');
    });
  });
});
