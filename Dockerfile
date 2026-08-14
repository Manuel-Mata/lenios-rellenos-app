# 1. Etapa de construcción (Build)
FROM node:20-alpine as builder

WORKDIR /app

# Copiar archivos de dependencias
COPY package.json package-lock.json* ./

# Instalar dependencias
RUN npm install

# Copiar el resto del código
COPY . .

# Construir la aplicación para producción (Vite genera la carpeta /dist)
RUN npm run build

# 2. Etapa de producción (Servidor Nginx)
FROM nginx:alpine

# Copiar el archivo de configuración de Nginx (para manejar React Router)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiar los archivos estáticos construidos desde la etapa anterior
COPY --from=builder /app/dist /usr/share/nginx/html

# Exponer el puerto 80
EXPOSE 80

# Comando para iniciar Nginx
CMD ["nginx", "-g", "daemon off;"]
