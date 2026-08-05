import { Request, Response } from 'express';
import { loginSchema } from '../validators/auth.validator';
import authService from '../services/auth.service';

export class AuthController {
  /**
   * POST /api/v1/auth/login
   * Autenticación de administradores
   */
  async login(req: Request, res: Response): Promise<void> {
    try {
      const parseResult = loginSchema.safeParse(req.body);

      if (!parseResult.success) {
        const issues = parseResult.error.issues || (parseResult.error as any).errors || [];
        const errorMessages = issues.map((e: any) => e.message).join(', ');
        res.status(400).json({
          error: `Datos de login inválidos: ${errorMessages}`,
          details: issues,
        });
        return;
      }

      const result = await authService.login(parseResult.data);
      res.status(200).json(result);
    } catch (error: any) {
      if (error.message === 'Credenciales inválidas') {
        res.status(401).json({ error: 'Correo o contraseña incorrectos' });
        return;
      }

      console.error('Error en autenticación:', error);
      res.status(500).json({ error: 'Error interno del servidor en autenticación' });
    }
  }
}

export const authController = new AuthController();
export default authController;
