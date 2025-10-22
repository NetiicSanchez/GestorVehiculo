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
