const express = require('express');
const router = express.Router();
const combustibleController = require('../controllers/combustibleController');

// Rutas para gestión de combustible
console.log('⛽ Configurando rutas de combustible...');

// GET /api/combustible/cargas - Obtener todas las cargas
router.get('/cargas', combustibleController.obtenerCargas);

// GET /api/combustible/cargas/vehiculo/:idVehiculo - Obtener cargas por vehículo
router.get('/cargas/vehiculo/:idVehiculo', combustibleController.obtenerCargasPorVehiculo);

// POST /api/combustible/cargas - Registrar nueva carga
router.post('/cargas', combustibleController.registrarCarga);

// PUT /api/combustible/cargas/:id - Actualizar carga
router.put('/cargas/:id', combustibleController.actualizarCarga);

// DELETE /api/combustible/cargas/:id - Eliminar carga
router.delete('/cargas/:id', combustibleController.eliminarCarga);

// GET /api/combustible/estadisticas - Obtener estadísticas
router.get('/estadisticas', combustibleController.obtenerEstadisticas);

console.log('✅ Rutas de combustible configuradas exitosamente');

module.exports = router;
