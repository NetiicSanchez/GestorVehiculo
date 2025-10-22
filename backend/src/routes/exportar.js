const express = require('express');
const router = express.Router();
const db = require('../config/database');
const ExcelJS = require('exceljs');

// Exportar cargas de combustible combinadas a Excel
router.get('/exportar-cargas', async (req, res) => {
  try {
    const { mes, anio } = req.query;
    let where = 'cc.activo = true';
    const params = [];
    if (mes && anio) {
      where += ` AND EXTRACT(MONTH FROM cc.fecha_carga) = $1 AND EXTRACT(YEAR FROM cc.fecha_carga) = $2`;
      params.push(mes, anio);
    }
    const query = `
      SELECT
        v.id AS id_vehiculo,
        v.nombre AS nombre_vehiculo,
        v.placa,
        v.marca,
        v.modelo,
        tv.nombre AS tipo_vehiculo,
        cc.fecha_carga,
        cc.fecha_registro,
        cc.proveedor_combustible,
        u.nombre AS nombre_usuario,
        tc.nombre AS tipo_combustible,
        cc.galones_cargados,
        cc.precio_galon,
        cc.total_pagado,
        cc.kilometraje_actual
      FROM carga_combustible cc
      LEFT JOIN vehiculo v ON cc.id_vehiculo = v.id
      LEFT JOIN tipo_vehiculo tv ON v.id_tipo_vehiculo = tv.id
      LEFT JOIN usuario u ON cc.id_usuario = u.id
      LEFT JOIN tipo_combustible tc ON cc.id_tipo_combustible = tc.id
      WHERE ${where}
      ORDER BY cc.fecha_carga DESC;
    `;
    const result = await db.query(query, params);
    const rows = result.rows;

    // Crear archivo Excel
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Cargas de Combustible');
    worksheet.columns = [
      { header: 'ID Vehículo', key: 'id_vehiculo', width: 12 },
      { header: 'Nombre Vehículo', key: 'nombre_vehiculo', width: 20 },
      { header: 'Placa', key: 'placa', width: 12 },
      { header: 'Marca', key: 'marca', width: 15 },
      { header: 'Modelo', key: 'modelo', width: 15 },
      { header: 'Tipo Vehículo', key: 'tipo_vehiculo', width: 15 },
      { header: 'Fecha Carga', key: 'fecha_carga', width: 18 },
      { header: 'Fecha Registro', key: 'fecha_registro', width: 18 },
      { header: 'Proveedor', key: 'proveedor_combustible', width: 20 },
      { header: 'Usuario', key: 'nombre_usuario', width: 18 },
      { header: 'Tipo Combustible', key: 'tipo_combustible', width: 18 },
      { header: 'Galones', key: 'galones_cargados', width: 10 },
      { header: 'Precio Unitario', key: 'precio_galon', width: 14 },
      { header: 'Total', key: 'total_pagado', width: 12 },
      { header: 'Kilometraje', key: 'kilometraje_actual', width: 12 },
    ];
    rows.forEach(row => {
      // Formatear fechas para mostrar solo YYYY-MM-DD
      row.fecha_carga = row.fecha_carga ? row.fecha_carga.toISOString().slice(0, 10) : '';
      row.fecha_registro = row.fecha_registro ? row.fecha_registro.toISOString().slice(0, 10) : '';
      worksheet.addRow(row);
    });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename="cargas_combustible.xlsx"');
    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error('❌ Error exportando cargas:', error);
    res.status(500).json({ success: false, message: 'Error exportando cargas', error: error.message });
  }
});

module.exports = router;
