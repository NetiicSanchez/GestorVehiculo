const express = require('express');
const router = express.Router();
const controller = require('../controllers/bitacoraController');

// Crear bitácora (si aplica)
router.post('/', controller.crearBitacora);

// Obtener todas las bitácoras (si aplica)
router.get('/', controller.obtenerBitacoras);

// Cumplimiento por vehículo/mes
router.get('/cumplimiento', controller.obtenerCumplimiento);

module.exports = router;
