# Usar Node.js 18 como imagen base
FROM node:18-alpine

# Establecer información del mantenedor
LABEL maintainer="Emiliano Silva <emilianosilva@example.com>"
LABEL description="Backend 3 Entregable - API para gestión de usuarios, mascotas y adopciones"

# Crear directorio de trabajo
WORKDIR /usr/src/app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias de producción
RUN npm ci --only=production && npm cache clean --force

# Crear usuario no-root para seguridad
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Copiar código de la aplicación
COPY --chown=nodejs:nodejs . .

# Cambiar al usuario no-root
USER nodejs

# Exponer puerto 8080
EXPOSE 8080

# Variables de entorno
ENV NODE_ENV=production
ENV PORT=8080
ENV DOCKER_ENV=true

# Comando de health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node healthcheck.js

# Comando para ejecutar la aplicación
CMD ["node", "index.js"]