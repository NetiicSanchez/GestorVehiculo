#!/bin/bash

echo "🚗 Configuración del Gestor de Vehículos"
echo "======================================="

# Instalar dependencias del frontend
echo "📦 Instalando dependencias del frontend..."
npm install

# Instalar dependencias del backend
echo "📦 Instalando dependencias del backend..."
cd backend
npm install
cd ..

echo "✅ Instalación completada!"
echo ""
echo "📋 Próximos pasos:"
echo "1. Configurar PostgreSQL y crear la base de datos 'flota_vehiculos'"
echo "2. Ejecutar el script: database-schema-flota.sql"
echo "3. Configurar el archivo backend/.env con tus credenciales de BD"
echo "4. Ejecutar: cd backend && npm start (en una terminal)"
echo "5. Ejecutar: npm start (en otra terminal, desde la raíz)"
echo "6. Abrir: http://localhost:4200"
echo ""
echo "🎉 ¡Listo para usar!"
