#!/bin/bash

# Script para construir y subir imagen Docker

echo "🐳 Construyendo imagen Docker..."
docker build -t backend3-entregable:latest .

echo "🏷️ Taggeando imagen para DockerHub..."
docker tag backend3-entregable:latest emisilva/backend3-entregable:latest
docker tag backend3-entregable:latest emisilva/backend3-entregable:v1.0.0

echo "📤 Subiendo imagen a DockerHub..."
echo "Nota: Asegúrate de estar logueado con 'docker login'"
docker push emisilva/backend3-entregable:latest
docker push emisilva/backend3-entregable:v1.0.0

echo "✅ Imagen subida exitosamente!"
echo "🔗 Disponible en: https://hub.docker.com/r/emisilva/backend3-entregable"