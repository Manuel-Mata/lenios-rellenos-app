# 🔒 Guía de Seguridad — Leños Rellenos

Documento de referencia para configurar la seguridad en transporte y navegador en entornos de **producción**.

---

## 1. HTTPS / TLS en Producción

> **El certificado autofirmado de desarrollo (`@vitejs/plugin-basic-ssl`) NO es válido en producción.**
> En producción, el TLS lo maneja el **reverse proxy** (Nginx, Caddy, etc.), no la app.

### Opción A — Nginx + Let's Encrypt (recomendado)

```nginx
server {
    listen 443 ssl http2;
    server_name tu-dominio.com;

    # Certificado gratuito con Certbot
    ssl_certificate     /etc/letsencrypt/live/tu-dominio.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/tu-dominio.com/privkey.pem;

    # ─── TLS 1.2 mínimo, TLS 1.3 preferido ────────────────────────
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers on;
    ssl_ciphers 'ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:TLS_AES_128_GCM_SHA256:TLS_AES_256_GCM_SHA384:TLS_CHACHA20_POLY1305_SHA256';

    # ─── HSTS ──────────────────────────────────────────────────────
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;

    # ─── Redirigir HTTP → HTTPS ────────────────────────────────────
    # (en bloque server listen 80)

    location / {
        proxy_pass http://localhost:5173;   # Frontend Vite (o dist servido estático)
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /api/ {
        proxy_pass http://localhost:3001;   # Backend Express
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

# Redirigir todo HTTP a HTTPS
server {
    listen 80;
    server_name tu-dominio.com;
    return 301 https://$host$request_uri;
}
```

### Opción B — Caddy (TLS automático, aún más simple)

```caddyfile
tu-dominio.com {
    reverse_proxy /api/* localhost:3001
    reverse_proxy * localhost:5173
}
```
> Caddy obtiene y renueva certificados Let's Encrypt automáticamente.

---

## 2. Variables de entorno en producción

| Variable | Valor en producción |
|---|---|
| `NODE_ENV` | `production` |
| `JWT_SECRET` | String aleatorio de mínimo 64 caracteres |
| `COOKIE_SECRET` | String aleatorio diferente al JWT_SECRET |
| `ALLOWED_ORIGINS` | Solo tu dominio HTTPS. Ej: `https://tu-dominio.com` |
| `DATABASE_URL` | URL de la DB de producción (nunca la misma que dev) |

**Generar secretos seguros:**
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

---

## 3. Cookies de sesión — Configuración

El helper `setAuthCookie(res, token)` en `backend/src/index.ts` aplica automáticamente:

| Atributo | Valor | Efecto |
|---|---|---|
| `HttpOnly` | `true` | JS no puede leer la cookie (previene XSS) |
| `Secure` | `true` (solo en producción) | Solo se envía por HTTPS |
| `SameSite` | `Strict` | Previene envío en peticiones cross-site (CSRF) |
| `maxAge` | 24h | Expiración automática |
| `Path` | `/` | Disponible en toda la app |

---

## 4. Checklist pre-deploy

- [ ] `NODE_ENV=production` en el servidor
- [ ] Certificado TLS válido (no autofirmado)
- [ ] `ALLOWED_ORIGINS` apunta solo a tu dominio HTTPS
- [ ] `JWT_SECRET` y `COOKIE_SECRET` generados aleatoriamente (no los del `.env.example`)
- [ ] HSTS habilitado en Nginx/Caddy
- [ ] HTTP redirige a HTTPS
- [ ] Verificar headers en [securityheaders.com](https://securityheaders.com)
- [ ] Verificar TLS en [ssllabs.com/ssltest](https://www.ssllabs.com/ssltest/)

---

## 5. Security Headers implementados

| Header | Dónde | Valor |
|---|---|---|
| `Strict-Transport-Security` | Backend (Helmet) + Vite | `max-age=31536000; includeSubDomains; preload` |
| `Content-Security-Policy` | Backend (Helmet) + Vite + HTML meta | Ver `index.ts` para política completa |
| `X-Frame-Options` | Backend (Helmet) + Vite | `DENY` |
| `X-Content-Type-Options` | Backend (Helmet) + Vite | `nosniff` |
| `X-XSS-Protection` | Backend (Helmet) + Vite | `1; mode=block` |
| `Referrer-Policy` | Backend (Helmet) + Vite + HTML meta | `strict-origin-when-cross-origin` |
| `Permissions-Policy` | Backend + Vite | `camera=(), microphone=(), geolocation=(), payment=(), usb=()` |
