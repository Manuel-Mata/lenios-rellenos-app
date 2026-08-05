import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import basicSsl from '@vitejs/plugin-basic-ssl';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // Habilita HTTPS con certificado autofirmado en desarrollo
    // En producción el TLS lo maneja el servidor/reverse proxy (ver SECURITY.md)
    basicSsl(),
  ],

  server: {
    // HTTPS habilitado vía basicSsl() plugin (certificado autofirmado en dev)
    port: 5173,

    // HTTP Security Headers para el servidor de desarrollo Vite
    headers: {
      // Strict-Transport-Security (HSTS)
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
      // Previene que el navegador "adivine" el tipo MIME
      'X-Content-Type-Options': 'nosniff',
      // Anti-clickjacking
      'X-Frame-Options': 'DENY',
      // XSS Protection para navegadores legacy
      'X-XSS-Protection': '1; mode=block',
      // Controla la información del Referer
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      // Deshabilita APIs de hardware no necesarias
      'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=(), usb=()',
      // Content-Security-Policy para desarrollo (más permisiva que producción)
      'Content-Security-Policy': [
        "default-src 'self'",
        "script-src 'self' 'unsafe-inline'",   // 'unsafe-inline' necesario en dev (HMR de Vite)
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
        "font-src 'self' https://fonts.gstatic.com",
        "img-src 'self' data: blob: https:",
        "connect-src 'self' https://localhost:3001 http://localhost:3001 ws://localhost:*",
        "frame-ancestors 'none'",
        "object-src 'none'",
      ].join('; '),
    },
  },
});
