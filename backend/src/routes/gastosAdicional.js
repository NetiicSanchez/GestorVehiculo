const express = require('express');
const router = express.Router();
const pool = require('../config/database');

// Middleware de logging para este router
router.use((req, res, next) => {
  console.log(`GastosAdicional router: ${req.method} ${req.url}`);
  next();
});

// Ruta de prueba para verificar que el router está activo
// Obtener todos los gastos adicionales con datos del vehículo
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT ga.*, v.marca, v.modelo, v.placa, v.numero_placa
      FROM gastos_adicional ga
      LEFT JOIN vehiculo v ON ga.id_vehiculo = v.id
      ORDER BY ga.fecha_gasto DESC, ga.id DESC
    `);
    return res.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('Error obteniendo gastos adicionales:', error);
    return res.status(500).json({ success: false, message: 'Error en el servidor' });
  }
});

// Crear un gasto adicional
router.post('/', async (req, res) => {
  const { id_vehiculo, tipo_gasto, fecha_gasto, descripcion, monto, proveedor, observaciones, foto_factura, kilometraje } = req.body;
  if (!id_vehiculo || !tipo_gasto || !fecha_gasto || monto == null || kilometraje == null) {
    return res.status(400).json({ success: false, message: 'Faltan datos requeridos' });
  }
  try {
    const result = await pool.query(
      `INSERT INTO gastos_adicional (id_vehiculo, tipo_gasto, fecha_gasto, descripcion, monto, proveedor, observaciones, foto_factura, kilometraje)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
      [id_vehiculo, tipo_gasto, fecha_gasto, descripcion, monto, proveedor, observaciones, foto_factura, kilometraje]
    );
    return res.json({ success: true, gasto: result.rows[0] });
  } catch (error) {
    console.error('Error creando gasto adicional:', error);
    return res.status(500).json({ success: false, message: 'Error en el servidor' });
  }
});

module.exports = router;
