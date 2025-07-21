const db = require('../config/database');

// Obtener todas las cargas de combustible con información de vehículos
const obtenerCargas = async (req, res) => {
  try {
    console.log('⛽ Obteniendo todas las cargas de combustible');
    
    const query = `
      SELECT 
        cc.*,
        v.placa,
        v.marca,
        v.modelo,
        tc.nombre as tipo_combustible
      FROM carga_combustible cc
      LEFT JOIN vehiculo v ON cc.id_vehiculo = v.id
      LEFT JOIN tipo_combustible tc ON cc.id_tipo_combustible = tc.id
      WHERE cc.activo = true
      ORDER BY cc.fecha_carga DESC
    `;
    
    const result = await db.query(query);
    
    console.log(`✅ ${result.rows.length} cargas encontradas`);
    
    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('❌ Error obteniendo cargas:', error);
    res.status(500).json({
      success: false,
      message: 'Error obteniendo cargas de combustible',
      error: error.message
    });
  }
};

// Obtener cargas por vehículo específico
const obtenerCargasPorVehiculo = async (req, res) => {
  try {
    const { idVehiculo } = req.params;
    console.log(`⛽ Obteniendo cargas del vehículo ${idVehiculo}`);
    
    const query = `
      SELECT 
        cc.*,
        v.placa,
        v.marca,
        v.modelo,
        tc.nombre as tipo_combustible
      FROM carga_combustible cc
      LEFT JOIN vehiculo v ON cc.id_vehiculo = v.id
      LEFT JOIN tipo_combustible tc ON cc.id_tipo_combustible = tc.id
      WHERE cc.id_vehiculo = $1 AND cc.activo = true
      ORDER BY cc.fecha_carga DESC
    `;
    
    const result = await db.query(query, [idVehiculo]);
    
    console.log(`✅ ${result.rows.length} cargas encontradas para vehículo ${idVehiculo}`);
    
    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('❌ Error obteniendo cargas por vehículo:', error);
    res.status(500).json({
      success: false,
      message: 'Error obteniendo cargas del vehículo',
      error: error.message
    });
  }
};

// Registrar nueva carga de combustible
const registrarCarga = async (req, res) => {
  try {
    const {
      id_vehiculo,
      id_tipo_combustible,
      fecha_carga,
      galones_cargados,
      precio_galon,
      total_pagado,
      kilometraje_actual,
      proveedor_combustible,
      numero_factura,
      observaciones,
      foto_factura
    } = req.body;

    console.log('⛽ Registrando nueva carga:', req.body);

    // Validaciones básicas
    if (!id_vehiculo || !galones_cargados || !precio_galon) {
      return res.status(400).json({
        success: false,
        message: 'Faltan campos requeridos: id_vehiculo, galones_cargados, precio_galon'
      });
    }

    const query = `
      INSERT INTO carga_combustible (
        id_vehiculo, id_usuario, id_tipo_combustible, fecha_carga,
        kilometraje_actual, galones_cargados, precio_galon, total_pagado,
        proveedor_combustible, numero_factura, observaciones, foto_factura, activo
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING *
    `;

    const values = [
      id_vehiculo,
      req.body.id_usuario || null, // Si tienes usuario en sesión
      id_tipo_combustible || null,
      fecha_carga || new Date(),
      kilometraje_actual || 0,
      galones_cargados,
      precio_galon,
      total_pagado || (galones_cargados * precio_galon),
      proveedor_combustible || null,
      numero_factura || null,
      observaciones || null,
      foto_factura || null,
      true
    ];

    const result = await db.query(query, values);
    
    console.log('✅ Carga registrada exitosamente:', result.rows[0]);
    
    res.status(201).json({
      success: true,
      message: 'Carga de combustible registrada exitosamente',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('❌ Error registrando carga:', error);
    res.status(500).json({
      success: false,
      message: 'Error registrando carga de combustible',
      error: error.message
    });
  }
};

// Actualizar carga de combustible
const actualizarCarga = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      id_vehiculo,
      id_tipo_combustible,
      fecha_carga,
      galones_cargados,
      precio_galon,
      total_pagado,
      kilometraje_actual,
      proveedor_combustible,
      numero_factura,
      observaciones,
      foto_factura
    } = req.body;

    console.log(`🔧 Actualizando carga ${id}:`, req.body);

    const query = `
      UPDATE carga_combustible 
      SET 
        id_vehiculo = $1,
        id_tipo_combustible = $2,
        fecha_carga = $3,
        kilometraje_actual = $4,
        galones_cargados = $5,
        precio_galon = $6,
        total_pagado = $7,
        proveedor_combustible = $8,
        numero_factura = $9,
        observaciones = $10,
        foto_factura = $11
      WHERE id = $12 AND activo = true
      RETURNING *
    `;

    const values = [
      id_vehiculo,
      id_tipo_combustible,
      fecha_carga,
      kilometraje_actual,
      galones_cargados,
      precio_galon,
      total_pagado || (galones_cargados * precio_galon),
      proveedor_combustible,
      numero_factura,
      observaciones,
      foto_factura,
      id
    ];

    const result = await db.query(query, values);
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Carga no encontrada'
      });
    }
    
    console.log('✅ Carga actualizada exitosamente:', result.rows[0]);
    
    res.json({
      success: true,
      message: 'Carga actualizada exitosamente',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('❌ Error actualizando carga:', error);
    res.status(500).json({
      success: false,
      message: 'Error actualizando carga',
      error: error.message
    });
  }
};

// Eliminar carga (soft delete)
const eliminarCarga = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`🗑️ Eliminando carga ${id}`);

    const query = `
      UPDATE carga_combustible 
      SET activo = false 
      WHERE id = $1 
      RETURNING *
    `;

    const result = await db.query(query, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Carga no encontrada'
      });
    }
    
    console.log('✅ Carga eliminada exitosamente');
    
    res.json({
      success: true,
      message: 'Carga eliminada exitosamente'
    });
  } catch (error) {
    console.error('❌ Error eliminando carga:', error);
    res.status(500).json({
      success: false,
      message: 'Error eliminando carga',
      error: error.message
    });
  }
};

// Obtener estadísticas de combustible
const obtenerEstadisticas = async (req, res) => {
  try {
    console.log('📊 Calculando estadísticas de combustible');
    
    const query = `
      SELECT 
        COUNT(*) as total_cargas,
        SUM(galones_cargados) as total_galones,
        SUM(total_pagado) as total_gasto,
        AVG(galones_cargados) as promedio_galones,
        AVG(precio_galon) as precio_promedio,
        MAX(fecha_carga) as ultima_carga,
        MIN(fecha_carga) as primera_carga
      FROM carga_combustible 
      WHERE activo = true
    `;
    
    const result = await db.query(query);
    const stats = result.rows[0];
    
    console.log('✅ Estadísticas calculadas:', stats);
    
    res.json({
      success: true,
      data: {
        totalLitros: parseFloat(stats.total_galones) * 3.78541 || 0, // Convertir galones a litros
        totalGasto: parseFloat(stats.total_gasto) || 0,
        promedioLitros: parseFloat(stats.promedio_galones) * 3.78541 || 0,
        rendimientoPromedio: 12.5, // Placeholder - calcular según kilometraje
        totalCargas: parseInt(stats.total_cargas) || 0,
        precioPromedio: parseFloat(stats.precio_promedio) || 0,
        ultimaCarga: stats.ultima_carga,
        primeraCarga: stats.primera_carga
      }
    });
  } catch (error) {
    console.error('❌ Error obteniendo estadísticas:', error);
    res.status(500).json({
      success: false,
      message: 'Error obteniendo estadísticas',
      error: error.message
    });
  }
};

module.exports = {
  obtenerCargas,
  obtenerCargasPorVehiculo,
  registrarCarga,
  actualizarCarga,
  eliminarCarga,
  obtenerEstadisticas
};
