const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');

// Rutas para dashboard
console.log('📊 Configurando rutas de dashboard...');

// GET /api/dashboard/gastos-vehiculos - Obtener gastos por vehículo
router.get('/gastos-vehiculos', dashboardController.obtenerGastosVehiculos);

// GET /api/dashboard/vehiculos - Obtener datos del dashboard de vehículos  
router.get('/vehiculos', dashboardController.obtenerDashboardVehiculos);

// GET /api/dashboard/resumen - Obtener resumen consolidado
router.get('/resumen', dashboardController.obtenerResumenDashboard);

// GET /api/dashboard/gastos-mensuales - Obtener gastos mensuales por vehículo
router.get('/gastos-mensuales', dashboardController.obtenerGastosMensuales);

console.log('✅ Rutas de dashboard configuradas exitosamente');

module.exports = router;
