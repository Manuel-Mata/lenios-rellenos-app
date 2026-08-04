import { Request, Response, NextFunction } from 'express';
import { verifyToken, TokenPayload } from '../utils/jwt.utils';

export interface AuthenticatedRequest extends Request {
  admin?: TokenPayload;
}

/**
 * Middleware para proteger rutas de administración mediante Bearer Token JWT
 */
export const authenticateAdmin = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({
      error: 'Acceso no autorizado. Token no proporcionado o formato inválido (debe ser Bearer <token>)',
    });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = verifyToken(token);
    req.admin = decoded;
    next();
  } catch (error) {
    res.status(401).json({
      error: 'Token inválido o expirado. Inicia sesión nuevamente.',
    });
  }
};
