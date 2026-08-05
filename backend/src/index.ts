import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import type { CookieOptions, Response } from 'express';
import { aiRoutes } from './routes/ai.routes';

const app = express();
const PORT = process.env.PORT || 3001;
const NODE_ENV = process.env.NODE_ENV || 'development';
const isProduction = NODE_ENV === 'production';

// ─────────────────────────────────────────────
// 1. HELMET — HTTP Security Headers
//    Strict-Transport-Security, X-Frame-Options,
//    X-Content-Type-Options, Referrer-Policy, CSP, etc.
// ─────────────────────────────────────────────
app.use(
  helmet({
    // Strict-Transport-Security: fuerza HTTPS durante 1 año, incluye subdominios
    hsts: {
      maxAge: 31_536_000,        // 1 año en segundos
      includeSubDomains: true,
      preload: true,
    },
    // Content-Security-Policy
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"], // Vite inyecta estilos inline en dev
        imgSrc: ["'self'", 'data:', 'blob:', 'https:'],
        connectSrc: [
          "'self'",
          // Permitir conexión al backend desde el frontend local
          'http://localhost:3001',
          'http://localhost:5173',
          'http://localhost:5174',
          'https://api.anthropic.com',
        ],
        fontSrc: ["'self'", 'https://fonts.gstatic.com'],
        objectSrc: ["'none'"],
        frameAncestors: ["'none'"],  // Equivale a X-Frame-Options: DENY
        upgradeInsecureRequests: isProduction ? [] : null, // Solo en producción
      },
    },
    // X-Frame-Options: DENY (anti-clickjacking)
    frameguard: { action: 'deny' },
    // X-Content-Type-Options: nosniff
    noSniff: true,
    // X-XSS-Protection: 1; mode=block (para navegadores legacy)
    xssFilter: true,
    // Referrer-Policy: strict-origin-when-cross-origin
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
    // Permissions-Policy: deshabilitar acceso a hardware innecesario
    permittedCrossDomainPolicies: { permittedPolicies: 'none' },
  })
);

// Permissions-Policy header adicional (helmet no lo cubre directamente)
app.use((_req, res, next) => {
  res.setHeader(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), payment=(), usb=()'
  );
  next();
});

// ─────────────────────────────────────────────
// 2. CORS ESTRICTO — Solo permite el origen del frontend
// ─────────────────────────────────────────────
const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'http://localhost:5173,http://localhost:5174')
  .split(',')
  .map((o) => o.trim());

app.use(
  cors({
    origin: (origin, callback) => {
      // Permitir peticiones sin origin (herramientas como Postman, curl) solo en dev
      if (!origin && !isProduction) return callback(null, true);
      if (origin && allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      callback(new Error(`CORS: origen no permitido → ${origin}`));
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,   // Necesario para enviar cookies seguras cross-origin
    maxAge: 86_400,      // Pre-flight cache: 24h
  })
);

app.use(express.json({ limit: '10kb' })); // Limitar tamaño de body

// ─────────────────────────────────────────────
// 3. HELPER — Cookies seguras para tokens de sesión/JWT
//    Usar en controladores de autenticación:
//      setAuthCookie(res, token);
// ─────────────────────────────────────────────
export function setAuthCookie(res: Response, token: string): void {
  const cookieOptions: CookieOptions = {
    httpOnly: true,           // No accesible desde JavaScript (previene XSS)
    secure: isProduction,     // Solo HTTPS en producción
    sameSite: 'strict',       // Previene CSRF
    maxAge: 24 * 60 * 60 * 1000, // 24 horas en ms
    path: '/',
  };
  res.cookie('auth_token', token, cookieOptions);
}

export function clearAuthCookie(res: Response): void {
  res.clearCookie('auth_token', { path: '/' });
}

// ─────────────────────────────────────────────
// Routes
// ─────────────────────────────────────────────
app.use('/api/v1/ia', aiRoutes);

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', env: NODE_ENV });
});

app.listen(PORT, () => {
  console.log(`✅ Backend corriendo en http://localhost:${PORT} [${NODE_ENV}]`);
  console.log(`🔒 CORS permitido para: ${allowedOrigins.join(', ')}`);
});
