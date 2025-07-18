# 🚀 Guía de Despliegue - Gestor de Vehículos

## 📋 Requisitos del Sistema

### Software Requerido
- **Node.js** v18 o superior
- **PostgreSQL** v12 o superior  
- **Angular CLI** v20 o superior
- **Git** (para clonar el repositorio)

### Recursos del Servidor
- **RAM**: Mínimo 2GB, recomendado 4GB
- **Almacenamiento**: 500MB libres
- **CPU**: 2 núcleos recomendados

## 🔧 Configuración de Base de Datos

### 1. Crear Base de Datos
```sql
CREATE DATABASE flota_vehiculos;
```

### 2. Ejecutar Schema
```bash
psql -U postgres -d flota_vehiculos -f database-schema-flota.sql
```

### 3. Insertar Datos Básicos (Opcional)
```bash
cd backend
node insertar-datos-basicos.js
```

## 🛠️ Instalación del Proyecto

### Opción 1: Script Automático (Recomendado)
```bash
# En Windows
setup.bat

# En Linux/Mac
chmod +x setup.sh
./setup.sh
```

### Opción 2: Instalación Manual
```bash
# 1. Clonar repositorio
git clone https://github.com/NetiicSanchez/GestorVehiculo.git
cd GestorVehiculo

# 2. Instalar dependencias frontend
npm install

# 3. Instalar dependencias backend
cd backend
npm install
cd ..

# 4. Configurar variables de entorno
cp backend/.env.example backend/.env
# Editar backend/.env con tus credenciales
```

## 🚀 Ejecución en Desarrollo

### Terminal 1 (Backend)
```bash
cd backend
npm start
```

### Terminal 2 (Frontend)
```bash
npm start
```

### Acceso
- **Frontend**: http://localhost:4200
- **Backend API**: http://localhost:3000/api

## 🏗️ Build para Producción

### Frontend
```bash
ng build --prod
```
Los archivos se generarán en `dist/`

### Backend
```bash
cd backend
npm start
```

## 🔒 Configuración de Seguridad

### Variables de Entorno (.env)
```env
# Base de datos
DB_HOST=tu_host
DB_PORT=5432
DB_NAME=flota_vehiculos
DB_USER=usuario_bd
DB_PASSWORD=password_seguro

# Servidor
PORT=3000
NODE_ENV=production
```

### Recomendaciones de Seguridad
- Usar HTTPS en producción
- Configurar CORS apropiadamente
- Validar entrada de datos
- Usar contraseñas seguras para BD
- Mantener dependencias actualizadas

## 🐳 Despliegue con Docker (Opcional)

### Dockerfile (Frontend)
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 4200
CMD ["npm", "start"]
```

### Dockerfile (Backend)
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY backend/package*.json ./
RUN npm ci --only=production
COPY backend/ .
EXPOSE 3000
CMD ["npm", "start"]
```

## 📊 Monitoreo y Logs

### Logs del Backend
Los logs se muestran en la consola durante el desarrollo.

### Monitoreo de Base de Datos
```sql
-- Verificar conexiones
SELECT * FROM pg_stat_activity WHERE datname = 'flota_vehiculos';

-- Verificar tablas
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';
```

## 🆘 Resolución de Problemas

### Error: Puerto en uso
```bash
# Matar proceso en puerto
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Error: Conexión a BD
1. Verificar que PostgreSQL esté ejecutándose
2. Comprobar credenciales en `.env`
3. Verificar que la BD existe
4. Revisar firewall/permisos

### Error: Dependencias
```bash
# Limpiar cache npm
npm cache clean --force

# Reinstalar dependencias
rm -rf node_modules package-lock.json
npm install
```

## 📞 Soporte

Para problemas o dudas:
- Revisar logs en consola
- Verificar estado de servicios
- Consultar documentación de APIs
- Abrir issue en GitHub

---

✅ **¡Proyecto listo para despliegue!**
