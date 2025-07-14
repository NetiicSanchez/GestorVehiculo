# Gestor de Vehículos - Sistema de Gestión de Flota

## 🚗 Descripción

Sistema completo de gestión de vehículos desarrollado en Angular 20 con Material Design. Permite el registro, seguimiento y administración de vehículos de manera profesional y responsiva.

## 📋 Funcionalidades Principales

### ✅ **Módulo de Vehículos**
- **Inventario Completo**: Lista paginada con búsqueda y filtros
- **Registro de Vehículos**: Formulario por pasos (wizard) con validaciones
- **Detalle de Vehículos**: Vista completa de la información
- **Edición de Vehículos**: Actualización de datos
- **Eliminación**: Borrado seguro con confirmación

### 🔧 **Características Técnicas**
- **Responsive Design**: Adaptado para móviles, tablets y escritorio
- **Material Design**: Interfaz moderna y profesional
- **Validaciones Avanzadas**: Formularios con validación en tiempo real
- **Lazy Loading**: Módulos cargados bajo demanda
- **TypeScript**: Tipado fuerte para mejor mantenibilidad

## 🛠️ Instalación y Configuración

### Pre-requisitos
- Node.js (versión 18 o superior)
- npm o yarn
- Angular CLI

### Pasos de Instalación

1. **Instalar dependencias**
   ```bash
   npm install
   ```

2. **Ejecutar la aplicación**
   ```bash
   npm start
   ```

3. **Acceder a la aplicación**
   - Abre tu navegador en `http://localhost:4200`

## 🏗️ Estructura del Proyecto

```
src/app/
├── models/                    # Modelos de datos TypeScript
│   └── vehiculo.model.ts
├── services/                  # Servicios para API
│   └── vehiculos.service.ts
├── vehiculos/                 # Módulo principal de vehículos
│   ├── inventario/           # Lista de vehículos
│   ├── agregar-vehiculo/     # Formulario de registro
│   ├── editar-vehiculo/      # Formulario de edición
│   ├── detalle-vehiculo/     # Vista detallada
│   ├── combustible/          # Gestión de combustible
│   ├── tipos/               # Tipos de vehículos
│   ├── grupos/              # Grupos de vehículos
│   └── estados/             # Estados de vehículos
```

## 📱 Diseño Responsive

### Breakpoints
- **Mobile**: 320px - 768px
- **Tablet**: 768px - 1024px  
- **Desktop**: 1024px+

### Características Móviles
- Navegación colapsable
- Formularios apilados
- Tablas con scroll horizontal
- Botones optimizados para touch

## 🔧 Configuración del Backend

### Endpoints Requeridos
```
GET    /api/vehiculos              # Obtener todos los vehículos
GET    /api/vehiculos/:id          # Obtener vehículo por ID
POST   /api/vehiculos              # Crear nuevo vehículo
PUT    /api/vehiculos/:id          # Actualizar vehículo
DELETE /api/vehiculos/:id          # Eliminar vehículo

GET    /api/tipos-vehiculos        # Obtener tipos de vehículos
GET    /api/grupos-vehiculos       # Obtener grupos
GET    /api/estados-vehiculos      # Obtener estados
GET    /api/tipos-combustible      # Obtener tipos de combustible
```

### Configuración de URL
En `src/app/services/vehiculos.service.ts`, actualiza la URL de tu API:
```typescript
private apiUrl = 'http://localhost:3000/api'; // Cambia por tu URL
```

## 🚀 Próximos Pasos

1. **Conectar con tu API**: Configura los endpoints en el servicio
2. **Implementar Autenticación**: Integra con tu sistema de login
3. **Agregar Módulos**: Desarrolla combustible, reportes, etc.
4. **Subir Imágenes**: Implementa carga de fotos de vehículos
5. **Exportar Datos**: Agregar funcionalidad de exportación

## 📊 Comandos Útiles

```bash
# Desarrollo
npm start                # Servidor de desarrollo
npm run build           # Compilar para producción
npm test               # Ejecutar pruebas

# Angular CLI
ng generate component nombre    # Crear componente
ng generate service nombre      # Crear servicio
ng generate module nombre       # Crear módulo
```

## 🎨 Personalización

### Colores del Tema
En `src/styles.css` puedes personalizar:
- Colores primarios
- Colores de estados
- Gradientes del header

### Responsive Breakpoints
En cada componente CSS puedes ajustar:
- Tamaños de pantalla
- Disposición de elementos
- Espaciado y padding

## 🐛 Solución de Problemas

### Error: Cannot find module
```bash
npm install
```

### Error: No se pueden cargar los módulos
Verifica que las rutas en `app.routes.ts` sean correctas.

### Error: Material Design no funciona
Asegúrate de que `provideAnimations()` esté en `app.config.ts`.

## 📝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature
3. Haz commit de tus cambios
4. Push a la rama
5. Abre un Pull Request
