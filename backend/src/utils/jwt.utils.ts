import jwt, { SignOptions } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_lenios_jwt_key_2026';
const JWT_EXPIRES_IN = (process.env.JWT_EXPIRES_IN || '24h') as any;

export interface TokenPayload {
  id: number;
  email: string;
}

/**
 * Genera un token JWT para un administrador
 */
export const generateToken = (payload: TokenPayload): string => {
  const options: SignOptions = {
    expiresIn: JWT_EXPIRES_IN,
  };
  return jwt.sign(payload, JWT_SECRET, options);
};

/**
 * Verifica un token JWT y devuelve el payload decodificado
 */
export const verifyToken = (token: string): TokenPayload => {
  return jwt.verify(token, JWT_SECRET) as TokenPayload;
};
