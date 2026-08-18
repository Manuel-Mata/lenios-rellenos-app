import bcrypt from 'bcryptjs';
import prisma from '../prisma';
import { LoginInput } from '../validators/auth.validator';
import { generateToken } from '../utils/jwt.utils';

export class AuthService {
  /**
   * Autentica a un administrador y genera un token JWT
   */
  async login(data: LoginInput) {
    const email = data.email.toLowerCase();

    // 1. Buscar administrador por email
    const admin = await prisma.admin.findUnique({
      where: { email },
    });

    if (!admin) {
      throw new Error('Credenciales inválidas');
    }

    // 2. Verificar contraseña con bcrypt
    const isPasswordValid = await bcrypt.compare(data.password, admin.passwordHash);
    if (!isPasswordValid) {
      throw new Error('Credenciales inválidas');
    }

    // 3. Generar token JWT
    const token = generateToken({
      id: admin.id,
      email: admin.email,
    });

    return {
      token,
      admin: {
        id: admin.id,
        email: admin.email,
        createdAt: admin.createdAt,
      },
    };
  }
}

export const authService = new AuthService();
export default authService;
