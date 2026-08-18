# Changelog

Todas las versiones notables de este proyecto serán documentadas en este archivo.

## [1.0.0] - 2026-08-18 (Liberación Inicial - Actividad 4)

### Qué se libera
- **Frontend (v1.0.0):** Aplicación web (SPA) desarrollada en React/Vite, lista para ser servida estáticamente. Incluye sistema POS, chat con IA, catálogo de productos y carrito de compras.
- **Backend (v1.0.0):** API RESTful desarrollada con Node.js, Express y Prisma para manejo de la base de datos y lógica de negocio.
- **Base de Datos:** Estructura inicial en PostgreSQL.

### Qué cambió
- **[Añadido]** Configuración de variables de entorno (VITE_API_URL) dinámicas para que el Frontend consuma la API en producción.
- **[Añadido]** Archivo `render.yaml` (Infrastructure as Code) para permitir un despliegue de toda la arquitectura (DB, API, Web) en 1 solo clic en la plataforma Render.
- **[Añadido]** Documentación de despliegue (`DOCUMENTACION_DESPLIEGUE.md`) requerida para la rúbrica de la materia, la cual especifica la justificación de la herramienta utilizada y el plan de rollback en caso de fallos.
- **[Modificado]** Corrección de endpoint en el Chat de IA (`AiChatWidget.tsx`) para evitar "hardcoding" a localhost en producción.

### Quién lo aprobó
- Aprobado y verificado por el Equipo de Desarrollo (Leños Rellenos).
- Liberado para cumplimiento de la **Actividad 4 Publicación real del desarrollo web**.
