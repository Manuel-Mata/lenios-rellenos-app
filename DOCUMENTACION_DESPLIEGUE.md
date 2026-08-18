# Documentación de Despliegue - Leños Rellenos

## Selección Justificada de Herramienta de Liberación

Para la publicación de la aplicación "Leños Rellenos", hemos seleccionado una arquitectura moderna y sin costos dividiendo los componentes en **Vercel** y **Neon.tech**, en lugar de utilizar una sola plataforma o VPS tradicional, por las siguientes razones técnicas y de negocio:

1. **Frontend en Vercel:** Vercel es la plataforma líder para despliegue de aplicaciones React/Vite. Ofrece un Edge Network global gratuito (Hobby tier) que garantiza tiempos de carga ultrarrápidos para los usuarios finales, además de integración directa y automática con repositorios de Github (CI/CD nativo).
2. **Backend como Serverless Functions (Vercel):** Para evitar costos fijos de un servidor siempre encendido (como Render o Heroku), hemos configurado nuestro backend Node.js (Express) para que se ejecute bajo demanda mediante Vercel Serverless Functions a través de un archivo `vercel.json`. Esto permite escalabilidad automática infinita: si no hay peticiones el costo/uso es cero, y si hay un pico de tráfico, se escala sin esfuerzo.
3. **Base de Datos en Neon.tech (PostgreSQL Serverless):** A diferencia de los proveedores tradicionales, Neon separa la capa de computación y almacenamiento de PostgreSQL. Esto permite tener una base de datos gratuita que entra en "suspensión" cuando no se usa y despierta en milisegundos, haciendo un match perfecto con nuestra arquitectura Serverless del backend. Además, no exige tarjeta de crédito para validar la cuenta.
4. **Despliegue Continuo (CI/CD):** Al conectar Vercel con Github, cada *push* a la rama `main` despliega automáticamente tanto el frontend como el backend en segundos, cumpliendo con las mejores prácticas de la industria.

## Plan de Rollback

A pesar de tener un proceso automatizado de Integración Continua (CI), pueden ocurrir fallos imprevistos en producción. Nuestro plan de *rollback* (regresión) se define de la siguiente manera:

1. **Detección del fallo:** Si el sistema de monitoreo o reportes de usuario indican que el último despliegue causó regresiones o caída del servicio.
2. **Rollback Instantáneo en Vercel:** 
   - Se ingresa al panel de control de Vercel en la pestaña "Deployments" del proyecto correspondiente (Frontend o Backend).
   - Se localiza el último despliegue exitoso (verde) y se hace clic en el menú desplegable seleccionando **"Rollback"** o **"Promote to Production"**.
   - Vercel cambiará el enrutamiento al instante, restaurando la versión anterior en menos de 1 segundo sin necesidad de recompilar.
3. **Rollback a nivel de Código (Git):**
   - Simultáneamente, se ejecutará `git revert <commit_hash>` en la rama principal (`main`) para deshacer los cambios fallidos.
   - Al hacer el nuevo *push*, Vercel generará el nuevo despliegue corregido y oficial.
4. **Rollback de Base de Datos (Neon.tech):**
   - Neon cuenta con una funcionalidad de "Branching" (ramas de base de datos) y restauración en el tiempo (Point-in-Time Recovery). 
   - En caso de una migración destructiva, podemos restaurar la base de datos a un punto en el tiempo específico previo al error directamente desde el Dashboard de Neon.

---
*Documento creado para la Actividad 4: Publicación real del desarrollo web.*
