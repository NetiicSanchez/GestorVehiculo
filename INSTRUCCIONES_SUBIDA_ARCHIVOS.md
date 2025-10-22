# PASOS PARA IMPLEMENTAR SUBIDA DE ARCHIVOS EN EL SERVIDOR

## 1. ARCHIVOS DEL BACKEND A CREAR/ACTUALIZAR:

### A. Crear archivo: `/tu-backend/src/routes/upload.js`
```javascript
const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();

// Configurar multer para guardar archivos en la carpeta loader
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../../../loader')); // Carpeta loader en la raíz del proyecto
  },
  filename: function (req, file, cb) {
    // Generar nombre único: timestamp + nombre original
    const timestamp = Date.now();
    const extension = path.extname(file.originalname);
    const nombreBase = path.basename(file.originalname, extension);
    cb(null, `${timestamp}_${nombreBase}${extension}`);
  }
});

// Filtro para tipos de archivo permitidos
const fileFilter = (req, file, cb) => {
  // Permitir solo imágenes
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Solo se permiten archivos de imagen'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB máximo
  }
});

// Endpoint para subir foto de factura
router.post('/factura', upload.single('foto'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No se proporcionó archivo'
      });
    }

    console.log('📁 Archivo subido:', req.file);

    // Devolver la URL relativa del archivo
    const url = `/loader/${req.file.filename}`;

    res.json({
      success: true,
      url: url,
      filename: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size,
      message: 'Archivo subido exitosamente'
    });

  } catch (error) {
    console.error('❌ Error al subir archivo:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno al subir archivo',
      error: error.message
    });
  }
});

// Middleware de manejo de errores de multer
router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'El archivo es demasiado grande (máximo 5MB)'
      });
    }
  }
  
  res.status(400).json({
    success: false,
    message: error.message || 'Error al subir archivo'
  });
});

module.exports = router;
```

### B. Actualizar archivo: `/tu-backend/src/server.js`
```javascript
// Agregar al inicio del archivo
const path = require('path');

// Agregar después de bodyParser
app.use('/loader', express.static(path.join(__dirname, '../../loader')));

// Agregar en las rutas
app.use('/api/upload', require('./routes/upload'));
```

## 2. COMANDOS A EJECUTAR EN EL SERVIDOR:

```bash
# Instalar multer
cd /ruta/a/tu/backend
sudo npm install multer

# Crear carpeta loader
sudo mkdir -p /var/www/loader
sudo chown -R www-data:www-data /var/www/loader
sudo chmod -R 755 /var/www/loader

# Reiniciar PM2
pm2 restart backend

# Verificar que el servicio está corriendo
pm2 status
```

## 3. CONFIGURAR NGINX:

### Editar configuración de Nginx:
```bash
sudo nano /etc/nginx/sites-available/default
```

### Agregar esta sección:
```nginx
# Servir archivos de la carpeta loader
location /loader/ {
    alias /var/www/loader/;
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

### Recargar Nginx:
```bash
sudo nginx -t
sudo systemctl reload nginx
```

## 4. VERIFICAR QUE TODO FUNCIONA:

### Probar endpoint de upload:
```bash
curl -X POST -F "foto=@/ruta/a/imagen.jpg" http://tu-servidor:8082/api/upload/factura
```

¡Con estos pasos deberías tener funcionando la subida de archivos!
