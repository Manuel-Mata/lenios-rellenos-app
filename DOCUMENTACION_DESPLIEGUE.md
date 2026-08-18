# Documentación de Despliegue - Leños Rellenos

## Selección Justificada de Herramienta de Liberación

Para la publicación de la aplicación "Leños Rellenos", hemos seleccionado **Render.com** (utilizando su característica de *Blueprints* / Infrastructure as Code con `render.yaml`) frente a otras opciones como Netlify, GitHub Pages o Docker+VPS por las siguientes razones técnicas y de negocio:

1. **Soporte Full-Stack en una sola plataforma:** A diferencia de GitHub Pages o Netlify que están orientados fuertemente a sitios estáticos y requieren servicios de terceros complejos para la base de datos y backend, Render permite provisionar toda la arquitectura (Frontend React, Backend Node.js y Base de Datos PostgreSQL) desde una única cuenta y panel de control.
2. **Infrastructure as Code (IaC):** Con la creación del archivo `render.yaml`, garantizamos que la configuración del servidor, variables de entorno y comandos de construcción estén versionados junto con el código. Esto asegura repetibilidad y reduce errores humanos al desplegar.
3. **Costo-Eficiencia y Accesibilidad:** Render ofrece una capa gratuita robusta para bases de datos relacionales y servicios web, ideal para fases de validación, actividades académicas y ambientes de staging sin requerir incurrir en costos de un VPS dedicado (ej. DigitalOcean o AWS EC2).
4. **CI/CD Integrado:** Provee integración directa con GitHub. Cada *push* a la rama principal gatilla un proceso de build y despliegue automático, cumpliendo con las mejores prácticas de Integración y Despliegue Continuo (CI/CD).

## Plan de Rollback

A pesar de tener un proceso automatizado de Integración Continua (CI), pueden ocurrir fallos imprevistos en producción. Nuestro plan de *rollback* se define de la siguiente manera:

1. **Detección del fallo:** Si el sistema de monitoreo (o reportes de usuario) indican que el último despliegue causó regresiones severas o caída del servicio.
2. **Rollback de la Aplicación en Render:** 
   - Se ingresa al panel de control de Render (Dashboard).
   - En la sección del servicio correspondiente (Frontend o Backend), se navega a la pestaña de **Deploys**.
   - Se selecciona el despliegue anterior que funcionaba correctamente y se hace clic en el botón **Rollback to this deploy**.
   - Esto levantará los contenedores de la versión anterior casi instantáneamente sin necesidad de recompilar.
3. **Rollback a nivel de Código (Git):**
   - Simultáneamente, el equipo de desarrollo ejecutará `git revert <commit_hash>` en la rama principal (`main`) para deshacer los cambios que causaron el fallo.
   - Se hará un nuevo *push* a `main`. Render detectará el cambio y generará un nuevo despliegue ya corregido, sincronizando la infraestructura con el código fuente.
4. **Rollback de Base de Datos (Si aplica):**
   - Si el fallo fue causado por una migración de base de datos destructiva, se restaurará un *backup* automatizado provisto por Render (disponible en la pestaña de la base de datos).
   - Se revertirá la migración en Prisma usando el historial de esquemas.

---
*Documento creado para la Actividad 4: Publicación real del desarrollo web.*
